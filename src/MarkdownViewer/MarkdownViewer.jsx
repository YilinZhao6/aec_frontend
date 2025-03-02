import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Menu, X, Home, GraduationCap, Library, Upload, ExternalLink } from 'lucide-react';
import MarkdownViewerBase from './MarkdownViewerBase';

/**
 * Main MarkdownViewer component that handles both live generation and archive viewing
 * This component manages data fetching and state management
 */
const MarkdownViewer = ({ markdownContent: initialContent, isComplete: initialIsComplete = false, userId: propUserId, conversationId: propConversationId }) => {
  const [markdownContent, setMarkdownContent] = useState(initialContent);
  const [isComplete, setIsComplete] = useState(initialIsComplete);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
          setMarkdownContent(data.completed_sections);
          setIsComplete(data.is_complete);

          if (!data.is_complete) {
            setTimeout(fetchProgress, 5000);
          }
        } catch (error) {
          console.error('Error fetching progress:', error);
        }
      };

      fetchProgress();
    }
  }, [isComplete, userId, activeConversationId, isArchiveView]);

  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    
    if (location.pathname !== path) {
      navigate(path);
    }
  };

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

  const MenuItem = ({ icon: Icon, label, path }) => (
    <button
      onClick={() => handleNavigation(path)}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 w-full text-left"
    >
      <Icon className="w-5 h-5 text-gray-600" />
      <span className="text-gray-700">{label}</span>
    </button>
  );

  // Navigation items for mobile menu
  const navigationItems = {
    mobileMenu: isMobileMenuOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-white" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <span className="text-lg font-medium text-gray-900">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="flex-1 py-2">
            <MenuItem icon={Home} label="Home" path="/" />
            <MenuItem icon={GraduationCap} label="Profile" path="/profile" />
            <MenuItem icon={Library} label="Archives" path="/archive" />
            <MenuItem icon={Upload} label="Upload" path="/upload" />
          </div>
        </div>
      </div>
    )
  };

  return (
    <MarkdownViewerBase
      markdownContent={markdownContent}
      isComplete={isComplete}
      userId={userId}
      conversationId={activeConversationId}
      isArchiveView={isArchiveView}
      onBackClick={handleBackClick}
      navigationItems={navigationItems}
    />
  );
};

export default MarkdownViewer;