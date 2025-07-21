import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'

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
    select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
    insert: () => Promise.reject(new Error('Supabase not configured. Please set up your Supabase credentials.'))
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