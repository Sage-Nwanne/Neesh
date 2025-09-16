import fetch from 'node-fetch';

const BACKEND_URL = 'http://localhost:5001';
const TEST_EMAIL = 'test@example.com';

async function testMailingList() {
  console.log('🧪 Testing Mailing List API...\n');

  try {
    // Test 1: Subscribe with valid email
    console.log('1️⃣ Testing subscription with valid email...');
    const subscribeResponse = await fetch(`${BACKEND_URL}/api/mailinglist/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: TEST_EMAIL }),
    });

    const subscribeData = await subscribeResponse.json();
    console.log('Response:', subscribeData);
    
    if (subscribeData.success) {
      console.log('✅ Subscription successful!\n');
    } else {
      console.log('❌ Subscription failed!\n');
      return;
    }

    // Test 2: Try to subscribe with same email (should handle duplicate)
    console.log('2️⃣ Testing duplicate subscription...');
    const duplicateResponse = await fetch(`${BACKEND_URL}/api/mailinglist/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: TEST_EMAIL }),
    });

    const duplicateData = await duplicateResponse.json();
    console.log('Response:', duplicateData);
    
    if (duplicateData.success) {
      console.log('✅ Duplicate handling works!\n');
    } else {
      console.log('❌ Duplicate handling failed!\n');
    }

    // Test 3: Test with invalid email
    console.log('3️⃣ Testing invalid email...');
    const invalidResponse = await fetch(`${BACKEND_URL}/api/mailinglist/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'invalid-email' }),
    });

    const invalidData = await invalidResponse.json();
    console.log('Response:', invalidData);
    
    if (!invalidData.success) {
      console.log('✅ Invalid email validation works!\n');
    } else {
      console.log('❌ Invalid email validation failed!\n');
    }

    // Test 4: Clean up - unsubscribe test email
    console.log('4️⃣ Testing unsubscribe...');
    const unsubscribeResponse = await fetch(`${BACKEND_URL}/api/mailinglist/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: TEST_EMAIL }),
    });

    const unsubscribeData = await unsubscribeResponse.json();
    console.log('Response:', unsubscribeData);
    
    if (unsubscribeData.success) {
      console.log('✅ Unsubscribe works!\n');
    } else {
      console.log('❌ Unsubscribe failed!\n');
    }

    console.log('🎉 All tests completed!');
    console.log('\n📧 Check your Resend dashboard for email logs:');
    console.log('https://resend.com/emails');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running on port 5001');
      console.log('Run: npm start (in the backend directory)');
    }
  }
}

// Run the test
testMailingList();
