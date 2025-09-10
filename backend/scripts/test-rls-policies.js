import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://smfzrubkyxejzkblrrjr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTcsImV4cCI6MjA2ODM1MzUxN30.1DF1Gtz3rIH0ifyeu0IUSKZmIy4LFnA1ddEtYjLSO0w';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc3NzUxNywiZXhwIjoyMDY4MzUzNTE3fQ.qsZ3frM-QtRfUVNDQRYlmex4HMD2jR38lyJk_Ofn2Jk';

// Create clients for different roles
const anonClient = createClient(supabaseUrl, supabaseAnonKey);
const serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function testAnonymousInsertion() {
  try {
    console.log('🧪 Test 1: Anonymous user submitting publisher application...');
    
    const testData = {
      email: 'anonymous-test@example.com',
      first_name: 'Anonymous',
      last_name: 'Applicant',
      business_name: 'Test Publishing House',
      magazine_title: 'Test Magazine',
      description: 'A test magazine for RLS policy verification',
      status: 'pending'
    };

    const { data, error } = await anonClient
      .from('publisher_applications')
      .insert(testData)
      .select('id, magazine_title, email, status')
      .single();

    if (error) {
      console.error('❌ Anonymous insertion failed:', error.message);
      return null;
    } else {
      console.log('✅ Anonymous insertion successful!');
      console.log('   Application ID:', data.id);
      console.log('   Magazine:', data.magazine_title);
      console.log('   Email:', data.email);
      console.log('   Status:', data.status);
      return data.id;
    }
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
    return null;
  }
}

async function testAnonymousRead(applicationId) {
  try {
    console.log('\n🧪 Test 2: Anonymous user trying to read applications...');
    
    const { data, error } = await anonClient
      .from('publisher_applications')
      .select('id, magazine_title, email')
      .eq('id', applicationId);

    if (error) {
      console.log('✅ Anonymous read blocked (as expected):', error.message);
      return true; // This is the expected behavior
    } else {
      console.log('❌ Anonymous read succeeded (security issue!)');
      console.log('   Data returned:', data);
      return false;
    }
  } catch (error) {
    console.log('✅ Anonymous read blocked (as expected):', error.message);
    return true;
  }
}

async function testServiceRoleAccess(applicationId) {
  try {
    console.log('\n🧪 Test 3: Service role (admin) accessing application...');
    
    const { data, error } = await serviceClient
      .from('publisher_applications')
      .select('id, magazine_title, email, status')
      .eq('id', applicationId)
      .single();

    if (error) {
      console.error('❌ Service role access failed:', error.message);
      return false;
    } else {
      console.log('✅ Service role access successful!');
      console.log('   Application ID:', data.id);
      console.log('   Magazine:', data.magazine_title);
      console.log('   Email:', data.email);
      console.log('   Status:', data.status);
      return true;
    }
  } catch (error) {
    console.error('💥 Service role error:', error.message);
    return false;
  }
}

async function testServiceRoleUpdate(applicationId) {
  try {
    console.log('\n🧪 Test 4: Service role updating application status...');
    
    const { data, error } = await serviceClient
      .from('publisher_applications')
      .update({ 
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewer_notes: 'Approved via RLS test'
      })
      .eq('id', applicationId)
      .select('id, status, reviewed_at')
      .single();

    if (error) {
      console.error('❌ Service role update failed:', error.message);
      return false;
    } else {
      console.log('✅ Service role update successful!');
      console.log('   Application ID:', data.id);
      console.log('   New Status:', data.status);
      console.log('   Reviewed At:', data.reviewed_at);
      return true;
    }
  } catch (error) {
    console.error('💥 Service role update error:', error.message);
    return false;
  }
}

async function cleanup(applicationId) {
  try {
    console.log('\n🧹 Cleaning up test data...');
    
    const { error } = await serviceClient
      .from('publisher_applications')
      .delete()
      .eq('id', applicationId);

    if (error) {
      console.error('❌ Cleanup failed:', error.message);
    } else {
      console.log('✅ Test data cleaned up successfully');
    }
  } catch (error) {
    console.error('💥 Cleanup error:', error.message);
  }
}

async function testFullApplicationWorkflow() {
  try {
    console.log('🧪 Testing complete publisher application workflow...\n');
    
    // Test data that matches the actual form structure
    const fullTestData = {
      email: 'workflow-test@example.com',
      first_name: 'Workflow',
      last_name: 'Test',
      business_name: 'Test Publishing Co',
      magazine_title: 'Workflow Test Magazine',
      publication_type: 'single',
      issue_number: '1',
      issue_frequency: 'monthly',
      description: 'A comprehensive test of the application workflow',
      social_website_link: 'https://example.com',
      print_run: 500,
      available_quantity: 300,
      wholesale_price: 12.50,
      suggested_retail_price: 18.99,
      specs: '8.5x11 inches, 64 pages, full color',
      volume_pricing_tiers: [
        { min_quantity: 10, price_per_unit: 11.50 },
        { min_quantity: 50, price_per_unit: 10.50 }
      ],
      cover_image_url: 'https://example.com/cover.jpg',
      has_sold_before: true,
      distribution_channels: ['online', 'retail'],
      copies_sold_estimate: 150,
      quotes_feedback: 'Very positive response from early readers',
      fulfillment_method: 'self',
      shipping_city: 'Test City',
      shipping_state: 'Test State',
      shipping_country: 'USA',
      accepts_returns: 'Yes, within 30 days with receipt',
      status: 'pending'
    };

    console.log('📝 Submitting full application data...');
    const { data, error } = await anonClient
      .from('publisher_applications')
      .insert(fullTestData)
      .select('id, magazine_title, email, status')
      .single();

    if (error) {
      console.error('❌ Full workflow test failed:', error.message);
      return false;
    } else {
      console.log('✅ Full application submission successful!');
      console.log('   Application ID:', data.id);
      console.log('   Magazine:', data.magazine_title);
      
      // Clean up
      await cleanup(data.id);
      return true;
    }
  } catch (error) {
    console.error('💥 Full workflow error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing RLS policies for publisher applications...\n');
  
  // Test 1: Anonymous insertion
  const applicationId = await testAnonymousInsertion();
  if (!applicationId) {
    console.log('\n❌ Basic anonymous insertion failed. Check if RLS policies are applied correctly.');
    return;
  }
  
  // Test 2: Anonymous read (should fail)
  const readBlocked = await testAnonymousRead(applicationId);
  
  // Test 3: Service role access (should succeed)
  const serviceAccess = await testServiceRoleAccess(applicationId);
  
  // Test 4: Service role update (should succeed)
  const serviceUpdate = await testServiceRoleUpdate(applicationId);
  
  // Test 5: Full workflow
  console.log('\n🧪 Test 5: Full application workflow...');
  const fullWorkflow = await testFullApplicationWorkflow();
  
  // Cleanup
  await cleanup(applicationId);
  
  // Summary
  console.log('\n📊 TEST RESULTS SUMMARY:');
  console.log('========================');
  console.log(`✅ Anonymous insertion: ${applicationId ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Anonymous read blocked: ${readBlocked ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Service role access: ${serviceAccess ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Service role update: ${serviceUpdate ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Full workflow: ${fullWorkflow ? 'PASS' : 'FAIL'}`);
  
  const allPassed = applicationId && readBlocked && serviceAccess && serviceUpdate && fullWorkflow;
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! RLS policies are working correctly.');
    console.log('✅ Publisher applications are ready for production use.');
  } else {
    console.log('\n❌ Some tests failed. Please check the RLS policies.');
  }
}

main();
