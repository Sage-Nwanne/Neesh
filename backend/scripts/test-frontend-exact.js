import { createClient } from '@supabase/supabase-js';

// Use exact same credentials as frontend
const supabaseUrl = 'https://smfzrubkyxejzkblrrjr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTcsImV4cCI6MjA2ODM1MzUxN30.1DF1Gtz3rIH0ifyeu0IUSKZmIy4LFnA1ddEtYjLSO0w';

// Create client exactly like frontend
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testExactFrontendCall() {
  console.log('🧪 Testing exact frontend call...\n');

  // Use exact same data structure as frontend
  const submissionData = {
    shop_name: 'Test Shop',
    business_address_line_1: '123 Test St',
    business_address_line_2: '',
    business_city: 'Test City',
    business_state: 'CA',
    business_zip_code: '12345',
    business_country: 'US',
    store_category: 'Independent Bookstore',
    store_type: 'Independent',
    store_size: 'Small (under 1,000 sq ft)',
    years_in_business: 5,
    buyer_name: 'Test Buyer',
    buyer_email: 'test@example.com',
    buyer_phone: '555-1234',
    pos_system: 'Square',
    monthly_magazine_budget: 500,
    preferred_delivery_frequency: 'Monthly',
    target_customers: ['Students'],
    aesthetic_preferences: ['Minimalist/Clean'],
    current_magazine_sources: ['Direct from Publishers'],
    interested_genres: ['Art & Design'],
    current_magazine_titles: ['Test Magazine']
  };

  console.log('📤 Submitting data:', submissionData);

  try {
    // Use exact same call as frontend
    const { data: result, error } = await supabase
      .from('retailer_applications')
      .insert(submissionData)
      .select('id, shop_name')
      .single();

    if (error) {
      console.log('❌ Frontend-style call failed:', error);
      console.log('   Code:', error.code);
      console.log('   Message:', error.message);
      console.log('   Details:', error.details);
      return false;
    }

    console.log('✅ Frontend-style call succeeded!');
    console.log('   ID:', result.id);
    console.log('   Shop:', result.shop_name);

    // Clean up
    await supabase.from('retailer_applications').delete().eq('id', result.id);
    console.log('🧹 Test data cleaned up');

    return true;
  } catch (error) {
    console.log('❌ Unexpected error:', error);
    return false;
  }
}

// Run the test
testExactFrontendCall()
  .then(success => {
    if (success) {
      console.log('\n🎉 Frontend call simulation successful!');
      console.log('   The issue might be in the frontend environment or data validation.');
    } else {
      console.log('\n💥 Frontend call simulation failed!');
      console.log('   The RLS policies need further investigation.');
    }
  })
  .catch(error => {
    console.error('💥 Script error:', error);
  });
