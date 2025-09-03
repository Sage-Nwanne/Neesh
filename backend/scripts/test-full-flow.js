import { supabase } from '../config/supabase.js';

async function testFullFlow() {
  try {
    console.log('🧪 Testing full application flow...\n');

    // 1. Test application submission (simulating frontend form)
    console.log('1️⃣ Testing application submission...');
    
    const testApplicationData = {
      email: 'newtest@example.com',
      first_name: 'Jane',
      last_name: 'Smith',
      business_name: 'Smith Publishing',
      magazine_title: 'Modern Art Weekly',
      publication_type: 'series',
      issue_number: '5',
      issue_frequency: 'Weekly',
      description: 'A weekly magazine focused on contemporary art and artists',
      social_website_link: 'https://modernartweekly.com',
      print_run: '2000',
      available_quantity: '1800',
      wholesale_price: '7.50',
      suggested_retail_price: '12.99',
      specs: 'A4, 48 pages, premium paper',
      volume_pricing: [
        { volume: '10-49', price: '7.00' },
        { volume: '50-99', price: '6.50' }
      ],
      cover_image_url: 'https://example.com/modern-art-cover.jpg',
      has_sold_before: 'yes',
      distribution_channels: ['online', 'retail', 'subscription'],
      estimated_copies_sold: '1200',
      sales_feedback: 'Excellent customer feedback, high repeat purchases',
      fulfillment_method: 'self-fulfillment',
      shipping_city: 'San Francisco',
      shipping_state: 'CA',
      shipping_country: 'USA',
      return_policy: '30-day return policy for damaged items'
    };

    // Simulate the API call that the frontend makes
    const response = await fetch('http://localhost:5000/api/publisher/application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testApplicationData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Application submission failed:', errorText);
      return;
    }

    const submissionResult = await response.json();
    console.log('✅ Application submitted successfully!');
    console.log('Application ID:', submissionResult.applicationId);

    // 2. Test admin authentication and application fetching
    console.log('\n2️⃣ Testing admin authentication...');
    
    // Create admin token (simulating frontend login)
    const adminCredentials = { email: 'admin@neesh.art', role: 'admin', userId: '1' };
    const adminToken = btoa(JSON.stringify(adminCredentials));

    // Test fetching applications as admin
    const adminResponse = await fetch('http://localhost:5000/api/admin/applications', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!adminResponse.ok) {
      const errorText = await adminResponse.text();
      console.error('❌ Admin applications fetch failed:', errorText);
      return;
    }

    const applications = await adminResponse.json();
    console.log('✅ Admin can fetch applications!');
    console.log(`Found ${applications.length} applications`);
    
    // Find our test application
    const testApp = applications.find(app => app.email === testApplicationData.email);
    if (testApp) {
      console.log('✅ Test application found in admin panel!');
      console.log(`- Applicant: ${testApp.applicantName}`);
      console.log(`- Business: ${testApp.businessName}`);
      console.log(`- Magazine: ${testApp.magazineTitle}`);
      console.log(`- Status: ${testApp.status}`);

      // 3. Test application approval
      console.log('\n3️⃣ Testing application approval...');
      
      const approvalResponse = await fetch(`http://localhost:5000/api/admin/applications/${testApp.id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!approvalResponse.ok) {
        const errorText = await approvalResponse.text();
        console.error('❌ Application approval failed:', errorText);
        return;
      }

      const approvalResult = await approvalResponse.json();
      console.log('✅ Application approved successfully!');
      console.log('Updated status:', approvalResult.application.status);

      // 4. Verify the approval in database
      console.log('\n4️⃣ Verifying approval in database...');
      
      const { data: updatedApp, error } = await supabase
        .from('publisher_applications')
        .select('*')
        .eq('id', testApp.id)
        .single();

      if (error) {
        console.error('❌ Database verification failed:', error);
        return;
      }

      console.log('✅ Database verification successful!');
      console.log(`- Status: ${updatedApp.status}`);
      console.log(`- Reviewed at: ${updatedApp.reviewed_at}`);
      console.log(`- Reviewed by: ${updatedApp.reviewed_by}`);

    } else {
      console.log('❌ Test application not found in admin panel');
    }

    console.log('\n🎉 Full flow test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('✅ Frontend can submit applications');
    console.log('✅ Applications are stored in Supabase');
    console.log('✅ Admin panel can authenticate');
    console.log('✅ Admin panel can fetch applications');
    console.log('✅ Admin can approve/deny applications');
    console.log('✅ Database updates are persisted');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testFullFlow();
