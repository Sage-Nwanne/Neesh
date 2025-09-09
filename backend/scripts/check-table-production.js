import { createClient } from '@supabase/supabase-js';

// Use the same credentials as the frontend
const supabaseUrl = 'https://smfzrubkyxejzkblrrjr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnpydWJreXhlanprYmxycmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3Nzc1MTcsImV4cCI6MjA2ODM1MzUxN30.1DF1Gtz3rIH0ifyeu0IUSKZmIy4LFnA1ddEtYjLSO0w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTable() {
  try {
    console.log('Checking publisher_applications table...');
    console.log('Supabase URL:', supabaseUrl);
    
    // Try to query the table
    const { data, error } = await supabase
      .from('publisher_applications')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Error accessing table:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === '42P01') {
        console.log('🔍 Table does not exist. Need to create it.');
      } else if (error.code === '42501') {
        console.log('🔒 Permission denied. RLS might be blocking access.');
      }
    } else {
      console.log('✅ Table exists and is accessible!');
      console.log('Data:', data);
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

checkTable();
