-- Add Exercise and Sleep tracking tables
-- Run this in Supabase SQL Editor

-- ============================================
-- EXERCISE LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.exercise_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  exercise_type text NOT NULL, -- 'cardio', 'strength', 'yoga', 'sport', 'other'
  duration_minutes int NOT NULL CHECK (duration_minutes > 0),
  calories_burned int, -- Optional, can be calculated
  notes text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies for exercise_logs
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exercise logs."
  ON exercise_logs FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert own exercise logs."
  ON exercise_logs FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update own exercise logs."
  ON exercise_logs FOR UPDATE
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete own exercise logs."
  ON exercise_logs FOR DELETE
  USING ( auth.uid() = user_id );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS exercise_logs_user_date_idx 
ON exercise_logs(user_id, date DESC);

-- ============================================
-- SLEEP LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.sleep_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  sleep_start timestamp with time zone NOT NULL,
  sleep_end timestamp with time zone NOT NULL,
  duration_hours numeric NOT NULL CHECK (duration_hours > 0 AND duration_hours <= 24),
  quality text CHECK (quality IN ('poor', 'fair', 'good', 'excellent')),
  notes text,
  date date NOT NULL, -- Date of the sleep (when you woke up)
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT valid_sleep_times CHECK (sleep_end > sleep_start)
);

-- Add RLS policies for sleep_logs
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sleep logs."
  ON sleep_logs FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert own sleep logs."
  ON sleep_logs FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update own sleep logs."
  ON sleep_logs FOR UPDATE
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete own sleep logs."
  ON sleep_logs FOR DELETE
  USING ( auth.uid() = user_id );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS sleep_logs_user_date_idx 
ON sleep_logs(user_id, date DESC);

-- ============================================
-- VERIFICATION
-- ============================================

-- Check tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('exercise_logs', 'sleep_logs');

-- Check RLS policies
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('exercise_logs', 'sleep_logs')
ORDER BY tablename, cmd;

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('exercise_logs', 'sleep_logs');
