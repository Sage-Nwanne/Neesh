-- ============================================
-- PRODUCTION-READY RLS SETUP FOR NEESH
-- ============================================
-- This script sets up secure RLS policies for all application tables
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/smfzrubkyxejzkblrrjr/sql

-- ============================================
-- PUBLISHER APPLICATIONS RLS
-- ============================================

-- Enable RLS on publisher_applications
ALTER TABLE publisher_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "anonymous_can_insert_publisher_applications" ON publisher_applications;
DROP POLICY IF EXISTS "users_can_view_own_publisher_applications" ON publisher_applications;
DROP POLICY IF EXISTS "service_role_full_access_publisher_applications" ON publisher_applications;
DROP POLICY IF EXISTS "users_can_update_own_publisher_applications" ON publisher_applications;

-- 1. Allow anonymous users to INSERT applications (for initial submission)
CREATE POLICY "anonymous_can_insert_publisher_applications" ON publisher_applications
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- 2. Allow authenticated users to view their own applications by email
CREATE POLICY "users_can_view_own_publisher_applications" ON publisher_applications
    FOR SELECT 
    TO authenticated
    USING (email = auth.jwt() ->> 'email');

-- 3. Allow service role full access (for admin operations and triggers)
CREATE POLICY "service_role_full_access_publisher_applications" ON publisher_applications
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. Allow authenticated users to update their own applications
CREATE POLICY "users_can_update_own_publisher_applications" ON publisher_applications
    FOR UPDATE 
    TO authenticated
    USING (email = auth.jwt() ->> 'email')
    WITH CHECK (email = auth.jwt() ->> 'email');

-- ============================================
-- RETAILER APPLICATIONS RLS
-- ============================================

-- Enable RLS on retailer_applications
ALTER TABLE retailer_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "anonymous_can_insert_retailer_applications" ON retailer_applications;
DROP POLICY IF EXISTS "users_can_view_own_retailer_applications" ON retailer_applications;
DROP POLICY IF EXISTS "service_role_full_access_retailer_applications" ON retailer_applications;
DROP POLICY IF EXISTS "users_can_update_own_retailer_applications" ON retailer_applications;

-- 1. Allow anonymous users to INSERT applications (for initial submission)
CREATE POLICY "anonymous_can_insert_retailer_applications" ON retailer_applications
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- 2. Allow authenticated users to view their own applications by email
CREATE POLICY "users_can_view_own_retailer_applications" ON retailer_applications
    FOR SELECT 
    TO authenticated
    USING (buyer_email = auth.jwt() ->> 'email');

-- 3. Allow service role full access (for admin operations and triggers)
CREATE POLICY "service_role_full_access_retailer_applications" ON retailer_applications
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. Allow authenticated users to update their own applications
CREATE POLICY "users_can_update_own_retailer_applications" ON retailer_applications
    FOR UPDATE 
    TO authenticated
    USING (buyer_email = auth.jwt() ->> 'email')
    WITH CHECK (buyer_email = auth.jwt() ->> 'email');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('publisher_applications', 'retailer_applications');

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
WHERE tablename IN ('publisher_applications', 'retailer_applications')
ORDER BY tablename, policyname;

-- Test policy count
SELECT 
    'publisher_applications' as table_name,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'publisher_applications'
UNION ALL
SELECT 
    'retailer_applications' as table_name,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'retailer_applications';

-- Final confirmation
SELECT 'RLS setup complete! Both tables are now secure.' as status;
