import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createMailingListTable() {
  try {
    console.log('Creating mailing list subscribers table...');

    // Read the SQL migration file
    const sqlContent = fs.readFileSync(
      path.join(__dirname, '../migrations/create_mailing_list_table.sql'),
      'utf8'
    );

    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: sqlContent
    });

    if (error) {
      console.error('Error creating table:', error);
      
      // Try alternative approach - execute statements one by one
      console.log('Trying alternative approach...');
      
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        if (statement.includes('CREATE TABLE')) {
          console.log('Creating table...');
          const { error: tableError } = await supabase
            .from('mailing_list_subscribers')
            .select('*')
            .limit(1);
          
          if (tableError && tableError.code === '42P01') {
            // Table doesn't exist, we need to create it manually
            console.log('Table does not exist. Please create it manually in Supabase dashboard.');
            console.log('SQL to run:');
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
            `);
          }
          break;
        }
      }
    } else {
      console.log('✅ Mailing list table created successfully!');
    }

    // Test the table by trying to insert and delete a test record
    console.log('Testing table...');
    const testEmail = 'test@example.com';
    
    const { data: insertData, error: insertError } = await supabase
      .from('mailing_list_subscribers')
      .insert([{
        email: testEmail,
        source: 'test'
      }])
      .select();

    if (insertError) {
      console.error('Error testing insert:', insertError);
    } else {
      console.log('✅ Test insert successful');
      
      // Clean up test record
      const { error: deleteError } = await supabase
        .from('mailing_list_subscribers')
        .delete()
        .eq('email', testEmail);
      
      if (deleteError) {
        console.error('Error cleaning up test record:', deleteError);
      } else {
        console.log('✅ Test cleanup successful');
      }
    }

  } catch (error) {
    console.error('Script error:', error);
  }
}

createMailingListTable();
