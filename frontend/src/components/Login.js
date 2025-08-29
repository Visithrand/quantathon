import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Auth.css';
import { Brain, Play, EyeOff, Eye, Loader, User, Lock, Globe, RefreshCw, CheckCircle, DollarSign, Monitor, CreditCard, Shield, Leaf } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationClicked, setVerificationClicked] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData);
      
      if (response.data.token) {
        // Use the login function from AuthContext
        login(response.data);
        // Redirect to home page after successful login
        navigate('/home');
      } else {
        setError('Login successful but no token received');
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status === 404) {
        setError('User not found');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = () => {
    setVerificationClicked(true);
    // Simulate verification process
    setTimeout(() => setVerificationClicked(false), 2000);
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
          {/* Left Panel - Welcome & Sign Up */}
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
              <User className="w-6 h-6 text-white" />
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
                Hello! Welcome to the SpeechCoach platform
              </h1>
              
              {/* Sub-heading */}
              <p className="text-xl text-white/80 mb-8">
                Don't have an account yet?
              </p>
              
              {/* Sign Up Button */}
              <Link to="/signup">
                <button className="bg-gradient-to-r from-teal-400 to-teal-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-teal-500 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>

          {/* Right Panel - Sign In */}
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
              Sign In
            </h2>
            
            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Login or email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
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
                    placeholder="Enter your login or email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="text-xs text-gray-400 mb-2">must contain at least 8 symbols</div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
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
                <div className="text-right mt-2">
                  <a href="#" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Verification Section */}
              <div>
                <button
                  type="button"
                  onClick={handleVerification}
                  className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg border border-gray-600 hover:bg-gray-600 transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <span>Click to verify</span>
                  </div>
                  <RefreshCw className={`h-5 w-5 text-gray-400 ${verificationClicked ? 'animate-spin' : ''}`} />
                </button>
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
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>

            {/* Terms and Conditions */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-400">
                By clicking "Sign In" button, you agree to our{' '}
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

export default Login;

