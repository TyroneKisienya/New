import React, { useState } from 'react';
import { X, ChevronDown, Phone, User, Mail, Lock, Gift } from 'lucide-react';

// TypeScript interfaces
interface FormData {
  fullName: string;
  phoneNumber: string;
  country: string;
  currency: string;
  email: string;
  promoCode: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface Currency {
  code: string;
  symbol: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    country: 'Kenya',
    currency: 'EUR',
    email: '',
    promoCode: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [showCountryDropdown, setShowCountryDropdown] = useState<boolean>(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState<boolean>(false);

  const countries: Country[] = [
    { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
    { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
    { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'GH', name: 'Ghana', flag: '🇬🇭' }
  ];

  const currencies: Currency[] = [
    { code: 'EUR', symbol: '€' },
    { code: 'USD', symbol: '$' },
    { code: 'KES', symbol: 'KSh' },
    { code: 'UGX', symbol: 'USh' },
    { code: 'TZS', symbol: 'TSh' }
  ];

  const handleInputChange = (field: keyof FormData, value: string | boolean): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      alert('Please enter your full name');
      return false;
    }
    
    if (!formData.phoneNumber.trim()) {
      alert('Please enter your phone number');
      return false;
    }
    
    if (!formData.email.trim()) {
      alert('Please enter your email');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    
    if (!formData.password.trim()) {
      alert('Please enter a password');
      return false;
    }
    
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return false;
    }
    
    if (!formData.acceptTerms) {
      alert('Please accept the terms of use');
      return false;
    }

    return true;
  };

  const handleSubmit = (): void => {
    if (!validateForm()) {
      return;
    }

    // Submit form data
    console.log('Registration Data:', formData);
    alert('Registration successful! Check console for data.');
    
    // Here you would typically send data to your backend
    // Example:
    // try {
    //   const response = await fetch('/api/register', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    //   });
    //   const result = await response.json();
    //   // Handle success
    // } catch (error) {
    //   console.error('Registration failed:', error);
    // }
  };

  const handleCountrySelect = (country: Country): void => {
    handleInputChange('country', country.name);
    setShowCountryDropdown(false);
  };

  const handleCurrencySelect = (currency: Currency): void => {
    handleInputChange('currency', currency.code);
    setShowCurrencyDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Registration Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange('fullName', e.target.value)
                }
                placeholder="Full Name"
                className="w-full bg-gray-50 border-0 rounded-lg pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <div className="relative">
              <div className="absolute left-3 top-3 flex items-center">
                <span className="text-sm mr-2">🇰🇪</span>
                <Phone size={16} className="text-gray-400" />
              </div>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange('phoneNumber', e.target.value)
                }
                placeholder="+254 712 123456"
                className="w-full bg-gray-50 border-0 rounded-lg pl-16 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Country Dropdown */}
          <div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="w-full bg-gray-50 border-0 rounded-lg px-4 py-3 text-left text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all flex items-center justify-between"
              >
                <span>{formData.country}</span>
                <ChevronDown size={20} className="text-gray-400" />
              </button>
              
              {showCountryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                    >
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Currency Dropdown */}
          <div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="w-full bg-gray-50 border-0 rounded-lg px-4 py-3 text-left text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all flex items-center justify-between"
              >
                <span>{formData.currency}</span>
                <ChevronDown size={20} className="text-gray-400" />
              </button>
              
              {showCurrencyDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {currencies.map((currency) => (
                    <button
                      key={currency.code}
                      type="button"
                      onClick={() => handleCurrencySelect(currency)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
                    >
                      <span>{currency.code}</span>
                      <span>{currency.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange('email', e.target.value)
                }
                placeholder="Email"
                className="w-full bg-gray-50 border-0 rounded-lg pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Promo Code */}
          <div>
            <div className="relative">
              <Gift className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.promoCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange('promoCode', e.target.value)
                }
                placeholder="Promo"
                className="w-full bg-gray-50 border-0 rounded-lg pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange('password', e.target.value)
                }
                placeholder="Password"
                className="w-full bg-gray-50 border-0 rounded-lg pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange('confirmPassword', e.target.value)
                }
                placeholder="New Password Confirmation"
                className="w-full bg-gray-50 border-0 rounded-lg pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center space-x-3 py-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange('acceptTerms', e.target.checked)
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                required
              />
              <span className="ml-2 text-sm text-gray-600">
                I accept{' '}
                <a 
                  href="#" 
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  terms of use
                </a>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!formData.acceptTerms}
          >
            Sign Up
          </button>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a 
              href="#" 
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;