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
        setCountdown((prev) => {
          if (prev <= 1) {
            // Dispatch custom event for login
            window.dispatchEvent(new Event('user-login'));

            // Call onLoginSuccess after the event dispatch
            setTimeout(() => {
              onLoginSuccess?.(localStorage.getItem('user_id'));
            }, 0);

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdownInterval);
  }, [countdown, onLoginSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
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
          text: 'Logged in successfully! Redirecting to main page in 3s'
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
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-top" />

      <div className="relative flex flex-col items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="mt-2 text-gray-600">Sign in to continue your learning journey</p>
            </div>

            {message.text && (
              <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200'
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 block">
                Forgot your password?
              </a>
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={onSignupClick}
                  className="text-blue-600 hover:text-blue-700 font-medium"
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