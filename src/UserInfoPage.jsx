import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Shield, Bell, Star, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LeftNavigationBar from './LeftNavigationBar';

const UserInfoPage = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangeName, setShowChangeName] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    if (email) {
      setUserEmail(email);
      setUserName(email.split('@')[0]);
    }
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setShowChangePassword(false);
    setMessage({ type: 'success', text: 'Password updated successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setShowChangeEmail(false);
    setMessage({ type: 'success', text: 'Email updated successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleNameChange = async (e) => {
    e.preventDefault();
    setShowChangeName(false);
    setMessage({ type: 'success', text: 'Username updated successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const Content = () => (
    <>
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200'
            : message.type === 'info'
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4 sm:space-y-6">
        {/* Account Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-base sm:text-lg font-medium text-gray-900">Account Information</h2>
          </div>
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Username</p>
                  <p className="text-sm text-gray-500">{userName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowChangeName(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Change
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Address</p>
                  <p className="text-sm text-gray-500">{userEmail}</p>
                </div>
              </div>
              <button
                onClick={() => setShowChangeEmail(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Change
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Password</p>
                  <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                </div>
              </div>
              <button
                onClick={() => setShowChangePassword(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Plan Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-base sm:text-lg font-medium text-gray-900">Plan Information</h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Current Plan</p>
                  <p className="text-sm text-gray-500">Free Beta User Plan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-base sm:text-lg font-medium text-gray-900">Privacy & Security</h2>
          </div>
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Enable
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Manage your email preferences</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Mobile View
  const MobileView = () => (
    <div className="min-h-screen bg-white overflow-y-auto">
      {/* Mobile Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-30">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <span className="text-lg font-medium text-gray-900 ml-2">Account Settings</span>
      </div>

      {/* Main Content - Scrollable */}
      <div className="pt-14 px-4 pb-6">
        <Content />
      </div>
    </div>
  );

  // Desktop View
  const DesktopView = () => (
    <div className="flex min-h-screen bg-white">
      {/* Fixed Left Navigation */}
      <div className="fixed left-0 top-0 h-full">
        <LeftNavigationBar 
          onHomeClick={() => navigate('/')}
          onProfileClick={() => navigate('/profile')}
          onArchivesClick={() => navigate('/archive')}
          onUploadClick={() => navigate('/upload')}
        />
      </div>

      {/* Main Content Container - Scrollable */}
      <div className="flex-1 ml-[70px] min-h-screen">
        <div className="h-screen overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Desktop Header */}
            <div className="mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Account Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences</p>
              </div>
              <div className="mt-4 px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded-full shadow-sm inline-block">
                PUBLIC BETA 1.1
              </div>
            </div>
            <Content />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="block sm:hidden">
        <MobileView />
      </div>
      <div className="hidden sm:block">
        <DesktopView />
      </div>
    </>
  );
};

export default UserInfoPage;