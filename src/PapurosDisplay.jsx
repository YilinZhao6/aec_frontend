import React from 'react';
import { useParams } from 'react-router-dom';
import InitialSearchMain from './InitialSearchMain';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import SourceCollectAnime from './source_collect_anime';
import OutlineGenerationScreen from './outline_loading_anime';
import MarkdownViewer from './MarkdownViewer';
import LeftNavigationBar from './LeftNavigationBar';
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
  const isLoggedIn = Boolean(localStorage.getItem('user_id'));
  const userEmail = localStorage.getItem('user_email');
  const userName = userEmail ? userEmail.split('@')[0] : '';

  return (
    <div className="flex min-h-screen bg-white">
      {/* Show sidebar only on desktop */}
      <div className="hidden sm:block fixed left-0 top-0 h-full">
        <LeftNavigationBar 
          onHomeClick={onHomeClick} 
          onProfileClick={onProfileClick} 
          onArchivesClick={onArchivesClick}
          onUploadClick={onUploadClick}
        />
      </div>

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

      <div className="flex-1 sm:ml-[70px] bg-white min-h-screen pt-14 sm:pt-0">
        {view === 'initial' && <InitialSearchMain onSearch={onSearch} onLoginClick={onLoginClick} />}
        {view === 'login' && <LoginPage onSignupClick={onSignupClick} onLoginSuccess={onLoginSuccess} />}
        {view === 'signup' && <SignupPage onBackToLogin={onBackToLogin} />}
        {view === 'source_collecting' && <SourceCollectAnime />}
        {view === 'outline_generating' && <OutlineGenerationScreen />}
        {(view === 'markdown' || conversationId) && <MarkdownViewer markdownContent={markdownContent} />}
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