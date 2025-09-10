#!/usr/bin/env node

/**
 * Test script to verify email functionality
 * This script tests:
 * 1. Application submission emails (publisher-notify, retailer-notify)
 * 2. Application decision emails (application-decision)
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables');
  console.error('Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

console.log('🧪 Testing NEESH Email System');
console.log('================================');

// Test data
const testPublisherApplication = {
  id: 'test-publisher-123',
  email: 'test-publisher@example.com',
  first_name: 'Test',
  last_name: 'Publisher',
  business_name: 'Test Publishing Co',
  magazine_title: 'Test Magazine',
  publication_type: 'series',
  issue_frequency: 'Monthly',
  description: 'A test magazine for email testing',
  created_at: new Date().toISOString()
};

const testRetailerApplication = {
  id: 'test-retailer-123',
  buyer_email: 'test-retailer@example.com',
  buyer_name: 'Test Retailer',
  shop_name: 'Test Bookstore',
  business_city: 'Test City',
  business_state: 'CA',
  created_at: new Date().toISOString()
};

async function testFunction(functionName, payload) {
  try {
    console.log(`\n📧 Testing ${functionName}...`);
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${functionName} - SUCCESS`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Response:`, result);
      return true;
    } else {
      console.log(`❌ ${functionName} - FAILED`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error:`, result);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${functionName} - ERROR`);
    console.log(`   Error:`, error.message);
    return false;
  }
}

async function runTests() {
  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Publisher application notification
  totalTests++;
  const publisherNotifyResult = await testFunction('publisher-notify', {
    record: testPublisherApplication
  });
  if (publisherNotifyResult) passedTests++;

  // Test 2: Retailer application notification
  totalTests++;
  const retailerNotifyResult = await testFunction('retailer-notify', {
    record: testRetailerApplication
  });
  if (retailerNotifyResult) passedTests++;

  // Test 3: Publisher approval email
  totalTests++;
  const publisherApprovalResult = await testFunction('application-decision', {
    applicationId: testPublisherApplication.id,
    applicationType: 'publisher',
    decision: 'approved',
    reviewedBy: 'test-admin'
  });
  if (publisherApprovalResult) passedTests++;

  // Test 4: Publisher rejection email
  totalTests++;
  const publisherRejectionResult = await testFunction('application-decision', {
    applicationId: testPublisherApplication.id,
    applicationType: 'publisher',
    decision: 'denied',
    reviewedBy: 'test-admin',
    denialReason: 'This is a test rejection for email testing purposes'
  });
  if (publisherRejectionResult) passedTests++;

  // Test 5: Retailer approval email
  totalTests++;
  const retailerApprovalResult = await testFunction('application-decision', {
    applicationId: testRetailerApplication.id,
    applicationType: 'retailer',
    decision: 'approved',
    reviewedBy: 'test-admin'
  });
  if (retailerApprovalResult) passedTests++;

  // Summary
  console.log('\n📊 Test Results');
  console.log('================');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All email tests passed! Your email system is working correctly.');
  } else {
    console.log('\n⚠️  Some email tests failed. Check the errors above.');
    console.log('\nCommon issues:');
    console.log('- RESEND_API_KEY not set in Supabase environment variables');
    console.log('- Supabase Edge Functions not deployed');
    console.log('- Network connectivity issues');
  }

  console.log('\n💡 Next steps:');
  console.log('1. Check your email inbox for test emails');
  console.log('2. If emails are not received, verify RESEND_API_KEY in Supabase dashboard');
  console.log('3. Test with real application submissions');
}

// Run the tests
runTests().catch(console.error);
