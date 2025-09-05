# Retailer Application Form Setup

This document outlines the setup process for the retailer application form that has been integrated into the "Request Access for Your Shop" page.

## What's Been Implemented

### 1. Frontend Components
- **RetailerApplicationForm.tsx**: A multi-step form component matching the publisher application form style
- **StepProgress.tsx**: Progress indicator component
- **StepNav.tsx**: Navigation component for multi-step forms
- **AuthPage.tsx**: Updated to show the retailer application form instead of coming soon message

### 2. Form Features
- **5-step application process**:
  1. Shop Information (name, category, type, size, years in business)
  2. Business Address (full address details)
  3. Contact Information (buyer details)
  4. Store Profile (target customers, aesthetics, interested genres)
  5. Business Operations (POS system, budget, delivery preferences, current sources)

- **Form validation** with error handling
- **Application number generation** (RS-YYYY-000001 format)
- **Responsive design** matching the publisher application form
- **Progress tracking** with visual indicators

### 3. Database Setup
- **Application number generation** with yearly counter
- **RLS policies** for security
- **Unique constraints** and indexing
- **Trigger functions** for auto-generating application numbers

## Setup Instructions

### 1. Database Migration
Run the SQL migration in Supabase:

```sql
-- Copy and paste the contents of database/migrations/retailer_applications_setup.sql
-- into the Supabase SQL editor and execute
```

### 2. Edge Function Deployment
Deploy the retailer notification function:

```bash
# Deploy the edge function
supabase functions deploy retailer-notify

# Set up environment variables in Supabase dashboard:
# - RESEND_API_KEY: Your Resend API key for email notifications
```

### 3. Database Trigger Setup
Create a database trigger to automatically send notifications:

```sql
-- In Supabase SQL editor, create a trigger to call the edge function
CREATE OR REPLACE FUNCTION notify_retailer_application()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://your-project-ref.supabase.co/functions/v1/retailer-notify',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || 'your-anon-key' || '"}',
      body := json_build_object('record', row_to_json(NEW))::text
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER retailer_application_notify
  AFTER INSERT ON retailer_applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_retailer_application();
```

### 4. Frontend Integration
The retailer application form is now integrated into the `/auth` route and will be accessible via:
- "Request Access for Your Shop" navbar link
- "Request Retailer Access" CTA button on homepage

## Application Flow

1. **User visits `/auth`** → Sees retailer application form
2. **Completes 5-step form** → Data validated at each step
3. **Submits application** → Data saved to `retailer_applications` table
4. **Application number generated** → Format: RS-2025-000001
5. **Email notification sent** → To hi@neesh.art with application details
6. **User sees confirmation** → With application number

## Database Schema

The retailer application form expects these fields in the `retailer_applications` table:

```sql
-- Core fields (should already exist)
user_id UUID REFERENCES auth.users(id)
created_at TIMESTAMPTZ DEFAULT NOW()
application_number TEXT UNIQUE NOT NULL

-- Shop Information
shop_name TEXT
store_category TEXT
store_type TEXT
store_size TEXT
years_in_business INTEGER

-- Address
business_address_line_1 TEXT
business_address_line_2 TEXT
business_city TEXT
business_state TEXT
business_zip_code TEXT
business_country TEXT DEFAULT 'US'

-- Contact
buyer_name TEXT
buyer_email TEXT
buyer_phone TEXT

-- Operations
pos_system TEXT
monthly_magazine_budget INTEGER
preferred_delivery_frequency TEXT
current_magazine_sources TEXT[] -- Array of strings
current_magazine_titles TEXT

-- Profile
target_customers TEXT[] -- Array of strings
aesthetic_preferences TEXT[] -- Array of strings
interested_genres TEXT[] -- Array of strings
```

## Testing

1. **Navigate to `/auth`** on your site
2. **Fill out the application form** step by step
3. **Submit the application**
4. **Check Supabase database** for the new record
5. **Check email** (hi@neesh.art) for notification
6. **Verify application number** is generated correctly

## Notes

- The form currently uses a temporary user ID (`temp-user-id`) since auth context isn't fully integrated
- You'll need to update the user ID handling once proper authentication is implemented
- The form styling matches the publisher application form for consistency
- All validation and error handling is implemented
- The application number format is RS-YYYY-NNNNNN (RS for Retailer, year, 6-digit counter)

## Next Steps

1. **Run the database migration**
2. **Deploy the edge function**
3. **Set up the database trigger**
4. **Test the complete flow**
5. **Update user authentication** when ready
