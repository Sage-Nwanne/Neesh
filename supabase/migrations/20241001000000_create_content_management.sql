-- Content Management System Tables
-- This migration creates tables for managing site content

-- Site Content table for general site content
CREATE TABLE IF NOT EXISTS site_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500),
    content TEXT,
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Navigation items table
CREATE TABLE IF NOT EXISTS navigation_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    href VARCHAR(500) NOT NULL,
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Landing page sections table
CREATE TABLE IF NOT EXISTS landing_page_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_type VARCHAR(100) NOT NULL, -- 'publisher' or 'retailer'
    section_type VARCHAR(100) NOT NULL, -- 'hero', 'benefits', 'how_it_works', 'requirements'
    title VARCHAR(500),
    subtitle VARCHAR(500),
    content TEXT,
    metadata JSONB DEFAULT '{}',
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ items table
CREATE TABLE IF NOT EXISTS faq_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content(key);
CREATE INDEX IF NOT EXISTS idx_site_content_active ON site_content(is_active);
CREATE INDEX IF NOT EXISTS idx_navigation_position ON navigation_items(position);
CREATE INDEX IF NOT EXISTS idx_navigation_active ON navigation_items(is_active);
CREATE INDEX IF NOT EXISTS idx_landing_page_type ON landing_page_sections(page_type);
CREATE INDEX IF NOT EXISTS idx_landing_page_section ON landing_page_sections(section_type);
CREATE INDEX IF NOT EXISTS idx_landing_page_position ON landing_page_sections(position);
CREATE INDEX IF NOT EXISTS idx_faq_category ON faq_items(category);
CREATE INDEX IF NOT EXISTS idx_faq_position ON faq_items(position);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_navigation_items_updated_at BEFORE UPDATE ON navigation_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_landing_page_sections_updated_at BEFORE UPDATE ON landing_page_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faq_items_updated_at BEFORE UPDATE ON faq_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to site_content" ON site_content FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to navigation_items" ON navigation_items FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to landing_page_sections" ON landing_page_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to faq_items" ON faq_items FOR SELECT USING (is_active = true);

-- Create policies for authenticated admin access (you can modify this based on your admin setup)
CREATE POLICY "Allow admin full access to site_content" ON site_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access to navigation_items" ON navigation_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access to landing_page_sections" ON landing_page_sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access to faq_items" ON faq_items FOR ALL USING (auth.role() = 'authenticated');
