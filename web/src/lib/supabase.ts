import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let _supabase: any;

const getSupabase = () => {
  if (_supabase) return _supabase;

  if (supabaseUrl && supabaseKey && supabaseUrl.startsWith("http")) {
    _supabase = createClient(supabaseUrl, supabaseKey);
    console.log("Supabase initialized (Web): URL Present, Key Present");
  } else {
    // Mock supabase client to prevent build errors when env vars are missing
    _supabase = {
      auth: {
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
        getSession: () => Promise.resolve({ data: { session: null } }),
        signUp: () => Promise.reject(new Error("Supabase not configured")),
        signIn: () => Promise.reject(new Error("Supabase not configured")),
        signOut: () => Promise.reject(new Error("Supabase not configured")),
      },
    };
    console.log("Supabase not initialized: Missing or invalid env vars");
  }

  return _supabase;
};

export const supabase: SupabaseClient = new Proxy(
  {},
  {
    get(target, prop) {
      const client = getSupabase();
      return client[prop];
    },
  },
) as SupabaseClient;
