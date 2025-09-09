import { createClient } from '@supabase/supabase-js';

// Use service role key to modify RLS policies
const supabaseUrl = 'https://smfzrubkyxejzkblrrjr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc3NzUxNywiZXhwIjoyMDY4MzUzNTE3fQ.qsZ3frM-QtRfUVNDQRYlmex4HMD2jR38lyJk_Ofn2Jk';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixRLSPolicy() {
  try {
    console.log('🔧 Fixing RLS policies for publisher_applications...');
    
    // Drop existing policies
    console.log('🗑️ Dropping existing RLS policies...');
    
    const dropPoliciesSQL = `
      DROP POLICY IF EXISTS "Anyone can submit applications" ON publisher_applications;
      DROP POLICY IF EXISTS "Users can view own applications" ON publisher_applications;
      DROP POLICY IF EXISTS "Admins can view all applications" ON publisher_applications;
      DROP POLICY IF EXISTS "Admins can update applications" ON publisher_applications;
    `;
    
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: dropPoliciesSQL
    });
    
    if (dropError) {
      console.error('❌ Error dropping policies:', dropError);
    } else {
      console.log('✅ Existing policies dropped');
    }
    
    // Create new policies that work correctly
    console.log('🏗️ Creating new RLS policies...');
    
    const createPoliciesSQL = `
      -- Allow anyone (including anonymous users) to insert applications
      CREATE POLICY "Allow anonymous application submissions" ON publisher_applications
          FOR INSERT WITH CHECK (true);
      
      -- Allow users to view their own applications by email
      CREATE POLICY "Users can view own applications by email" ON publisher_applications
          FOR SELECT USING (
              email = (auth.jwt() ->> 'email')::text
          );
      
      -- Allow service role and authenticated users with admin role to view all
      CREATE POLICY "Service role can view all applications" ON publisher_applications
          FOR ALL USING (
              auth.role() = 'service_role' OR
              (auth.jwt() ->> 'role')::text IN ('admin', 'owner')
          );
      
      -- Allow service role and admins to update applications
      CREATE POLICY "Service role can update applications" ON publisher_applications
          FOR UPDATE USING (
              auth.role() = 'service_role' OR
              (auth.jwt() ->> 'role')::text IN ('admin', 'owner')
          );
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: createPoliciesSQL
    });
    
    if (createError) {
      console.error('❌ Error creating policies:', createError);
      return false;
    }
    
    console.log('✅ New RLS policies created successfully');
    return true;
    
  } catch (error) {
    console.error('💥 Error fixing RLS policies:', error);
    return false;
  }
}

async function testAnonymousInsertion() {
  try {
    console.log('🧪 Testing anonymous insertion after RLS fix...');
    
    // Create anonymous client
    const anonClient = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTcsImV4cCI6MjA2ODM1MzUxN30.1DF1Gtz3rIH0ifyeu0IUSKZmIy4LFnA1ddEtYjLSO0w');
    
    const testData = {
      email: 'rls-test@example.com',
      first_name: 'RLS',
      last_name: 'Test',
      business_name: 'Test Business',
      magazine_title: 'Test Magazine',
      description: 'Test description',
      status: 'pending'
    };

    const { data, error } = await anonClient
      .from('publisher_applications')
      .insert(testData)
      .select('id, magazine_title')
      .single();

    if (error) {
      console.error('❌ Anonymous insertion still failed:', error);
      return false;
    } else {
      console.log('✅ Anonymous insertion successful!');
      console.log('Result:', data);
      
      // Clean up using service role
      await supabase
        .from('publisher_applications')
        .delete()
        .eq('id', data.id);
      console.log('🧹 Test record cleaned up');
      
      return true;
    }
  } catch (error) {
    console.error('💥 Error testing anonymous insertion:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting RLS policy fix...\n');
  
  const policyFixed = await fixRLSPolicy();
  
  if (policyFixed) {
    console.log('\n🧪 Testing the fix...\n');
    const testPassed = await testAnonymousInsertion();
    
    if (testPassed) {
      console.log('\n🎉 RLS policy fix completed successfully!');
      console.log('✅ Anonymous users can now submit publisher applications');
    } else {
      console.log('\n❌ RLS policy fix failed - anonymous insertions still blocked');
    }
  } else {
    console.log('\n❌ Failed to fix RLS policies');
  }
}

main();
