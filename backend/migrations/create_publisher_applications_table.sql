-- Create publisher_applications table
CREATE TABLE IF NOT EXISTS publisher_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Account Info
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  
  -- Magazine Details
  magazine_title VARCHAR(255) NOT NULL,
  publication_type VARCHAR(50) CHECK (publication_type IN ('single', 'series')),
  issue_number VARCHAR(50),
  issue_frequency VARCHAR(100),
  description TEXT,
  social_website_link VARCHAR(500),
  
  -- Print & Pricing
  print_run INTEGER DEFAULT 0,
  available_quantity INTEGER DEFAULT 0,
  wholesale_price DECIMAL(10,2) DEFAULT 0,
  suggested_retail_price DECIMAL(10,2) DEFAULT 0,
  specs TEXT,
  volume_pricing JSONB DEFAULT '[]',
  cover_image_url VARCHAR(500),
  
  -- Sales Experience
  has_sold_before VARCHAR(10) CHECK (has_sold_before IN ('yes', 'no', '')),
  distribution_channels TEXT[] DEFAULT '{}',
  estimated_copies_sold INTEGER DEFAULT 0,
  sales_feedback TEXT,
  
  -- Fulfillment
  fulfillment_method VARCHAR(100),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_country VARCHAR(100),
  return_policy TEXT,
  
  -- Application Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  denial_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_publisher_applications_email ON publisher_applications(email);
CREATE INDEX IF NOT EXISTS idx_publisher_applications_status ON publisher_applications(status);
CREATE INDEX IF NOT EXISTS idx_publisher_applications_submitted_at ON publisher_applications(submitted_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_publisher_applications_updated_at 
    BEFORE UPDATE ON publisher_applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE publisher_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow anyone to insert (submit applications)
CREATE POLICY "Anyone can submit applications" ON publisher_applications
    FOR INSERT WITH CHECK (true);

-- Allow users to view their own applications
CREATE POLICY "Users can view own applications" ON publisher_applications
    FOR SELECT USING (email = auth.jwt() ->> 'email');

-- Allow admins to view all applications
CREATE POLICY "Admins can view all applications" ON publisher_applications
    FOR ALL USING (
        auth.jwt() ->> 'role' IN ('admin', 'owner')
    );

-- Allow admins to update applications (approve/deny)
CREATE POLICY "Admins can update applications" ON publisher_applications
    FOR UPDATE USING (
        auth.jwt() ->> 'role' IN ('admin', 'owner')
    );

-- Add comments for documentation
COMMENT ON TABLE publisher_applications IS 'Stores publisher application submissions';
COMMENT ON COLUMN publisher_applications.volume_pricing IS 'JSON array of volume pricing tiers';
COMMENT ON COLUMN publisher_applications.distribution_channels IS 'Array of distribution channel names';
COMMENT ON COLUMN publisher_applications.status IS 'Application status: pending, approved, or denied';
COMMENT ON COLUMN publisher_applications.reviewed_by IS 'UUID of admin who reviewed the application';
