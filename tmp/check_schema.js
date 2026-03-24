import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './mobile/.env' });

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_KEY
);

async function checkSchema() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching profiles:', error);
  } else if (data && data.length > 0) {
    console.log('Columns in profiles table:', Object.keys(data[0]));
  } else {
    console.log('No data in profiles table, trying RPC or another way...');
  }
}

checkSchema();
