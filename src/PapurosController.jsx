import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import PapurosDisplay from './PapurosDisplay';
import ConceptExplanationProvider from './ConceptExplanation';
import UserInfoPage from './UserInfoPage';
import NotesPage from './Notes/NotesPage';
import NoteEditorPage from './Notes/NoteEditorPage';

const PapurosController = () => {
  const [view, setView] = useState('initial');
  const [markdownContent, setMarkdownContent] = useState('');
  const [loadingMessages, setLoadingMessages] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem('user_id') || '');
  const [conversationId, setConversationId] = useState(localStorage.getItem('conversation_id') || '');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const navigate = useNavigate();

  const saveQuery = async (query, bookIds, enableWebSearch, additionalComments) => {
    try {
      const requestBody = {
        query,
        user_id: userId,
        book_ids: bookIds,
        websearch: enableWebSearch
      };

      if (additionalComments) {
        requestBody.additional_comments = additionalComments;
      }

      const response = await fetch('https://backend-ai-cloud-explains.onrender.com/save_query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok && data.conversation_id) {
        console.log('Conversation ID received:', data.conversation_id);
        setConversationId(data.conversation_id);
        localStorage.setItem('conversation_id', data.conversation_id);
        return data.conversation_id;
      } else {
        console.error('Failed to retrieve conversation_id:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Error in save_query:', error);
      return null;
    }
  };

  const startEventSource = (query, bookIds, enableWebSearch, newConversationId) => {
    setLoadingMessages([]);
    const eventSourceUrl = `https://backend-ai-cloud-explains.onrender.com/generate?query=${encodeURIComponent(query)}&user_id=${userId}&conversation_id=${newConversationId}&book_ids=${encodeURIComponent(bookIds)}&websearch=${enableWebSearch}`;
    console.log('Starting EventSource with URL:', eventSourceUrl);
    
    const eventSource = new EventSource(eventSourceUrl);

    eventSource.onopen = () => {
      console.log('EventSource connection established');
    };

    eventSource.onmessage = (event) => {
      const message = event.data;
      console.log('Received message:', message);
      setLoadingMessages((prevMessages) => [...prevMessages, message]);

      if (message.includes(`Starting OpenAI web search for user '${userId}' in conversation '${newConversationId}'`)) {
        console.log('Switching to source collection view');
        setView('source_collecting');
        navigate('/search-collecting');
      } 
      else if (message.includes(`Starting Outline generation for user '${userId}' in conversation '${newConversationId}'`)) {
        console.log('Switching to outline generation view');
        setView('outline_generating');
        navigate('/outline-generating');
      }
      else if (message.includes(`Starting Article writing for user '${userId}' in conversation '${newConversationId}'`)) {
        console.log('Switching to markdown view');
        setView('markdown');
        setMarkdownContent('');
        navigate(`/paper/${newConversationId}`);
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      eventSource.close();
    };
  };

  const handleSearch = async (query, bookIds, enableWebSearch, additionalComments) => {
    console.log('Search query:', query);
    console.log('Book IDs:', bookIds);
    console.log('Web Search enabled:', enableWebSearch);
    console.log('Additional Comments:', additionalComments);

    const newConversationId = await saveQuery(query, bookIds, enableWebSearch, additionalComments);
    if (!newConversationId) {
      console.error('Failed to save query');
      return;
    }

    console.log('Starting generation with conversation ID:', newConversationId);
    startEventSource(query, bookIds, enableWebSearch, newConversationId);
  };

  const handleLoginSuccess = (user_id, needsProfile = false) => {
    console.log('Login Success Handler called with user_id:', user_id);
    setUserId(user_id);
    localStorage.setItem('user_id', user_id);
    
    if (needsProfile) {
      setShowWelcomeModal(true);
      setView('profile');
      navigate('/profile');
    } else {
      setView('initial');
      navigate('/');
    }
  };

  const handleHomeClick = () => {
    localStorage.removeItem('current_article_user_id');
    localStorage.removeItem('current_article_conversation_id');
    localStorage.removeItem('conversation_id');
    setView('initial');
    navigate('/', { replace: true });
  };
  
  const handleProfileClick = () => {
    setView('profile');
    navigate('/profile');
  };
  
  const handleArchivesClick = () => {
    setView('archive');
    navigate('/archive');
  };
  
  const handleUploadClick = () => {
    setView('upload');
    navigate('/upload');
  };
  
  const handleLoginClick = () => {
    setView('login');
    navigate('/login');
  };
  
  const handleSignupClick = () => {
    setView('signup');
    navigate('/signup');
  };

  return (
    <ConceptExplanationProvider>
      <Routes>
        {/* Home route */}
        <Route path="/" element={
          <PapurosDisplay
            view="initial"
            markdownContent={markdownContent}
            onSearch={handleSearch}
            onLoginSuccess={handleLoginSuccess}
            onHomeClick={handleHomeClick}
            onProfileClick={handleProfileClick}
            onArchivesClick={handleArchivesClick}
            onUploadClick={handleUploadClick}
            onLoginClick={handleLoginClick}
            onSignupClick={handleSignupClick}
            onBackToLogin={() => {
              setView('login');
              navigate('/login');
            }}
            showWelcomeModal={showWelcomeModal}
            setShowWelcomeModal={setShowWelcomeModal}
          />
        } />

        {/* User info page */}
        <Route path="/user_info" element={<UserInfoPage />} />

        {/* Notes routes */}
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/:noteId" element={<NoteEditorPage />} />

        {/* Archive paper route */}
        <Route path="/archive/paper/:conversationId" element={
          <PapurosDisplay
            view="markdown"
            markdownContent={markdownContent}
            onSearch={handleSearch}
            onLoginSuccess={handleLoginSuccess}
            onHomeClick={handleHomeClick}
            onProfileClick={handleProfileClick}
            onArchivesClick={handleArchivesClick}
            onUploadClick={handleUploadClick}
            onLoginClick={handleLoginClick}
            onSignupClick={handleSignupClick}
            onBackToLogin={() => {
              setView('login');
              navigate('/login');
            }}
            showWelcomeModal={showWelcomeModal}
            setShowWelcomeModal={setShowWelcomeModal}
          />
        } />

        {/* Paper route */}
        <Route path="/paper/:conversationId" element={
          <PapurosDisplay
            view="markdown"
            markdownContent={markdownContent}
            onSearch={handleSearch}
            onLoginSuccess={handleLoginSuccess}
            onHomeClick={handleHomeClick}
            onProfileClick={handleProfileClick}
            onArchivesClick={handleArchivesClick}
            onUploadClick={handleUploadClick}
            onLoginClick={handleLoginClick}
            onSignupClick={handleSignupClick}
            onBackToLogin={() => {
              setView('login');
              navigate('/login');
            }}
            showWelcomeModal={showWelcomeModal}
            setShowWelcomeModal={setShowWelcomeModal}
          />
        } />

        {/* Search collecting animation route */}
        <Route path="/search-collecting" element={
          <PapurosDisplay
            view="source_collecting"
            markdownContent={markdownContent}
            onSearch={handleSearch}
            onLoginSuccess={handleLoginSuccess}
            onHomeClick={handleHomeClick}
            onProfileClick={handleProfileClick}
            onArchivesClick={handleArchivesClick}
            onUploadClick={handleUploadClick}
            onLoginClick={handleLoginClick}
            onSignupClick={handleSignupClick}
            onBackToLogin={() => {
              setView('login');
              navigate('/login');
            }}
            showWelcomeModal={showWelcomeModal}
            setShowWelcomeModal={setShowWelcomeModal}
          />
        } />

        {/* Outline generating animation route */}
        <Route path="/outline-generating" element={
          <PapurosDisplay
            view="outline_generating"
            markdownContent={markdownContent}
            onSearch={handleSearch}
            onLoginSuccess={handleLoginSuccess}
            onHomeClick={handleHomeClick}
            onProfileClick={handleProfileClick}
            onArchivesClick={handleArchivesClick}
            onUploadClick={handleUploadClick}
            onLoginClick={handleLoginClick}
            onSignupClick={handleSignupClick}
            onBackToLogin={() => {
              setView('login');
              navigate('/login');
            }}
            showWelcomeModal={showWelcomeModal}
            setShowWelcomeModal={setShowWelcomeModal}
          />
        } />

        {/* Profile route */}
        <Route path="/profile" element={
          <PapurosDisplay
            view="profile"
            markdownContent={markdownContent}
            onSearch={handleSearch}
            onLoginSuccess={handleLoginSuccess}
            onHomeClick={handleHomeClick}
            onProfileClick={handleProfileClick}
            onArchivesClick={handleArchivesClick}
            onUploadClick={handleUploadClick}
            onLoginClick={handleLoginClick}
            onSignupClick={handleSignupClick}
            onBackToLogin={() => {
              setView('login');
              navigate('/login');
            }}
            showWelcomeModal={showWelcomeModal}
            setShowWelcomeModal={setShowWelcomeModal}
          />
        } />

        {/* Archive route */}
        <Route path="/archive" element={
          <PapurosDisplay
            view="archive"
            markdownContent={markdownContent}
            onSearch={handleSearch}
            onLoginSuccess={handleLoginSuccess}
            onHomeClick={handleHomeClick}
            onProfileClick={handleProfileClick}
            onArchivesClick={handleArchivesClick}
            onUploadClick={handleUploadClick}
            onLoginClick={handleLoginClick}
            onSignupClick={handleSignupClick}
            onBackToLogin={() => {
              setView('login');
              navigate('/login');
            }}
            showWelcomeModal={showWelcomeModal}
            setShowWelcomeModal={setShowWelcomeModal}
          />
        } />

        {/* Upload route */}
        <Route path="/upload" element={
          <PapurosDisplay
            view="upload"
            markdownContent={markdownContent}
            onSearch={handleSearch}
            onLoginSuccess={handleLoginSuccess}
            onHomeClick={handleHomeClick}
            onProfileClick={handleProfileClick}
            onArchivesClick={handleArchivesClick}
            onUploadClick={handleUploadClick}
            onLoginClick={handleLoginClick}
            onSignupClick={handleSignupClick}
            onBackToLogin={() => {
              setView('login');
              navigate('/login');
            }}
            showWelcomeModal={showWelcomeModal}
            setShowWelcomeModal={setShowWelcomeModal}
          />
        } />

        {/* Login route */}
        <Route path="/login" element={
          <PapurosDisplay
            view="login"
            markdownContent={markdownContent}
            onSearch={handleSearch}
            onLoginSuccess={handleLoginSuccess}
            onHomeClick={handleHomeClick}
            onProfileClick={handleProfileClick}
            onArchivesClick={handleArchivesClick}
            onUploadClick={handleUploadClick}
            onLoginClick={handleLoginClick}
            onSignupClick={handleSignupClick}
            onBackToLogin={() => {
              setView('login');
              navigate('/login');
            }}
            showWelcomeModal={showWelcomeModal}
            setShowWelcomeModal={setShowWelcomeModal}
          />
        } />

        {/* Signup route */}
        <Route path="/signup" element={
          <PapurosDisplay
            view="signup"
            markdownContent={markdownContent}
            onSearch={handleSearch}
            onLoginSuccess={handleLoginSuccess}
            onHomeClick={handleHomeClick}
            onProfileClick={handleProfileClick}
            onArchivesClick={handleArchivesClick}
            onUploadClick={handleUploadClick}
            onLoginClick={handleLoginClick}
            onSignupClick={handleSignupClick}
            onBackToLogin={() => {
              setView('login');
              navigate('/login');
            }}
            showWelcomeModal={showWelcomeModal}
            setShowWelcomeModal={setShowWelcomeModal}
          />
        } />

        {/* Catch-all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ConceptExplanationProvider>
  );
};

export default PapurosController;