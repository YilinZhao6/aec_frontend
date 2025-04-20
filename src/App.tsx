import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import SearchPage from './pages/SearchPage';
import NotesPage from './pages/NotesPage';
import ReferenceBooksPage from './pages/ReferenceBooksPage';
import ExplanationsPage from './pages/ExplanationsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MarkdownViewer from './pages/MarkdownViewer/Desktop/MarkdownViewer';
import NoteEditor from './pages/NoteEditor';
import PreferencesPage from './pages/PreferencesPage';
import ReportBugPage from './pages/ReportBugPage';
import CommunityPage from './pages/CommunityPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import OnboardingPage from './pages/OnboardingPage';

function App() {
  useEffect(() => {
    // Mobile detection using user agent
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(navigator.userAgent);
    
    // Additional check for screen width
    const isMobileWidth = window.innerWidth <= 768;
    
    // Only redirect if we're not already on the mobile domain
    const isMobileDomain = window.location.hostname === 'mobile.hyperknow.io';
    
    if ((isMobile || isMobileWidth) && !isMobileDomain) {
      // Preserve the current path when redirecting
      const currentPath = window.location.pathname;
      const searchParams = window.location.search;
      const hash = window.location.hash;
      
      // Construct the mobile URL
      const mobileUrl = `https://mobile.hyperknow.io${currentPath}${searchParams}${hash}`;
      
      // Redirect to mobile site
      window.location.href = mobileUrl;
      return;
    }
  }, []);

  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notes/editor/:noteId" element={<NoteEditor />} />
          <Route path="/reference-books" element={<ReferenceBooksPage />} />
          <Route path="/explanations" element={<ExplanationsPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/account-settings" element={<AccountSettingsPage />} />
          <Route path="/report-bug" element={<ReportBugPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route 
            path="/markdown-viewer/:source/:userId/:conversationId" 
            element={<MarkdownViewer />} 
          />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;