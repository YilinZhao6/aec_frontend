import React, { useState, useEffect } from 'react';
import { 
  User, 
  Star,
  LogIn
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from './LeftSidebar';
import MobileMenuDrawer from './MobileMenuDrawer';

const UserInfoPage = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('user_id'));

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    if (email) {
      setUserEmail(email);
      setUserName(email.split('@')[0]);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    navigate('/');
  };

  return (
    <div className="relative min-h-screen bg-[#F0F0F0]">
      {/* Show SidebarTrigger only on desktop */}
      <div className="hidden sm:block">
        <SidebarTrigger 
          onHomeClick={() => navigate('/')}
          onProfileClick={() => navigate('/profile')}
          onArchivesClick={() => navigate('/archive')}
          onUploadClick={() => navigate('/upload')}
        />
      </div>

      {/* Show MobileMenuDrawer only on mobile */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <MobileMenuDrawer 
          isLoggedIn={isLoggedIn}
          onHomeClick={() => navigate('/')}
          onProfileClick={() => navigate('/profile')}
          onArchivesClick={() => navigate('/archive')}
          onUploadClick={() => navigate('/upload')}
          onSignOut={handleSignOut}
          onLoginClick={() => navigate('/login')}
        />
      </div>

      {/* Sign In Button - visible on mobile */}
      {!isLoggedIn && (
        <div className="sm:hidden fixed top-4 right-4 z-30">
          <button
            onClick={() => navigate('/login')}
            className="cyber-button bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2"
          >
            <LogIn className="w-5 h-5 text-white" />
            <span className="text-white">Sign In</span>
          </button>
        </div>
      )}

      <div className="w-[65%] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Account Information</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome to Hyperknow!</p>
        </div>

        <div className="space-y-6">
          <div className="bg-[#EEEEEE] rounded-lg border border-[#CCCCCC] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#CCCCCC] bg-[#E5E5E5]">
              <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Username</p>
                  <p className="text-sm text-gray-500">{userName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Address</p>
                  <p className="text-sm text-gray-500">{userEmail}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#EEEEEE] rounded-lg border border-[#CCCCCC] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#CCCCCC] bg-[#E5E5E5]">
              <h2 className="text-lg font-medium text-gray-900">Plan Information</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Current Plan</p>
                  <p className="text-sm text-gray-500">Internal Testing Premium Plan</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <span className="inline-block px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded-full shadow-sm">
              PUBLIC BETA 2.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoPage;