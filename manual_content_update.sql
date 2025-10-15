-- MANUAL CONTENT UPDATE FOR NEESH DATABASE
-- Copy and paste this into your Supabase SQL Editor to populate with real content

-- First, clear existing homepage content
DELETE FROM site_content WHERE key LIKE 'homepage_%' OR key LIKE 'mailing_list_%';

-- Insert the REAL content from your live website
INSERT INTO site_content (key, title, content, metadata, is_active) VALUES

-- Hero section (ACTUAL content from your site)
('homepage_hero_title', 'Hero Title', 'The OS for Indie Print', '{"component": "HomePage", "section": "hero", "element": "h1", "location": "Main hero title"}', true),
('homepage_hero_subtitle', 'Hero Subtitle', 'A marketplace for indie print. Curated titles, risk-free orders, faster payouts.', '{"component": "HomePage", "section": "hero", "element": "p", "location": "Hero subtitle"}', true),

-- Publisher section (ACTUAL content from your site)
('homepage_publisher_section_title', 'Publisher Section Title', 'FOR PUBLISHERS', '{"component": "HomePage", "section": "value_props", "element": "h3", "location": "Publisher card small title"}', true),
('homepage_publisher_main_title', 'Publisher Main Title', 'Get stocked. Get paid. Stay independent.', '{"component": "HomePage", "section": "value_props", "element": "h2", "location": "Publisher card main heading"}', true),
('homepage_publisher_description', 'Publisher Description', 'The hardest shelves to reach are often the most valuable. Neesh opens access to retailers that traditional distributors overlook and makes every transaction clean and direct.', '{"component": "HomePage", "section": "value_props", "element": "p", "location": "Publisher card main description"}', true),
('homepage_publisher_subtext', 'Publisher Subtext', 'Upload your catalog once, and we put your work in front of the shops that matter. Orders, returns, and payouts flow through us, so you get paid fast and can keep creating.', '{"component": "HomePage", "section": "value_props", "element": "p.subText", "location": "Publisher card secondary description"}', true),

-- Retailer section (ACTUAL content from your site)
('homepage_retailer_section_title', 'Retailer Section Title', 'FOR RETAILERS', '{"component": "HomePage", "section": "value_props", "element": "h3", "location": "Retailer card small title"}', true),
('homepage_retailer_main_title', 'Retailer Main Title', 'Curated print. Clear terms. No risk.', '{"component": "HomePage", "section": "value_props", "element": "h2", "location": "Retailer card main heading"}', true),
('homepage_retailer_description', 'Retailer Description', 'Magazines give a shop character. They spark conversations, set the vibe, and make customers linger. But clunky portals and risky bets have made them a nightmare to stock. Neesh fixes that.', '{"component": "HomePage", "section": "value_props", "element": "p", "location": "Retailer card main description"}', true),
('homepage_retailer_subtext', 'Retailer Subtext', 'Browse curated titles, see clear margins upfront, and place small trial orders. Give your shoppers the culture they love while keeping business healthy.', '{"component": "HomePage", "section": "value_props", "element": "p.subText", "location": "Retailer card secondary description"}', true),

-- Pipeline section (ACTUAL content from your site)
('homepage_pipeline_title', 'Pipeline Title', 'A clean pipeline from studio to shop.', '{"component": "HomePage", "section": "pipeline", "element": "h2", "location": "Pipeline section main title"}', true),
('homepage_pipeline_step1_title', 'Pipeline Step 1 Title', 'Step 1', '{"component": "HomePage", "section": "pipeline", "element": "h4", "location": "First step title"}', true),
('homepage_pipeline_step1_desc', 'Pipeline Step 1 Description', 'Publishers upload titles, inventory, and pricing.', '{"component": "HomePage", "section": "pipeline", "element": "p", "location": "First step description"}', true),
('homepage_pipeline_step1_subtext', 'Pipeline Step 1 Subtext', 'Shops see trusted titles with real pricing and margins upfront', '{"component": "HomePage", "section": "pipeline", "element": "span.stepSubtext", "location": "First step additional info"}', true),

('homepage_pipeline_step2_title', 'Pipeline Step 2 Title', 'Step 2', '{"component": "HomePage", "section": "pipeline", "element": "h4", "location": "Second step title"}', true),
('homepage_pipeline_step2_desc', 'Pipeline Step 2 Description', 'Retailers explore collections and place small trial orders.', '{"component": "HomePage", "section": "pipeline", "element": "p", "location": "Second step description"}', true),
('homepage_pipeline_step2_subtext', 'Pipeline Step 2 Subtext', 'Get clear margins upfront and test new titles without financial risk.', '{"component": "HomePage", "section": "pipeline", "element": "span.stepSubtext", "location": "Second step additional info"}', true),

('homepage_pipeline_step3_title', 'Pipeline Step 3 Title', 'Step 3', '{"component": "HomePage", "section": "pipeline", "element": "h4", "location": "Third step title"}', true),
('homepage_pipeline_step3_desc', 'Pipeline Step 3 Description', 'Fulfillment and returns are managed through Neesh.', '{"component": "HomePage", "section": "pipeline", "element": "p", "location": "Third step description"}', true),
('homepage_pipeline_step3_subtext', 'Pipeline Step 3 Subtext', 'Prepaid labels and fast processing keeps logistics painless for shops and publishers.', '{"component": "HomePage", "section": "pipeline", "element": "span.stepSubtext", "location": "Third step additional info"}', true),

-- Problems section (ACTUAL content from your site)
('homepage_problems_title', 'Problems Section Title', 'Print is alive. Neesh makes it work.', '{"component": "HomePage", "section": "problems", "element": "h2", "location": "Problems section main title"}', true),
('homepage_problems_description', 'Problems Section Description', 'Magazines are thriving again, carrying culture into shops and building loyal audiences. Neesh gives retailers and publishers the system to keep that momentum.', '{"component": "HomePage", "section": "problems", "element": "p", "location": "Problems section description"}', true),

-- CTA section (ACTUAL content from your site)
('homepage_cta_title', 'CTA Title', 'Find your Neesh.<br />Keep indie print moving forward.', '{"component": "HomePage", "section": "cta", "element": "h2", "location": "Call-to-action section title"}', true),

-- Mailing list popup (ACTUAL content from your site)
('mailing_list_popup_title', 'Popup Title', 'Stay Updated with NEESH', '{"component": "MailingListPopup", "element": "h3", "location": "Mailing list popup title"}', true),
('mailing_list_popup_subtitle', 'Popup Subtitle', 'Be the first to know about new magazines and features', '{"component": "MailingListPopup", "element": "p", "location": "Mailing list popup subtitle"}', true);

-- Verify the data was inserted
SELECT key, title, content FROM site_content WHERE key LIKE 'homepage_%' OR key LIKE 'mailing_list_%' ORDER BY key;
