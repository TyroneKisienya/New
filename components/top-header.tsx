"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe, Clock, X, User, Mail, Lock, Eye, EyeOff, Phone, Gift, Menu } from "lucide-react"

export function TopHeader() {
  const [activeForm, setActiveForm] = useState<"login" | "register" | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setActiveForm(null)
      }
    }

    if (activeForm) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeForm])

  const handleClose = () => {
    setActiveForm(null)
    setShowPassword(false)
    setShowConfirmPassword(false)
    setAcceptTerms(false)
  }

  const LoginForm = () => (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Log In</h2>
      
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="email"
          placeholder="Email"
          className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full pl-10 pr-12 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-sm">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-gray-600">Remember me</span>
        </label>
        <a href="#" className="text-blue-500 hover:text-blue-600">
          Forgot your password?
        </a>
      </div>

      <button className="w-full bg-gray-800 text-white py-2.5 sm:py-3 rounded-lg hover:bg-gray-900 transition-colors text-sm sm:text-base">
        Log In
      </button>

      <div className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={() => setActiveForm("register")}
          className="text-blue-500 hover:text-blue-600"
        >
          Sign Up
        </button>
      </div>
    </div>
  )

  const RegisterForm = () => (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Sign Up</h2>
      
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Full Name"
          className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
        />
      </div>

      <div className="relative">
        <div className="flex">
          <div className="flex items-center bg-gray-50 border border-gray-200 border-r-0 rounded-l-lg px-2 sm:px-3">
            <img src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'%3e%3cpath fill='%23000' d='M0 0h3v1H0z'/%3e%3cpath fill='%23fff' d='M0 1h3v1H0z'/%3e%3cpath fill='%23f00' d='M0 0h3v.67H0z'/%3e%3cpath fill='%23009639' d='M0 1.33h3V2H0z'/%3e%3c/svg%3e" alt="Kenya" className="w-4 sm:w-5 h-2.5 sm:h-3 mr-1 sm:mr-2" />
            <Phone className="text-gray-400 w-3 sm:w-4 h-3 sm:h-4" />
          </div>
          <input
            type="tel"
            placeholder="+254 712 123456"
            className="flex-1 pl-2 sm:pl-3 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="relative">
        <select className="w-full pl-4 pr-10 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-800 text-sm sm:text-base">
          <option>Kenya</option>
          <option>Uganda</option>
          <option>Tanzania</option>
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="relative">
        <select className="w-full pl-4 pr-10 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-800 text-sm sm:text-base">
          <option>EUR</option>
          <option>USD</option>
          <option>KES</option>
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="email"
          placeholder="Email"
          className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
        />
      </div>

      <div className="relative">
        <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Promo"
          className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
        />
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full pl-10 pr-12 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="New Password Confirmation"
          className="w-full pl-10 pr-12 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-start text-sm">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mr-2 mt-0.5 flex-shrink-0"
        />
        <span className="text-gray-600 leading-relaxed">
          I accept{" "}
          <a href="#" className="text-blue-500 hover:text-blue-600">
            terms of use
          </a>
        </span>
      </div>

      <button
        disabled={!acceptTerms}
        className="w-full bg-gray-800 text-white py-2.5 sm:py-3 rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        Sign Up
      </button>
    </div>
  )

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
          <span className="hover:text-white cursor-pointer">LIVE</span>
          <span className="hover:text-white cursor-pointer">LIVE</span>
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
            <span className="hidden md:inline">30/01/25, 12:35</span>
            <span className="md:hidden">12:35</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-white border-gray-600 hover:bg-gray-700 bg-transparent text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
            onClick={() => setActiveForm("login")}
          >
            <span className="hidden sm:inline">Log In</span>
            <span className="sm:hidden">Login</span>
          </Button>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
            onClick={() => setActiveForm("register")}
          >
            <span className="hidden sm:inline">Sign Up</span>
            <span className="sm:hidden">Join</span>
          </Button>
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
      <Button
        variant="outline"
        size="sm"
        className="w-1/2 text-white border-gray-600 hover:bg-gray-700 bg-transparent text-xs h-8"
        onClick={() => setActiveForm("login")}
      >
        Login
      </Button>
      <Button
        size="sm"
        className="w-1/2 bg-green-600 hover:bg-green-700 text-white text-xs h-8"
        onClick={() => setActiveForm("register")}
      >
        Join
      </Button>
    </div>

    {/* Mobile Navigation Menu */}
    {showMobileMenu && (
      <div className="lg:hidden absolute top-full left-0 right-0 bg-gray-800 border-b border-gray-700 px-4 py-3 z-40">
        <div className="flex flex-col space-y-2 text-gray-400 text-sm">
          <span className="hover:text-white cursor-pointer py-1">HOME</span>
          <span className="hover:text-white cursor-pointer py-1">LIVE</span>
          <span className="hover:text-white cursor-pointer py-1">LIVE</span>
          <span className="hover:text-white cursor-pointer py-1">CLICK HERE FOR HELP</span>
          <div className="flex items-center justify-between pt-2 border-t border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>EN</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>12:35</span>
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
          <div className="sticky top-0 z-10 bg-white rounded-t-2xl flex justify-end p-3 sm:p-4 pb-0">
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-4 sm:px-6 pb-4 sm:pb-6">
            {activeForm === "login" && <LoginForm />}
            {activeForm === "register" && <RegisterForm />}
          </div>
        </div>
      </div>
    )}
  </div>
)
}