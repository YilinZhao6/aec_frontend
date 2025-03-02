import React, { useState, useEffect } from 'react';
import { LogIn, Mail, Lock } from 'lucide-react';

const LoginPage = ({ onSignupClick, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    let countdownInterval;
    if (countdown !== null && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdownInterval);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      checkUserProfile();
    }
  }, [countdown]);

  const checkUserProfile = async () => {
    const userId = localStorage.getItem('user_id');
    try {
      const response = await fetch(`https://backend-ai-cloud-explains.onrender.com/get_user_profile?user_id=${userId}`);
      
      const data = await response.json();

      // Dispatch login event first
      window.dispatchEvent(new Event('user-login'));

      if (response.ok && data.preferences) {
        // Profile exists, go to home page
        onLoginSuccess(userId, false);
      } else {
        // No profile or error, redirect to profile page
        onLoginSuccess(userId, true);
      }
    } catch (err) {
      console.error('Error checking user profile:', err);
      // In case of error, go to home page as fallback
      window.dispatchEvent(new Event('user-login'));
      onLoginSuccess(userId, false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://backend-ai-cloud-explains.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user_id) {
        localStorage.setItem('user_id', data.user_id.toString());
        localStorage.setItem('user_email', email);
        setMessage({ 
          type: 'success', 
          text: 'Logged in successfully! Redirecting in 3s'
        });
        setCountdown(3);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Invalid credentials'
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage({ 
        type: 'error', 
        text: 'Server error. Please try again later.'
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      <div className="relative flex flex-col items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="mt-2 text-gray-600">Sign in to continue your learning journey</p>
            </div>

            {message.text && (
              <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
                message.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.text}
                {countdown && message.type === 'success' && (
                  <span className="ml-1">({countdown})</span>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <a href="#" className="text-sm text-gray-900 hover:text-gray-700 block">
                Forgot your password?
              </a>
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={onSignupClick}
                  className="text-gray-900 hover:text-gray-700 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;