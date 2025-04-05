import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from './LeftSidebar';

const SignupPage = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.email !== formData.confirmEmail) {
      showMessage('error', 'Emails do not match!');
      return;
    }

    try {
      const response = await fetch('https://backend-ai-cloud-explains.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', 'Account created successfully!');
        setTimeout(() => onBackToLogin(), 1500);
      } else {
        showMessage('error', data.error || 'Registration failed');
      }
    } catch (err) {
      showMessage('error', 'Server error. Please try again later.');
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
              <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
              <p className="mt-2 text-gray-600">Join us to start your learning journey</p>
            </div>

            {message.text && (
              <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
                message.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      name="firstName"
                      type="text"
                      required
                      className="cyber-input w-full pl-10 pr-4 py-3"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    <User className="w-5 h-5 text-[#3A3A3A] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      name="lastName"
                      type="text"
                      required
                      className="cyber-input w-full pl-10 pr-4 py-3"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    <User className="w-5 h-5 text-[#3A3A3A] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    required
                    className="cyber-input w-full pl-10 pr-4 py-3"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <Mail className="w-5 h-5 text-[#3A3A3A] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Email
                </label>
                <div className="relative">
                  <input
                    name="confirmEmail"
                    type="email"
                    required
                    className="cyber-input w-full pl-10 pr-4 py-3"
                    placeholder="Confirm your email"
                    value={formData.confirmEmail}
                    onChange={handleChange}
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
                    name="password"
                    type="password"
                    required
                    className="cyber-input w-full pl-10 pr-4 py-3"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Lock className="w-5 h-5 text-[#3A3A3A] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                className="cyber-button w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                <UserPlus className="w-5 h-5" />
                <span>Create Account</span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-900">
                Already have an account?{' '}
                <button
                  onClick={onBackToLogin}
                  className="text-gray-900 hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;