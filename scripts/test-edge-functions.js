#!/usr/bin/env node

// Test script for the new Edge Functions
// Run with: node scripts/test-edge-functions.js

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://smfzrubkyxejzkblrrjr.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTcsImV4cCI6MjA2ODM1MzUxN30.1DF1Gtz3rIH0ifyeu0IUSKZmIy4LFnA1ddEtYjLSO0w';

async function testPublisherApplication() {
  console.log('🧪 Testing Publisher Application Submission...');
  
  const testData = {
    email: 'test-publisher@example.com',
    first_name: 'Test',
    last_name: 'Publisher',
    business_name: 'Test Publishing House',
    magazine_title: 'Test Magazine',
    publication_type: 'single',
    description: 'A test magazine for Edge Function testing',
    print_run: 1000,
    available_quantity: 500,
    wholesale_price: 8.50,
    suggested_retail_price: 15.00,
    status: 'pending'
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/publisher-application`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Origin': 'https://neesh.art' // Test CORS
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Publisher application test PASSED');
      console.log('   Response:', result);
      return true;
    } else {
      const error = await response.json();
      console.log('❌ Publisher application test FAILED');
      console.log('   Status:', response.status);
      console.log('   Error:', error);
      return false;
    }
  } catch (error) {
    console.log('❌ Publisher application test ERROR');
    console.log('   Error:', error.message);
    return false;
  }
}

async function testRetailerApplication() {
  console.log('\n🧪 Testing Retailer Application Submission...');
  
  const testData = {
    shop_name: 'Test Bookstore',
    buyer_email: 'test-retailer@example.com',
    buyer_name: 'Test Retailer',
    buyer_phone: '+1-555-0123',
    business_address_line_1: '123 Main Street',
    business_city: 'Test City',
    business_state: 'CA',
    business_zip_code: '90210',
    business_country: 'US',
    store_category: 'Independent Bookstore',
    store_type: 'Independent',
    store_size: 'Small (under 1,000 sq ft)'
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/retailer-application`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Origin': 'https://neesh.art' // Test CORS
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Retailer application test PASSED');
      console.log('   Response:', result);
      return true;
    } else {
      const error = await response.json();
      console.log('❌ Retailer application test FAILED');
      console.log('   Status:', response.status);
      console.log('   Error:', error);
      return false;
    }
  } catch (error) {
    console.log('❌ Retailer application test ERROR');
    console.log('   Error:', error.message);
    return false;
  }
}

async function testCORS() {
  console.log('\n🧪 Testing CORS Preflight...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/publisher-application`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://neesh.art',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type,authorization,apikey'
      }
    });

    if (response.ok) {
      const corsOrigin = response.headers.get('Access-Control-Allow-Origin');
      const corsHeaders = response.headers.get('Access-Control-Allow-Headers');
      const corsMethods = response.headers.get('Access-Control-Allow-Methods');
      
      console.log('✅ CORS preflight test PASSED');
      console.log('   Allow-Origin:', corsOrigin);
      console.log('   Allow-Headers:', corsHeaders);
      console.log('   Allow-Methods:', corsMethods);
      return true;
    } else {
      console.log('❌ CORS preflight test FAILED');
      console.log('   Status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ CORS preflight test ERROR');
    console.log('   Error:', error.message);
    return false;
  }
}

async function testInvalidOrigin() {
  console.log('\n🧪 Testing Invalid Origin Rejection...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/publisher-application`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://malicious-site.com',
        'Access-Control-Request-Method': 'POST'
      }
    });

    const corsOrigin = response.headers.get('Access-Control-Allow-Origin');
    
    if (!corsOrigin || corsOrigin === '') {
      console.log('✅ Invalid origin rejection test PASSED');
      console.log('   Correctly rejected malicious origin');
      return true;
    } else {
      console.log('❌ Invalid origin rejection test FAILED');
      console.log('   Incorrectly allowed:', corsOrigin);
      return false;
    }
  } catch (error) {
    console.log('❌ Invalid origin rejection test ERROR');
    console.log('   Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Testing NEESH Edge Functions\n');
  console.log('📍 Testing against:', SUPABASE_URL);
  console.log('🔑 Using anon key:', SUPABASE_ANON_KEY.substring(0, 20) + '...\n');

  const results = [];
  
  results.push(await testCORS());
  results.push(await testInvalidOrigin());
  results.push(await testPublisherApplication());
  results.push(await testRetailerApplication());

  const passed = results.filter(r => r).length;
  const total = results.length;

  console.log('\n📊 Test Results:');
  console.log(`   Passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 All tests PASSED! Edge Functions are working correctly.');
  } else {
    console.log('⚠️  Some tests FAILED. Please check the errors above.');
  }

  console.log('\n💡 Next steps:');
  console.log('   1. Deploy the functions: ./scripts/deploy-functions.sh');
  console.log('   2. Test admin authentication with a real admin user');
  console.log('   3. Verify production deployment works correctly');
}

runTests().catch(console.error);
