
-- ============================================
-- PUBLISHER APPLICATIONS RLS SETUP
-- ============================================

-- Ensure RLS is enabled
ALTER TABLE publisher_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous application submissions" ON publisher_applications;
DROP POLICY IF EXISTS "Users can view own applications by email" ON publisher_applications;
DROP POLICY IF EXISTS "Service role can view all applications" ON publisher_applications;
DROP POLICY IF EXISTS "Service role can update applications" ON publisher_applications;
DROP POLICY IF EXISTS "Anyone can submit applications" ON publisher_applications;
DROP POLICY IF EXISTS "Users can view own applications" ON publisher_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON publisher_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON publisher_applications;

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

-- 3. Allow service role full access (for admin operations)
CREATE POLICY "service_role_full_access_publisher_applications" ON publisher_applications
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. Allow authenticated users to update their own applications (after account creation)
CREATE POLICY "users_can_update_own_publisher_applications" ON publisher_applications
    FOR UPDATE 
    TO authenticated
    USING (email = auth.jwt() ->> 'email')
    WITH CHECK (email = auth.jwt() ->> 'email');

-- ============================================
-- RETAILER APPLICATIONS RLS SETUP (if table exists)
-- ============================================

-- Check if retailer_applications table exists and set up similar policies
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'retailer_applications') THEN
        -- Ensure RLS is enabled
        ALTER TABLE retailer_applications ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies
        DROP POLICY IF EXISTS "anonymous_can_insert_retailer_applications" ON retailer_applications;
        DROP POLICY IF EXISTS "users_can_view_own_retailer_applications" ON retailer_applications;
        DROP POLICY IF EXISTS "service_role_full_access_retailer_applications" ON retailer_applications;
        DROP POLICY IF EXISTS "users_can_update_own_retailer_applications" ON retailer_applications;
        
        -- Create new policies
        CREATE POLICY "anonymous_can_insert_retailer_applications" ON retailer_applications
            FOR INSERT 
            TO anon
            WITH CHECK (true);
            
        CREATE POLICY "users_can_view_own_retailer_applications" ON retailer_applications
            FOR SELECT 
            TO authenticated
            USING (email = auth.jwt() ->> 'email');
            
        CREATE POLICY "service_role_full_access_retailer_applications" ON retailer_applications
            FOR ALL 
            TO service_role
            USING (true)
            WITH CHECK (true);
            
        CREATE POLICY "users_can_update_own_retailer_applications" ON retailer_applications
            FOR UPDATE 
            TO authenticated
            USING (email = auth.jwt() ->> 'email')
            WITH CHECK (email = auth.jwt() ->> 'email');
            
        RAISE NOTICE 'Retailer applications RLS policies updated';
    ELSE
        RAISE NOTICE 'Retailer applications table does not exist, skipping';
    END IF;
END $$;
