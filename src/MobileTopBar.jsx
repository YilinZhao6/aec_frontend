import React from 'react';
import { LogIn, ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import MobileMenuDrawer from './MobileMenuDrawer';

const MobileTopBar = ({ 
  onHomeClick, 
  onProfileClick, 
  onArchivesClick, 
  onUploadClick,
  onLoginClick,
  isLoggedIn,
  userName
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isExplanationPage = location.pathname.includes('/paper/') || location.pathname.includes('/archive/paper/');
  const isGeneratingPage = location.pathname.includes('/search-collecting') || location.pathname.includes('/outline-generating');
  const isArchiveArticle = location.pathname.includes('/archive/paper/');

  const handleSignOut = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    onHomeClick();
  };

  const handleBackClick = () => {
    if (isArchiveArticle) {
      // For archive articles, go back to archives
      navigate('/archive');
    } else {
      // For new articles, clear data and navigate home
      localStorage.removeItem('current_article_user_id');
      localStorage.removeItem('current_article_conversation_id');
      localStorage.removeItem('conversation_id');
      navigate('/', { replace: true });
    }
  };

  if (isExplanationPage || isGeneratingPage) {
    return (
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <button
          onClick={handleBackClick}
          className="p-2 bg-[#F0F0F0] text-gray-600 rounded-lg hover:bg-[#E5E5E5] border border-[#CCCCCC]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Menu */}
      <div className="sm:hidden fixed top-4 left-4 z-50">
        <MobileMenuDrawer 
          isLoggedIn={isLoggedIn}
          onHomeClick={onHomeClick}
          onProfileClick={onProfileClick}
          onArchivesClick={onArchivesClick}
          onUploadClick={onUploadClick}
          onSignOut={handleSignOut}
          onLoginClick={onLoginClick}
        />
      </div>

      {/* Mobile Sign In Button */}
      {!isLoggedIn && (
        <div className="sm:hidden fixed top-4 right-4 z-30">
          <button
            onClick={onLoginClick}
            className="cyber-button bg-gray-900 text-white hover:bg-gray-800 flex items-center gap-2"
          >
            <LogIn className="w-5 h-5 text-white" />
            <span className="text-white">Sign In</span>
          </button>
        </div>
      )}
    </>
  );
};

export default MobileTopBar;