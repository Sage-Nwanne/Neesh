-- Enable RLS on all tables
ALTER TABLE public.publisher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retailer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailing_list ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "admins can read publisher applications" ON public.publisher_applications;
DROP POLICY IF EXISTS "admins can update publisher applications" ON public.publisher_applications;
DROP POLICY IF EXISTS "admins can read retailer applications" ON public.retailer_applications;
DROP POLICY IF EXISTS "admins can update retailer applications" ON public.retailer_applications;
DROP POLICY IF EXISTS "admins can read mailing list" ON public.mailing_list;

-- Publisher Applications Policies
CREATE POLICY "admins can read publisher applications"
ON public.publisher_applications
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'owner'
);

CREATE POLICY "admins can update publisher applications"
ON public.publisher_applications
FOR UPDATE
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'owner'
)
WITH CHECK (
  auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'owner'
);

-- Retailer Applications Policies
CREATE POLICY "admins can read retailer applications"
ON public.retailer_applications
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'owner'
);

CREATE POLICY "admins can update retailer applications"
ON public.retailer_applications
FOR UPDATE
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'owner'
)
WITH CHECK (
  auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'owner'
);

-- Mailing List Policies
CREATE POLICY "admins can read mailing list"
ON public.mailing_list
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'owner'
);

-- Allow public inserts for mailing list (for newsletter signups)
CREATE POLICY "anyone can subscribe to mailing list"
ON public.mailing_list
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
