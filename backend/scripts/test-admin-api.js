#!/usr/bin/env node

/**
 * Test admin API end-to-end
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// Create Supabase client (like frontend)
const supabase = createClient(supabaseUrl, anonKey);

async function testAdminAPI() {
  console.log('🧪 Testing Admin API End-to-End');
  console.log('================================');

  const adminEmail = 'admin@neesh.art';
  const adminPassword = 'NeeshAdmin2025!';

  try {
    // Step 1: Sign in as admin
    console.log('🔐 Step 1: Signing in as admin...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });

    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message);
      return;
    }

    console.log('✅ Sign in successful');
    console.log('   User ID:', signInData.user.id);
    console.log('   Email:', signInData.user.email);
    console.log('   Role:', signInData.user.app_metadata?.role);

    // Step 2: Test admin API call
    console.log('\n📡 Step 2: Testing admin API call...');
    const token = signInData.session.access_token;
    
    const response = await fetch(`${supabaseUrl}/functions/v1/admin`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:');
    for (const [key, value] of response.headers.entries()) {
      if (key.startsWith('x-') || key === 'content-type') {
        console.log(`   ${key}: ${value}`);
      }
    }

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Admin API call successful');
      console.log('   Applications found:', Array.isArray(data) ? data.length : 'N/A');
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('   Sample application:', {
          id: data[0].id,
          type: data[0].type,
          status: data[0].status,
          email: data[0].email
        });
      }
    } else {
      const errorData = await response.text();
      console.error('❌ Admin API call failed');
      console.error('   Status:', response.status);
      console.error('   Response:', errorData);
    }

    // Step 3: Test with anon key (should fail)
    console.log('\n🚫 Step 3: Testing with anon key (should fail)...');
    const anonResponse = await fetch(`${supabaseUrl}/functions/v1/admin`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📊 Anon response status:', anonResponse.status);
    if (!anonResponse.ok) {
      console.log('✅ Correctly rejected anon key');
    } else {
      console.log('❌ Unexpectedly accepted anon key');
    }

    // Step 4: Sign out
    console.log('\n🚪 Step 4: Signing out...');
    await supabase.auth.signOut();
    console.log('✅ Signed out successfully');

    console.log('\n🎉 Admin API test complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAdminAPI();
