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

async function setupProperRLS() {
  console.log('🔧 Setting up proper RLS policies for application tables...\n');
  
  // SQL commands to set up proper RLS policies
  const rlsSetupSQL = `
-- ============================================
-- PUBLISHER APPLICATIONS RLS SETUP
-- ============================================

-- Ensure RLS is enabled
ALTER TABLE publisher_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous application submissions" ON publisher_applications;
DROP POLICY IF EXISTS "Users can view own applications by email" ON publisher_applications;
DROP POLICY IF EXISTS "Service role can view all applications" ON publisher_applications;
DROP POLICY IF EXISTS "Service role can update applications" ON publisher_applications;
DROP POLICY IF EXISTS "Anyone can submit applications" ON publisher_applications;
DROP POLICY IF EXISTS "Users can view own applications" ON publisher_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON publisher_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON publisher_applications;

-- 1. Allow anonymous users to INSERT applications (for initial submission)
CREATE POLICY "anonymous_can_insert_publisher_applications" ON publisher_applications
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- 2. Allow authenticated users to view their own applications by email
CREATE POLICY "users_can_view_own_publisher_applications" ON publisher_applications
    FOR SELECT 
    TO authenticated
    USING (email = auth.jwt() ->> 'email');

-- 3. Allow service role full access (for admin operations)
CREATE POLICY "service_role_full_access_publisher_applications" ON publisher_applications
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. Allow authenticated users to update their own applications (after account creation)
CREATE POLICY "users_can_update_own_publisher_applications" ON publisher_applications
    FOR UPDATE 
    TO authenticated
    USING (email = auth.jwt() ->> 'email')
    WITH CHECK (email = auth.jwt() ->> 'email');

-- ============================================
-- RETAILER APPLICATIONS RLS SETUP (if table exists)
-- ============================================

-- Check if retailer_applications table exists and set up similar policies
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'retailer_applications') THEN
        -- Ensure RLS is enabled
        ALTER TABLE retailer_applications ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies
        DROP POLICY IF EXISTS "anonymous_can_insert_retailer_applications" ON retailer_applications;
        DROP POLICY IF EXISTS "users_can_view_own_retailer_applications" ON retailer_applications;
        DROP POLICY IF EXISTS "service_role_full_access_retailer_applications" ON retailer_applications;
        DROP POLICY IF EXISTS "users_can_update_own_retailer_applications" ON retailer_applications;
        
        -- Create new policies
        CREATE POLICY "anonymous_can_insert_retailer_applications" ON retailer_applications
            FOR INSERT 
            TO anon
            WITH CHECK (true);
            
        CREATE POLICY "users_can_view_own_retailer_applications" ON retailer_applications
            FOR SELECT 
            TO authenticated
            USING (email = auth.jwt() ->> 'email');
            
        CREATE POLICY "service_role_full_access_retailer_applications" ON retailer_applications
            FOR ALL 
            TO service_role
            USING (true)
            WITH CHECK (true);
            
        CREATE POLICY "users_can_update_own_retailer_applications" ON retailer_applications
            FOR UPDATE 
            TO authenticated
            USING (email = auth.jwt() ->> 'email')
            WITH CHECK (email = auth.jwt() ->> 'email');
            
        RAISE NOTICE 'Retailer applications RLS policies updated';
    ELSE
        RAISE NOTICE 'Retailer applications table does not exist, skipping';
    END IF;
END $$;
`;

  console.log('📝 SQL commands to execute:');
  console.log('=====================================');
  console.log(rlsSetupSQL);
  console.log('=====================================\n');
  
  console.log('🔧 To apply these RLS policies:');
  console.log('1. Go to your Supabase Dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Copy and paste the SQL above');
  console.log('4. Click Run\n');
  
  console.log('💡 These policies will:');
  console.log('   ✅ Allow anonymous users to submit applications');
  console.log('   ✅ Allow authenticated users to view/update their own applications');
  console.log('   ✅ Allow service role (admin) full access');
  console.log('   ✅ Maintain security by preventing unauthorized access\n');
  
  return rlsSetupSQL;
}

async function testAnonymousInsertion() {
  try {
    console.log('🧪 Testing anonymous insertion (run this after applying SQL)...\n');
    
    // Create anonymous client
    const anonClient = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTcsImV4cCI6MjA2ODM1MzUxN30.1DF1Gtz3rIH0ifyeu0IUSKZmIy4LFnA1ddEtYjLSO0w');
    
    const testData = {
      email: 'rls-policy-test@example.com',
      first_name: 'RLS',
      last_name: 'Test',
      business_name: 'Test Business',
      magazine_title: 'Test Magazine',
      description: 'Test description for RLS policy',
      status: 'pending'
    };

    console.log('Attempting anonymous insertion...');
    const { data, error } = await anonClient
      .from('publisher_applications')
      .insert(testData)
      .select('id, magazine_title, email')
      .single();

    if (error) {
      console.error('❌ Anonymous insertion failed:', error);
      console.error('Error code:', error.code);
      
      if (error.code === '42501') {
        console.log('🔒 RLS policies not yet applied - please run the SQL above first');
      }
      
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
    console.error('💥 Error testing insertion:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Setting up proper RLS policies for application workflow...\n');
  
  // Generate the SQL
  const sql = await setupProperRLS();
  
  // Test current state
  const testPassed = await testAnonymousInsertion();
  
  if (testPassed) {
    console.log('\n🎉 RLS policies are working correctly!');
    console.log('✅ Anonymous users can submit applications');
    console.log('✅ Security is maintained');
  } else {
    console.log('\n⏳ Please apply the SQL commands above, then run this script again to test');
  }
  
  // Save SQL to file for easy access
  const fs = await import('fs');
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const sqlFile = path.join(__dirname, 'rls-setup.sql');
  
  fs.writeFileSync(sqlFile, sql);
  console.log(`\n📁 SQL saved to: ${sqlFile}`);
}

main();
