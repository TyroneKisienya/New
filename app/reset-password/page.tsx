"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ResetPasswordRoute() {
  const router = useRouter()

  useEffect(() => {
    // Get the current URL with all parameters
    const currentUrl = window.location.href
    
    // Redirect to home page with all the URL parameters intact
    // This will let your MainApp component handle the reset password logic
    const urlParams = new URLSearchParams(window.location.search)
    const hash = window.location.hash
    
    // Construct the redirect URL with parameters
    const redirectUrl = `/${window.location.search}${hash}`
    
    console.log('Redirecting to:', redirectUrl)
    router.replace(redirectUrl)
  }, [router])

  // Show a loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="text-white mt-4">Redirecting...</p>
      </div>
    </div>
  )
}