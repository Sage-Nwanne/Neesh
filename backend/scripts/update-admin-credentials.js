#!/usr/bin/env node

/**
 * Update admin user credentials in Supabase Auth
 * This script updates the existing admin user with new email and password
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', serviceKey ? '✅' : '❌');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function updateAdminCredentials() {
  console.log('🔧 Updating Admin User Credentials');
  console.log('==================================');

  const oldEmail = 'admin@neesh.art';
  const newEmail = 'gem@neesh.art';
  const newPassword = 'neeshis@dmin';

  console.log('📧 Old Email:', oldEmail);
  console.log('📧 New Email:', newEmail);
  console.log('🔑 New Password:', newPassword.replace(/./g, '*'));

  try {
    // Step 1: Find existing admin user
    console.log('🔍 Finding existing admin user...');
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw listError;
    }

    let existingUser = users.users.find(u => u.email === oldEmail);
    if (!existingUser) {
      // Try to find by new email in case it was already updated
      existingUser = users.users.find(u => u.email === newEmail);
      if (!existingUser) {
        console.log('⚠️  No existing admin user found. Creating new one...');
        
        // Create new admin user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: newEmail,
          password: newPassword,
          email_confirm: true,
          app_metadata: {
            role: 'admin'
          },
          user_metadata: {
            name: 'Gem - NEESH Owner'
          }
        });

        if (authError) {
          throw authError;
        }

        console.log('✅ Created new admin user');
        console.log('   User ID:', authData.user.id);
        console.log('   Email:', authData.user.email);
        console.log('   Role:', authData.user.app_metadata?.role);
        
        existingUser = authData.user;
      }
    }

    // Step 2: Update user credentials and metadata
    console.log('📝 Updating user credentials...');
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        email: newEmail,
        password: newPassword,
        app_metadata: {
          role: 'admin'
        },
        user_metadata: {
          name: 'Gem - NEESH Owner'
        }
      }
    );

    if (updateError) {
      throw updateError;
    }

    console.log('✅ Updated admin user credentials');
    console.log('   User ID:', updateData.user.id);
    console.log('   Email:', updateData.user.email);
    console.log('   Role:', updateData.user.app_metadata?.role);
    console.log('   Name:', updateData.user.user_metadata?.name);

    // Step 3: Test authentication with new credentials
    console.log('\n🔍 Testing authentication with new credentials...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: newEmail,
      password: newPassword
    });

    if (signInError) {
      console.log('❌ Authentication test failed:', signInError.message);
    } else {
      console.log('✅ Authentication test successful');
      console.log('   Access token length:', signInData.session?.access_token?.length);
      console.log('   User role:', signInData.user?.app_metadata?.role);
      console.log('   User name:', signInData.user?.user_metadata?.name);
      
      // Sign out after test
      await supabase.auth.signOut();
    }

    console.log('\n📋 Updated Admin User Details:');
    console.log('   Email:', newEmail);
    console.log('   Password:', newPassword);
    console.log('   Role: admin');
    console.log('   Name: Gem - NEESH Owner');
    console.log('\n🎉 Admin credentials update complete!');
    console.log('💡 You can now login to the admin panel with the new credentials.');

  } catch (error) {
    console.error('❌ Failed to update admin credentials:', error.message);
    process.exit(1);
  }
}

// Run the script
updateAdminCredentials();
