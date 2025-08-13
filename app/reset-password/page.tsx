"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import ResetPasswordPage from "@/components/auth/reset-password-page"

export default function ResetPasswordRoute() {
  const router = useRouter()
  const [showResetForm, setShowResetForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recoveryTokens, setRecoveryTokens] = useState<{
    accessToken: string
    refreshToken: string
  } | null>(null)

  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        // Check both URL params and hash for tokens (Supabase can send them in either)
        const urlParams = new URLSearchParams(window.location.search)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        
        const accessToken = urlParams.get('access_token') || hashParams.get('access_token')
        const refreshToken = urlParams.get('refresh_token') || hashParams.get('refresh_token')
        const type = urlParams.get('type') || hashParams.get('type')
        const urlError = urlParams.get('error') || hashParams.get('error')
        
        console.log('Reset route - Full URL:', window.location.href)
        console.log('Reset route - URL params:', Object.fromEntries(urlParams))
        console.log('Reset route - Hash params:', Object.fromEntries(hashParams))
        console.log('Reset route - Extracted values:', { 
          type, 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken,
          error: urlError,
          accessTokenLength: accessToken?.length,
          refreshTokenLength: refreshToken?.length
        })

        // Handle URL errors
        if (urlError) {
          setError(`Reset error: ${urlError.replace('_', ' ')}`)
          setIsLoading(false)
          return
        }

        // Check if this is a valid password recovery
        if (type === 'recovery' && accessToken && refreshToken) {
          console.log('Valid recovery tokens found, storing for reset form...')
          
          // Store the tokens to pass to the reset form
          setRecoveryTokens({ accessToken, refreshToken })
          setShowResetForm(true)
          
          // Don't clean up URL parameters yet - let the reset form handle the session
          
        } else {
          console.log('Invalid or missing recovery parameters')
          setError('Invalid password reset link - missing required parameters')
        }
        
      } catch (err) {
        console.error('Password reset error:', err)
        setError('An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    handlePasswordReset()
  }, [])

  const handleResetComplete = () => {
    // Clean up URL parameters after successful reset
    window.history.replaceState({}, document.title, window.location.pathname)
    router.push('/')
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Processing password reset...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 border border-gray-700 text-center">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">Reset Link Error</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={handleBackToHome}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showResetForm && recoveryTokens) {
    return (
      <ResetPasswordPage 
        onComplete={handleResetComplete}
        recoveryTokens={recoveryTokens}
      />
    )
  }

  return null
}