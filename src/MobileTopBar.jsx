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
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useTheme, ThemeToggle } from './ThemeProvider';

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
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Fixed isActive function to correctly check the current path
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/profile' && location.pathname === '/profile') return true;
    if (path === '/archive' && location.pathname.includes('/archive')) return true;
    if (path === '/upload' && location.pathname === '/upload') return true;
    return false;
  };

  const MenuItem = ({ icon: Icon, label, onClick, path, className = '' }) => {
    return (
      <button
        onClick={() => {
          onClick();
          setIsMenuOpen(false);
        }}
        className={`flex items-center gap-3 px-4 py-3 hover:bg-[#E0E0E0] dark:hover:bg-[#2A2A30] w-full text-left text-[#121212] dark:text-white ${className}`}
      >
        <Icon className="w-5 h-5 flex-shrink-0 text-[#3A3A3A]" />
        <span className="truncate font-mono">{label}</span>
      </button>
    );
  };

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
      <div className="fixed top-0 left-0 right-0 h-14 bg-[#F0F0F0] dark:bg-cyber-dark border-b border-[#CCCCCC] dark:border-[#2A2A30] flex items-center justify-between px-4 z-30 sm:hidden transition-colors duration-300">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 hover:bg-terminal-light dark:hover:bg-cyber-gray rounded-lg"
        >
          <Menu className="w-5 h-5 text-[#3A3A3A]" />
        </button>

        <Logo size="small" />

        <div className="flex items-center gap-4">
          <ThemeToggle className="p-1.5" />
          
          <button
            onClick={handleUserIconClick}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-900 dark:bg-neon-teal"
          >
            {isLoggedIn ? (
              <span className="text-sm font-medium text-white dark:text-cyber-black">
                {userName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            ) : (
              <LogIn className="w-4 h-4 text-white dark:text-cyber-black" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden">
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-[#F0F0F0] dark:bg-cyber-dark flex flex-col transition-colors duration-300">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-[#CCCCCC] dark:border-[#2A2A30]">
              <span className="text-lg font-medium text-gray-900 dark:text-terminal-white">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-terminal-light dark:hover:bg-cyber-gray rounded-lg"
              >
                <X className="w-5 h-5 text-[#3A3A3A]" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 py-2">
              <MenuItem icon={Home} label="Home" onClick={onHomeClick} path="/" />
              <MenuItem icon={GraduationCap} label="Profile" onClick={onProfileClick} path="/profile" />
              <MenuItem icon={Library} label="Archives" onClick={onArchivesClick} path="/archive" />
              <MenuItem icon={Upload} label="Upload" onClick={onUploadClick} path="/upload" />
              
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#E0E0E0] dark:hover:bg-[#2A2A30] w-full text-left text-[#121212] dark:text-white"
              >
                <ThemeToggle className="p-0" />
                <span className="truncate font-mono">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>

            {/* Info Section */}
            <div className="border-t border-[#CCCCCC] dark:border-[#2A2A30] p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-terminal-white mb-2">Join Our Community</h3>
                <a 
                  href="https://discord.com/invite/tJZJBTPJ" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-[#3A3A3A] hover:underline"
                >
                  Join Discord
                </a>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-terminal-white mb-1">Contact Us/Open Positions</h3>
                <a 
                  href="mailto:contact@hyperknow.io"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-terminal-white"
                >
                  contact@hyperknow.io
                </a>
              </div>
              <div className="pt-2 border-t border-[#CCCCCC] dark:border-[#2A2A30]">
                <span className="text-xs text-gray-500 dark:text-gray-400">Version: Public Beta 1.1</span>
              </div>
            </div>

            {/* Sign Out Button - Only show when logged in */}
            {isLoggedIn && (
              <div className="border-t border-[#CCCCCC] dark:border-[#2A2A30]">
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