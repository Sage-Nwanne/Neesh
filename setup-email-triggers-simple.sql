-- ============================================
-- EMAIL NOTIFICATION SETUP FOR APPLICATIONS
-- ============================================
-- Copy and paste this entire script into Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/smfzrubkyxejzkblrrjr/sql

-- First, let's check what extensions are available
SELECT * FROM pg_available_extensions WHERE name IN ('http', 'pg_net');

-- Enable the pg_net extension (Supabase's HTTP extension)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================
-- PUBLISHER APPLICATION EMAIL NOTIFICATIONS
-- ============================================

-- Create function to notify on new publisher applications
CREATE OR REPLACE FUNCTION notify_publisher_application()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
BEGIN
  -- Only send notification for new applications (INSERT)
  IF TG_OP = 'INSERT' THEN
    -- Use pg_net.http_post for HTTP requests in Supabase
    SELECT INTO request_id net.http_post(
      url := 'https://smfzrubkyxejzkblrrjr.supabase.co/functions/v1/publisher-notify',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTcsImV4cCI6MjA2ODM1MzUxN30.1DF1Gtz3rIH0ifyeu0IUSKZmIy4LFnA1ddEtYjLSO0w'
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
    
    -- Log the request
    RAISE NOTICE 'Publisher notification sent, request_id: %', request_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for publisher applications
DROP TRIGGER IF EXISTS publisher_application_notify_trigger ON publisher_applications;
CREATE TRIGGER publisher_application_notify_trigger
  AFTER INSERT ON publisher_applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_publisher_application();

-- ============================================
-- RETAILER APPLICATION EMAIL NOTIFICATIONS
-- ============================================

-- Create function to notify on new retailer applications
CREATE OR REPLACE FUNCTION notify_retailer_application()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
BEGIN
  -- Only send notification for new applications (INSERT)
  IF TG_OP = 'INSERT' THEN
    -- Use pg_net.http_post for HTTP requests in Supabase
    SELECT INTO request_id net.http_post(
      url := 'https://smfzrubkyxejzkblrrjr.supabase.co/functions/v1/retailer-notify',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTcsImV4cCI6MjA2ODM1MzUxN30.1DF1Gtz3rIH0ifyeu0IUSKZmIy4LFnA1ddEtYjLSO0w'
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
    
    -- Log the request
    RAISE NOTICE 'Retailer notification sent, request_id: %', request_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for retailer applications (only if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'retailer_applications') THEN
        DROP TRIGGER IF EXISTS retailer_application_notify_trigger ON retailer_applications;
        CREATE TRIGGER retailer_application_notify_trigger
          AFTER INSERT ON retailer_applications
          FOR EACH ROW
          EXECUTE FUNCTION notify_retailer_application();
        RAISE NOTICE 'Retailer application email trigger created';
    ELSE
        RAISE NOTICE 'Retailer applications table does not exist, skipping trigger creation';
    END IF;
END $$;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if triggers are created
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers 
WHERE trigger_name IN ('publisher_application_notify_trigger', 'retailer_application_notify_trigger');

-- Check if functions exist
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_name IN ('notify_publisher_application', 'notify_retailer_application');

-- Check if pg_net extension is enabled
SELECT * FROM pg_extension WHERE extname = 'pg_net';

-- Final confirmation
SELECT 'Email notification setup complete!' as status;
