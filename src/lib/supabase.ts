import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// For demo purposes, we'll use mock values if environment variables are not set
let supabase: any;

try {
  if (supabaseUrl === 'https://demo.supabase.co' || supabaseAnonKey === 'demo-key') {
    // Create a mock Supabase client for demo purposes
    supabase = {
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: [], error: null }),
        update: () => ({ data: [], error: null }),
        delete: () => ({ data: [], error: null }),
        eq: () => ({ data: [], error: null }),
        order: () => ({ data: [], error: null }),
        single: () => ({ data: null, error: null })
      }),
      auth: {
        signUp: () => ({ data: null, error: null }),
        signInWithPassword: () => ({ data: null, error: null }),
        signOut: () => ({ error: null })
      }
    };
  } else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  console.warn('Supabase client initialization failed, using mock client for demo');
  // Fallback mock client
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: [], error: null }),
      update: () => ({ data: [], error: null }),
      delete: () => ({ data: [], error: null }),
      eq: () => ({ data: [], error: null }),
      order: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null })
    }),
    auth: {
      signUp: () => ({ data: null, error: null }),
      signInWithPassword: () => ({ data: null, error: null }),
      signOut: () => ({ error: null })
    }
  };
}

export { supabase };