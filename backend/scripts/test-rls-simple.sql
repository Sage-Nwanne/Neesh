-- Test if anon role can actually insert into tables
-- Run this as anon role to test RLS

-- First check if we can select (should be empty but no error)
SELECT COUNT(*) as publisher_count FROM publisher_applications;
SELECT COUNT(*) as retailer_count FROM retailer_applications;

-- Test minimal insert for publisher
INSERT INTO publisher_applications (magazine_title) 
VALUES ('Test Magazine') 
RETURNING id, magazine_title;

-- Test minimal insert for retailer  
INSERT INTO retailer_applications (
  shop_name, 
  business_address_line_1, 
  business_city, 
  business_state, 
  business_zip_code, 
  store_category, 
  store_type, 
  store_size, 
  buyer_name, 
  buyer_email
) VALUES (
  'Test Shop',
  '123 Test St', 
  'Test City',
  'CA',
  '12345',
  'Independent Bookstore',
  'Independent', 
  'Small (under 1,000 sq ft)',
  'Test Buyer',
  'test@example.com'
) RETURNING id, shop_name;
