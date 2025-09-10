-- ============================================
-- EMAIL NOTIFICATION SETUP FOR APPLICATIONS
-- ============================================
-- Copy and paste this entire script into Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/smfzrubkyxejzkblrrjr/sql

-- Alternative approach: Use Supabase webhooks instead of database triggers
-- This creates a simpler setup that logs notifications and can be extended

-- ============================================
-- PUBLISHER APPLICATION EMAIL NOTIFICATIONS
-- ============================================

-- Create a simple notification log table
CREATE TABLE IF NOT EXISTS notification_log (
  id BIGSERIAL PRIMARY KEY,
  application_type TEXT NOT NULL,
  application_id BIGINT,
  email_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  error_message TEXT
);

-- Create function to log publisher notifications
CREATE OR REPLACE FUNCTION log_publisher_application()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the notification request
  INSERT INTO notification_log (application_type, application_id, email_status)
  VALUES ('publisher', NEW.id, 'triggered');
  
  -- Log to console for debugging
  RAISE NOTICE 'Publisher application notification logged for ID: %', NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for publisher applications
DROP TRIGGER IF EXISTS publisher_application_notify_trigger ON publisher_applications;
CREATE TRIGGER publisher_application_notify_trigger
  AFTER INSERT ON publisher_applications
  FOR EACH ROW
  EXECUTE FUNCTION log_publisher_application();

-- ============================================
-- RETAILER APPLICATION EMAIL NOTIFICATIONS
-- ============================================

-- Create function to log retailer notifications
CREATE OR REPLACE FUNCTION log_retailer_application()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the notification request
  INSERT INTO notification_log (application_type, application_id, email_status)
  VALUES ('retailer', NEW.id, 'triggered');
  
  -- Log to console for debugging
  RAISE NOTICE 'Retailer application notification logged for ID: %', NEW.id;
  
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
          EXECUTE FUNCTION log_retailer_application();
        RAISE NOTICE 'Retailer application notification trigger created';
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
WHERE routine_name IN ('log_publisher_application', 'log_retailer_application');

-- Check if notification log table exists
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notification_log'
ORDER BY ordinal_position;

-- Final confirmation
SELECT 'Email notification logging setup complete!' as status;

-- ============================================
-- NEXT STEPS
-- ============================================

-- After running this script:
-- 1. Test by submitting an application form
-- 2. Check the notification_log table: SELECT * FROM notification_log;
-- 3. Set up Supabase webhooks to call your edge functions
-- 4. Or modify the trigger functions to call edge functions directly
