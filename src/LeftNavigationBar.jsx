import React, { useState, useEffect } from 'react';
import { 
  Library, 
  GraduationCap,
  Settings,
  User,
  LogIn,
  LogOut,
  Home,
  Upload
} from 'lucide-react';

const LeftNavigation = ({ onHomeClick, onProfileClick, onArchivesClick, onUploadClick }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    imageUrl: ''
  });

  const updateUserProfile = () => {
    const userEmail = localStorage.getItem('user_email');
    if (userEmail) {
      setIsLoggedIn(true);
      const username = userEmail.split('@')[0];
      const firstLetter = username.charAt(0).toUpperCase();
      // Columbia Blue (#C4D8E2)
      const columbiaBlue = '#C4D8E2';
      
      setUserProfile({
        name: username,
        imageUrl: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="141" height="141" xmlns="http://www.w3.org/2000/svg">
            <rect width="141" height="141" fill="${columbiaBlue}"/>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
                  font-family="Arial" font-size="70" fill="white">${firstLetter}</text>
          </svg>
        `)}`
      });
    }
  };

  useEffect(() => {
    updateUserProfile();
    
    window.addEventListener('user-login', updateUserProfile);
    
    return () => {
      window.removeEventListener('user-login', updateUserProfile);
    };
  }, []);

  const handleLogin = () => {
    updateUserProfile();
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    
    // Update state
    setIsLoggedIn(false);
    setUserProfile({
      name: '',
      imageUrl: ''
    });

    // Redirect to home page
    onHomeClick();
  };

  return (
    <nav className="w-[4.666667%] min-w-[70px] h-screen bg-white border-r border-[#E8E8D0] flex flex-col flex-shrink-0">
      {/* User Profile Section */}
      <div className="px-2 py-4 bg-white border-b border-[#E8E8D0] text-center">
        {isLoggedIn ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden mb-2 border-2 border-[#E8E8D0] shadow-sm">
              <img
                src={userProfile.imageUrl}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-sm font-medium text-gray-800 leading-tight truncate">
              {userProfile.name}
            </h3>
          </div>
        ) : (
          <div className="flex flex-col items-center py-2">
            <div className="w-12 h-12 rounded-full bg-[#F5F5DC] flex items-center justify-center mb-2">
              <User className="w-8 h-8 text-gray-500" />
            </div>
            <button onClick={handleLogin} className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1">
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 pt-3">
        <div className="space-y-1">
          <button onClick={onHomeClick} className="flex flex-col items-center w-full px-1 py-3 text-gray-600 rounded hover:bg-[#F5F5DC] transition-colors">
            <Home className="w-7 h-7 mb-1.5" />
            <span className="text-sm font-medium">Home</span>
          </button>

          <button onClick={onProfileClick} className="flex flex-col items-center w-full px-1 py-3 text-gray-600 rounded hover:bg-[#F5F5DC] transition-colors">
            <GraduationCap className="w-7 h-7 mb-1.5" />
            <span className="text-sm font-medium">My Profile</span>
          </button>

          <button onClick={onArchivesClick} className="flex flex-col items-center w-full px-1 py-3 text-gray-600 rounded hover:bg-[#F5F5DC] transition-colors">
            <Library className="w-7 h-7 mb-1.5" />
            <span className="text-sm font-medium">Archives</span>
          </button>

          <button onClick={onUploadClick} className="flex flex-col items-center w-full px-1 py-3 text-gray-600 rounded hover:bg-[#F5F5DC] transition-colors">
            <Upload className="w-7 h-7 mb-1.5" />
            <span className="text-sm font-medium">Upload Textbook</span>
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 border-t border-[#E8E8D0] bg-white">
        <div className="p-2 flex justify-between items-center">
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <Settings className="w-6 h-6" />
          </button>
          {isLoggedIn && (
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Logout"
            >
              <LogOut className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LeftNavigation;