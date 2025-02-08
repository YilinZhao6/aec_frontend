import React, { useState } from 'react';
import PapurosDisplay from './PapurosDisplay';
import ConceptExplanationProvider from './ConceptExplanation';

const PapurosController = () => {
  const [view, setView] = useState('initial');
  const [markdownContent, setMarkdownContent] = useState('');
  const [loadingMessages, setLoadingMessages] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem('user_id') || '');
  const [conversationId, setConversationId] = useState(localStorage.getItem('conversation_id') || '');

  const saveQuery = async (query, bookIds, enableWebSearch) => {
    try {
      const response = await fetch('https://backend-ai-cloud-explains.onrender.com/save_query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          user_id: userId,
          book_ids: bookIds,
          websearch: enableWebSearch
        }),
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

      if (message.includes(`Starting Google search and content collection for user '${userId}' in conversation '${newConversationId}'`)) {
        console.log('Switching to source collection view');
        setView('source_collecting');
      } 
      else if (message.includes(`Starting Outline generation for user '${userId}' in conversation '${newConversationId}'`)) {
        console.log('Switching to outline generation view');
        setView('outline_generating');
      }
      else if (message.includes(`Starting Article writing for user '${userId}' in conversation '${newConversationId}'`)) {
        console.log('Switching to markdown view');
        setView('markdown');
        setMarkdownContent(''); // Start with empty content, it will be updated by polling
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      eventSource.close();
    };
  };

  const handleSearch = async (query, bookIds, enableWebSearch) => {
    console.log('Search query:', query);
    console.log('Book IDs:', bookIds);
    console.log('Web Search enabled:', enableWebSearch);

    const newConversationId = await saveQuery(query, bookIds, enableWebSearch);
    if (!newConversationId) {
      console.error('Failed to save query');
      return;
    }

    console.log('Starting generation with conversation ID:', newConversationId);
    startEventSource(query, bookIds, enableWebSearch, newConversationId);
  };

  const handleLoginSuccess = (user_id) => {
    console.log('Login Success Handler called with user_id:', user_id);
    setUserId(user_id);
    localStorage.setItem('user_id', user_id);
    setView('initial');
  };

  const handleHomeClick = () => setView('initial');
  const handleProfileClick = () => setView('profile');
  const handleArchivesClick = () => setView('archive');
  const handleUploadClick = () => setView('upload');
  const handleLoginClick = () => setView('login');
  const handleSignupClick = () => setView('signup');

  return (
    <ConceptExplanationProvider>
      <PapurosDisplay
        view={view}
        markdownContent={markdownContent}
        onSearch={handleSearch}
        onLoginSuccess={handleLoginSuccess}
        onHomeClick={handleHomeClick}
        onProfileClick={handleProfileClick}
        onArchivesClick={handleArchivesClick}
        onUploadClick={handleUploadClick}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onBackToLogin={() => setView('login')}
      />
    </ConceptExplanationProvider>
  );
};

export default PapurosController;