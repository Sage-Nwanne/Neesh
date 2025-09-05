-- Retailer Applications Database Setup
-- Run this entire block as a single migration in Supabase

-- 1) Enable RLS on retailer_applications table
ALTER TABLE public.retailer_applications ENABLE ROW LEVEL SECURITY;

-- 2) Create RLS policies
CREATE POLICY "insert_own_application"
  ON public.retailer_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "read_own_application"
  ON public.retailer_applications FOR SELECT
  USING (auth.uid() = user_id);

-- 3) Add the application_number column
ALTER TABLE public.retailer_applications
  ADD COLUMN IF NOT EXISTS application_number TEXT;

-- 4) Counter table (yearly)
CREATE TABLE IF NOT EXISTS public.app_counters (
  year INTEGER PRIMARY KEY,
  last_serial INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5) Generate a new application number (RS-YYYY-000001)
CREATE OR REPLACE FUNCTION public.gen_application_number()
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

  app_no := FORMAT('RS-%s-%06s', y, next_serial);
  RETURN app_no;
END;
$$;

-- 6) BEFORE INSERT trigger to set application_number when missing
CREATE OR REPLACE FUNCTION public.set_application_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.application_number IS NULL OR LENGTH(NEW.application_number) = 0 THEN
    NEW.application_number := public.gen_application_number();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_application_number ON public.retailer_applications;
CREATE TRIGGER trg_set_application_number
BEFORE INSERT ON public.retailer_applications
FOR EACH ROW
EXECUTE FUNCTION public.set_application_number();

-- 7) Uniqueness + fast lookup
CREATE UNIQUE INDEX IF NOT EXISTS retailer_applications_application_number_key
  ON public.retailer_applications (application_number);

-- 8) Make application_number non-null going forward
ALTER TABLE public.retailer_applications
  ALTER COLUMN application_number SET NOT NULL;

-- 9) If you need to backfill old rows (run this separately if needed):
-- UPDATE public.retailer_applications
-- SET application_number = public.gen_application_number()
-- WHERE application_number IS NULL;
