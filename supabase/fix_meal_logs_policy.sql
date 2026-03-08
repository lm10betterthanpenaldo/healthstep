-- Fix meal_logs table: Add DELETE policy
-- Run this in Supabase SQL Editor

-- Add delete policy for meal_logs
create policy "Users can delete own meal logs."
  on meal_logs for delete
  using ( auth.uid() = user_id );

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'meal_logs';
