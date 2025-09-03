import { supabase } from '../config/supabase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('Running database migration...');
    
    // Read the SQL migration file
    const migrationPath = path.join(__dirname, '../migrations/create_publisher_applications_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });
    
    if (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }
    
    console.log('Migration completed successfully!');
    console.log('Publisher applications table created.');
    
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  }
}

// Alternative method using direct SQL execution
async function runMigrationDirect() {
  try {
    console.log('Creating publisher_applications table...');
    
    // Create the table directly
    const { error } = await supabase
      .from('publisher_applications')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') { // Table doesn't exist
      console.log('Table does not exist. Please run the SQL migration manually in Supabase dashboard.');
      console.log('SQL file location: backend/migrations/create_publisher_applications_table.sql');
      return;
    }
    
    if (error) {
      console.error('Error checking table:', error);
      return;
    }
    
    console.log('Publisher applications table already exists!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the migration
runMigrationDirect();
