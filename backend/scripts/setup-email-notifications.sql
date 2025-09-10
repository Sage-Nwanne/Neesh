-- ============================================
-- EMAIL NOTIFICATION SETUP FOR APPLICATIONS
-- ============================================

-- First, let's update the RLS policies (run the previous RLS script first)
-- This script sets up email notifications for new applications

-- ============================================
-- PUBLISHER APPLICATION EMAIL NOTIFICATIONS
-- ============================================

-- Create function to notify on new publisher applications
CREATE OR REPLACE FUNCTION notify_publisher_application()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send notification for new applications (INSERT)
  IF TG_OP = 'INSERT' THEN
    PERFORM
      net.http_post(
        url := 'https://smfzrubkyxejzkblrrjr.supabase.co/functions/v1/publisher-notify',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTcsImV4cCI6MjA2ODM1MzUxN30.1DF1Gtz3rIH0ifyeu0IUSKZmIy4LFnA1ddEtYjLSO0w'
        ),
        body := jsonb_build_object('record', row_to_json(NEW))
      );
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

-- Create function to notify on new retailer applications (if table exists)
CREATE OR REPLACE FUNCTION notify_retailer_application()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send notification for new applications (INSERT)
  IF TG_OP = 'INSERT' THEN
    PERFORM
      net.http_post(
        url := 'https://smfzrubkyxejzkblrrjr.supabase.co/functions/v1/retailer-notify',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTcsImV4cCI6MjA2ODM1MzUxN30.1DF1Gtz3rIH0ifyeu0IUSKZmIy4LFnA1ddEtYjLSO0w'
        ),
        body := jsonb_build_object('record', row_to_json(NEW))
      );
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
-- ENABLE HTTP EXTENSION (if not already enabled)
-- ============================================

-- Enable the http extension for making HTTP requests
CREATE EXTENSION IF NOT EXISTS http;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA net TO postgres, anon, authenticated, service_role;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if triggers are created
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name IN ('publisher_application_notify_trigger', 'retailer_application_notify_trigger');

-- Check if functions exist
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_name IN ('notify_publisher_application', 'notify_retailer_application');

RAISE NOTICE 'Email notification setup complete!';
RAISE NOTICE 'Next steps:';
RAISE NOTICE '1. Deploy the Supabase Edge Functions';
RAISE NOTICE '2. Set RESEND_API_KEY in Supabase environment variables';
RAISE NOTICE '3. Test by submitting an application';
