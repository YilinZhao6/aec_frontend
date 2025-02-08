import React from 'react';
import InitialSearchMain from './InitialSearchMain';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import SourceCollectAnime from './source_collect_anime';
import OutlineGenerationScreen from './outline_loading_anime';
import MarkdownViewer from './MarkdownViewer';
import LeftNavigationBar from './LeftNavigationBar';
import UserProfilePage from './UserProfilePage';
import BookshelfPage from './BookShelfPage';
import UploadTextbook from './UploadTextbook';

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
  onBackToLogin
}) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-full">
        <LeftNavigationBar 
          onHomeClick={onHomeClick} 
          onProfileClick={onProfileClick} 
          onArchivesClick={onArchivesClick}
          onUploadClick={onUploadClick}
        />
      </div>
      <div className="flex-1 ml-[70px]">
        {view === 'initial' && <InitialSearchMain onSearch={onSearch} onLoginClick={onLoginClick} />}
        {view === 'login' && <LoginPage onSignupClick={onSignupClick} onLoginSuccess={onLoginSuccess} />}
        {view === 'signup' && <SignupPage onBackToLogin={onBackToLogin} />}
        {view === 'source_collecting' && <SourceCollectAnime />}
        {view === 'outline_generating' && <OutlineGenerationScreen />}
        {view === 'markdown' && <MarkdownViewer markdownContent={markdownContent} />}
        {view === 'profile' && <UserProfilePage />}
        {view === 'archive' && <BookshelfPage />}
        {view === 'upload' && <UploadTextbook />}
      </div>
    </div>
  );
};

export default PapurosDisplay;