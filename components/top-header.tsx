import React, { useEffect, useRef, useState } from "react"
import { Globe, Clock, X, Menu } from "lucide-react"
import { supabase } from '@/lib/supabaseClient'
import type { Session, User } from '@supabase/supabase-js'
import LoginPage from './auth/LoginPage'
import RegisterPage from './auth/RegisterPage'
import ForgotPasswordPage from './auth/ForgotPasswordPage'

interface TopHeaderProps {
  session?: Session | null
  user?: User | null
}

export default function TopHeader({ session: propSession, user: propUser }: TopHeaderProps) {
  const [activeForm, setActiveForm] = useState<"login" | "register" | "forgot-password" | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  const modalRef = useRef<HTMLDivElement>(null)

  // Use props if provided, otherwise manage local state (for backwards compatibility)
  const session = propSession !== undefined ? propSession : null
  const user = propUser !== undefined ? propUser : null

  // Clock update
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setActiveForm(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleClose = () => {
    setActiveForm(null)
  }

  const handleLoginSuccess = (userSession: any) => {
    // Close the modal after successful login
    setActiveForm(null)
    // The session state will be updated by the parent component
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      alert('Logged out successfully.')
      // The session state will be updated by the parent component's auth listener
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const switchToRegister = () => setActiveForm("register")
  const switchToLogin = () => setActiveForm("login")
  const switchToForgotPassword = () => setActiveForm("forgot-password")

  return (
    <div className="relative bg-gray-800 border-b border-gray-700 px-2 sm:px-4 py-2">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 sm:w-6 sm:h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded flex items-center justify-center">
              <span className="text-gray-900 font-bold text-sm">P</span>
            </div>
            <span className="text-yellow-400 font-bold text-base sm:text-lg">PRIMEBET</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2 sm:space-x-4 text-gray-400">
            <span className="hover:text-white cursor-pointer">HOME</span>
            <span className="hover:text-white cursor-pointer">CLICK HERE FOR HELP</span>
          </div>
        </div>

        {/* Right side (sm+): Language + Time + Auth */}
        <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:flex items-center space-x-2 sm:space-x-4 text-gray-400">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Globe className="w-4 h-4" />
              <span>EN</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Clock className="w-4 h-4" />
              <span className="hidden md:inline">
                {currentTime.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit"
                })},{" "}
                {currentTime.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
              <span className="md:hidden">
                {currentTime.toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            </div>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {!session ? (
              <>
                <button
                  className="text-white border border-gray-600 hover:bg-gray-700 bg-transparent text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3 rounded transition-colors"
                  onClick={() => setActiveForm("login")}
                >
                  <span className="hidden sm:inline">Log In</span>
                  <span className="sm:hidden">Login</span>
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3 rounded transition-colors"
                  onClick={() => setActiveForm("register")}
                >
                  <span className="hidden sm:inline">Sign Up</span>
                  <span className="sm:hidden">Join</span>
                </button>
              </>
            ) : (
              <>
                <span className="text-white text-xs sm:text-sm">
                  Welcome, {session.user?.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white border border-gray-600 hover:bg-gray-700 bg-transparent text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile-only: Right side Globe + Hamburger */}
        <div className="flex sm:hidden items-center space-x-3">
          <div className="flex items-center space-x-1 text-gray-400">
            <Globe className="w-4 h-4" />
            <span>EN</span>
          </div>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile-only Login/Register under logo */}
      <div className="flex sm:hidden mt-2 space-x-2">
        {!session ? (
          <>
            <button
              className="w-1/2 text-white border border-gray-600 hover:bg-gray-700 bg-transparent text-xs h-8 rounded transition-colors"
              onClick={() => setActiveForm("login")}
            >
              Login
            </button>
            <button
              className="w-1/2 bg-green-600 hover:bg-green-700 text-white text-xs h-8 rounded transition-colors"
              onClick={() => setActiveForm("register")}
            >
              Join
            </button>
          </>
        ) : (
          <>
            <div className="flex-1 text-white text-xs flex items-center justify-center">
              Welcome, {session.user?.email?.split('@')[0]}
            </div>
            <button
              onClick={handleLogout}
              className="w-1/3 text-white border border-gray-600 hover:bg-gray-700 bg-transparent text-xs h-8 rounded transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-gray-800 border-b border-gray-700 px-4 py-3 z-40">
          <div className="flex flex-col space-y-2 text-gray-400 text-sm">
            <span className="hover:text-white cursor-pointer py-1">HOME</span>
            <span className="hover:text-white cursor-pointer py-1">CLICK HERE FOR HELP</span>
            <div className="flex items-center justify-between pt-2 border-t border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>EN</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {currentTime.toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {activeForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div
            ref={modalRef}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[95vh] overflow-y-auto"
          >
            {/* Only show close button for login and register pages (ForgotPasswordPage has its own) */}
            {activeForm !== "forgot-password" && (
              <div className="sticky top-0 z-10 bg-white rounded-t-2xl flex justify-end p-3 sm:p-4 pb-0">
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              {activeForm === "login" && (
                <LoginPage
                  onClose={handleClose}
                  onSwitchToRegister={switchToRegister}
                  onSwitchToForgotPassword={switchToForgotPassword}
                  onLoginSuccess={handleLoginSuccess}
                />
              )}
              {activeForm === "register" && (
                <RegisterPage
                  onClose={handleClose}
                  onSwitchToLogin={switchToLogin}
                />
              )}
              {activeForm === "forgot-password" && (
                <ForgotPasswordPage
                  onClose={handleClose}
                  onSwitchToLogin={switchToLogin}
                  onSwitchToRegister={switchToRegister}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}