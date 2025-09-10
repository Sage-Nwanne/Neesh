import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://smfzrubkyxejzkblrrjr.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndFixRLS() {
  console.log('🔍 Checking RLS policies for application tables...\n');

  try {
    // Check publisher_applications table
    console.log('📋 Checking publisher_applications table...');
    const { data: publisherPolicies, error: publisherError } = await supabase
      .rpc('get_table_policies', { table_name: 'publisher_applications' });

    if (publisherError) {
      console.log('⚠️  Could not check publisher policies:', publisherError.message);
    } else {
      console.log(`✅ Publisher applications has ${publisherPolicies?.length || 0} RLS policies`);
    }

    // Check retailer_applications table
    console.log('📋 Checking retailer_applications table...');
    const { data: retailerPolicies, error: retailerError } = await supabase
      .rpc('get_table_policies', { table_name: 'retailer_applications' });

    if (retailerError) {
      console.log('⚠️  Could not check retailer policies:', retailerError.message);
    } else {
      console.log(`✅ Retailer applications has ${retailerPolicies?.length || 0} RLS policies`);
    }

    // Test publisher application insertion
    console.log('\n🧪 Testing publisher application insertion...');
    const testPublisherData = {
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      business_name: 'Test Business',
      magazine_title: 'Test Magazine',
      publication_type: 'single',
      description: 'Test description',
      print_run: 100,
      available_quantity: 50,
      wholesale_price: 10.00,
      suggested_retail_price: 20.00,
      status: 'pending'
    };

    const { data: publisherResult, error: publisherInsertError } = await supabase
      .from('publisher_applications')
      .insert(testPublisherData)
      .select('id')
      .single();

    if (publisherInsertError) {
      console.log('❌ Publisher application insertion failed:', publisherInsertError.message);
      
      if (publisherInsertError.message.includes('RLS')) {
        console.log('🔧 Fixing publisher RLS policies...');
        await fixPublisherRLS();
      }
    } else {
      console.log('✅ Publisher application insertion successful');
      // Clean up test data
      await supabase.from('publisher_applications').delete().eq('id', publisherResult.id);
    }

    // Test retailer application insertion
    console.log('\n🧪 Testing retailer application insertion...');
    const testRetailerData = {
      shop_name: 'Test Shop',
      buyer_email: 'test@example.com',
      buyer_name: 'Test Buyer',
      business_address_line_1: '123 Test St',
      business_city: 'Test City',
      business_state: 'TS',
      business_zip_code: '12345',
      business_country: 'US',
      store_category: 'bookstore',
      store_type: 'independent',
      store_size: 'small'
    };

    const { data: retailerResult, error: retailerInsertError } = await supabase
      .from('retailer_applications')
      .insert(testRetailerData)
      .select('id')
      .single();

    if (retailerInsertError) {
      console.log('❌ Retailer application insertion failed:', retailerInsertError.message);
      
      if (retailerInsertError.message.includes('RLS')) {
        console.log('🔧 Fixing retailer RLS policies...');
        await fixRetailerRLS();
      }
    } else {
      console.log('✅ Retailer application insertion successful');
      // Clean up test data
      await supabase.from('retailer_applications').delete().eq('id', retailerResult.id);
    }

  } catch (error) {
    console.error('❌ Error checking RLS:', error);
  }
}

async function fixPublisherRLS() {
  const policies = `
    -- Enable RLS
    ALTER TABLE publisher_applications ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "anonymous_can_insert_publisher_applications" ON publisher_applications;
    DROP POLICY IF EXISTS "users_can_view_own_publisher_applications" ON publisher_applications;
    DROP POLICY IF EXISTS "service_role_full_access_publisher_applications" ON publisher_applications;
    
    -- Allow anonymous users to INSERT applications
    CREATE POLICY "anonymous_can_insert_publisher_applications" ON publisher_applications
        FOR INSERT 
        TO anon
        WITH CHECK (true);
    
    -- Allow service role full access
    CREATE POLICY "service_role_full_access_publisher_applications" ON publisher_applications
        FOR ALL 
        TO service_role
        USING (true)
        WITH CHECK (true);
    
    -- Allow authenticated users to view their own applications
    CREATE POLICY "users_can_view_own_publisher_applications" ON publisher_applications
        FOR SELECT 
        TO authenticated
        USING (email = auth.jwt() ->> 'email');
  `;

  const { error } = await supabase.rpc('exec_sql', { sql: policies });
  if (error) {
    console.log('❌ Failed to fix publisher RLS:', error.message);
  } else {
    console.log('✅ Publisher RLS policies fixed');
  }
}

async function fixRetailerRLS() {
  const policies = `
    -- Enable RLS
    ALTER TABLE retailer_applications ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "anonymous_can_insert_retailer_applications" ON retailer_applications;
    DROP POLICY IF EXISTS "users_can_view_own_retailer_applications" ON retailer_applications;
    DROP POLICY IF EXISTS "service_role_full_access_retailer_applications" ON retailer_applications;
    
    -- Allow anonymous users to INSERT applications
    CREATE POLICY "anonymous_can_insert_retailer_applications" ON retailer_applications
        FOR INSERT 
        TO anon
        WITH CHECK (true);
    
    -- Allow service role full access
    CREATE POLICY "service_role_full_access_retailer_applications" ON retailer_applications
        FOR ALL 
        TO service_role
        USING (true)
        WITH CHECK (true);
    
    -- Allow authenticated users to view their own applications
    CREATE POLICY "users_can_view_own_retailer_applications" ON retailer_applications
        FOR SELECT 
        TO authenticated
        USING (buyer_email = auth.jwt() ->> 'email');
  `;

  const { error } = await supabase.rpc('exec_sql', { sql: policies });
  if (error) {
    console.log('❌ Failed to fix retailer RLS:', error.message);
  } else {
    console.log('✅ Retailer RLS policies fixed');
  }
}

// Run the check
checkAndFixRLS().then(() => {
  console.log('\n🎉 RLS check and fix completed!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
