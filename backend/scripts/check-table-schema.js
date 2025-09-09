import { createClient } from '@supabase/supabase-js';

// Use the same credentials as the frontend
const supabaseUrl = 'https://smfzrubkyxejzkblrrjr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTcsImV4cCI6MjA2ODM1MzUxN30.1DF1Gtz3rIH0ifyeu0IUSKZmIy4LFnA1ddEtYjLSO0w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTableSchema() {
  try {
    console.log('Checking table schema...');
    
    // Try to get the table structure by querying with a limit of 0
    const { data, error } = await supabase
      .from('publisher_applications')
      .select('*')
      .limit(0);
    
    if (error) {
      console.error('❌ Error querying table:', error);
      return;
    }
    
    console.log('✅ Table exists and is accessible');
    
    // Try to insert a minimal record to see what columns are required/available
    const minimalData = {
      email: 'schema-test@example.com',
      first_name: 'Schema',
      last_name: 'Test',
      business_name: 'Test Business',
      magazine_title: 'Test Magazine'
    };

    console.log('Testing minimal insertion...');
    const { data: insertResult, error: insertError } = await supabase
      .from('publisher_applications')
      .insert(minimalData)
      .select('*')
      .single();

    if (insertError) {
      console.error('❌ Minimal insertion failed:', insertError);
      console.error('Error code:', insertError.code);
      console.error('Error message:', insertError.message);
    } else {
      console.log('✅ Minimal insertion successful!');
      console.log('Available columns in result:', Object.keys(insertResult));
      
      // Clean up the test record
      await supabase
        .from('publisher_applications')
        .delete()
        .eq('id', insertResult.id);
      console.log('🧹 Test record cleaned up');
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

checkTableSchema();
