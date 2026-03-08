-- =====================================================
-- Storage Policies for Profile Avatars
-- =====================================================
-- Run this after creating the 'profiles' storage bucket
-- in the Supabase Dashboard
-- =====================================================

-- Allow authenticated users to upload their own avatars to the avatars folder
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profiles' 
  AND (storage.foldername(name))[1] = 'avatars'
);

-- Allow authenticated users to update their own avatars
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profiles'
  AND (storage.foldername(name))[1] = 'avatars'
);

-- Allow authenticated users to delete their own avatars
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profiles'
  AND (storage.foldername(name))[1] = 'avatars'
);

-- Allow public access to view all avatars
-- This is necessary because the bucket is public
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profiles');

-- =====================================================
-- Verification Query
-- =====================================================
-- Run this to verify the policies are created
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
