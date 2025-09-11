#!/usr/bin/env node

/**
 * Reset admin user password
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

async function resetAdminPassword() {
  console.log('🔧 Resetting Admin Password');
  console.log('===========================');

  const adminEmail = 'admin@neesh.art';
  const newPassword = 'neeshis@dmin';

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

    // Update password
    console.log('🔄 Updating password...');
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        password: newPassword
      }
    );

    if (updateError) {
      throw updateError;
    }

    console.log('✅ Password updated successfully');

    // Test authentication
    console.log('\n🔐 Testing authentication...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: newPassword
    });

    if (signInError) {
      console.log('❌ Authentication test failed:', signInError.message);
    } else {
      console.log('✅ Authentication test successful');
      console.log('   Role:', signInData.user.app_metadata?.role);
      console.log('   Token length:', signInData.session?.access_token?.length);
      
      // Sign out after test
      await supabase.auth.signOut();
    }

    console.log('\n🎉 Password reset complete!');
    console.log('📋 Login Details:');
    console.log('   Email: admin@neesh.art');
    console.log('   Password: neeshis@dmin');

  } catch (error) {
    console.error('❌ Failed to reset password:', error.message);
    process.exit(1);
  }
}

// Run the script
resetAdminPassword();
