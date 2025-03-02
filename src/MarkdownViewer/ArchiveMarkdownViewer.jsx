import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MarkdownViewerBase from './MarkdownViewerBase';

/**
 * Specialized MarkdownViewer for the archive view
 * Handles loading archived content and simplified navigation
 */
const ArchiveMarkdownViewer = ({ userId, conversationId }) => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticleContent = async () => {
      if (!userId || !conversationId) {
        setError('Missing user ID or conversation ID');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/article?user_id=${userId}&conversation_id=${conversationId}`);
        
        if (response.ok) {
          const content = await response.text();
          setMarkdownContent(content);
          
          // Store IDs for follow-up questions
          localStorage.setItem('current_article_user_id', userId);
          localStorage.setItem('current_article_conversation_id', conversationId);
        } else {
          throw new Error(await response.text());
        }
      } catch (error) {
        console.error('Failed to load article content:', error);
        setError('Failed to load article. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleContent();
  }, [userId, conversationId]);

  const handleBackClick = () => {
    navigate('/archive');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-xl text-gray-600">Loading article...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="max-w-md p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <h3 className="text-lg font-medium mb-2">Error</h3>
          <p>{error}</p>
          <button 
            onClick={handleBackClick}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Back to Archive
          </button>
        </div>
      </div>
    );
  }

  return (
    <MarkdownViewerBase
      markdownContent={markdownContent}
      isComplete={true}
      userId={userId}
      conversationId={conversationId}
      isArchiveView={true}
      onBackClick={handleBackClick}
    />
  );
};

export default ArchiveMarkdownViewer;