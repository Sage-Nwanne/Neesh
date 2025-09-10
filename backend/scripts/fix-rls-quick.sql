-- Quick RLS fix for application submissions
-- Run this in Supabase SQL Editor

-- Temporarily disable RLS to allow submissions
ALTER TABLE publisher_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE retailer_applications DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('publisher_applications', 'retailer_applications');

-- This should show rls_enabled = false for both tables
