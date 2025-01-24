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
import { BookOpen, ChevronRight, Brain } from 'lucide-react';

const PapurosDisplay = ({
  view,
  markdownContent,
  outlineSections,
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
  const renderSectionWriterScreen = () => (
    <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 w-full h-full min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Brain className="w-6 h-6 text-orange-600" />
            <span className="text-orange-900 font-mono">
              Here's the outline! Now working on the full explanation...
            </span>
          </div>
        </div>

        {/* Content Box - Outline Display */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-orange-100">
          <div className="space-y-6">
            {outlineSections.map((section, index) => (
              <div key={index} className="opacity-100">
                <div className="flex items-center space-x-2 text-orange-900 font-semibold mb-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-orange-400">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg">{section.section_title}</h3>
                </div>
                <div className="ml-7 space-y-2">
                  {section.learning_goals?.map((goal, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-orange-600">
                      <ChevronRight className="w-4 h-4 text-orange-400 mt-1 flex-shrink-0" />
                      <span className="text-sm">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

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
        {view === 'section_writing' && renderSectionWriterScreen()}
        {view === 'markdown' && <MarkdownViewer markdownContent={markdownContent} />}
        {view === 'profile' && <UserProfilePage />}
        {view === 'archive' && <BookshelfPage />}
        {view === 'upload' && <UploadTextbook />}
      </div>
    </div>
  );
};

export default PapurosDisplay;