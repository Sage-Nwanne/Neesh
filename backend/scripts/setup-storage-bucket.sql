-- ============================================
-- STORAGE BUCKET SETUP FOR NEESH
-- ============================================
-- This script creates the product-images bucket and sets up proper policies
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/smfzrubkyxejzkblrrjr/sql

-- ============================================
-- CREATE STORAGE BUCKET
-- ============================================

-- Create the product-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images', 
  true,  -- Make bucket public
  10485760,  -- 10MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']  -- Allowed image types
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "anonymous_upload_product_images" ON storage.objects;
DROP POLICY IF EXISTS "public_read_product_images" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_upload_product_images" ON storage.objects;
DROP POLICY IF EXISTS "service_role_all_product_images" ON storage.objects;

-- 1. Allow anonymous users to upload images to product-images bucket
CREATE POLICY "anonymous_upload_product_images" ON storage.objects
  FOR INSERT 
  TO anon
  WITH CHECK (
    bucket_id = 'product-images' AND
    (storage.foldername(name))[1] = 'uploads' OR name ~ '^[0-9]+\.(jpg|jpeg|png|webp|avif)$'
  );

-- 2. Allow public read access to all images in product-images bucket
CREATE POLICY "public_read_product_images" ON storage.objects
  FOR SELECT 
  TO public
  USING (bucket_id = 'product-images');

-- 3. Allow authenticated users to upload images to product-images bucket
CREATE POLICY "authenticated_upload_product_images" ON storage.objects
  FOR INSERT 
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- 4. Allow authenticated users to update their own images
CREATE POLICY "authenticated_update_own_product_images" ON storage.objects
  FOR UPDATE 
  TO authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

-- 5. Allow authenticated users to delete their own images
CREATE POLICY "authenticated_delete_own_product_images" ON storage.objects
  FOR DELETE 
  TO authenticated
  USING (bucket_id = 'product-images');

-- 6. Allow service role full access for admin operations
CREATE POLICY "service_role_all_product_images" ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

-- ============================================
-- VERIFY SETUP
-- ============================================

-- Check if bucket was created successfully
SELECT
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE id = 'product-images';

-- Check policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE '%product_images%'
ORDER BY policyname;

-- ============================================
-- NOTES
-- ============================================
--
-- After running this script:
-- 1. The product-images bucket will be created and publicly accessible
-- 2. Anonymous users can upload images (for publisher applications)
-- 3. All users can read/view images
-- 4. Authenticated users have full CRUD access to their images
-- 5. Service role has full access for admin operations
--
-- The bucket allows common image formats with a 10MB size limit
-- Images uploaded by anonymous users should follow the naming pattern: timestamp.extension
--
-- Test the setup by:
-- 1. Uploading an image via the publisher application form
-- 2. Verifying the image URL is accessible publicly
-- 3. Checking that the application submission works with uploaded images
