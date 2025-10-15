-- Update content management tables with actual site content

-- Clear existing content and insert real content from the site
DELETE FROM site_content;
DELETE FROM navigation_items;
DELETE FROM landing_page_sections;

-- Insert actual site content with exact text from HomePage
INSERT INTO site_content (key, title, content, metadata) VALUES
('homepage_hero_title', 'The OS for Indie Print', 'The OS for Indie Print', '{"component": "HomePage", "section": "hero", "element": "h1", "location": "Hero section main title"}'),
('homepage_hero_subtitle', 'A marketplace for indie print. Curated titles, risk-free orders, faster payouts.', 'A marketplace for indie print. Curated titles, risk-free orders, faster payouts.', '{"component": "HomePage", "section": "hero", "element": "p", "location": "Hero section subtitle"}'),

-- Publisher value proposition
('homepage_publisher_section_title', 'For Publishers', 'For Publishers', '{"component": "HomePage", "section": "value_props", "element": "h3", "location": "Publisher card title"}'),
('homepage_publisher_main_title', 'Get stocked. Get paid. Stay independent.', 'Get stocked. Get paid. Stay independent.', '{"component": "HomePage", "section": "value_props", "element": "h2", "location": "Publisher card main heading"}'),
('homepage_publisher_description', 'The hardest shelves to reach are often the most valuable. Neesh opens access to retailers that traditional distributors overlook and makes every transaction clean and direct.', 'The hardest shelves to reach are often the most valuable. Neesh opens access to retailers that traditional distributors overlook and makes every transaction clean and direct.', '{"component": "HomePage", "section": "value_props", "element": "p", "location": "Publisher card main description"}'),
('homepage_publisher_subtext', 'Upload your catalog once, and we put your work in front of the shops that matter. Orders, returns, and payouts flow through us, so you get paid fast and can keep creating.', 'Upload your catalog once, and we put your work in front of the shops that matter. Orders, returns, and payouts flow through us, so you get paid fast and can keep creating.', '{"component": "HomePage", "section": "value_props", "element": "p.subText", "location": "Publisher card sub description"}'),

-- Retailer value proposition
('homepage_retailer_section_title', 'For Retailers', 'For Retailers', '{"component": "HomePage", "section": "value_props", "element": "h3", "location": "Retailer card title"}'),
('homepage_retailer_main_title', 'Curated print. Clear terms. No risk.', 'Curated print. Clear terms. No risk.', '{"component": "HomePage", "section": "value_props", "element": "h2", "location": "Retailer card main heading"}'),
('homepage_retailer_description', 'Magazines give a shop character. They spark conversations, set the vibe, and make customers linger. But clunky portals and risky bets have made them a nightmare to stock. Neesh fixes that.', 'Magazines give a shop character. They spark conversations, set the vibe, and make customers linger. But clunky portals and risky bets have made them a nightmare to stock. Neesh fixes that.', '{"component": "HomePage", "section": "value_props", "element": "p", "location": "Retailer card main description"}'),
('homepage_retailer_subtext', 'Browse curated titles, see clear margins upfront, and place small trial orders. Give your shoppers the culture they love while keeping business healthy.', 'Browse curated titles, see clear margins upfront, and place small trial orders. Give your shoppers the culture they love while keeping business healthy.', '{"component": "HomePage", "section": "value_props", "element": "p.subText", "location": "Retailer card sub description"}'),

-- Pipeline section
('homepage_pipeline_title', 'A clean pipeline from studio to shop.', 'A clean pipeline from studio to shop.', '{"component": "HomePage", "section": "pipeline", "element": "h2", "location": "Pipeline section main title"}'),
('homepage_pipeline_step1_title', 'Step 1', 'Step 1', '{"component": "HomePage", "section": "pipeline", "element": "h4", "location": "Pipeline step 1 title"}'),
('homepage_pipeline_step1_desc', 'Publishers upload titles, inventory, and pricing.', 'Publishers upload titles, inventory, and pricing.', '{"component": "HomePage", "section": "pipeline", "element": "p", "location": "Pipeline step 1 description"}'),
('homepage_pipeline_step1_subtext', 'Shops see trusted titles with real pricing and margins upfront', 'Shops see trusted titles with real pricing and margins upfront', '{"component": "HomePage", "section": "pipeline", "element": "span.stepSubtext", "location": "Pipeline step 1 subtext"}'),

('homepage_pipeline_step2_title', 'Step 2', 'Step 2', '{"component": "HomePage", "section": "pipeline", "element": "h4", "location": "Pipeline step 2 title"}'),
('homepage_pipeline_step2_desc', 'Retailers explore collections and place small trial orders.', 'Retailers explore collections and place small trial orders.', '{"component": "HomePage", "section": "pipeline", "element": "p", "location": "Pipeline step 2 description"}'),
('homepage_pipeline_step2_subtext', 'Get clear margins upfront and test new titles without financial risk.', 'Get clear margins upfront and test new titles without financial risk.', '{"component": "HomePage", "section": "pipeline", "element": "span.stepSubtext", "location": "Pipeline step 2 subtext"}'),

('homepage_pipeline_step3_title', 'Step 3', 'Step 3', '{"component": "HomePage", "section": "pipeline", "element": "h4", "location": "Pipeline step 3 title"}'),
('homepage_pipeline_step3_desc', 'Fulfillment and returns are managed through Neesh.', 'Fulfillment and returns are managed through Neesh.', '{"component": "HomePage", "section": "pipeline", "element": "p", "location": "Pipeline step 3 description"}'),
('homepage_pipeline_step3_subtext', 'Prepaid labels and fast processing keeps logistics painless for shops and publishers.', 'Prepaid labels and fast processing keeps logistics painless for shops and publishers.', '{"component": "HomePage", "section": "pipeline", "element": "span.stepSubtext", "location": "Pipeline step 3 subtext"}'),

-- Problems section
('homepage_problems_title', 'Print is alive. Neesh makes it work.', 'Print is alive. Neesh makes it work.', '{"component": "HomePage", "section": "problems", "element": "h2", "location": "Problems section main title"}'),
('homepage_problems_description', 'Magazines are thriving again, carrying culture into shops and building loyal audiences. Neesh gives retailers and publishers the system to keep that momentum.', 'Magazines are thriving again, carrying culture into shops and building loyal audiences. Neesh gives retailers and publishers the system to keep that momentum.', '{"component": "HomePage", "section": "problems", "element": "p", "location": "Problems section description"}'),

-- CTA section
('homepage_cta_title', 'Find your Neesh. Keep indie print moving forward.', 'Find your Neesh.<br />Keep indie print moving forward.', '{"component": "HomePage", "section": "cta", "element": "h2", "location": "CTA section title"}'),

-- Mailing list popup
('mailing_list_popup_title', 'Stay Updated with NEESH', 'Stay Updated with NEESH', '{"component": "MailingListPopup", "element": "h3", "location": "Popup title"}'),
('mailing_list_popup_subtitle', 'Be the first to know about new magazines and features', 'Be the first to know about new magazines and features', '{"component": "MailingListPopup", "element": "p", "location": "Popup subtitle"}');

-- Insert actual navigation items
INSERT INTO navigation_items (label, href, position) VALUES
('Home', '/', 1),
('For Publishers', '/publisher-landing', 2),
('For Retailers', '/retailer-landing', 3);

-- Insert actual landing page content (keeping existing as they seem accurate)
INSERT INTO landing_page_sections (page_type, section_type, title, subtitle, content, position) VALUES
('publisher', 'hero', 'Partner with NEESH', 'Reach new audiences and grow your independent magazine', 'Connect with retailers and readers who value quality independent publishing', 1),
('publisher', 'benefits', 'Why Choose NEESH?', '', 'Access to curated retail network, Direct connection with quality-focused retailers, Streamlined distribution process, Support for independent publishing', 2),
('publisher', 'how_it_works', 'How It Works', '', '1. Submit your magazine for review, 2. Our team evaluates quality and fit, 3. Get connected with interested retailers, 4. Start building lasting partnerships', 3),
('publisher', 'requirements', 'Requirements', '', 'High-quality content and production, Independent or small-press publication, Consistent publishing schedule, Professional presentation', 4),

('retailer', 'hero', 'Discover Unique Magazines', 'Access curated independent publications for your store', 'Find magazines that will set your store apart and delight your customers', 1),
('retailer', 'benefits', 'Benefits for Retailers', '', 'Curated selection of quality magazines, Direct publisher relationships, Exclusive access to independent titles, Support for unique inventory', 2),
('retailer', 'how_it_works', 'How It Works', '', '1. Request access to our platform, 2. Browse our curated magazine selection, 3. Connect directly with publishers, 4. Build your unique magazine collection', 3),
('retailer', 'requirements', 'Requirements', '', 'Physical retail location, Commitment to quality curation, Interest in independent publishing, Professional retail operation', 4);
