import React, { useState } from 'react';
import { 
  ArrowUpCircle, 
  LogIn, 
  Beaker, 
  BookOpen, 
  Brain, 
  Atom,
  FlaskConical,
  TestTubes,
  Cpu,
  CircuitBoard,
  Microscope,
  Rocket,
  Dna
} from 'lucide-react';
import InitialSearchCollapseMenu from './InitialSearchCollapseMenu';

const BackgroundIcons = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0">
        <div className="grid grid-cols-8 gap-12 p-8">
          {Array(64).fill(null).map((_, idx) => (
            <div key={idx} className="flex items-center justify-center opacity-[0.15]">
              {idx % 8 === 0 && <Atom className="w-24 h-24 text-blue-300" />}
              {idx % 8 === 1 && <FlaskConical className="w-24 h-24 text-purple-300" />}
              {idx % 8 === 2 && <TestTubes className="w-24 h-24 text-indigo-300" />}
              {idx % 8 === 3 && <Cpu className="w-24 h-24 text-violet-300" />}
              {idx % 8 === 4 && <CircuitBoard className="w-24 h-24 text-blue-300" />}
              {idx % 8 === 5 && <Microscope className="w-24 h-24 text-purple-300" />}
              {idx % 8 === 6 && <Rocket className="w-24 h-24 text-indigo-300" />}
              {idx % 8 === 7 && <Dna className="w-24 h-24 text-violet-300" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SuggestionCard = ({ icon, text, color, onClick }) => {
  const colorClasses = {
    blue: 'hover:bg-blue-50 hover:border-blue-200 [&_svg]:text-blue-600',
    indigo: 'hover:bg-indigo-50 hover:border-indigo-200 [&_svg]:text-indigo-600',
    purple: 'hover:bg-purple-50 hover:border-purple-200 [&_svg]:text-purple-600',
    violet: 'hover:bg-violet-50 hover:border-violet-200 [&_svg]:text-violet-600',
  };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group ${colorClasses[color]}`}
    >
      <div className="p-2 rounded-lg">
        {icon}
      </div>
      <span className="text-lg text-gray-700 font-medium text-left group-hover:text-gray-900">
        {text}
      </span>
    </button>
  );
};

const InitialSearchMain = ({ onSearch, onLoginClick }) => {
  const [query, setQuery] = useState('');
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [enableWebSearch, setEnableWebSearch] = useState(true);

  const handleSearch = () => {
    const userId = localStorage.getItem('user_id');
    
    if (!userId) {
      setShowAuthAlert(true);
      setTimeout(() => setShowAuthAlert(false), 3000);
      return;
    }

    if (query.trim() !== '') {
      const bookIdsString = selectedBooks.join('///');
      onSearch(query, bookIdsString, enableWebSearch);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 overflow-y-auto">
      <BackgroundIcons />
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-top" />

      {/* Login Button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={onLoginClick}
          className="group flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <LogIn className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-gray-700 font-medium">Sign In</span>
        </button>
      </div>

      {/* Auth Alert */}
      {showAuthAlert && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-lg shadow-lg">
            Please sign in to continue
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-4xl space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight sm:text-6xl">
              Nothing in life is to be feared,
              <span className="block text-blue-600">it is only to be understood.</span>
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              - Marie Curie
            </p>
          </div>

          {/* Search Box */}
          <div className="relative mx-auto max-w-3xl">
            <div className="relative">
              <input
                type="text"
                className="w-full h-16 pl-6 pr-16 text-xl text-gray-900 bg-white rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-shadow duration-300"
                placeholder="Ask anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300"
              >
                <ArrowUpCircle className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Collapsible Menu */}
          <InitialSearchCollapseMenu
            showAdditionalInputs={showAdditionalInputs}
            setShowAdditionalInputs={setShowAdditionalInputs}
            selectedBooks={selectedBooks}
            setSelectedBooks={setSelectedBooks}
            enableWebSearch={enableWebSearch}
            setEnableWebSearch={setEnableWebSearch}
          />

          {/* Suggestion Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SuggestionCard
              icon={<Atom />}
              text="Tell me about Quantum Entanglement"
              color="blue"
              onClick={() => {
                setQuery("Tell me about Quantum Entanglement");
                setShowAdditionalInputs(true);
              }}
            />
            <SuggestionCard
              icon={<Brain />}
              text="What are Moore Diagrams"
              color="indigo"
              onClick={() => {
                setQuery("What are Moore Diagrams");
                setShowAdditionalInputs(true);
              }}
            />
            <SuggestionCard
              icon={<Beaker />}
              text="I want to learn more about Orbital Motion"
              color="purple"
              onClick={() => {
                setQuery("I want to learn more about Orbital Motion");
                setShowAdditionalInputs(true);
              }}
            />
            <SuggestionCard
              icon={<BookOpen />}
              text="Explain Neural Networks"
              color="violet"
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