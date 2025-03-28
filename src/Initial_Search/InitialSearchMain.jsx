import React, { useState, useRef, useEffect } from 'react';
import { 
  Search,
  LogIn, 
  Zap,
  BookOpen, 
  Brain, 
  Atom,
  Lightbulb,
  Loader2,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchDashboard from './SearchDashboard';
import TrendingSection from './TrendingSection';
import RightSideMenu from './RightSideMenu';
import { SidebarTrigger } from '../LeftSidebar';
import './InitialSearch.css';

const ProcessingIndicator = () => (
  <div className="absolute -bottom-6 left-0 right-0 flex justify-center opacity-70">
    <div className="flex items-center gap-2 text-sm text-gray-500 font-quicksand">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="animate-pulse">Connecting to knowledge base</span>
    </div>
  </div>
);

const InitialSearchMain = ({ 
  onSearch, 
  onLoginClick,
  onHomeClick,
  onProfileClick,
  onArchivesClick,
  onUploadClick
}) => {
  const [query, setQuery] = useState('');
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [additionalComments, setAdditionalComments] = useState('');
  const [mode, setMode] = useState('normal');
  const [familiarity, setFamiliarity] = useState(2);
  const [autoFamiliarity, setAutoFamiliarity] = useState(true);
  const [showWeChatPopup, setShowWeChatPopup] = useState(false);
  const searchBoxRef = useRef(null);
  const dashboardRef = useRef(null);
  const wechatPopupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const searchBox = searchBoxRef.current;
    const dashboard = dashboardRef.current;
    
    if (!searchBox || !dashboard) return;
    
    const handleMouseEnter = () => {
      setShowDashboard(true);
    };
    
    const handleDocumentClick = (e) => {
      if (
        !searchBox.contains(e.target) && 
        !dashboard.contains(e.target)
      ) {
        setShowDashboard(false);
      }

      // Close WeChat popup when clicking outside
      if (
        wechatPopupRef.current && 
        !wechatPopupRef.current.contains(e.target) &&
        !e.target.closest('.wechat-icon')
      ) {
        setShowWeChatPopup(false);
      }
    };
    
    searchBox.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('click', handleDocumentClick);
    
    return () => {
      searchBox.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleSearch = () => {
    const userId = localStorage.getItem('user_id');
    
    if (!userId) {
      setShowAuthAlert(true);
      setTimeout(() => setShowAuthAlert(false), 3000);
      return;
    }

    if (query.trim() !== '') {
      const bookIdsString = selectedBooks.join('///');
      const comments = additionalComments.trim() || undefined;
      
      const searchParams = {
        query,
        bookIdsString,
        enableWebSearch,
        comments,
        mode,
        familiarity: autoFamiliarity ? 'auto' : familiarity
      };
      
      onSearch(query, bookIdsString, enableWebSearch, comments);
    }
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    setIsTyping(true);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => setIsTyping(false), 1000);
  };

  const SuggestionCard = ({ icon: Icon, text, onClick }) => (
    <button 
      onClick={onClick}
      className="text-box group w-full text-left"
    >
      <Icon className="icon w-6 h-6 sm:w-7 sm:h-7" />
      <span className="text-sm sm:text-base font-medium font-quicksand">
        {text}
      </span>
    </button>
  );

  return (
    <div className="relative min-h-screen bg-terminal-white transition-colors duration-300">
      <SidebarTrigger 
        onHomeClick={onHomeClick}
        onProfileClick={onProfileClick}
        onArchivesClick={onArchivesClick}
        onUploadClick={onUploadClick}
      />

      <div className="fixed top-0 right-0 left-0 h-16 flex items-center justify-end px-6 z-10 sm:pr-6 sm:pl-20">
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center bg-terminal-light px-3 py-2 rounded-lg">
            <img 
              src="/hyperknow_logo_with_text.svg" 
              alt="HyperKnow" 
              className="h-6" 
            />
          </div>
          
          <button
            onClick={onLoginClick}
            className="cyber-button hidden sm:flex bg-gray-900 text-white hover:bg-gray-800"
          >
            <LogIn className="w-5 h-5 mr-2 inline-block text-white" />
            <span className="text-white">Sign In</span>
          </button>
        </div>
      </div>

      {showAuthAlert && (
        <div className="fixed top-20 sm:top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-quicksand">
            Please sign in to continue
          </div>
        </div>
      )}

      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 pt-16">
        <div className="w-full max-w-5xl space-y-8 sm:space-y-12">
          <TrendingSection />

          <div className="text-center space-y-4 sm:space-y-6 animate-text-fade-in">
            <h1 className="text-3xl sm:text-[34px] font-medium text-gray-900 font-quicksand tracking-wide">
              Ask anything.
              <span className="block text-gray-500 mt-2 tracking-wide">Get comprehensive answers.</span>
            </h1>
          </div>

          <div className="relative animate-slide-up w-full">
            <div className="relative" ref={searchBoxRef}>
              <div className="text-box w-full h-12 sm:h-16 pl-12 sm:pl-14 pr-14 sm:pr-16">
                <Search className="icon absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  className="bg-transparent border-none outline-none w-full text-base sm:text-lg font-quicksand"
                  value={query}
                  onChange={handleQueryChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-300"
                >
                  <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>
            {isTyping && <ProcessingIndicator />}
          </div>

          <div 
            ref={dashboardRef}
            className={`transition-all duration-700 ease-in-out overflow-hidden w-full ${
              showDashboard ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <SearchDashboard
              mode={mode}
              setMode={setMode}
              familiarity={familiarity}
              setFamiliarity={setFamiliarity}
              autoFamiliarity={autoFamiliarity}
              setAutoFamiliarity={setAutoFamiliarity}
              selectedBooks={selectedBooks}
              setSelectedBooks={setSelectedBooks}
              enableWebSearch={enableWebSearch}
              setEnableWebSearch={setEnableWebSearch}
              additionalComments={additionalComments}
              setAdditionalComments={setAdditionalComments}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 animate-slide-up w-full" style={{ animationDelay: '0.1s' }}>
            <SuggestionCard
              icon={Atom}
              text="Tell me about Quantum Entanglement"
              onClick={() => {
                setQuery("Tell me about Quantum Entanglement");
                setShowDashboard(true);
              }}
            />
            <SuggestionCard
              icon={Brain}
              text="What are Moore Diagrams"
              onClick={() => {
                setQuery("What are Moore Diagrams");
                setShowDashboard(true);
              }}
            />
            <SuggestionCard
              icon={Lightbulb}
              text="I want to learn more about Orbital Motion"
              onClick={() => {
                setQuery("I want to learn more about Orbital Motion");
                setShowDashboard(true);
              }}
            />
            <SuggestionCard
              icon={BookOpen}
              text="Explain Neural Networks"
              onClick={() => {
                setQuery("Explain Neural Networks");
                setShowDashboard(true);
              }}
            />
          </div>
        </div>
      </div>

      <RightSideMenu />

      {/* WeChat Icon */}
      <div className="fixed bottom-6 left-6 z-50">
        <img 
          src="/wechat_icon.svg" 
          alt="WeChat" 
          className="wechat-icon w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setShowWeChatPopup(!showWeChatPopup)}
        />

        {/* WeChat QR Code Popup */}
        {showWeChatPopup && (
          <div 
            ref={wechatPopupRef}
            className="absolute bottom-10 left-0 bg-white rounded-lg shadow-xl p-3 border border-gray-200"
            style={{ width: '200px' }}
          >
            <button 
              onClick={() => setShowWeChatPopup(false)}
              className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
            <img 
              src="/wechat_group.jpg" 
              alt="WeChat Group" 
              className="w-full h-auto rounded-lg"
            />
            <p className="text-xs text-gray-600 text-center mt-2 font-quicksand">
              Scan to join our WeChat group
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InitialSearchMain;