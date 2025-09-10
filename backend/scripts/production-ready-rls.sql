-- ============================================
-- PRODUCTION-READY RLS FOR ANONYMOUS APPLICATION SUBMISSIONS
-- ============================================
-- This allows anonymous users (no accounts) to submit applications
-- while maintaining security for other operations

-- ============================================
-- PUBLISHER APPLICATIONS
-- ============================================

-- Enable RLS
ALTER TABLE publisher_applications ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start clean
DROP POLICY IF EXISTS "anonymous_can_insert_publisher_applications" ON publisher_applications;
DROP POLICY IF EXISTS "users_can_view_own_publisher_applications" ON publisher_applications;
DROP POLICY IF EXISTS "service_role_full_access_publisher_applications" ON publisher_applications;
DROP POLICY IF EXISTS "users_can_update_own_publisher_applications" ON publisher_applications;

-- 1. Allow anonymous users to INSERT applications (for initial submission)
CREATE POLICY "anonymous_insert_publisher_applications" ON publisher_applications
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- 2. Allow service role full access (for admin operations, triggers, and backend processes)
CREATE POLICY "service_role_all_publisher_applications" ON publisher_applications
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 3. Allow authenticated users to view their own applications (after they get accounts)
CREATE POLICY "authenticated_view_own_publisher_applications" ON publisher_applications
    FOR SELECT 
    TO authenticated
    USING (email = auth.jwt() ->> 'email');

-- 4. Allow authenticated users to update their own applications (after they get accounts)
CREATE POLICY "authenticated_update_own_publisher_applications" ON publisher_applications
    FOR UPDATE 
    TO authenticated
    USING (email = auth.jwt() ->> 'email')
    WITH CHECK (email = auth.jwt() ->> 'email');

-- ============================================
-- RETAILER APPLICATIONS
-- ============================================

-- Enable RLS
ALTER TABLE retailer_applications ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start clean
DROP POLICY IF EXISTS "anonymous_can_insert_retailer_applications" ON retailer_applications;
DROP POLICY IF EXISTS "users_can_view_own_retailer_applications" ON retailer_applications;
DROP POLICY IF EXISTS "service_role_full_access_retailer_applications" ON retailer_applications;
DROP POLICY IF EXISTS "users_can_update_own_retailer_applications" ON retailer_applications;

-- 1. Allow anonymous users to INSERT applications (for initial submission)
CREATE POLICY "anonymous_insert_retailer_applications" ON retailer_applications
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- 2. Allow service role full access (for admin operations, triggers, and backend processes)
CREATE POLICY "service_role_all_retailer_applications" ON retailer_applications
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 3. Allow authenticated users to view their own applications (after they get accounts)
CREATE POLICY "authenticated_view_own_retailer_applications" ON retailer_applications
    FOR SELECT 
    TO authenticated
    USING (buyer_email = auth.jwt() ->> 'email');

-- 4. Allow authenticated users to update their own applications (after they get accounts)
CREATE POLICY "authenticated_update_own_retailer_applications" ON retailer_applications
    FOR UPDATE 
    TO authenticated
    USING (buyer_email = auth.jwt() ->> 'email')
    WITH CHECK (buyer_email = auth.jwt() ->> 'email');

-- ============================================
-- VERIFICATION & TESTING
-- ============================================

-- Verify RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('publisher_applications', 'retailer_applications');

-- Verify policies are created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename IN ('publisher_applications', 'retailer_applications')
ORDER BY tablename, policyname;

-- Test anonymous access (should return policy count)
SELECT 
    'publisher_applications' as table_name,
    COUNT(*) as anonymous_insert_policies
FROM pg_policies 
WHERE tablename = 'publisher_applications' 
AND policyname LIKE '%anonymous_insert%'
UNION ALL
SELECT 
    'retailer_applications' as table_name,
    COUNT(*) as anonymous_insert_policies
FROM pg_policies 
WHERE tablename = 'retailer_applications' 
AND policyname LIKE '%anonymous_insert%';

-- Final status
SELECT 'Production-ready RLS setup complete! Anonymous users can now submit applications.' as status;
