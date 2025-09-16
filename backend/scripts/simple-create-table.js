import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTable() {
  try {
    console.log('Creating mailing list table...');
    
    // Try to insert a test record to see if table exists
    const { data, error } = await supabase
      .from('mailing_list_subscribers')
      .insert([{
        email: 'test@example.com',
        source: 'test'
      }])
      .select();

    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Table does not exist. Please create it manually in Supabase dashboard.');
        console.log('\n📋 SQL to run in Supabase SQL Editor:');
        console.log(`
CREATE TABLE mailing_list_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    source VARCHAR(50) DEFAULT 'website',
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mailing_list_email ON mailing_list_subscribers(email);
CREATE INDEX idx_mailing_list_status ON mailing_list_subscribers(status);

-- Enable RLS
ALTER TABLE mailing_list_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations for service role" ON mailing_list_subscribers
    FOR ALL USING (true);
        `);
        console.log('\n🔗 Go to: https://supabase.com/dashboard/project/smfzrubkyxejzkblrrjr/sql');
      } else {
        console.error('Other error:', error);
      }
    } else {
      console.log('✅ Table exists! Cleaning up test record...');
      
      // Clean up test record
      await supabase
        .from('mailing_list_subscribers')
        .delete()
        .eq('email', 'test@example.com');
      
      console.log('✅ Table is ready for use!');
    }
  } catch (error) {
    console.error('Script error:', error);
  }
}

createTable();
