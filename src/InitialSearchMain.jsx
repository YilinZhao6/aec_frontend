import React, { useState } from 'react';
import { 
  Search,
  LogIn, 
  Sparkles,
  BookOpen, 
  Brain, 
  Atom,
  Lightbulb,
  Loader2
} from 'lucide-react';
import InitialSearchCollapseMenu from './InitialSearchCollapseMenu';

const ProcessingIndicator = () => (
  <div className="absolute -bottom-6 left-0 right-0 flex justify-center opacity-70">
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="animate-pulse">Connecting to knowledge base</span>
    </div>
  </div>
);

const InitialSearchMain = ({ onSearch, onLoginClick }) => {
  const [query, setQuery] = useState('');
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [enableWebSearch, setEnableWebSearch] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [additionalComments, setAdditionalComments] = useState('');

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
      className="group flex items-center gap-4 p-4 sm:p-6 bg-white rounded-lg border border-gray-100 
                 hover:border-gray-200 transition-all duration-300 w-full"
    >
      <div className="p-2 rounded-lg text-gray-600 group-hover:text-gray-800">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <span className="text-base sm:text-lg text-gray-600 font-medium text-left group-hover:text-gray-900">
        {text}
      </span>
    </button>
  );

  return (
    <div className="relative min-h-screen bg-white">
      {/* Login Button - Only show on desktop */}
      <div className="hidden sm:block absolute top-6 right-6 z-10">
        <button
          onClick={onLoginClick}
          className="group flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200
                   hover:border-gray-300 transition-all duration-300"
        >
          <LogIn className="w-5 h-5 text-gray-600" />
          <span className="text-gray-600">Sign In</span>
        </button>
      </div>

      {showAuthAlert && (
        <div className="fixed top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
            Please sign in to continue
          </div>
        </div>
      )}

      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6">
        <div className="w-full max-w-3xl space-y-8 sm:space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-gray-50 text-gray-600 text-xs sm:text-sm">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              AI-Powered Knowledge Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-medium text-gray-900">
              Ask anything.
              <span className="block text-gray-500 mt-2">Get comprehensive answers.</span>
            </h1>
          </div>

          {/* Search Box */}
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                className="w-full h-12 sm:h-16 pl-12 sm:pl-14 pr-14 sm:pr-16 text-lg sm:text-xl bg-gray-50 rounded-lg border border-gray-200
                         focus:outline-none focus:border-gray-300 transition-all duration-300"
                placeholder="Ask anything..."
                value={query}
                onChange={handleQueryChange}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              <button
                onClick={handleSearch}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-gray-900 text-white rounded-lg
                         hover:bg-gray-800 transition-colors duration-300"
              >
                <Search className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            {isTyping && <ProcessingIndicator />}
          </div>

          <InitialSearchCollapseMenu
            showAdditionalInputs={showAdditionalInputs}
            setShowAdditionalInputs={setShowAdditionalInputs}
            selectedBooks={selectedBooks}
            setSelectedBooks={setSelectedBooks}
            enableWebSearch={enableWebSearch}
            setEnableWebSearch={setEnableWebSearch}
            additionalComments={additionalComments}
            setAdditionalComments={setAdditionalComments}
          />

          {/* Suggestion Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <SuggestionCard
              icon={Atom}
              text="Tell me about Quantum Entanglement"
              onClick={() => {
                setQuery("Tell me about Quantum Entanglement");
                setShowAdditionalInputs(true);
              }}
            />
            <SuggestionCard
              icon={Brain}
              text="What are Moore Diagrams"
              onClick={() => {
                setQuery("What are Moore Diagrams");
                setShowAdditionalInputs(true);
              }}
            />
            <SuggestionCard
              icon={Lightbulb}
              text="I want to learn more about Orbital Motion"
              onClick={() => {
                setQuery("I want to learn more about Orbital Motion");
                setShowAdditionalInputs(true);
              }}
            />
            <SuggestionCard
              icon={BookOpen}
              text="Explain Neural Networks"
              onClick={() => {
                setQuery("Explain Neural Networks");
                setShowAdditionalInputs(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialSearchMain;