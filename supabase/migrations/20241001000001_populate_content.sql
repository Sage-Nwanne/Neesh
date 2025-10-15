-- Populate content management tables with current site content

-- Insert site content
INSERT INTO site_content (key, title, content, metadata) VALUES
('homepage_hero_title', 'Discover Independent Magazines', 'The main hero title on homepage', '{"component": "HomePage", "section": "hero"}'),
('homepage_hero_subtitle', 'Connect with unique publications and discover your next favorite read', 'The hero subtitle on homepage', '{"component": "HomePage", "section": "hero"}'),
('homepage_value_prop_1_title', 'Curated Selection', 'First value proposition title', '{"component": "HomePage", "section": "value_props"}'),
('homepage_value_prop_1_desc', 'Hand-picked independent magazines from around the world', 'First value proposition description', '{"component": "HomePage", "section": "value_props"}'),
('homepage_value_prop_2_title', 'Direct Connection', 'Second value proposition title', '{"component": "HomePage", "section": "value_props"}'),
('homepage_value_prop_2_desc', 'Connect directly with publishers and retailers', 'Second value proposition description', '{"component": "HomePage", "section": "value_props"}'),
('homepage_value_prop_3_title', 'Quality Focus', 'Third value proposition title', '{"component": "HomePage", "section": "value_props"}'),
('homepage_value_prop_3_desc', 'Every magazine is carefully reviewed for quality and uniqueness', 'Third value proposition description', '{"component": "HomePage", "section": "value_props"}'),
('mailing_list_popup_title', 'Stay Updated with NEESH', 'Mailing list popup title', '{"component": "MailingListPopup"}'),
('mailing_list_popup_subtitle', 'Be the first to know about new magazines and features', 'Mailing list popup subtitle', '{"component": "MailingListPopup"}');

-- Insert navigation items
INSERT INTO navigation_items (label, href, position) VALUES
('Home', '/', 1),
('For Publishers', '/publisher-landing', 2),
('For Retailers', '/retailer-landing', 3);

-- Insert publisher landing page content
INSERT INTO landing_page_sections (page_type, section_type, title, subtitle, content, position) VALUES
('publisher', 'hero', 'Partner with NEESH', 'Reach new audiences and grow your independent magazine', 'Connect with retailers and readers who value quality independent publishing', 1),
('publisher', 'benefits', 'Why Choose NEESH?', '', 'Access to curated retail network, Direct connection with quality-focused retailers, Streamlined distribution process, Support for independent publishing', 2),
('publisher', 'how_it_works', 'How It Works', '', '1. Submit your magazine for review, 2. Our team evaluates quality and fit, 3. Get connected with interested retailers, 4. Start building lasting partnerships', 3),
('publisher', 'requirements', 'Requirements', '', 'High-quality content and production, Independent or small-press publication, Consistent publishing schedule, Professional presentation', 4);

-- Insert retailer landing page content
INSERT INTO landing_page_sections (page_type, section_type, title, subtitle, content, position) VALUES
('retailer', 'hero', 'Discover Unique Magazines', 'Access curated independent publications for your store', 'Find magazines that will set your store apart and delight your customers', 1),
('retailer', 'benefits', 'Benefits for Retailers', '', 'Curated selection of quality magazines, Direct publisher relationships, Exclusive access to independent titles, Support for unique inventory', 2),
('retailer', 'how_it_works', 'How It Works', '', '1. Request access to our platform, 2. Browse our curated magazine selection, 3. Connect directly with publishers, 4. Build your unique magazine collection', 3),
('retailer', 'requirements', 'Requirements', '', 'Physical retail location, Commitment to quality curation, Interest in independent publishing, Professional retail operation', 4);

-- Insert FAQ items
INSERT INTO faq_items (question, answer, category, position) VALUES
('What is NEESH?', 'NEESH is a platform that connects independent magazine publishers with quality retailers, creating a curated marketplace for unique publications.', 'general', 1),
('How do I apply as a publisher?', 'Click on "For Publishers" in the navigation, review the requirements, and submit your application through our form.', 'publisher', 2),
('How do I apply as a retailer?', 'Click on "For Retailers" in the navigation, review the requirements, and request access through our application form.', 'retailer', 3),
('What types of magazines do you accept?', 'We focus on high-quality independent magazines with unique content, professional production, and consistent publishing schedules.', 'publisher', 4),
('Is there a fee to join?', 'Please contact us for information about our partnership terms and any associated fees.', 'general', 5);
