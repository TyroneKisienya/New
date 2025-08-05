import React, { useState } from "react"
import { Mail, X } from "lucide-react"
import { supabase } from '@/lib/supabaseClient'

interface ForgotPasswordPageProps {
  onClose: () => void
  onSwitchToLogin: () => void
  onSwitchToRegister: () => void
}

export default function ForgotPasswordPage({ onClose, onSwitchToLogin, onSwitchToRegister }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!email) {
      alert('Please enter your email address.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}`,
      })

      if (error) {
        alert('Password reset failed: ' + error.message)
        setLoading(false)
        return
      }

      setEmailSent(true)
      alert('Password reset email sent! Check your inbox.')
    } catch (error) {
      console.error('Password reset error:', error)
      alert('An error occurred while sending the reset email.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (value: string) => {
    setEmail(value)
  }

  if (emailSent) {
    return (
      <div className="space-y-4">
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Email Sent</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Check your email</h3>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <button
            onClick={onSwitchToLogin}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with close button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Password recovery</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handlePasswordReset} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
            required
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {loading ? 'Sending...' : 'Restore password'}
        </button>
      </form>

      <div className="text-center text-sm">
        <button
          onClick={onSwitchToLogin}
          className="text-blue-500 hover:text-orange-600 font-medium mr-2"
        >
          Log In
        </button>
        <button
          onClick={onSwitchToRegister}
          className="text-blue-500 hover:text-orange-600 font-medium"
        >
          Sign Up
        </button>
      </div>
    </div>
  )
}