import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey)

console.log('Supabase initialized (Web):', !!supabaseUrl ? 'URL Present' : 'URL MISSING', !!supabaseKey ? 'Key Present' : 'Key MISSING');

