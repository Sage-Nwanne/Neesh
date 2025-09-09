import { createClient } from '@supabase/supabase-js';

// Use the same credentials as the frontend
const supabaseUrl = 'https://smfzrubkyxejzkblrrjr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTcsImV4cCI6MjA2ODM1MzUxN30.1DF1Gtz3rIH0ifyeu0IUSKZmIy4LFnA1ddEtYjLSO0w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsertion() {
  try {
    console.log('Testing publisher application insertion...');
    
    // Test data similar to what the frontend would send
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

    console.log('Attempting to insert:', testData);

    const { data, error } = await supabase
      .from('publisher_applications')
      .insert(testData)
      .select('id, magazine_title')
      .single();

    if (error) {
      console.error('❌ Insertion failed:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
    } else {
      console.log('✅ Insertion successful!');
      console.log('Result:', data);
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

testInsertion();
