import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use service role key to bypass RLS
const supabaseUrl = 'https://smfzrubkyxejzkblrrjr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc3NzUxNywiZXhwIjoyMDY4MzUzNTE3fQ.qsZ3frM-QtRfUVNDQRYlmex4HMD2jR38lyJk_Ofn2Jk';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkCurrentSchema() {
  try {
    console.log('🔍 Checking current table schema...');
    
    // Get table info using service role
    const { data, error } = await supabase
      .from('publisher_applications')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error querying table:', error);
      return false;
    }
    
    console.log('✅ Table exists and is accessible with service role');
    
    // Try a test insertion to see what columns exist
    const testData = {
      email: 'schema-test@example.com',
      first_name: 'Schema',
      last_name: 'Test',
      business_name: 'Test Business',
      magazine_title: 'Test Magazine'
    };

    const { data: insertResult, error: insertError } = await supabase
      .from('publisher_applications')
      .insert(testData)
      .select('*')
      .single();

    if (insertError) {
      console.error('❌ Test insertion failed:', insertError);
      return false;
    } else {
      console.log('✅ Test insertion successful!');
      console.log('Available columns:', Object.keys(insertResult));
      
      // Clean up
      await supabase
        .from('publisher_applications')
        .delete()
        .eq('id', insertResult.id);
      
      return true;
    }
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return false;
  }
}

async function recreateTable() {
  try {
    console.log('🔄 Recreating table with correct schema...');
    
    // Read the migration SQL
    const migrationPath = path.join(__dirname, '../migrations/create_publisher_applications_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Migration SQL loaded');
    
    // Drop existing table first
    console.log('🗑️ Dropping existing table...');
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: 'DROP TABLE IF EXISTS publisher_applications CASCADE;'
    });
    
    if (dropError) {
      console.error('❌ Error dropping table:', dropError);
      return false;
    }
    
    console.log('✅ Table dropped successfully');
    
    // Create new table
    console.log('🏗️ Creating new table...');
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });
    
    if (createError) {
      console.error('❌ Error creating table:', createError);
      return false;
    }
    
    console.log('✅ Table created successfully');
    return true;
    
  } catch (error) {
    console.error('💥 Error recreating table:', error);
    return false;
  }
}

async function testNewSchema() {
  try {
    console.log('🧪 Testing new schema with full data...');
    
    const testData = {
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      business_name: 'Test Business',
      magazine_title: 'Test Magazine',
      publication_type: 'single',
      issue_number: '1',
      issue_frequency: 'monthly',
      description: 'Test description',
      social_website_link: 'https://example.com',
      print_run: 100,
      available_quantity: 50,
      wholesale_price: 10.00,
      suggested_retail_price: 15.00,
      specs: 'Test specs',
      volume_pricing: [{ min_quantity: 10, price_per_unit: 9.00 }],
      cover_image_url: 'https://example.com/image.jpg',
      has_sold_before: 'yes',
      distribution_channels: ['online', 'retail'],
      estimated_copies_sold: 25,
      sales_feedback: 'Good response',
      fulfillment_method: 'self',
      shipping_city: 'Test City',
      shipping_state: 'Test State',
      shipping_country: 'Test Country',
      return_policy: 'Test return policy',
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('publisher_applications')
      .insert(testData)
      .select('id, magazine_title')
      .single();

    if (error) {
      console.error('❌ Full test insertion failed:', error);
      return false;
    } else {
      console.log('✅ Full test insertion successful!');
      console.log('Result:', data);
      
      // Clean up
      await supabase
        .from('publisher_applications')
        .delete()
        .eq('id', data.id);
      
      return true;
    }
  } catch (error) {
    console.error('💥 Error testing new schema:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting table schema fix...\n');
  
  // Check current schema
  const schemaOk = await checkCurrentSchema();
  
  if (!schemaOk) {
    console.log('\n🔧 Schema issues detected, recreating table...\n');
    
    const recreated = await recreateTable();
    if (!recreated) {
      console.log('❌ Failed to recreate table');
      return;
    }
  }
  
  // Test the new schema
  console.log('\n🧪 Testing final schema...\n');
  const testPassed = await testNewSchema();
  
  if (testPassed) {
    console.log('\n🎉 Table schema fix completed successfully!');
    console.log('✅ Publisher applications should now work correctly');
  } else {
    console.log('\n❌ Schema fix failed');
  }
}

main();
