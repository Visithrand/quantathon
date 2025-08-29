import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Loader, Brain, Play, CheckCircle, Shield, Leaf, Monitor, CreditCard, DollarSign, Users, Star, Zap } from 'lucide-react';
import axios from 'axios';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    // Check if all required fields are filled
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Make API call to backend
      const response = await axios.post('http://localhost:8080/api/auth/signup', {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password
      });

      if (response.status === 200 || response.status === 201) {
        // Registration successful
        console.log('User registered successfully:', response.data);
        
        // Show success message
        alert('Registration successful! Please login with your credentials.');
        
        // Redirect to login page
        navigate('/login');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response) {
        // Server responded with error
        if (err.response.status === 409) {
          setError('User with this email already exists. Please use a different email or login.');
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('Registration failed. Please try again.');
        }
      } else if (err.request) {
        // Network error
        setError('Network error. Please check your connection and try again.');
      } else {
        // Other error
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-8 h-8 text-teal-400">
          <Shield className="w-full h-full" />
        </div>
        <div className="absolute top-40 right-32 w-6 h-6 text-teal-400">
          <Leaf className="w-full h-full" />
        </div>
        <div className="absolute bottom-32 left-32 w-8 h-8 text-teal-400">
          <Shield className="w-full h-full" />
        </div>
        <div className="absolute bottom-20 right-20 w-6 h-6 text-teal-400">
          <Leaf className="w-full h-full" />
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <div className="flex">
          {/* Left Panel - Welcome & Features */}
          <div className="w-3/5 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-12 flex flex-col justify-center items-center text-center relative overflow-hidden">
            {/* Floating Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-teal-400/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 left-10 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>
            
            {/* Clouds */}
            <div className="absolute top-16 left-16 w-16 h-16 bg-white/10 rounded-full"></div>
            <div className="absolute top-32 right-24 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-32 left-24 w-14 h-14 bg-white/10 rounded-full"></div>
            
            {/* Monitor with Form */}
            <div className="absolute bottom-16 right-16 w-48 h-32 bg-gray-700 rounded-lg border border-gray-600 p-3">
              <div className="w-full h-full bg-gray-800 rounded border border-gray-600 p-2">
                <div className="w-full h-2 bg-gray-600 rounded mb-2"></div>
                <div className="w-full h-2 bg-gray-600 rounded mb-2"></div>
                <div className="w-full h-2 bg-gray-600 rounded w-3/4"></div>
              </div>
            </div>
            
            {/* Credit Cards */}
            <div className="absolute top-24 right-20 transform rotate-12">
              <div className="w-16 h-10 bg-teal-500 rounded-lg mb-2"></div>
              <div className="w-16 h-10 bg-gray-700 rounded-lg"></div>
            </div>
            
            {/* Dollar Sign */}
            <div className="absolute top-40 right-32 w-8 h-8 text-white/60 text-2xl font-bold">$</div>
            
            {/* Person Icon */}
            <div className="absolute bottom-32 left-20 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            
            {/* Teal Leaves */}
            <div className="absolute bottom-16 left-32 w-6 h-6 text-teal-400">
              <Leaf className="w-full h-full" />
            </div>
            <div className="absolute bottom-24 right-32 w-4 h-4 text-teal-400">
              <Leaf className="w-full h-full" />
            </div>
            
            {/* Padlocks */}
            <div className="absolute bottom-8 left-16 w-6 h-6 text-teal-400">
              <Shield className="w-full h-full" />
            </div>
            <div className="absolute bottom-12 right-16 w-5 h-5 text-teal-400">
              <Shield className="w-full h-full" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center justify-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-blue-400 rounded-lg mr-3 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">SpeechCoach</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl font-bold text-white mb-4">
                Join the SpeechCoach Community
              </h1>
              
              {/* Sub-heading */}
              <p className="text-xl text-white/80 mb-8">
                Start your journey to better communication today
              </p>
              
              {/* Feature Highlights */}
              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-400/20 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-teal-400" />
                  </div>
                  <span className="text-white/90">AI-powered speech analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-400/20 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-teal-400" />
                  </div>
                  <span className="text-white/90">Real-time feedback & progress tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-400/20 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-teal-400" />
                  </div>
                  <span className="text-white/90">Personalized exercise plans</span>
                </div>
              </div>
              
              {/* Login Link */}
              <div className="text-center">
                <p className="text-white/70 mb-4">Already have an account?</p>
                <Link to="/login">
                  <button className="bg-transparent border-2 border-teal-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-400 hover:text-gray-900 transition-all duration-300">
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Panel - Sign Up Form */}
          <div className="w-2/5 bg-gray-800 p-12 flex flex-col justify-center">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-blue-400 rounded-lg mr-3 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SpeechCoach</span>
            </div>
            
            {/* Main Heading */}
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Create Account
            </h2>
            
            {/* Signup Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200"
                      placeholder="First name"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200"
                      placeholder="Last name"
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="text-xs text-gray-400 mb-2">must contain at least 6 characters</div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-teal-400 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-teal-400 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 text-teal-400 focus:ring-teal-400 border-gray-600 rounded bg-gray-700"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-300">
                    I agree to the{' '}
                    <a href="#" className="text-teal-400 hover:text-teal-300 font-medium underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-teal-400 hover:text-teal-300 font-medium underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-400 to-teal-500 text-white py-3 px-6 rounded-lg hover:from-teal-500 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2 inline" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>

            {/* Terms and Conditions */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-400">
                By clicking "Create Account" button, you agree to our{' '}
                <a href="#" className="text-teal-400 hover:text-teal-300 transition-colors underline">
                  Terms of Use
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
