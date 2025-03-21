import React, { useState, useEffect } from 'react';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from './LeftSidebar';

const LoginPage = ({ onSignupClick, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [countdown, setCountdown] = useState(null);
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      setIsGoogleScriptLoaded(true);
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (!window.google || !document.getElementById('google-signin')) return;

      try {
        window.google.accounts.id.initialize({
          client_id: '976750923806-crklchaijhc9avntdmbcjnmf9eame6hs.apps.googleusercontent.com',
          callback: handleGoogleResponse
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin'),
          { 
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: '100%'
          }
        );
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
      }
    };

    // Initialize when both script is loaded and component is mounted
    if (isGoogleScriptLoaded) {
      // Add a small delay to ensure DOM is ready
      setTimeout(initializeGoogleSignIn, 100);
    }
  }, [isGoogleScriptLoaded]);

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

  const handleGoogleResponse = async (response) => {
    try {
      const result = await fetch('https://backend-ai-cloud-explains.onrender.com/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: response.credential })
      });

      const data = await result.json();

      if (result.ok && data.user_id) {
        localStorage.setItem('user_id', data.user_id.toString());
        localStorage.setItem('user_email', data.email);
        setMessage({ 
          type: 'success', 
          text: 'Logged in successfully! Redirecting in 3s'
        });
        setCountdown(3);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Google authentication failed'
        });
      }
    } catch (err) {
      console.error('Google auth error:', err);
      setMessage({ 
        type: 'error', 
        text: 'Server error during Google authentication'
      });
    }
  };

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
    <div className="relative min-h-screen bg-[#F0F0F0]">
      <SidebarTrigger 
        onHomeClick={() => navigate('/')}
        onProfileClick={() => navigate('/profile')}
        onArchivesClick={() => navigate('/archive')}
        onUploadClick={() => navigate('/upload')}
      />
      
      <div className="relative flex flex-col items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md">
          <div className="cyber-card p-8 bg-white">
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
                    className="cyber-input w-full pl-10 pr-4 py-3"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="w-5 h-5 text-[#3A3A3A] absolute left-3 top-1/2 -translate-y-1/2" />
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
                    className="cyber-input w-full pl-10 pr-4 py-3"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock className="w-5 h-5 text-[#3A3A3A] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                className="cyber-button w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  OR
                </span>
              </div>
            </div>

            {/* Google Sign-In Button Container */}
            <div id="google-signin" className="w-full flex justify-center mb-6"></div>

            <div className="mt-6 text-center space-y-4">
              <a href="#" className="text-sm text-gray-900 hover:underline block">
                Forgot your password?
              </a>
              <p className="text-sm text-gray-900">
                Don't have an account?{' '}
                <button
                  onClick={onSignupClick}
                  className="text-gray-900 hover:underline font-medium"
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