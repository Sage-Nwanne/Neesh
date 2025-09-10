#!/usr/bin/env node

/**
 * Test admin approve/reject functionality
 */

import fetch from 'node-fetch';

console.log('🧪 Testing Admin Panel Actions');
console.log('===============================');

const adminToken = btoa(JSON.stringify({ role: 'admin', userId: 'admin-user' }));

async function testAdminActions() {
  try {
    // Get applications
    console.log('📊 Fetching applications...');
    const response = await fetch('http://localhost:5000/api/admin/applications', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log('❌ Failed to fetch applications');
      return;
    }

    const applications = await response.json();
    const pendingApps = applications.filter(app => app.status === 'pending');
    
    console.log(`✅ Found ${applications.length} total applications`);
    console.log(`⏳ Found ${pendingApps.length} pending applications`);

    if (pendingApps.length === 0) {
      console.log('ℹ️  No pending applications to test with');
      return;
    }

    const testApp = pendingApps[0];
    console.log(`\n🎯 Testing with application: ${testApp.applicantName} (${testApp.type})`);
    console.log(`📧 Email: ${testApp.email}`);
    console.log(`🆔 ID: ${testApp.id}`);

    // Test approval
    console.log('\n📧 Testing approval...');
    const approvalResponse = await fetch(`http://localhost:5000/api/admin/applications/${testApp.id}/approve`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type: testApp.type })
    });

    if (approvalResponse.ok) {
      const result = await approvalResponse.json();
      console.log('✅ Approval request successful!');
      console.log(`   Message: ${result.message}`);
      console.log(`   Email sent: ${result.emailSent}`);
      console.log(`   Email ID: ${result.emailId}`);
    } else {
      const error = await approvalResponse.json();
      console.log('❌ Approval failed:', error);
    }

    // Verify status change
    console.log('\n🔍 Verifying status change...');
    const verifyResponse = await fetch('http://localhost:5000/api/admin/applications', {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (verifyResponse.ok) {
      const updatedApps = await verifyResponse.json();
      const updatedApp = updatedApps.find(app => app.id === testApp.id);
      
      if (updatedApp) {
        console.log(`✅ Application status updated to: ${updatedApp.status}`);
      } else {
        console.log('❌ Could not find updated application');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminActions();
