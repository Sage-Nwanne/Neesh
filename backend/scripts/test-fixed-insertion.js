import { createClient } from '@supabase/supabase-js';

// Use the same credentials as the frontend (anon key)
const supabaseUrl = 'https://smfzrubkyxejzkblrrjr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTcsImV4cCI6MjA2ODM1MzUxN30.1DF1Gtz3rIH0ifyeu0IUSKZmIy4LFnA1ddEtYjLSO0w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFixedInsertion() {
  try {
    console.log('🧪 Testing fixed publisher application insertion...');
    
    // Test data with corrected column names (matching the frontend fix)
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
      volume_pricing_tiers: [{ min_quantity: 10, price_per_unit: 9.00 }], // Fixed column name
      cover_image_url: 'https://example.com/image.jpg',
      has_sold_before: true, // Boolean instead of string
      distribution_channels: ['online', 'retail'],
      copies_sold_estimate: 25, // Fixed column name
      quotes_feedback: 'Good response', // Fixed column name
      fulfillment_method: 'self',
      shipping_city: 'Test City',
      shipping_state: 'Test State',
      shipping_country: 'Test Country',
      accepts_returns: 'Test return policy', // Fixed column name
      status: 'pending'
    };

    console.log('Attempting to insert with corrected column names...');

    const { data, error } = await supabase
      .from('publisher_applications')
      .insert(testData)
      .select('id, magazine_title')
      .single();

    if (error) {
      console.error('❌ Insertion failed:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === '42501') {
        console.log('🔒 This is an RLS (Row Level Security) issue');
        console.log('💡 The table exists and columns are correct, but RLS policy is blocking anonymous insertions');
        console.log('🔧 Need to fix the RLS policy to allow anonymous insertions');
      }
    } else {
      console.log('✅ Insertion successful!');
      console.log('Result:', data);
      
      // Clean up the test record
      await supabase
        .from('publisher_applications')
        .delete()
        .eq('id', data.id);
      console.log('🧹 Test record cleaned up');
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

testFixedInsertion();
