import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkMailingList() {
  try {
    console.log('🔍 Checking mailing list subscribers...\n');
    
    // Get all subscribers
    const { data: subscribers, error } = await supabase
      .from('mailing_list_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching subscribers:', error);
      return;
    }

    console.log(`📊 Total subscribers: ${subscribers.length}\n`);
    
    if (subscribers.length > 0) {
      console.log('📋 Recent subscribers:');
      subscribers.slice(0, 10).forEach((sub, index) => {
        console.log(`${index + 1}. ${sub.email} - ${sub.status} - ${new Date(sub.created_at).toLocaleString()}`);
      });
    } else {
      console.log('📭 No subscribers found');
    }

  } catch (error) {
    console.error('💥 Script error:', error);
  }
}

checkMailingList();
