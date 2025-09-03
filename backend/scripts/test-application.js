import { supabase } from '../config/supabase.js';

async function testApplicationSubmission() {
  try {
    console.log('Testing publisher application submission...');
    
    // Test data
    const testApplication = {
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      business_name: 'Test Magazine Co',
      magazine_title: 'Test Magazine',
      publication_type: 'single',
      issue_number: '1',
      issue_frequency: 'Monthly',
      description: 'A test magazine for testing purposes',
      social_website_link: 'https://testmagazine.com',
      print_run: 1000,
      available_quantity: 800,
      wholesale_price: 5.99,
      suggested_retail_price: 9.99,
      specs: 'A4, 32 pages, glossy cover',
      volume_pricing: [
        { volume: '10-49', price: '5.50' },
        { volume: '50-99', price: '5.00' }
      ],
      cover_image_url: 'https://example.com/cover.jpg',
      has_sold_before: 'yes',
      distribution_channels: ['online', 'retail'],
      estimated_copies_sold: 500,
      sales_feedback: 'Positive feedback from customers',
      fulfillment_method: 'self-fulfillment',
      shipping_city: 'New York',
      shipping_state: 'NY',
      shipping_country: 'USA',
      return_policy: '30-day return policy',
      status: 'pending',
      submitted_at: new Date().toISOString()
    };

    // Insert test application
    const { data: application, error } = await supabase
      .from('publisher_applications')
      .insert([testApplication])
      .select()
      .single();

    if (error) {
      console.error('Error inserting test application:', error);
      return;
    }

    console.log('✅ Test application created successfully!');
    console.log('Application ID:', application.id);
    console.log('Email:', application.email);
    console.log('Magazine:', application.magazine_title);
    console.log('Status:', application.status);

    // Test fetching applications
    console.log('\nTesting application retrieval...');
    
    const { data: applications, error: fetchError } = await supabase
      .from('publisher_applications')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching applications:', fetchError);
      return;
    }

    console.log(`✅ Found ${applications.length} applications in database`);
    applications.forEach((app, index) => {
      console.log(`${index + 1}. ${app.magazine_title} by ${app.first_name} ${app.last_name} (${app.status})`);
    });

    // Test updating application status
    console.log('\nTesting application approval...');
    
    const { data: updatedApp, error: updateError } = await supabase
      .from('publisher_applications')
      .update({ 
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'test-admin'
      })
      .eq('id', application.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating application:', updateError);
      return;
    }

    console.log('✅ Application approved successfully!');
    console.log('Updated status:', updatedApp.status);
    console.log('Reviewed at:', updatedApp.reviewed_at);

    console.log('\n🎉 All tests passed! Database integration is working correctly.');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testApplicationSubmission();
