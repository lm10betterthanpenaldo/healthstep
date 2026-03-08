-- NOTIFICATIONS TABLE
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  type text not null check (type in (
    'meal_reminder',      -- Nhắc nhở ăn uống
    'water_reminder',     -- Nhắc uống nước
    'exercise_reminder',  -- Nhắc tập luyện
    'sleep_reminder',     -- Nhắc đi ngủ
    'goal_completed',     -- Hoàn thành mục tiêu
    'streak',            -- Chuỗi thói quen
    'weight_update',     -- Cập nhật cân nặng
    'new_article',       -- Bài viết mới
    'tip',              -- Mẹo nhỏ
    'welcome'           -- Chào mừng
  )),
  title text not null,
  message text not null,
  icon text not null,         -- emoji icon
  icon_bg text not null,       -- background color
  is_read boolean default false,
  related_id uuid,            -- ID liên quan (meal_log_id, exercise_log_id, etc.)
  metadata jsonb,             -- Dữ liệu bổ sung
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  read_at timestamp with time zone
);

alter table public.notifications enable row level security;

create policy "Users can view own notifications."
  on notifications for select
  using ( auth.uid() = user_id );

create policy "Users can update own notifications."
  on notifications for update
  using ( auth.uid() = user_id );

create policy "Users can insert own notifications."
  on notifications for insert
  with check ( auth.uid() = user_id );

-- Index cho performance
create index notifications_user_id_idx on public.notifications(user_id);
create index notifications_created_at_idx on public.notifications(created_at desc);
create index notifications_is_read_idx on public.notifications(is_read);

-- NOTIFICATION SETTINGS TABLE
create table public.notification_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null unique,
  
  -- Meal reminders
  breakfast_enabled boolean default true,
  breakfast_time time default '07:00:00',
  lunch_enabled boolean default true,
  lunch_time time default '12:00:00',
  dinner_enabled boolean default true,
  dinner_time time default '18:00:00',
  
  -- Water reminders
  water_enabled boolean default true,
  water_interval_hours int default 2,
  
  -- Exercise reminders
  exercise_enabled boolean default true,
  exercise_time time default '17:00:00',
  
  -- Sleep reminders
  sleep_enabled boolean default true,
  sleep_time time default '22:00:00',
  
  -- Goal & achievement notifications
  goal_notifications_enabled boolean default true,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notification_settings enable row level security;

create policy "Users can view own notification settings."
  on notification_settings for select
  using ( auth.uid() = user_id );

create policy "Users can update own notification settings."
  on notification_settings for update
  using ( auth.uid() = user_id );

create policy "Users can insert own notification settings."
  on notification_settings for insert
  with check ( auth.uid() = user_id );

-- Function to create notification
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
    user_id, type, title, message, icon, icon_bg, related_id, metadata
  ) values (
    p_user_id, p_type, p_title, p_message, p_icon, p_icon_bg, p_related_id, p_metadata
  )
  returning id into v_notification_id;
  
  return v_notification_id;
end;
$$;

-- Function to check and create goal completion notifications
create or replace function check_daily_goals()
returns trigger
language plpgsql
security definer
as $$
declare
  v_user_goal text;
  v_total_calories int;
  v_calorie_target int;
  v_water_total int;
  v_exercise_done boolean;
begin
  -- Check water goal (2000ml = 2L)
  if TG_TABLE_NAME = 'water_logs' then
    select coalesce(sum(amount_ml), 0) into v_water_total
    from public.water_logs
    where user_id = NEW.user_id 
      and date = CURRENT_DATE;
    
    if v_water_total >= 2000 then
      perform create_notification(
        NEW.user_id,
        'goal_completed',
        'Hoàn thành mục tiêu',
        'Chúc mừng! Bạn đã uống đủ 2L nước hôm nay. Cơ thể đang cảm ơn bạn đấy!',
        '🏆',
        '#FEF3C7',
        NEW.id,
        jsonb_build_object('goal_type', 'water', 'amount', v_water_total)
      );
    end if;
  end if;
  
  -- Check meal goal - calorie target
  if TG_TABLE_NAME = 'meal_logs' then
    select goal into v_user_goal
    from public.profiles
    where id = NEW.user_id;
    
    -- Simple calorie target based on goal
    v_calorie_target := case v_user_goal
      when 'lose_weight' then 1800
      when 'gain_muscle' then 2500
      else 2000
    end;
    
    select coalesce(sum(calories), 0) into v_total_calories
    from public.meal_logs
    where user_id = NEW.user_id 
      and date(eaten_at) = CURRENT_DATE;
    
    if v_total_calories >= v_calorie_target then
      perform create_notification(
        NEW.user_id,
        'goal_completed',
        'Đạt mục tiêu calo',
        format('Tuyệt vời! Bạn đã đạt %s/%s calo hôm nay.', v_total_calories, v_calorie_target),
        '🎯',
        '#FEF3C7',
        NEW.id,
        jsonb_build_object('goal_type', 'calories', 'current', v_total_calories, 'target', v_calorie_target)
      );
    end if;
  end if;
  
  -- Check exercise goal
  if TG_TABLE_NAME = 'exercise_logs' then
    select exists(
      select 1 from public.exercise_logs
      where user_id = NEW.user_id 
        and date = CURRENT_DATE
        and duration_minutes >= 30
    ) into v_exercise_done;
    
    if v_exercise_done then
      perform create_notification(
        NEW.user_id,
        'goal_completed',
        'Hoàn thành tập luyện',
        'Tuyệt vời! Bạn đã hoàn thành mục tiêu tập luyện hôm nay.',
        '💪',
        '#FEE2E2',
        NEW.id,
        jsonb_build_object('goal_type', 'exercise')
      );
    end if;
  end if;
  
  return NEW;
end;
$$;

-- Triggers for goal completion
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

-- Function to check streak
create or replace function check_meal_streak()
returns trigger
language plpgsql
security definer
as $$
declare
  v_streak_days int;
  v_last_log_date date;
begin
  -- Count consecutive days with meal logs
  select count(*) into v_streak_days
  from (
    select date(eaten_at) as log_date
    from public.meal_logs
    where user_id = NEW.user_id
      and date(eaten_at) >= CURRENT_DATE - interval '7 days'
    group by date(eaten_at)
    having count(*) >= 3  -- At least 3 meals per day
    order by log_date desc
  ) as daily_logs;
  
  -- Notify on 3, 5, 7 day streaks
  if v_streak_days in (3, 5, 7) then
    perform create_notification(
      NEW.user_id,
      'streak',
      'Chuỗi thói quen',
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

create trigger check_meal_streak_trigger
  after insert on public.meal_logs
  for each row
  execute function check_meal_streak();

-- Function to create default notification settings for new users
create or replace function create_default_notification_settings()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.notification_settings (user_id)
  values (NEW.id);
  
  -- Send welcome notification
  perform create_notification(
    NEW.id,
    'welcome',
    'Chào mừng',
    'Chào mừng bạn! Hãy cùng nhau thiết lập mục tiêu sức khỏe đầu tiên của bạn.',
    '🎉',
    '#FEF3C7',
    null,
    null
  );
  
  return NEW;
end;
$$;

create trigger create_notification_settings_trigger
  after insert on public.profiles
  for each row
  execute function create_default_notification_settings();
