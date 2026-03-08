-- Enable Row Level Security
alter table auth.users enable row level security;

-- PROFILES
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  gender text check (gender in ('male', 'female', 'other')),
  date_of_birth date,
  height_cm numeric,
  current_weight_kg numeric,
  activity_level text check (activity_level in ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  goal text check (goal in ('lose_weight', 'gain_muscle', 'maintain')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- WEIGHT LOGS
create table public.weight_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  weight_kg numeric not null,
  logged_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.weight_logs enable row level security;

create policy "Users can view own weight logs."
  on weight_logs for select
  using ( auth.uid() = user_id );

create policy "Users can insert own weight logs."
  on weight_logs for insert
  with check ( auth.uid() = user_id );

-- WATER LOGS
create table public.water_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  amount_ml int not null,
  date date not null default CURRENT_DATE
);

alter table public.water_logs enable row level security;

create policy "Users can view own water logs."
  on water_logs for select
  using ( auth.uid() = user_id );

create policy "Users can insert own water logs."
  on water_logs for insert
  with check ( auth.uid() = user_id );

-- MEAL PLANS (Static Data / System Data)
create table public.meal_plans (
  id uuid default gen_random_uuid() primary key,
  name text not null, -- 'Standard', 'Vegan', 'Keto' etc.
  goal_type text not null, -- 'lose_weight', 'gain_muscle', 'balance'
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.meal_plans enable row level security;
create policy "Meal plans are viewable by everyone." on meal_plans for select using ( true );

-- MEALS
create table public.meals (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references public.meal_plans(id),
  name text not null,
  description text,
  calories int,
  protein_g numeric,
  carbs_g numeric,
  fats_g numeric,
  meal_type text check (meal_type in ('breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner')),
  image_url text
);

alter table public.meals enable row level security;
create policy "Meals are viewable by everyone." on meals for select using ( true );

-- MEAL LOGS (User Tracking)
create table public.meal_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  meal_id uuid references public.meals(id),
  custom_meal_name text, -- if not from system DB
  calories int,
  eaten_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.meal_logs enable row level security;

create policy "Users can view own meal logs."
  on meal_logs for select
  using ( auth.uid() = user_id );

create policy "Users can insert own meal logs."
  on meal_logs for insert
  with check ( auth.uid() = user_id );

-- ARTICLES (Knowledge Hub)
create table public.articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text,
  category text check (category in ('nutrition', 'cooking_tips', 'home_workout')),
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.articles enable row level security;
create policy "Articles are viewable by everyone." on articles for select using ( true );

-- SAVED ARTICLES
create table public.saved_articles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  article_id uuid references public.articles(id) not null,
  saved_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, article_id)
);

alter table public.saved_articles enable row level security;

create policy "Users can view own saved articles."
  on saved_articles for select
  using ( auth.uid() = user_id );

create policy "Users can insert own saved articles."
  on saved_articles for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete own saved articles."
  on saved_articles for delete
  using ( auth.uid() = user_id );

-- Triggers for Profile creation on Auth Signup
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
