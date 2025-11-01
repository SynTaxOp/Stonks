import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api.js';
import { LogIn, TrendingUp, BarChart3, Gift, Zap, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    loginId: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if user was redirected from signup
    const urlParams = new URLSearchParams(window.location.search);
    const fromSignup = urlParams.get('fromSignup');
    if (fromSignup === 'true') {
      setSuccessMessage('Account created successfully! Please login with your credentials.');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.loginId.trim()) {
      newErrors.loginId = 'Login ID is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
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
      
      const response = await userAPI.login(formData);
      
      if (response) {
        onLogin(response);
      } else {
        setErrors({ general: 'Invalid login credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Login failed. Please try again.' });
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
    
    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const features = [
    { icon: BarChart3, text: 'Track Performance', color: 'from-blue-500 to-blue-600' },
    { icon: TrendingUp, text: 'Portfolio Analytics', color: 'from-purple-500 to-purple-600' },
    { icon: Gift, text: 'Lifetime Free', color: 'from-indigo-500 to-indigo-600' },
    { icon: Zap, text: 'Real-time Updates', color: 'from-pink-500 to-pink-600' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Logo & Brand Section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300 border border-white/30">
              <img src="/Stonks.jpeg" alt="Stonks" className="w-20 h-20 rounded-lg" />
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1 tracking-tight">
                Stonks
              </h1>
              <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider">
                Investment Tracking Platform
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Your comprehensive solution for tracking mutual fund investments, analyzing performance, and making informed financial decisions.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Side - Features */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Why Choose Stonks?</h3>
              </div>
              <div className="space-y-5">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center space-x-4 group">
                      <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h4 className="text-gray-900 dark:text-gray-100 font-semibold text-lg">{feature.text}</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          {feature.text === 'Track Performance' && 'Monitor your investment returns in real-time'}
                          {feature.text === 'Portfolio Analytics' && 'Deep insights into your portfolio performance'}
                          {feature.text === 'Lifetime Free' && 'No charges, no subscriptions, free forever'}
                          {feature.text === 'Real-time Updates' && 'Instant updates on NAV and market changes'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div>
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <LogIn className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Welcome Back
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Sign in to access your investment dashboard
                </p>
              </div>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
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
                        : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400'
                    } text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 transition-all duration-200`}
                    placeholder="Enter your login ID"
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
                          : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400'
                      } text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 transition-all duration-200`}
                      placeholder="Enter your password"
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
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="rounded-xl bg-green-50 border-2 border-green-200 p-4">
                    <div className="flex items-center text-sm text-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {successMessage}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {errors.general && (
                  <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4">
                    <div className="flex items-center text-sm text-red-700">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      {errors.general}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Switch to Signup */}
                <div className="text-center pt-4">
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={onSwitchToSignup}
                      className="font-semibold text-blue-600 hover:text-purple-600 transition-colors inline-flex items-center space-x-1"
                    >
                      <span>Create Account</span>
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

export default Login;