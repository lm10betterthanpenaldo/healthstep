-- ================================================
-- ADD NOTIFICATION TRIGGERS & FUNCTIONS
-- (Only adds missing triggers, doesn't recreate tables)
-- ================================================

-- ================================================
-- STEP 1: CREATE NOTIFICATION FUNCTION
-- ================================================

-- Drop existing function if exists (to update it)
drop function if exists create_notification(uuid, text, text, text, text, text, uuid, jsonb);

create or replace function create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text,
  p_icon text,
  p_icon_bg text,
  p_related_id uuid default null,
  p_metadata jsonb default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_notification_id uuid;
begin
  insert into public.notifications (
    user_id,
    type,
    title,
    message,
    icon,
    icon_bg,
    related_id,
    metadata
  ) values (
    p_user_id,
    p_type,
    p_title,
    p_message,
    p_icon,
    p_icon_bg,
    p_related_id,
    p_metadata
  )
  returning id into v_notification_id;
  
  return v_notification_id;
end;
$$;

-- ================================================
-- STEP 2: CHECK DAILY GOALS FUNCTION
-- ================================================

-- Drop existing function if exists
drop function if exists check_daily_goals() cascade;

create or replace function check_daily_goals()
returns trigger
language plpgsql
security definer
as $$
declare
  v_profile record;
  v_today_water int;
  v_today_calories int;
  v_today_exercise int;
  v_target_water int;
  v_target_calories int;
  v_bmr numeric;
  v_tdee numeric;
  v_age int;
begin
  -- Get user profile
  select * into v_profile
  from public.profiles
  where id = NEW.user_id;
  
  -- Calculate age
  v_age := EXTRACT(YEAR FROM age(CURRENT_DATE, v_profile.date_of_birth::date));
  if v_age is null or v_age < 1 then
    v_age := 25; -- default age
  end if;
  
  -- Calculate BMR (Mifflin-St Jeor Equation)
  if v_profile.gender = 'male' then
    v_bmr := (10 * coalesce(v_profile.current_weight_kg, 70)) + 
             (6.25 * coalesce(v_profile.height_cm, 170)) - 
             (5 * v_age) + 5;
  else
    v_bmr := (10 * coalesce(v_profile.current_weight_kg, 70)) + 
             (6.25 * coalesce(v_profile.height_cm, 170)) - 
             (5 * v_age) - 161;
  end if;
  
  -- Calculate TDEE based on activity level
  case coalesce(v_profile.activity_level, 'moderate')
    when 'sedentary' then v_tdee := v_bmr * 1.2;
    when 'light' then v_tdee := v_bmr * 1.375;
    when 'moderate' then v_tdee := v_bmr * 1.55;
    when 'active' then v_tdee := v_bmr * 1.725;
    when 'very_active' then v_tdee := v_bmr * 1.9;
    else v_tdee := v_bmr * 1.55; -- default moderate
  end case;
  
  -- Calculate target calories based on goal
  case coalesce(v_profile.goal, 'maintain')
    when 'lose_weight' then v_target_calories := round(v_tdee - 500);
    when 'gain_muscle' then v_target_calories := round(v_tdee + 300);
    when 'maintain' then v_target_calories := round(v_tdee);
    else v_target_calories := round(v_tdee);
  end case;
  
  -- Calculate water target
  v_target_water := (coalesce(v_profile.current_weight_kg, 70) * 35); -- 35ml per kg
  
  -- Check water goal (if trigger from water_logs)
  if TG_TABLE_NAME = 'water_logs' then
    select coalesce(sum(amount_ml), 0) into v_today_water
    from public.water_logs
    where user_id = NEW.user_id
      and date = CURRENT_DATE;
    
    if v_today_water >= v_target_water then
      perform create_notification(
        NEW.user_id,
        'goal_completed',
        '💧 Hoàn thành mục tiêu uống nước',
        format('Tuyệt vời! Bạn đã uống đủ %s ml nước hôm nay.', v_today_water),
        '💧',
        '#DBEAFE',
        NEW.id,
        jsonb_build_object('goal_type', 'water', 'amount', v_today_water, 'target', v_target_water)
      );
    end if;
  end if;
  
  -- Check meal/calorie goal (if trigger from meal_logs)
  if TG_TABLE_NAME = 'meal_logs' then
    select coalesce(sum(m.calories), 0) into v_today_calories
    from public.meal_logs ml
    join public.meals m on ml.meal_id = m.id
    where ml.user_id = NEW.user_id
      and date(ml.eaten_at) = CURRENT_DATE;
    
    -- Check if reached target (within 10% range)
    if v_today_calories >= (v_target_calories * 0.9) and v_today_calories <= (v_target_calories * 1.1) then
      perform create_notification(
        NEW.user_id,
        'goal_completed',
        '🍽️ Hoàn thành mục tiêu calories',
        format('Xuất sắc! Bạn đã đạt %s/%s calories hôm nay.', v_today_calories, v_target_calories),
        '🍽️',
        '#FEF3C7',
        NEW.id,
        jsonb_build_object('goal_type', 'calories', 'current', v_today_calories, 'target', v_target_calories)
      );
    end if;
  end if;
  
  -- Check exercise goal (if trigger from exercise_logs)
  if TG_TABLE_NAME = 'exercise_logs' then
    select coalesce(sum(duration_minutes), 0) into v_today_exercise
    from public.exercise_logs
    where user_id = NEW.user_id
      and date = CURRENT_DATE;
    
    if v_today_exercise >= 30 then
      perform create_notification(
        NEW.user_id,
        'goal_completed',
        '💪 Hoàn thành tập luyện',
        format('Tuyệt vời! Bạn đã tập luyện %s phút hôm nay.', v_today_exercise),
        '💪',
        '#FEE2E2',
        NEW.id,
        jsonb_build_object('goal_type', 'exercise', 'minutes', v_today_exercise)
      );
    end if;
  end if;
  
  return NEW;
end;
$$;

-- ================================================
-- STEP 3: CHECK MEAL STREAK FUNCTION
-- ================================================

drop function if exists check_meal_streak() cascade;

create or replace function check_meal_streak()
returns trigger
language plpgsql
security definer
as $$
declare
  v_streak_days int;
begin
  -- Count consecutive days with meal logs (at least 3 meals per day)
  select count(*) into v_streak_days
  from (
    select date(eaten_at) as log_date
    from public.meal_logs
    where user_id = NEW.user_id
      and date(eaten_at) >= CURRENT_DATE - interval '7 days'
    group by date(eaten_at)
    having count(*) >= 3
    order by log_date desc
  ) as daily_logs;
  
  -- Notify on 3, 5, 7 day streaks
  if v_streak_days in (3, 5, 7) then
    perform create_notification(
      NEW.user_id,
      'streak',
      '🔥 Chuỗi thói quen',
      format('Tuyệt vời! Bạn đã duy trì ăn uống lành mạnh %s ngày liên tiếp. Đừng bỏ cuộc nhé!', v_streak_days),
      '🔥',
      '#FEE2E2',
      null,
      jsonb_build_object('streak_days', v_streak_days)
    );
  end if;
  
  return NEW;
end;
$$;

-- ================================================
-- STEP 4: CREATE DEFAULT SETTINGS FUNCTION
-- ================================================

drop function if exists create_default_notification_settings() cascade;

create or replace function create_default_notification_settings()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Create default notification settings
  insert into public.notification_settings (user_id)
  values (NEW.id)
  on conflict (user_id) do nothing;
  
  -- Send welcome notification
  perform create_notification(
    NEW.id,
    'welcome',
    '🎉 Chào mừng',
    'Chào mừng bạn! Hãy cùng nhau thiết lập mục tiêu sức khỏe đầu tiên của bạn.',
    '🎉',
    '#FEF3C7',
    null,
    null
  );
  
  return NEW;
end;
$$;

-- ================================================
-- STEP 5: CREATE TRIGGERS
-- ================================================

-- Drop existing triggers if they exist
drop trigger if exists check_water_goal_trigger on public.water_logs;
drop trigger if exists check_meal_goal_trigger on public.meal_logs;
drop trigger if exists check_exercise_goal_trigger on public.exercise_logs;
drop trigger if exists check_meal_streak_trigger on public.meal_logs;
drop trigger if exists create_default_settings_trigger on public.profiles;

-- Create triggers for goal completion
create trigger check_water_goal_trigger
  after insert on public.water_logs
  for each row
  execute function check_daily_goals();

create trigger check_meal_goal_trigger
  after insert on public.meal_logs
  for each row
  execute function check_daily_goals();

create trigger check_exercise_goal_trigger
  after insert on public.exercise_logs
  for each row
  execute function check_daily_goals();

-- Create trigger for streak tracking
create trigger check_meal_streak_trigger
  after insert on public.meal_logs
  for each row
  execute function check_meal_streak();

-- Create trigger for new user settings
create trigger create_default_settings_trigger
  after insert on public.profiles
  for each row
  execute function create_default_notification_settings();

-- ================================================
-- STEP 6: CREATE NOTIFICATION SETTINGS IF MISSING
-- ================================================

-- Create notification_settings for existing users who don't have it
insert into public.notification_settings (user_id)
select id from public.profiles
where id not in (select user_id from public.notification_settings)
on conflict (user_id) do nothing;

-- ================================================
-- VERIFICATION
-- ================================================

-- Show created triggers
SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  'CREATED' as status
FROM pg_trigger 
WHERE tgname IN (
  'check_water_goal_trigger',
  'check_meal_goal_trigger',
  'check_exercise_goal_trigger',
  'check_meal_streak_trigger',
  'create_default_settings_trigger'
)
ORDER BY table_name, trigger_name;
