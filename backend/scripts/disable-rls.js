import { createClient } from '@supabase/supabase-js';

// Use service role key
const supabaseUrl = 'https://smfzrubkyxejzkblrrjr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc3NzUxNywiZXhwIjoyMDY4MzUzNTE3fQ.qsZ3frM-QtRfUVNDQRYlmex4HMD2jR38lyJk_Ofn2Jk';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function disableRLS() {
  try {
    console.log('🔧 Temporarily disabling RLS for publisher_applications...');
    console.log('⚠️  This allows anyone to read/write to the table');
    console.log('💡 For production, you should implement proper RLS policies');
    
    // Try to disable RLS using a direct query
    // Note: This might not work with the client, but let's try
    const { data, error } = await supabase
      .from('publisher_applications')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Cannot access table:', error);
      return false;
    }
    
    console.log('✅ Table is accessible');
    console.log('');
    console.log('🔍 To fix this properly, you need to run this SQL in the Supabase SQL Editor:');
    console.log('');
    console.log('-- Disable RLS temporarily');
    console.log('ALTER TABLE publisher_applications DISABLE ROW LEVEL SECURITY;');
    console.log('');
    console.log('-- OR create a proper policy:');
    console.log('-- DROP POLICY IF EXISTS "Allow anonymous application submissions" ON publisher_applications;');
    console.log('-- CREATE POLICY "Allow anonymous application submissions" ON publisher_applications');
    console.log('--     FOR INSERT WITH CHECK (true);');
    console.log('');
    
    return true;
    
  } catch (error) {
    console.error('💥 Error:', error);
    return false;
  }
}

async function testWithoutRLS() {
  try {
    console.log('🧪 Testing insertion (assuming RLS is disabled)...');
    
    // Create anonymous client
    const anonClient = createClient(supabaseUrl, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTcsImV4cCI6MjA2ODM1MzUxN30.1DF1Gtz3rIH0ifyeu0IUSKZmIy4LFnA1ddEtYjLSO0w');
    
    const testData = {
      email: 'final-test@example.com',
      first_name: 'Final',
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
      console.error('❌ Insertion failed:', error);
      console.error('Error code:', error.code);
      
      if (error.code === '42501') {
        console.log('🔒 RLS is still enabled and blocking the insertion');
        console.log('📝 Please run the SQL commands shown above in Supabase SQL Editor');
      }
      
      return false;
    } else {
      console.log('✅ Insertion successful!');
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
  console.log('🚀 Checking RLS status and providing fix instructions...\n');
  
  await disableRLS();
  
  console.log('\n🧪 Testing current state...\n');
  const testPassed = await testWithoutRLS();
  
  if (testPassed) {
    console.log('\n🎉 Publisher applications are working!');
    console.log('✅ Users can now submit applications successfully');
  } else {
    console.log('\n❌ Still having issues - RLS needs to be fixed manually');
    console.log('');
    console.log('🔧 MANUAL FIX REQUIRED:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run this command:');
    console.log('   ALTER TABLE publisher_applications DISABLE ROW LEVEL SECURITY;');
    console.log('');
    console.log('🔒 For production security, consider enabling RLS with proper policies later');
  }
}

main();
