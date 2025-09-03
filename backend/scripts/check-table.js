import { supabase } from '../config/supabase.js';

async function checkTable() {
  try {
    console.log('Checking publisher_applications table structure...');
    
    // Try to fetch table info
    const { data, error } = await supabase
      .from('publisher_applications')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error accessing table:', error);
      return;
    }

    console.log('✅ Table exists and is accessible');
    console.log('Sample data structure:', data);

    // Try a simple insert with minimal data
    console.log('\nTesting simple insert...');
    
    const simpleData = {
      email: 'simple-test@example.com',
      first_name: 'Test',
      last_name: 'User',
      business_name: 'Test Business',
      magazine_title: 'Simple Test Magazine',
      description: 'A simple test'
    };

    const { data: inserted, error: insertError } = await supabase
      .from('publisher_applications')
      .insert([simpleData])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return;
    }

    console.log('✅ Simple insert successful!');
    console.log('Inserted record:', inserted);

  } catch (error) {
    console.error('Check failed:', error);
  }
}

checkTable();
