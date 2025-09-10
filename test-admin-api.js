// Test script to check admin API
import fetch from 'node-fetch';

async function testAdminAPI() {
  try {
    // Create admin token
    const adminToken = Buffer.from(JSON.stringify({ role: 'admin', userId: 'admin-user' })).toString('base64');
    
    console.log('🧪 Testing admin API...');
    console.log('Admin token:', adminToken);
    
    const response = await fetch('http://localhost:5000/api/admin/applications', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ API Success!');
    console.log('Applications found:', data.length);
    console.log('Sample application:', data[0]);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminAPI();
