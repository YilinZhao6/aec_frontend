import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  Library, 
  GraduationCap,
  Info,
  User,
  LogIn,
  LogOut,
  Home,
  Upload,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InfoDialog = ({ onClose, buttonRect }) => {
  if (!buttonRect) return null;

  // Calculate position relative to the button, but offset upward
  const dialogStyle = {
    position: 'fixed',
    left: `${buttonRect.right + 8}px`,
    top: `${buttonRect.top - 180}px`, // Moved up by adjusting this value
  };

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 z-[9999]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4"
        style={dialogStyle}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">Join Our Community</h3>
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
      </div>
    </div>,
    document.body
  );
};

const LeftNavigationBar = ({ onHomeClick, onProfileClick, onArchivesClick, onUploadClick }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '',
    imageUrl: ''
  });
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [infoButtonRect, setInfoButtonRect] = useState(null);
  const infoButtonRef = React.useRef(null);
  const navigate = useNavigate();

  const updateUserProfile = () => {
    const userEmail = localStorage.getItem('user_email');
    if (userEmail) {
      setIsLoggedIn(true);
      const username = userEmail.split('@')[0];
      const firstLetter = username.charAt(0).toUpperCase();
      
      setUserProfile({
        name: username,
        imageUrl: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="141" height="141" xmlns="http://www.w3.org/2000/svg">
            <rect width="141" height="141" fill="#f3f4f6"/>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
                  font-family="Arial" font-size="70" fill="#374151">${firstLetter}</text>
          </svg>
        `)}`
      });
    }
  };

  useEffect(() => {
    updateUserProfile();
    window.addEventListener('user-login', updateUserProfile);
    return () => window.removeEventListener('user-login', updateUserProfile);
  }, []);

  const handleInfoClick = () => {
    if (infoButtonRef.current) {
      setInfoButtonRect(infoButtonRef.current.getBoundingClientRect());
    }
    setShowInfoDialog(!showInfoDialog);
  };

  const handleLogin = () => {
    updateUserProfile();
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    setIsLoggedIn(false);
    setUserProfile({
      name: '',
      imageUrl: ''
    });
    onHomeClick();
  };

  const NavButton = ({ icon: Icon, label, onClick }) => (
    <button 
      onClick={onClick}
      className="group flex flex-col items-center w-full px-1 py-3 text-gray-500 
                 hover:text-gray-900 transition-all duration-300"
    >
      <Icon className="w-5 h-5 mb-1" />
      <span className="text-xs">{label}</span>
    </button>
  );

  return (
    <nav className="w-16 h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      {/* User Profile */}
      <div className="px-2 py-4 text-center border-b border-gray-100 flex-shrink-0">
        {isLoggedIn ? (
          <div 
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/user_info')}
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden mb-1">
              <img
                src={userProfile.imageUrl}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xs text-gray-600 truncate">
              {userProfile.name}
            </h3>
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-gray-900"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-1">
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs">Sign In</span>
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-2 py-4 space-y-4">
        <NavButton icon={Home} label="Home" onClick={onHomeClick} />
        <NavButton icon={GraduationCap} label="Profile" onClick={onProfileClick} />
        <NavButton icon={Library} label="Archives" onClick={onArchivesClick} />
        <NavButton icon={Upload} label="Upload" onClick={onUploadClick} />
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <button 
            ref={infoButtonRef}
            onClick={handleInfoClick}
            className="text-gray-500 hover:text-gray-900"
          >
            <Info className="w-5 h-5" />
          </button>
          {showInfoDialog && (
            <InfoDialog 
              onClose={() => setShowInfoDialog(false)} 
              buttonRect={infoButtonRect}
            />
          )}
          {isLoggedIn && (
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-900"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LeftNavigationBar;