import { supabase } from '../config/supabase.js';

async function testMinimalSubmission() {
  try {
    console.log('Testing minimal application submission...');
    
    // Use only the fields we know exist
    const minimalData = {
      email: 'minimal@example.com',
      first_name: 'Minimal',
      last_name: 'Test',
      business_name: 'Minimal Business',
      magazine_title: 'Minimal Magazine',
      description: 'A minimal test magazine'
    };

    console.log('Submitting minimal data:', minimalData);

    const { data: application, error } = await supabase
      .from('publisher_applications')
      .insert([minimalData])
      .select()
      .single();

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('✅ Success! Application created:', application.id);
    console.log('Full record:', application);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testMinimalSubmission();
