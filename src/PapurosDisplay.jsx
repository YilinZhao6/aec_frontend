import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import InitialSearchMain from './Initial_Search/InitialSearchMain';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import SourceCollectAnime from './source_collect_anime';
import OutlineGenerationScreen from './outline_loading_anime';
import { MarkdownViewer, ArchiveMarkdownViewer } from './MarkdownViewer/index.js';
import MobileTopBar from './MobileTopBar';
import UserProfilePage from './UserProfilePage';
import BookshelfPage from './BookShelfPage';
import UploadTextbook from './UploadTextbook';
import WelcomeModal from './WelcomeModal.jsx';

const PapurosDisplay = ({
  view,
  markdownContent,
  onSearch,
  onLoginSuccess,
  onHomeClick,
  onProfileClick,
  onArchivesClick,
  onUploadClick,
  onLoginClick,
  onSignupClick,
  onBackToLogin,
  showWelcomeModal,
  setShowWelcomeModal
}) => {
  const { conversationId } = useParams();
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem('user_id'));
  const userEmail = localStorage.getItem('user_email');
  const userName = userEmail ? userEmail.split('@')[0] : '';
  const userId = localStorage.getItem('user_id');

  // Determine if we're in archive view
  const isArchiveView = location.pathname.includes('/archive/paper/');
  
  // Only show the initial search page with the collapsible sidebar
  if (view === 'initial') {
    return (
      <InitialSearchMain 
        onSearch={onSearch} 
        onLoginClick={onLoginClick}
        onHomeClick={onHomeClick}
        onProfileClick={onProfileClick}
        onArchivesClick={onArchivesClick}
        onUploadClick={onUploadClick}
      />
    );
  }

  // For login and signup views, don't show the sidebar
  if (view === 'login') {
    return <LoginPage onSignupClick={onSignupClick} onLoginSuccess={onLoginSuccess} />;
  }
  
  if (view === 'signup') {
    return <SignupPage onBackToLogin={onBackToLogin} />;
  }

  // For animation views, show the appropriate animation
  if (view === 'source_collecting') {
    return <SourceCollectAnime />;
  }

  if (view === 'outline_generating') {
    return <OutlineGenerationScreen />;
  }

  return (
    <div className="relative min-h-screen bg-[#F0F0F0] dark:bg-cyber-black transition-colors duration-300">
      {/* Show top bar only on mobile */}
      <MobileTopBar
        onHomeClick={onHomeClick}
        onProfileClick={onProfileClick}
        onArchivesClick={onArchivesClick}
        onUploadClick={onUploadClick}
        onLoginClick={onLoginClick}
        isLoggedIn={isLoggedIn}
        userName={userName}
      />

      <div className="flex-1 sm:ml-0 bg-[#F0F0F0] dark:bg-cyber-black min-h-screen pt-14 sm:pt-0">
        {view === 'markdown' && !isArchiveView && conversationId && <MarkdownViewer markdownContent={markdownContent} />}
        {isArchiveView && conversationId && <ArchiveMarkdownViewer userId={userId} conversationId={conversationId} />}
        {view === 'profile' && (
          <>
            <UserProfilePage />
            {showWelcomeModal && (
              <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
            )}
          </>
        )}
        {view === 'archive' && !conversationId && <BookshelfPage />}
        {view === 'upload' && <UploadTextbook />}
      </div>
    </div>
  );
};

export default PapurosDisplay;