-- Enable Realtime for notifications table
-- Run this in Supabase SQL Editor

-- 1. Enable realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- 2. Verify realtime is enabled
SELECT 
  schemaname,
  tablename,
  pubname
FROM 
  pg_publication_tables
WHERE 
  tablename = 'notifications';

-- Should return a row showing notifications in supabase_realtime publication
