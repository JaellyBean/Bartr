import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: any

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey)
  console.log('Supabase initialized (Web): URL Present, Key Present')
} else {
  // Mock supabase client to prevent build errors when env vars are missing
  supabase = {
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getSession: () => Promise.resolve({ data: { session: null } }),
      signUp: () => Promise.reject(new Error('Supabase not configured')),
    }
  }
  console.log('Supabase not initialized: Missing env vars')
}

export { supabase }

