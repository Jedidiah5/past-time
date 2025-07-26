import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'

// Log configuration status for debugging
console.log('Supabase Configuration:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing',
  hasValidCredentials
})

// Create a mock client for development when credentials aren't set
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: () => Promise.reject(new Error('Supabase not configured. Please set up your Supabase credentials.')),
    signInWithPassword: () => Promise.reject(new Error('Supabase not configured. Please set up your Supabase credentials.')),
    signOut: () => Promise.resolve({ error: null })
  },
  from: () => ({
    select: () => ({ 
      order: () => Promise.resolve({ data: [], error: null }),
      eq: () => ({ is: () => Promise.resolve({ data: [], error: null }) })
    }),
    insert: () => ({
      select: () => Promise.reject(new Error('Supabase not configured. Please set up your Supabase credentials.'))
    }),
    update: () => ({ eq: () => Promise.reject(new Error('Supabase not configured. Please set up your Supabase credentials.')) }),
    delete: () => ({ eq: () => ({ is: () => Promise.reject(new Error('Supabase not configured. Please set up your Supabase credentials.')) }) })
  })
})

export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient()

export type Database = {
  public: {
    Tables: {
      capsules: {
        Row: {
          id: string
          user_id: string
          title: string
          body: string
          unlock_date: string
          created_at: string
          media_url?: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          body: string
          unlock_date: string
          created_at?: string
          media_url?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          body?: string
          unlock_date?: string
          created_at?: string
          media_url?: string
        }
      }
    }
  }
}