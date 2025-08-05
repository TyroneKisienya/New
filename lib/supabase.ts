// Create this file: lib/supabase.ts

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

export interface UserRegistrationData {
  full_name: string
  phone_number: string
  country_code: string
  country: string
  currency: string
  email: string
  password: string
  promo_code?: string
}

// Registration function
export async function registerUser(userData: UserRegistrationData) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.full_name,
          phone_number: userData.phone_number,
          country_code: userData.country_code,
          country: userData.country,
          currency: userData.currency,
          promo_code: userData.promo_code || null,
        }
      }
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Registration error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Registration failed' 
    }
  }
}

// Login function
export async function loginUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Login error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Login failed' 
    }
  }
}

// Get current user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}