#!/usr/bin/env node

/**
 * Update existing user to have admin role
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function updateAdminRole() {
  console.log('🔧 Updating Admin Role');
  console.log('======================');

  const adminEmail = 'admin@neesh.art';

  try {
    // Get existing user
    console.log('🔍 Finding user...');
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw listError;
    }

    const existingUser = users.users.find(u => u.email === adminEmail);
    if (!existingUser) {
      console.error('❌ User not found:', adminEmail);
      return;
    }

    console.log('✅ Found user:', existingUser.id);
    console.log('   Current role:', existingUser.app_metadata?.role || 'none');

    // Update user's metadata
    console.log('🔄 Updating role to admin...');
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        app_metadata: {
          role: 'admin'
        },
        user_metadata: {
          name: 'NEESH Admin'
        }
      }
    );

    if (updateError) {
      throw updateError;
    }

    console.log('✅ Updated user with admin role');
    console.log('   User ID:', existingUser.id);
    console.log('   Email:', existingUser.email);
    console.log('   New role:', updateData.user.app_metadata?.role);

    // Test authentication
    console.log('\n🔐 Testing authentication...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: 'NeeshAdmin2025!'
    });

    if (signInError) {
      console.log('❌ Authentication test failed:', signInError.message);
      console.log('   You may need to reset the password');
    } else {
      console.log('✅ Authentication test successful');
      console.log('   Role:', signInData.user.app_metadata?.role);
      console.log('   Token length:', signInData.session?.access_token?.length);
      
      // Sign out after test
      await supabase.auth.signOut();
    }

    console.log('\n🎉 Admin role update complete!');
    console.log('📋 Login Details:');
    console.log('   Email: admin@neesh.art');
    console.log('   Password: NeeshAdmin2025!');

  } catch (error) {
    console.error('❌ Failed to update admin role:', error.message);
    process.exit(1);
  }
}

// Run the script
updateAdminRole();
