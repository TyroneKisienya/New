"use client"

import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// TypeScript interfaces
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginPageProps {
  onClose?: () => void;
  onSwitchToRegister?: () => void;
  onSwitchToForgotPassword?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ 
  onClose, 
  onSwitchToRegister, 
  onSwitchToForgotPassword 
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      console.log('Login Data:', formData);
      
      // Here you would typically send data to your backend
      // Example:
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     email: formData.email,
      //     password: formData.password,
      //     rememberMe: formData.rememberMe
      //   })
      // });
      // 
      // const result = await response.json();
      // 
      // if (response.ok) {
      //   // Handle successful login
      //   localStorage.setItem('token', result.token);
      //   window.location.href = '/dashboard';
      // } else {
      //   // Handle login error
      //   alert(result.message || 'Login failed');
      // }
      
      // For demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Login successful! Check console for data.');
      
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Login Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Log In</h2>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Email Field */}
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange('email', e.target.value)
                }
                onKeyPress={handleKeyPress}
                placeholder="Email"
                className={`w-full bg-gray-50 border-0 rounded-lg pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:outline-none transition-all ${
                  errors.email ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-blue-500'
                }`}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange('password', e.target.value)
                }
                onKeyPress={handleKeyPress}
                placeholder="Password"
                className={`w-full bg-gray-50 border-0 rounded-lg pl-10 pr-12 py-3 text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:outline-none transition-all ${
                  errors.password ? 'focus:ring-red-500 ring-2 ring-red-500' : 'focus:ring-blue-500'
                }`}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between py-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  handleInputChange('rememberMe', e.target.checked)
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                disabled={isLoading}
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            
            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
              disabled={isLoading}
            >
              Forgot your password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Logging in...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </div>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Ещё нет аккаунта?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              disabled={isLoading}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;