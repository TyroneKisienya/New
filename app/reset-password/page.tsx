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
  const [recoveryTokenHash, setRecoveryTokenHash] = useState<string | null>(null)

  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        // Check both URL params and hash for tokens (Supabase can send them in either)
        const urlParams = new URLSearchParams(window.location.search)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        
        const tokenHash = urlParams.get('token_hash') || hashParams.get('token_hash')
        const type = urlParams.get('type') || hashParams.get('type')
        const urlError = urlParams.get('error') || hashParams.get('error')
        
        console.log('Reset route - Full URL:', window.location.href)
        console.log('Reset route - URL params:', Object.fromEntries(urlParams))
        console.log('Reset route - Hash params:', Object.fromEntries(hashParams))
        console.log('Reset route - Extracted values:', { 
          type, 
          hasTokenHash: !!tokenHash,
          error: urlError,
          tokenHashLength: tokenHash?.length
        })

        // Handle URL errors
        if (urlError) {
          setError(`Reset error: ${urlError.replace('_', ' ')}`)
          setIsLoading(false)
          return
        }

        // Check if this is a valid password recovery
        if (type === 'recovery' && tokenHash) {
          console.log('Valid recovery token found, verifying...')
          
          try {
            // Verify the token hash and get session
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: 'recovery'
            })
            
            if (verifyError) {
              console.error('Token verification error:', verifyError)
              setError('Invalid or expired reset link: ' + verifyError.message)
            } else if (data.session) {
              console.log('Token verified successfully, showing reset form')
              // Token is already verified and session is established
              // We don't need to pass the token hash anymore
              setShowResetForm(true)
            } else {
              setError('Failed to verify reset token')
            }
          } catch (verifyErr) {
            console.error('Token verification failed:', verifyErr)
            setError('Failed to verify reset token')
          }
          
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

  if (showResetForm) {
    return (
      <ResetPasswordPage 
        onComplete={handleResetComplete}
      />
    )
  }

  return null
}