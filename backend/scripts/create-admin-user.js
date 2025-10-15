#!/usr/bin/env node

/**
 * Create an admin user in Supabase Auth
 * This script creates a user account and sets the admin role in app_metadata
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

async function createAdminUser() {
  console.log('🔧 Creating Admin User');
  console.log('=====================');

  const adminEmail = 'gem@neesh.art';
  const adminPassword = 'neeshis@dmin';

  console.log('📧 Admin Email:', adminEmail);
  console.log('🔑 Password:', adminPassword.replace(/./g, '*'));

  try {
    // Step 1: Create the user account
    console.log('📝 Creating user account...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
      app_metadata: {
        role: 'admin'
      },
      user_metadata: {
        name: 'Gem - NEESH Owner'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('⚠️  User already exists, updating role...');
        
        // Get existing user
        const { data: users, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) {
          throw listError;
        }

        const existingUser = users.users.find(u => u.email === adminEmail);
        if (!existingUser) {
          throw new Error('User exists but could not be found');
        }

        // Update existing user's metadata
        const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          {
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

        console.log('✅ Updated existing user with admin role');
        console.log('   User ID:', existingUser.id);
        console.log('   Email:', existingUser.email);
        console.log('   Role:', updateData.user.app_metadata?.role);
      } else {
        throw authError;
      }
    } else {
      console.log('✅ Created new admin user');
      console.log('   User ID:', authData.user.id);
      console.log('   Email:', authData.user.email);
      console.log('   Role:', authData.user.app_metadata?.role);
    }

    // Step 2: Verify the user can authenticate
    console.log('\n🔍 Testing authentication...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });

    if (signInError) {
      console.log('❌ Authentication test failed:', signInError.message);
    } else {
      console.log('✅ Authentication test successful');
      console.log('   Access token length:', signInData.session?.access_token?.length);
      console.log('   User role:', signInData.user?.app_metadata?.role);
      
      // Sign out after test
      await supabase.auth.signOut();
    }

    console.log('\n📋 Admin User Details:');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('   Role: admin');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    console.log('🎉 Admin user setup complete!');

  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    process.exit(1);
  }
}

// Run the script
createAdminUser();
