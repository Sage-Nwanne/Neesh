-- Debug RLS status and policies
-- Run this in Supabase SQL Editor to see what's actually configured

-- 1. Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    hasrls
FROM pg_tables 
WHERE tablename IN ('publisher_applications', 'retailer_applications');

-- 2. Check what policies exist
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

-- 3. Check table ownership and permissions
SELECT 
    table_name,
    table_schema,
    table_type
FROM information_schema.tables 
WHERE table_name IN ('publisher_applications', 'retailer_applications');

-- 4. Test if anon role can insert (this should work)
SET ROLE anon;
SELECT 'Testing anon role permissions' as test;
RESET ROLE;

-- 5. Check if there are any other constraints
SELECT 
    table_name,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name IN ('publisher_applications', 'retailer_applications');
