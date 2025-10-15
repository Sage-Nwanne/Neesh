#!/usr/bin/env node

/**
 * Test admin authentication flow end-to-end
 * This script tests the complete flow from login to API call
 */

import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   SUPABASE_ANON_KEY:', anonKey ? '✅' : '❌');
  process.exit(1);
}

// Create Supabase client (like frontend)
const supabase = createClient(supabaseUrl, anonKey);

async function testAdminAuth() {
  console.log('🧪 Testing Admin Authentication Flow');
  console.log('====================================');

  // Get admin credentials from command line or use defaults
  const adminEmail = process.argv[2] || 'gem@neesh.art';
  const adminPassword = process.argv[3] || 'neeshis@dmin';
  
  console.log('📧 Testing with email:', adminEmail);

  try {
    // Step 1: Sign in as admin
    console.log('\n🔐 Step 1: Signing in...');
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
    console.log('   Access token length:', signInData.session?.access_token?.length);

    // Step 2: Check if user has admin role
    if (signInData.user.app_metadata?.role !== 'admin') {
      console.error('❌ User does not have admin role');
      console.error('   Current role:', signInData.user.app_metadata?.role);
      console.error('   Expected: admin');
      return;
    }

    console.log('✅ User has admin role');

    // Step 3: Test admin API call
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

    // Step 4: Test with anon key (should fail)
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
      const anonError = await anonResponse.text();
      console.log('✅ Correctly rejected anon key');
      console.log('   Error:', anonError.substring(0, 100) + '...');
    } else {
      console.log('❌ Unexpectedly accepted anon key');
    }

    // Step 5: Sign out
    console.log('\n🚪 Step 4: Signing out...');
    await supabase.auth.signOut();
    console.log('✅ Signed out successfully');

    console.log('\n🎉 Admin authentication test complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testAdminAuth();
