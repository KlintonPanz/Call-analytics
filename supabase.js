import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for authentication
export const auth = {
  // Sign up with email and password
  signUp: async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Helper functions for calls data
export const calls = {
  // Get calls for current user
  getUserCalls: async (userId, limit = 100) => {
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)
    return { data, error }
  },

  // Create new call
  createCall: async (callData, userId) => {
    const { data, error } = await supabase
      .from('calls')
      .insert([{ ...callData, user_id: userId }])
      .select()
    return { data, error }
  },

  // Update call
  updateCall: async (callId, updates, userId) => {
    const { data, error } = await supabase
      .from('calls')
      .update(updates)
      .eq('call_id', callId)
      .eq('user_id', userId)
      .select()
    return { data, error }
  }
}
