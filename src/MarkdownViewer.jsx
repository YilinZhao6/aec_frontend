import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';
import { Toolbar, HIGHLIGHT_COLORS } from './MarkdownToolbar';
import { useContextMenu } from './MarkdownContextMenu';
import html2pdf from 'html2pdf.js';
import { getMarkdownStyles } from './MarkdownViewer_css';
import MarkdownAskFollowUp from './MarkdownAskFollowUp';
import SectionProgressMenu from './SectionProgressMenu';
import { Menu, X, Home, GraduationCap, Library, Upload, ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const MarkdownViewer = ({ markdownContent: initialContent, isComplete: initialIsComplete = false, userId: propUserId, conversationId: propConversationId }) => {
  const [zoom, setZoom] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightColor, setHighlightColor] = useState(HIGHLIGHT_COLORS[0].class);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [markdownContent, setMarkdownContent] = useState(initialContent);
  const [isComplete, setIsComplete] = useState(initialIsComplete);
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const contentRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const { contextMenu, handleContextMenu, ContextMenuComponent } = useContextMenu();
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
  
  const wordCount = markdownContent.trim().split(/\s+/).length;
  const charCount = markdownContent.length;
  const readingTimeMinutes = Math.ceil(wordCount / 200);

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

  useEffect(() => {
    window.scrollTo(0, 0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [markdownContent]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleSaveAsPDF = async () => {
    if (contentRef.current) {
      const element = contentRef.current;
      const images = element.querySelectorAll('img');
      const imagePromises = Array.from(images).map(img =>
        new Promise((resolve) => {
          if (img.complete) resolve();
          else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        })
      );
  
      await Promise.all(imagePromises);
  
      const options = {
        margin: 0.5,
        filename: 'preview.pdf',
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: true,
          windowWidth: 1080
        },
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' }
      };
      
      html2pdf().set(options).from(element).save();
    }
  };

  useEffect(() => {
    const handleSelection = () => {
      if (!isHighlightMode) return;
      
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      if (!selectedText) return;

      let container = selection.getRangeAt(0).commonAncestorContainer;
      while (container && container !== contentRef.current) {
        container = container.parentNode;
      }
      if (!container) return;

      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.className = highlightColor;
      
      try {
        range.surroundContents(span);
      } catch (e) {
        console.warn('Could not highlight complex selection');
      }
      
      selection.removeAllRanges();
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && isHighlightMode) {
        handleSelection();
      }
    };

    const handleMouseUp = () => {
      if (isHighlightMode) {
        setTimeout(handleSelection, 10);
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isHighlightMode, highlightColor]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = getMarkdownStyles();
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleNavigation = (path) => {
    setIsMobileMenuOpen(false);
    setIsSectionMenuOpen(false);
    setIsFollowUpOpen(false);
    
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

  return (
    <div className="flex-1 flex flex-col h-full bg-[#ffffff] relative">
      {/* Mobile Header */}
      <div className="sm:hidden fixed top-0 left-0 right-0 bg-white z-30">
        {/* Top Bar */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4">
          <button
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSectionMenuOpen(!isSectionMenuOpen)}
              className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-lg"
            >
              OUTLINE
            </button>
            <button
              onClick={() => setIsFollowUpOpen(!isFollowUpOpen)}
              className="px-3 py-1.5 bg-gray-500 text-white text-sm rounded-lg"
            >
              ASK
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
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
        )}

        {/* Section Menu Dropdown */}
        {isSectionMenuOpen && (
          <div className="border-b border-gray-200 bg-white mx-4">
            <div className="max-h-[50vh] overflow-y-auto">
              <SectionProgressMenu 
                userId={userId} 
                conversationId={activeConversationId}
                isArchiveView={isArchiveView}
              />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Toolbar */}
      <div className="hidden sm:block fixed top-0 left-[70px] right-0 z-20">
        <Toolbar 
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          isHighlightMode={isHighlightMode}
          onHighlightToggle={() => setIsHighlightMode(!isHighlightMode)}
          highlightColor={highlightColor}
          onColorChange={setHighlightColor}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPrint={handlePrint}
          onSavePDF={handleSaveAsPDF}
        />
      </div>

      {/* Desktop Section Progress Menu */}
      <div className="hidden sm:block">
        <SectionProgressMenu 
          userId={userId} 
          conversationId={activeConversationId}
          isArchiveView={isArchiveView}
        />
      </div>

      {ContextMenuComponent}
      
      {/* Main Content */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-auto px-2 sm:px-4 sm:pt-14 pb-10 sm:ml-20"
        onContextMenu={handleContextMenu}
      >
        <div 
          ref={contentRef}
          className={`max-w-[980px] mx-auto p-4 sm:p-8 bg-white prose markdown-content transform origin-top transition-transform duration-200 ${
            isDarkMode ? 'dark:bg-gray-800 dark:prose-invert' : ''
          }`}
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <ReactMarkdown
            children={markdownContent}
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[
              rehypeHighlight,
              [rehypeKatex, { strict: false, throwOnError: false, output: 'html' }],
              rehypeRaw
            ]}
          />

          {!isComplete && !isArchiveView && (
            <div className="mt-8 space-y-4">
              <div className="h-4 sm:h-6 bg-gray-200 rounded-md overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-sweep" />
              </div>
              <div className="h-4 sm:h-6 bg-gray-200 rounded-md overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-sweep" />
              </div>
              <div className="h-4 sm:h-6 bg-gray-200 rounded-md overflow-hidden">
                <div className="h-full w-4/5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-sweep" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="fixed bottom-0 left-0 sm:left-[70px] right-0 bg-white border-t px-2 sm:px-4 py-2 text-gray-600 z-20 markdown-bottom-bar">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm">
            <div>Reading time: {readingTimeMinutes} min</div>
            <div>Words: {wordCount.toLocaleString()}</div>
            <div>Characters: {charCount.toLocaleString()}</div>
          </div>
          <div className="text-xs sm:text-sm">Zoom: {zoom}%</div>
        </div>
      </div>

      <MarkdownAskFollowUp 
        isOpen={isFollowUpOpen}
        onToggle={() => setIsFollowUpOpen(!isFollowUpOpen)}
      />
    </div>
  );
};

export default MarkdownViewer;