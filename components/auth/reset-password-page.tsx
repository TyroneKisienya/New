import React, { useState, useEffect } from "react"
import { Lock, Eye, EyeOff, CheckCircle, X } from "lucide-react"
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

interface ResetPasswordPageProps {
  onComplete?: () => void
}

export default function ResetPasswordPage({ onComplete }: ResetPasswordPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false)
  const router = useRouter()
  
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if we have URL parameters for password recovery
        const urlParams = new URLSearchParams(window.location.search)
        const accessToken = urlParams.get('access_token')
        const refreshToken = urlParams.get('refresh_token')
        const type = urlParams.get('type')
        
        console.log('URL params:', { accessToken, refreshToken, type })

        if (type === 'recovery' && accessToken && refreshToken) {
          // Set the session for password recovery
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          
          if (!error && data.session) {
            console.log('Recovery session set successfully')
            setIsValidSession(true)
          } else {
            console.error('Error setting recovery session:', error)
            setIsValidSession(false)
          }
        } else {
          // Check if user has an active session (already logged in)
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            setIsValidSession(true)
          } else {
            setIsValidSession(false)
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
        setIsValidSession(false)
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkSession()
  }, [])

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!passwords.password || !passwords.confirmPassword) {
      alert('Please fill in both password fields.')
      setLoading(false)
      return
    }

    if (passwords.password !== passwords.confirmPassword) {
      alert('Passwords do not match.')
      setLoading(false)
      return
    }

    if (passwords.password.length < 6) {
      alert('Password must be at least 6 characters long.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.password
      })

      if (error) {
        console.error('Password update error:', error)
        alert('Password update failed: ' + error.message)
        setLoading(false)
        return
      }

      console.log('Password updated successfully')
      setPasswordResetSuccess(true)
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)
      
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        if (onComplete) {
          onComplete()
        } else {
          router.push('/')
        }
      }, 3000)
      
    } catch (error) {
      console.error('Password update error:', error)
      alert('An error occurred while updating your password.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof passwords, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }))
  }

  const handleBackToHome = () => {
    if (onComplete) {
      onComplete()
    } else {
      router.push('/')
    }
  }

  // Loading state while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Verifying reset link...</p>
        </div>
      </div>
    )
  }

  // Invalid session state
  if (!isValidSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 border border-gray-700 text-center">
            <div className="text-red-400 mb-4">
              <X className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">Invalid Reset Link</h2>
            <p className="text-gray-400 mb-6">
              This password reset link is invalid or has expired. Please request a new password reset.
            </p>
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

  // Success state
  if (passwordResetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 border border-gray-700 text-center">
            <div className="text-green-400 mb-4">
              <CheckCircle className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">Password Reset Successful!</h2>
            <p className="text-gray-400 mb-6">
              Your password has been updated successfully. You will be redirected shortly.
            </p>
            <button
              onClick={handleBackToHome}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Continue to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Reset password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-gray-800 rounded-lg shadow-md p-6 sm:p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-white">Reset Your Password</h2>
            <p className="text-gray-400 mt-2">Enter your new password below</p>
          </div>
          
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password (min 6 characters)"
                value={passwords.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={passwords.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-sm text-gray-400">
              Password must be at least 6 characters long
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={handleBackToHome}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}