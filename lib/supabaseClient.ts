import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for our database
export interface UserProfile {
  id: string
  full_name: string
  phone_number: string
  country_code: string
  country: string
  currency: string
  promo_code?: string
  created_at: string
  updated_at: string
}