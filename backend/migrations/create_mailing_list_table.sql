-- Create mailing list subscribers table
CREATE TABLE IF NOT EXISTS mailing_list_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    source VARCHAR(50) DEFAULT 'website',
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_mailing_list_email ON mailing_list_subscribers(email);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_mailing_list_status ON mailing_list_subscribers(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mailing_list_updated_at 
    BEFORE UPDATE ON mailing_list_subscribers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE mailing_list_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow service role to do everything
CREATE POLICY "Service role can manage mailing list" ON mailing_list_subscribers
    FOR ALL USING (auth.role() = 'service_role');

-- Allow anonymous users to insert (for subscriptions)
CREATE POLICY "Allow anonymous subscriptions" ON mailing_list_subscribers
    FOR INSERT WITH CHECK (true);

-- Allow users to update their own subscription status
CREATE POLICY "Users can update their own subscription" ON mailing_list_subscribers
    FOR UPDATE USING (true);
