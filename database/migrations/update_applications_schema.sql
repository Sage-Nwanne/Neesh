-- Update Applications Schema for Enhanced Workflow
-- Run this migration to add missing fields and policies

-- 1. Update retailer_applications table to match publisher_applications structure
ALTER TABLE public.retailer_applications 
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID,
  ADD COLUMN IF NOT EXISTS denial_reason TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create indexes for better performance on retailer_applications
CREATE INDEX IF NOT EXISTS idx_retailer_applications_status ON public.retailer_applications(status);
CREATE INDEX IF NOT EXISTS idx_retailer_applications_submitted_at ON public.retailer_applications(submitted_at);
CREATE INDEX IF NOT EXISTS idx_retailer_applications_buyer_email ON public.retailer_applications(buyer_email);

-- 3. Create updated_at trigger for retailer_applications
CREATE OR REPLACE FUNCTION update_retailer_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_retailer_applications_updated_at ON public.retailer_applications;
CREATE TRIGGER update_retailer_applications_updated_at 
    BEFORE UPDATE ON public.retailer_applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_retailer_applications_updated_at();

-- 4. Update RLS policies for retailer_applications to match publisher_applications

-- Drop existing policies
DROP POLICY IF EXISTS "insert_own_application" ON public.retailer_applications;
DROP POLICY IF EXISTS "read_own_application" ON public.retailer_applications;

-- Create new comprehensive policies
-- Allow anyone to insert (submit applications)
CREATE POLICY "Anyone can submit retailer applications" ON public.retailer_applications
    FOR INSERT WITH CHECK (true);

-- Allow users to view their own applications by email
CREATE POLICY "Users can view own retailer applications" ON public.retailer_applications
    FOR SELECT USING (buyer_email = auth.jwt() ->> 'email');

-- Allow admins to view all applications
CREATE POLICY "Admins can view all retailer applications" ON public.retailer_applications
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('admin', 'owner')
    );

-- Allow admins to update applications (approve/deny)
CREATE POLICY "Admins can update retailer applications" ON public.retailer_applications
    FOR UPDATE USING (
        auth.jwt() ->> 'role' IN ('admin', 'owner')
    );

-- 5. Add application number to publisher_applications if it doesn't exist
ALTER TABLE public.publisher_applications 
  ADD COLUMN IF NOT EXISTS application_number TEXT;

-- 6. Create application number generation for publishers (similar to retailers)
CREATE OR REPLACE FUNCTION public.gen_publisher_application_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  y INT := DATE_PART('year', NOW())::INT;
  next_serial INT;
  app_no TEXT;
BEGIN
  LOOP
    UPDATE public.app_counters
       SET last_serial = last_serial + 1,
           updated_at = NOW()
     WHERE year = y
     RETURNING last_serial INTO next_serial;

    IF FOUND THEN
      EXIT;
    END IF;

    -- no row for this year yet -> create it
    BEGIN
      INSERT INTO public.app_counters (year, last_serial)
      VALUES (y, 1)
      RETURNING last_serial INTO next_serial;
      EXIT;
    EXCEPTION WHEN unique_violation THEN
      -- another tx inserted the row; retry the loop
    END;
  END LOOP;

  app_no := FORMAT('PB-%s-%06s', y, next_serial);
  RETURN app_no;
END;
$$;

-- 7. Create trigger for publisher application numbers
CREATE OR REPLACE FUNCTION public.set_publisher_application_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.application_number IS NULL OR LENGTH(NEW.application_number) = 0 THEN
    NEW.application_number := public.gen_publisher_application_number();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_publisher_application_number ON public.publisher_applications;
CREATE TRIGGER trg_set_publisher_application_number
BEFORE INSERT ON public.publisher_applications
FOR EACH ROW
EXECUTE FUNCTION public.set_publisher_application_number();

-- 8. Create unique index for publisher application numbers
CREATE UNIQUE INDEX IF NOT EXISTS publisher_applications_application_number_key
  ON public.publisher_applications (application_number);

-- 9. Create invitation_tokens table for tracking invitation links
CREATE TABLE IF NOT EXISTS public.invitation_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  application_id UUID NOT NULL,
  application_type VARCHAR(20) NOT NULL CHECK (application_type IN ('publisher', 'retailer')),
  email VARCHAR(255) NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- 10. Create indexes for invitation_tokens
CREATE INDEX IF NOT EXISTS idx_invitation_tokens_token ON public.invitation_tokens(token);
CREATE INDEX IF NOT EXISTS idx_invitation_tokens_email ON public.invitation_tokens(email);
CREATE INDEX IF NOT EXISTS idx_invitation_tokens_expires_at ON public.invitation_tokens(expires_at);

-- 11. Enable RLS on invitation_tokens
ALTER TABLE public.invitation_tokens ENABLE ROW LEVEL SECURITY;

-- 12. Create RLS policies for invitation_tokens
-- Allow anyone to read valid tokens (for verification)
CREATE POLICY "Anyone can read valid tokens" ON public.invitation_tokens
    FOR SELECT USING (NOT used AND expires_at > NOW());

-- Allow admins to manage all tokens
CREATE POLICY "Admins can manage all tokens" ON public.invitation_tokens
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('admin', 'owner')
    );

-- 13. Add comments for documentation
COMMENT ON TABLE public.invitation_tokens IS 'Stores invitation tokens for approved applications';
COMMENT ON COLUMN public.invitation_tokens.token IS 'Base64 encoded invitation token';
COMMENT ON COLUMN public.invitation_tokens.application_type IS 'Type of application: publisher or retailer';
COMMENT ON COLUMN public.invitation_tokens.used IS 'Whether the token has been used for account creation';
COMMENT ON COLUMN public.invitation_tokens.expires_at IS 'When the token expires (default 7 days)';

-- 14. Update comments for existing tables
COMMENT ON COLUMN public.retailer_applications.status IS 'Application status: pending, approved, or denied';
COMMENT ON COLUMN public.retailer_applications.reviewed_by IS 'UUID of admin who reviewed the application';
COMMENT ON COLUMN public.retailer_applications.denial_reason IS 'Reason for denial if application was rejected';
COMMENT ON COLUMN public.retailer_applications.application_number IS 'Unique application number (RS-YYYY-NNNNNN format)';

COMMENT ON COLUMN public.publisher_applications.application_number IS 'Unique application number (PB-YYYY-NNNNNN format)';
