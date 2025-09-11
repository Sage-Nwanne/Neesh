-- Fix retailer_applications table schema to match form requirements
-- Run this in Supabase SQL Editor

-- First, check current schema
SELECT 
    column_name, 
    is_nullable, 
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'retailer_applications' 
ORDER BY ordinal_position;

-- Update schema to match form validation requirements
-- Required fields (must be NOT NULL)
DO $$
BEGIN
    -- Shop details (required)
    ALTER TABLE retailer_applications ALTER COLUMN shop_name SET NOT NULL;
    ALTER TABLE retailer_applications ALTER COLUMN store_category SET NOT NULL;
    ALTER TABLE retailer_applications ALTER COLUMN store_type SET NOT NULL;
    ALTER TABLE retailer_applications ALTER COLUMN store_size SET NOT NULL;
    
    -- Business address (required)
    ALTER TABLE retailer_applications ALTER COLUMN business_address_line_1 SET NOT NULL;
    ALTER TABLE retailer_applications ALTER COLUMN business_city SET NOT NULL;
    ALTER TABLE retailer_applications ALTER COLUMN business_state SET NOT NULL;
    ALTER TABLE retailer_applications ALTER COLUMN business_zip_code SET NOT NULL;
    
    -- Buyer contact (required)
    ALTER TABLE retailer_applications ALTER COLUMN buyer_name SET NOT NULL;
    ALTER TABLE retailer_applications ALTER COLUMN buyer_email SET NOT NULL;
    
    -- Optional fields (can be NULL)
    ALTER TABLE retailer_applications ALTER COLUMN business_address_line_2 DROP NOT NULL;
    ALTER TABLE retailer_applications ALTER COLUMN buyer_phone DROP NOT NULL;
    ALTER TABLE retailer_applications ALTER COLUMN pos_system DROP NOT NULL;
    ALTER TABLE retailer_applications ALTER COLUMN years_in_business DROP NOT NULL;
    
    RAISE NOTICE 'Schema updated successfully!';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error updating schema: %', SQLERRM;
        RAISE NOTICE 'Some columns may already have the correct constraints';
END $$;

-- Verify the changes
SELECT 
    column_name, 
    is_nullable, 
    CASE 
        WHEN is_nullable = 'NO' THEN 'REQUIRED' 
        ELSE 'OPTIONAL' 
    END as requirement_status
FROM information_schema.columns 
WHERE table_name = 'retailer_applications' 
AND column_name IN (
    'shop_name', 'store_category', 'store_type', 'store_size',
    'business_address_line_1', 'business_address_line_2', 
    'business_city', 'business_state', 'business_zip_code',
    'buyer_name', 'buyer_email', 'buyer_phone', 
    'pos_system', 'years_in_business'
)
ORDER BY 
    CASE WHEN is_nullable = 'NO' THEN 1 ELSE 2 END,
    column_name;
