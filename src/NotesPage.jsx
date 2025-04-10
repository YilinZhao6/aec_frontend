import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search,
  Folder,
  FileText,
  Edit2,
  Trash2,
  Plus,
  Home,
  LogIn
} from 'lucide-react';
import { SidebarTrigger } from './LeftSidebar';
import MobileMenuDrawer from './MobileMenuDrawer';
import * as NotesAPI from './api';

const NotesPage = () => {
  // ... your existing state declarations ...

  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('user_id'));

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
        {/* Rest of your existing NotesPage content */}
        {/* ... */}
      </div>
    </div>
  );
};

export default NotesPage;