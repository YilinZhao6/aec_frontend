import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import MarkdownViewerBase from './MarkdownViewerBase';
import { SidebarTrigger } from '../LeftSidebar';

/**
 * Main MarkdownViewer component that handles both live generation and archive viewing
 * This component manages data fetching and state management
 */
const MarkdownViewer = ({ markdownContent: initialContent, isComplete: initialIsComplete = false, userId: propUserId, conversationId: propConversationId }) => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [isComplete, setIsComplete] = useState(initialIsComplete);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGenerationStarted, setIsGenerationStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialContent, setHasInitialContent] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { conversationId: urlConversationId } = useParams();
  
  const isArchiveView = Boolean(propUserId && propConversationId);
  const userId = isArchiveView ? propUserId : localStorage.getItem('user_id');
  const activeConversationId = isArchiveView ? propConversationId : (urlConversationId || localStorage.getItem('conversation_id'));

  // Set current article IDs for follow-up questions
  useEffect(() => {
    if (!isArchiveView && userId && activeConversationId) {
      localStorage.setItem('current_article_user_id', userId);
      localStorage.setItem('current_article_conversation_id', activeConversationId);
    }
  }, [isArchiveView, userId, activeConversationId]);

  // Fetch content progress for non-archive view
  useEffect(() => {
    if (!isArchiveView && !isComplete && userId && activeConversationId) {
      const fetchProgress = async () => {
        try {
          const response = await fetch('https://backend-ai-cloud-explains.onrender.com/get_progress', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId,
              conversation_id: activeConversationId
            }),
          });

          if (!response.ok) throw new Error('Failed to fetch progress');

          const data = await response.json();
          
          // Only update content if we have actual content
          if (data.completed_sections && data.completed_sections.trim()) {
            // Check if this is the first time we're getting content
            if (!hasInitialContent) {
              setHasInitialContent(true);
              setIsGenerationStarted(true);
              setMarkdownContent(data.completed_sections);
              setIsLoading(false);
            } else {
              // Update content for subsequent fetches
              setMarkdownContent(data.completed_sections);
            }
          }
          
          setIsComplete(data.is_complete);

          if (!data.is_complete) {
            setTimeout(fetchProgress, 5000);
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error fetching progress:', error);
          // On error, keep trying if not complete
          if (!isComplete) {
            setTimeout(fetchProgress, 5000);
          }
        }
      };

      fetchProgress();
    } else if (isArchiveView) {
      // For archive view, we're not loading
      setIsLoading(false);
    }
  }, [isComplete, userId, activeConversationId, isArchiveView, hasInitialContent]);

  const handleBackClick = () => {
    if (location.pathname.includes('/archive/paper/')) {
      navigate('/archive');
    } else {
      // Clear any stored conversation data
      localStorage.removeItem('current_article_user_id');
      localStorage.removeItem('current_article_conversation_id');
      localStorage.removeItem('conversation_id');
      // Navigate to home and force a reload
      navigate('/', { replace: true });
      window.location.reload();
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Add SidebarTrigger */}
      <SidebarTrigger 
        onHomeClick={() => navigate('/')}
        onProfileClick={() => navigate('/profile')}
        onArchivesClick={() => navigate('/archive')}
        onUploadClick={() => navigate('/upload')}
      />
      
      <MarkdownViewerBase
        markdownContent={markdownContent}
        isComplete={isComplete}
        userId={userId}
        conversationId={activeConversationId}
        isArchiveView={isArchiveView}
        onBackClick={handleBackClick}
        isLoading={isLoading || (!hasInitialContent && !isArchiveView)}
      />
    </div>
  );
};

export default MarkdownViewer;