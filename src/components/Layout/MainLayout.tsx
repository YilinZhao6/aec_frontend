import React, { useState, useRef, useEffect } from 'react';
import { Settings, FileText, MessageSquare, BookOpen, Home, CreditCard, Bug, Languages, User2, Sliders } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { SEARCH_PAGE_STRINGS } from '../../constants/strings';
import './MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const userEmail = localStorage.getItem('user_email');
  const userFirstName = localStorage.getItem('user_first_name');
  const userLastName = localStorage.getItem('user_last_name');
  const fullName = userFirstName && userLastName ? `${userFirstName} ${userLastName}` : t(SEARCH_PAGE_STRINGS.NAVIGATION.SIGN_IN);
  const isLoggedIn = !!localStorage.getItem('user_id');

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_first_name');
      localStorage.removeItem('user_last_name');
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageButtonRef.current && !languageButtonRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languageOptions = [
    { code: 'en', label: 'English' },
    { code: 'zh', label: '简体中文' }
  ];

  return (
    <div className="app-container">
      <nav className="side-nav">
        <div className="nav-sections">
          <div className="user-info">
            <div className="user-avatar">
              <User2 size={24} className="text-gray-600" />
            </div>
            <div className="user-details">
              <h3 className="user-name">{fullName}</h3>
              <p className="user-email">{userEmail || 'hyperknow.io'}</p>
            </div>
          </div>

          <div className="nav-section nav-section-main">
            <Link to="/" className="nav-link"><Home size={20} /> {t(SEARCH_PAGE_STRINGS.NAVIGATION.HOME)}</Link>
            <Link to="/notes" className="nav-link"><FileText size={20} /> {t(SEARCH_PAGE_STRINGS.NAVIGATION.NOTES)}</Link>
            <Link to="/explanations" className="nav-link"><MessageSquare size={20} /> {t(SEARCH_PAGE_STRINGS.NAVIGATION.EXPLANATIONS)}</Link>
            <Link to="/reference-books" className="nav-link"><BookOpen size={20} /> {t(SEARCH_PAGE_STRINGS.NAVIGATION.REFERENCE_BOOKS)}</Link>
            <Link to="/preferences" className="nav-link"><Sliders size={20} /> {t(SEARCH_PAGE_STRINGS.NAVIGATION.PREFERENCES)}</Link>
          </div>
          
          <div className="nav-section nav-section-bottom">
            <Link to="/subscription" className="nav-link"><CreditCard size={20} /> {t(SEARCH_PAGE_STRINGS.NAVIGATION.SUBSCRIPTION)}</Link>
            <Link to="/account-settings" className="nav-link"><Settings size={20} /> {t(SEARCH_PAGE_STRINGS.NAVIGATION.ACCOUNT_SETTINGS)}</Link>
            <Link to="/report-bug" className="nav-link"><Bug size={20} /> {t(SEARCH_PAGE_STRINGS.NAVIGATION.REPORT_BUG)}</Link>
            <Link to="/community" className="nav-link"><MessageSquare size={20} /> {t(SEARCH_PAGE_STRINGS.NAVIGATION.COMMUNITY_CHANNELS)}</Link>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <header className="top-header">
          <div className="header-actions">
            <div className="relative" ref={languageButtonRef}>
              <button 
                className="language-button"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                <Languages size={20} />
                <span className="current-language">{language === 'en' ? 'EN' : '中文'}</span>
              </button>

              {showLanguageDropdown && (
                <div className="language-dropdown">
                  {languageOptions.map((option) => (
                    <div
                      key={option.code}
                      className={`language-option ${language === option.code ? 'active' : ''}`}
                      onClick={() => {
                        setLanguage(option.code as 'en' | 'zh');
                        setShowLanguageDropdown(false);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              className="sign-in-button"
              onClick={handleAuthClick}
            >
              {isLoggedIn ? t(SEARCH_PAGE_STRINGS.NAVIGATION.SIGN_OUT) : t(SEARCH_PAGE_STRINGS.NAVIGATION.SIGN_IN)}
            </button>
          </div>
        </header>

        <div className="white-container">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;