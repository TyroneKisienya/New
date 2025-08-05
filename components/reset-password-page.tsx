import React, { useState } from "react"
import { Lock, Eye, EyeOff } from "lucide-react"
import { supabase } from '@/lib/supabaseClient'

interface ResetPasswordPageProps {
  onComplete: () => void
}

export default function ResetPasswordPage({ onComplete }: ResetPasswordPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  })

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
        alert('Password update failed: ' + error.message)
        setLoading(false)
        return
      }

      alert('Password updated successfully!')
      onComplete() // Go back to main app
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
                placeholder="New Password"
                value={passwords.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                required
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
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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
              onClick={onComplete}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}