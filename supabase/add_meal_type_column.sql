-- Add meal_type column to meal_logs table
-- This allows us to store the actual meal type instead of inferring from time

-- Step 1: Add the column (nullable first to avoid issues with existing data)
ALTER TABLE public.meal_logs 
ADD COLUMN meal_type text;

-- Step 2: Add constraint to ensure valid values
ALTER TABLE public.meal_logs
ADD CONSTRAINT meal_logs_meal_type_check 
CHECK (meal_type IN ('breakfast', 'lunch', 'snack', 'dinner'));

-- Step 3: Update existing records based on their eaten_at time (migration)
-- This is a one-time migration for existing data
UPDATE public.meal_logs
SET meal_type = CASE
  WHEN EXTRACT(HOUR FROM eaten_at AT TIME ZONE 'UTC') >= 5 
   AND EXTRACT(HOUR FROM eaten_at AT TIME ZONE 'UTC') < 11 THEN 'breakfast'
  WHEN EXTRACT(HOUR FROM eaten_at AT TIME ZONE 'UTC') >= 11 
   AND EXTRACT(HOUR FROM eaten_at AT TIME ZONE 'UTC') < 15 THEN 'lunch'
  WHEN EXTRACT(HOUR FROM eaten_at AT TIME ZONE 'UTC') >= 15 
   AND EXTRACT(HOUR FROM eaten_at AT TIME ZONE 'UTC') < 18 THEN 'snack'
  ELSE 'dinner'
END
WHERE meal_type IS NULL;

-- Step 4: Make the column NOT NULL after migration
ALTER TABLE public.meal_logs
ALTER COLUMN meal_type SET NOT NULL;

-- Verify the changes
SELECT 
  id,
  user_id,
  meal_type,
  eaten_at,
  EXTRACT(HOUR FROM eaten_at AT TIME ZONE 'UTC') as hour_utc
FROM meal_logs
ORDER BY eaten_at DESC
LIMIT 10;
