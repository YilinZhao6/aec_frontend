import React, { useState, useEffect } from 'react';
import { 
  User, 
  Star, 
  ChevronLeft,
  Search,
  Home,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarTrigger } from './LeftSidebar';

const UserInfoPage = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('user_email');
    if (email) {
      setUserEmail(email);
      setUserName(email.split('@')[0]);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F0F0F0]">
      <SidebarTrigger 
        onHomeClick={() => navigate('/')}
        onProfileClick={() => navigate('/profile')}
        onArchivesClick={() => navigate('/archive')}
        onUploadClick={() => navigate('/upload')}
      />

      <div className="w-[65%] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Account Information</h1>
          <p className="text-sm text-gray-500 mt-1">Welcomt to Hyperknow!</p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Account Information */}
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

          {/* Plan Information */}
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

          {/* Version Info */}
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