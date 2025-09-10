-- ============================================
-- PRODUCTION-READY APPLICATION SYSTEM SETUP
-- ============================================
-- This script sets up proper RLS policies for anonymous application submissions
-- AND email notification triggers
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/smfzrubkyxejzkblrrjr/sql

-- ============================================
-- STEP 1: PROPER RLS POLICIES FOR ANONYMOUS USERS
-- ============================================

-- Enable RLS on both tables
ALTER TABLE publisher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailer_applications ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "anonymous_can_insert_publisher_applications" ON publisher_applications;
DROP POLICY IF EXISTS "service_role_full_access_publisher_applications" ON publisher_applications;
DROP POLICY IF EXISTS "users_can_view_own_publisher_applications" ON publisher_applications;
DROP POLICY IF EXISTS "users_can_update_own_publisher_applications" ON publisher_applications;

DROP POLICY IF EXISTS "anonymous_can_insert_retailer_applications" ON retailer_applications;
DROP POLICY IF EXISTS "service_role_full_access_retailer_applications" ON retailer_applications;
DROP POLICY IF EXISTS "users_can_view_own_retailer_applications" ON retailer_applications;
DROP POLICY IF EXISTS "users_can_update_own_retailer_applications" ON retailer_applications;

-- PUBLISHER APPLICATIONS POLICIES
-- 1. Allow anonymous users to submit applications (this is the key policy!)
CREATE POLICY "anonymous_can_insert_publisher_applications" ON publisher_applications
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- 2. Allow service role full access (for admin operations and triggers)
CREATE POLICY "service_role_full_access_publisher_applications" ON publisher_applications
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 3. Allow authenticated users to view their own applications (after they get accounts)
CREATE POLICY "users_can_view_own_publisher_applications" ON publisher_applications
    FOR SELECT
    TO authenticated
    USING (email = auth.jwt() ->> 'email');

-- 4. Allow authenticated users to update their own applications (after they get accounts)
CREATE POLICY "users_can_update_own_publisher_applications" ON publisher_applications
    FOR UPDATE
    TO authenticated
    USING (email = auth.jwt() ->> 'email')
    WITH CHECK (email = auth.jwt() ->> 'email');

-- RETAILER APPLICATIONS POLICIES
-- 1. Allow anonymous users to submit applications (this is the key policy!)
CREATE POLICY "anonymous_can_insert_retailer_applications" ON retailer_applications
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- 2. Allow service role full access (for admin operations and triggers)
CREATE POLICY "service_role_full_access_retailer_applications" ON retailer_applications
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 3. Allow authenticated users to view their own applications (after they get accounts)
CREATE POLICY "users_can_view_own_retailer_applications" ON retailer_applications
    FOR SELECT
    TO authenticated
    USING (buyer_email = auth.jwt() ->> 'email');

-- 4. Allow authenticated users to update their own applications (after they get accounts)
CREATE POLICY "users_can_update_own_retailer_applications" ON retailer_applications
    FOR UPDATE
    TO authenticated
    USING (buyer_email = auth.jwt() ->> 'email')
    WITH CHECK (buyer_email = auth.jwt() ->> 'email');