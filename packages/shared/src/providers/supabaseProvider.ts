import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl =
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  ''

const supabaseAnonKey =
  (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[HabitForge] Supabase env vars not set. Check your .env file.')
}

// This is the ONLY file that imports from @supabase/supabase-js.
// To migrate away, replace this file with an httpProvider — everything else stays the same.
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { autoRefreshToken: true, persistSession: true },
})

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}
