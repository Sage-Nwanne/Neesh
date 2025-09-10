import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://smfzrubkyxejzkblrrjr.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTcsImV4cCI6MjA2ODM1MzUxN30.1DF1Gtz3rIH0ifyeu0IUSKZmIy4LFnA1ddEtYjLSO0w';

// Create client with anon key (simulating frontend)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPublisherApplication() {
  console.log('🧪 Testing Publisher Application Submission...\n');

  const testData = {
    email: 'test-publisher@example.com',
    first_name: 'Test',
    last_name: 'Publisher',
    business_name: 'Test Publishing House',
    magazine_title: 'Test Magazine',
    publication_type: 'single',
    issue_number: '1',
    issue_frequency: 'monthly',
    description: 'A test magazine for testing purposes',
    social_website_link: 'https://testmagazine.com',
    print_run: 1000,
    available_quantity: 500,
    wholesale_price: 8.50,
    suggested_retail_price: 15.00,
    specs: '8.5x11 inches, 32 pages, full color',
    has_sold_before: 'yes',
    distribution_channels: ['online', 'retail'],
    copies_sold_estimate: 200,
    quotes_feedback: 'Positive feedback from readers',
    fulfillment_method: 'self_fulfillment',
    shipping_city: 'New York',
    shipping_state: 'NY',
    shipping_country: 'US',
    accepts_returns: 'yes',
    status: 'pending'
  };

  try {
    const { data: result, error } = await supabase
      .from('publisher_applications')
      .insert(testData)
      .select('id, magazine_title, email')
      .single();

    if (error) {
      console.log('❌ Publisher application failed:', error.message);
      return false;
    }

    console.log('✅ Publisher application submitted successfully!');
    console.log(`   ID: ${result.id}`);
    console.log(`   Magazine: ${result.magazine_title}`);
    console.log(`   Email: ${result.email}`);

    // Clean up test data
    await supabase.from('publisher_applications').delete().eq('id', result.id);
    console.log('🧹 Test data cleaned up\n');

    return true;
  } catch (error) {
    console.log('❌ Publisher application error:', error.message);
    return false;
  }
}

async function testRetailerApplication() {
  console.log('🧪 Testing Retailer Application Submission...\n');

  const testData = {
    shop_name: 'Test Bookstore',
    buyer_email: 'test-retailer@example.com',
    buyer_name: 'Test Retailer',
    buyer_phone: '+1-555-0123',
    business_address_line_1: '123 Main Street',
    business_address_line_2: 'Suite 100',
    business_city: 'Test City',
    business_state: 'CA',
    business_zip_code: '90210',
    business_country: 'US',
    store_category: 'Independent Bookstore',
    store_type: 'Independent',
    store_size: 'Small (under 1,000 sq ft)',
    years_in_business: 5,
    pos_system: 'square',
    monthly_magazine_budget: 500,
    preferred_delivery_frequency: 'monthly',
    current_magazine_sources: ['distributor', 'direct'],
    current_magazine_titles: ['Various art and culture magazines'],
    target_customers: ['art_enthusiasts', 'students'],
    aesthetic_preferences: ['minimalist', 'artistic'],
    interested_genres: ['art', 'culture', 'design']
  };

  try {
    const { data: result, error } = await supabase
      .from('retailer_applications')
      .insert(testData)
      .select('id, shop_name, buyer_email')
      .single();

    if (error) {
      console.log('❌ Retailer application failed:', error.message);
      return false;
    }

    console.log('✅ Retailer application submitted successfully!');
    console.log(`   ID: ${result.id}`);
    console.log(`   Shop: ${result.shop_name}`);
    console.log(`   Email: ${result.buyer_email}`);

    // Clean up test data
    await supabase.from('retailer_applications').delete().eq('id', result.id);
    console.log('🧹 Test data cleaned up\n');

    return true;
  } catch (error) {
    console.log('❌ Retailer application error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Testing Application Submissions with Fixed Code\n');
  console.log('This simulates the frontend submissions without manual Edge Function calls\n');

  const publisherSuccess = await testPublisherApplication();
  const retailerSuccess = await testRetailerApplication();

  console.log('📊 Test Results:');
  console.log(`   Publisher Application: ${publisherSuccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Retailer Application: ${retailerSuccess ? '✅ PASS' : '❌ FAIL'}`);

  if (publisherSuccess && retailerSuccess) {
    console.log('\n🎉 All tests passed! The POST errors should be resolved.');
    console.log('📧 Email notifications will be sent automatically by database triggers.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the error messages above.');
  }
}

runTests().catch(console.error);
