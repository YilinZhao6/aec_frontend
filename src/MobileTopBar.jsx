import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  LogIn, 
  Home, 
  Library, 
  GraduationCap, 
  Upload, 
  LogOut,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileTopBar = ({ 
  onHomeClick, 
  onProfileClick, 
  onArchivesClick, 
  onUploadClick,
  onLoginClick,
  isLoggedIn,
  userName
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const MenuItem = ({ icon: Icon, label, onClick, className = '' }) => (
    <button
      onClick={() => {
        onClick();
        setIsMenuOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 w-full text-left ${className}`}
    >
      <Icon className="w-5 h-5 text-gray-600" />
      <span className="text-gray-700">{label}</span>
    </button>
  );

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      navigate('/user_info');
    } else {
      onLoginClick();
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    onHomeClick();
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30 sm:hidden">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        <span className="text-lg font-medium text-gray-900">Hyperknow</span>

        <button
          onClick={handleUserIconClick}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100"
        >
          {isLoggedIn ? (
            <span className="text-sm font-medium text-gray-700">
              {userName?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          ) : (
            <LogIn className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden">
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <span className="text-lg font-medium text-gray-900">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 py-2">
              <MenuItem icon={Home} label="Home" onClick={onHomeClick} />
              <MenuItem icon={GraduationCap} label="Profile" onClick={onProfileClick} />
              <MenuItem icon={Library} label="Archives" onClick={onArchivesClick} />
              <MenuItem icon={Upload} label="Upload" onClick={onUploadClick} />
            </div>

            {/* Info Section */}
            <div className="border-t border-gray-200 p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Join Our Community</h3>
                <a 
                  href="https://discord.com/invite/tJZJBTPJ" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Join Discord
                </a>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Contact Us/Open Positions</h3>
                <a 
                  href="mailto:contact@hyperknow.io"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  contact@hyperknow.io
                </a>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500">Version: Public Beta 1.1</span>
              </div>
            </div>

            {/* Sign Out Button - Only show when logged in */}
            {isLoggedIn && (
              <div className="border-t border-gray-200">
                <MenuItem 
                  icon={LogOut} 
                  label="Sign Out" 
                  onClick={handleSignOut}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileTopBar;