import React, { useState } from 'react';
import { userAPI } from '../../services/api.js';
import { UserPlus, TrendingUp, BarChart3, Gift, CheckCircle, ArrowRight, Eye, EyeOff, Sparkles, Zap } from 'lucide-react';

const SignUp = ({ onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    loginId: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.loginId.trim()) {
      newErrors.loginId = 'Login ID is required';
    } else if (formData.loginId.length < 3) {
      newErrors.loginId = 'Login ID must be at least 3 characters';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setErrors({});
      
      const userData = {
        name: formData.name.trim(),
        loginId: formData.loginId.trim(),
        password: formData.password
      };
      
      const response = await userAPI.createUser(userData);
      
      if (response && response.success) {
        // Show success message and redirect to login
        setErrors({ 
          general: 'Account created successfully! Redirecting to login...' 
        });
        
        // Clear form data
        setFormData({
          name: '',
          loginId: '',
          password: '',
          confirmPassword: ''
        });
        
        // Switch to login page after a short delay
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      } else {
        const errorMessage = response?.message || 'Failed to create account';
        if (errorMessage.includes('already exists')) {
          setErrors({ loginId: 'This login ID is already taken. Please choose a different one.' });
        } else {
          setErrors({ general: errorMessage });
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error.response?.data?.message?.includes('already exists')) {
        setErrors({ loginId: 'This login ID is already taken. Please choose a different one.' });
      } else {
        setErrors({ general: 'Failed to create account. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const benefits = [
    { icon: BarChart3, text: 'Track all your investments', description: 'Comprehensive portfolio tracking', color: 'from-blue-500 to-blue-600' },
    { icon: TrendingUp, text: 'Analyze performance metrics', description: 'Deep insights and analytics', color: 'from-purple-500 to-purple-600' },
    { icon: Gift, text: 'Lifetime Free', description: 'No charges, no subscriptions, free forever', color: 'from-indigo-500 to-indigo-600' },
    { icon: Zap, text: 'Real-time portfolio updates', description: 'Instant NAV and market data', color: 'from-pink-500 to-pink-600' }
  ];

  const passwordStrength = () => {
    if (!formData.password) return { strength: 0, text: '', color: '' };
    const length = formData.password.length >= 6;
    const hasUpper = /[A-Z]/.test(formData.password);
    const hasLower = /[a-z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    
    const strength = [length, hasUpper, hasLower, hasNumber].filter(Boolean).length;
    
    if (strength <= 1) return { strength: 1, text: 'Weak', color: 'bg-red-500' };
    if (strength <= 2) return { strength: 2, text: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 3) return { strength: 3, text: 'Good', color: 'bg-blue-500' };
    return { strength: 4, text: 'Strong', color: 'bg-green-500' };
  };

  const passwordInfo = passwordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="w-full max-w-5xl relative z-10">
        {/* Logo & Brand Section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300 border border-white/30">
              <img src="/Stonks.jpeg" alt="Stonks" className="w-20 h-20 rounded-lg" />
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-1 tracking-tight">
                Stonks
              </h1>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider">
                Investment Tracking Platform
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Start your investment journey today. Track, analyze, and grow your mutual fund portfolio with comprehensive insights and real-time updates.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Side - Benefits */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Why Join Stonks?</h3>
              </div>
              <div className="space-y-5">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-center space-x-4 group">
                      <div className={`w-14 h-14 bg-gradient-to-r ${benefit.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h4 className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{benefit.text}</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Signup Form */}
            <div>
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Create Account
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Start tracking your investments today
                </p>
              </div>
              
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.name 
                        ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' 
                        : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400'
                    } text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 transition-all duration-200`}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Login ID */}
                <div>
                  <label htmlFor="loginId" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Login ID
                  </label>
                  <input
                    id="loginId"
                    name="loginId"
                    type="text"
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.loginId 
                        ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' 
                        : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400'
                    } text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 transition-all duration-200`}
                    placeholder="Choose a unique login ID"
                    value={formData.loginId}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  {errors.loginId && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.loginId}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className={`w-full px-4 py-3 pr-12 rounded-xl border-2 ${
                        errors.password 
                          ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' 
                          : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400'
                      } text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 transition-all duration-200`}
                      placeholder="Create a password (min 6 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${passwordInfo.color} transition-all duration-300`}
                            style={{ width: `${(passwordInfo.strength / 4) * 100}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-semibold ${passwordInfo.color.replace('bg-', 'text-')}`}>
                          {passwordInfo.text}
                        </span>
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className={`w-full px-4 py-3 pr-12 rounded-xl border-2 ${
                        errors.confirmPassword 
                          ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400' 
                          : formData.confirmPassword && formData.password === formData.confirmPassword
                          ? 'border-green-300 dark:border-green-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500 dark:focus:ring-green-400'
                          : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400'
                      } text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 transition-all duration-200`}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                    <p className="mt-2 text-sm text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Passwords match
                    </p>
                  )}
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Success/Error Message */}
                {errors.general && (
                  <div className={`rounded-xl border-2 p-4 ${
                    errors.general.includes('successfully') 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className={`flex items-center text-sm ${
                      errors.general.includes('successfully') 
                        ? 'text-green-700' 
                        : 'text-red-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        errors.general.includes('successfully') ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      {errors.general}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Switch to Login */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 text-sm">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={onSwitchToLogin}
                      className="font-semibold text-purple-600 hover:text-pink-600 transition-colors inline-flex items-center space-x-1"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-8">
          © 2024 Stonks. Your trusted investment partner.
        </p>
      </div>
    </div>
  );
};

export default SignUp;