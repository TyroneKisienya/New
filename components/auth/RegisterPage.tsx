import React, { useState, useRef } from "react"
import { User, Mail, Lock, Eye, EyeOff, Gift, ChevronDown } from "lucide-react"
import { supabase } from '@/lib/supabaseClient'

interface Country {
  code: string
  name: string
  dialCode: string
  flag: string
}

interface UserRegistrationData {
  fullName: string
  phoneNumber: string
  countryCode: string
  country: string
  currency: string
  email: string
  password: string
  confirmPassword: string
  promoCode?: string
}

interface RegisterPageProps {
  onClose: () => void
  onSwitchToLogin: () => void
}

export default function RegisterPage({ onClose, onSwitchToLogin }: RegisterPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: "KE",
    name: "Kenya",
    dialCode: "+254",
    flag: "🇰🇪"
  })
  const [loading, setLoading] = useState(false)
  const [registerData, setRegisterData] = useState<UserRegistrationData>({
    fullName: '',
    phoneNumber: '',
    countryCode: '+254',
    country: 'Kenya',
    currency: 'EUR',
    email: '',
    password: '',
    confirmPassword: '',
    promoCode: ''
  })
  
  const countryDropdownRef = useRef<HTMLDivElement>(null)

  // Countries list
  const countries: Country[] = [
    { code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪" },
    { code: "UG", name: "Uganda", dialCode: "+256", flag: "🇺🇬" },
    { code: "TZ", name: "Tanzania", dialCode: "+255", flag: "🇹🇿" },
    { code: "RW", name: "Rwanda", dialCode: "+250", flag: "🇷🇼" },
    { code: "ET", name: "Ethiopia", dialCode: "+251", flag: "🇪🇹" },
    { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
    { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
    { code: "GH", name: "Ghana", dialCode: "+233", flag: "🇬🇭" },
    { code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" }
  ]

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setRegisterData(prev => ({
      ...prev,
      countryCode: country.dialCode,
      country: country.name
    }))
    setIsCountryDropdownOpen(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!registerData.fullName || !registerData.email || !registerData.password || !registerData.phoneNumber) {
      alert('Please fill in all required fields.')
      setLoading(false)
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match.')
      setLoading(false)
      return
    }

    if (!acceptTerms) {
      alert('Please accept the terms of use.')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            full_name: registerData.fullName,
            phone_number: registerData.phoneNumber,
            country_code: registerData.countryCode,
            country: registerData.country,
            currency: registerData.currency,
            promo_code: registerData.promoCode || null,
          }
        }
      })

      if (error) {
        alert('Registration failed: ' + error.message)
        setLoading(false)
        return
      }

      alert('Registration successful! Check your email to confirm.')
      onClose()
    } catch (error) {
      console.error('Registration error:', error)
      alert('An error occurred during registration.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof UserRegistrationData, value: string) => {
    setRegisterData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Sign Up</h2>
      
      <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Full Name"
            value={registerData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
            required
          />
        </div>

        {/* Enhanced Phone Number Input with Country Picker */}
        <div className="relative">
          <div className="flex">
            {/* Country Code Picker */}
            <div className="relative" ref={countryDropdownRef}>
              <button
                type="button"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 border-r-0 rounded-l-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
              >
                <span className="text-base sm:text-lg">{selectedCountry.flag}</span>
                <span className="text-xs sm:text-sm font-medium">{selectedCountry.dialCode}</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              </button>
              
              {/* Country Dropdown */}
              {isCountryDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-800 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-lg">{country.flag}</span>
                      <span className="flex-1 text-sm">{country.name}</span>
                      <span className="text-sm text-gray-500 font-medium">{country.dialCode}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Phone Number Input */}
            <input
              type="tel"
              placeholder="712 123456"
              value={registerData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="flex-1 pl-3 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
              required
            />
          </div>
        </div>

        <div className="relative">
          <select 
            value={registerData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-800 text-sm sm:text-base"
          >
            <option value="Kenya">Kenya</option>
            <option value="Uganda">Uganda</option>
            <option value="Tanzania">Tanzania</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <select 
            value={registerData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-800 text-sm sm:text-base"
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="KES">KES</option>
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
            value={registerData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
            required
          />
        </div>

        <div className="relative">
          <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Promo Code (Optional)"
            value={registerData.promoCode}
            onChange={(e) => handleInputChange('promoCode', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={registerData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full pl-10 pr-12 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
            required
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
            placeholder="Confirm Password"
            value={registerData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="w-full pl-10 pr-12 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base"
            required
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
            required
          />
          <span className="text-gray-600 leading-relaxed">
            I accept{" "}
            <a href="#" className="text-blue-500 hover:text-blue-600">
              terms of use
            </a>
          </span>
        </div>

        <button
          type="submit"
          disabled={!acceptTerms || loading}
          className="w-full bg-gray-800 text-white py-2.5 sm:py-3 rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-blue-500 hover:text-blue-600"
        >
          Log In
        </button>
      </div>
    </div>
  )
}