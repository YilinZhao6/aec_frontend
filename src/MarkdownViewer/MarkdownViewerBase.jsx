import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';
import { Toolbar, HIGHLIGHT_COLORS } from './MarkdownToolbar';
import html2pdf from 'html2pdf.js';
import DiagramRenderer from '../DiagramRenderer';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DocumentSectionsPanel } from './index.js';
import { RightSidePanel } from './Sidebar';
import { processCustomTags, customComponents } from './utils/markdownProcessor.jsx';
import './MarkdownViewer.css';
import RatingModal from '../RatingModal';
import { SidebarTrigger } from '../LeftSidebar';

const CONTENT_WIDTH_PERCENTAGE = 100;
const HORIZONTAL_MARGIN_PERCENTAGE = 0;
const LEFT_PAGE_MARGIN = 2;
const LEFT_COLUMN_WIDTH = 16;
const CENTER_COLUMN_WIDTH = 60;
const RIGHT_COLUMN_WIDTH = 22;

const MarkdownViewerBase = ({ 
  markdownContent,
  isComplete,
  userId,
  conversationId,
  isArchiveView,
  onBackClick,
  isLoading = false
}) => {
  const [zoom, setZoom] = useState(100);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightColor, setHighlightColor] = useState(HIGHLIGHT_COLORS[0].class);
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);
  const [previousContentLength, setPreviousContentLength] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const contentRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const navigate = useNavigate();
  
  const wordCount = markdownContent ? markdownContent.trim().split(/\s+/).length : 0;
  const charCount = markdownContent ? markdownContent.length : 0;
  const readingTimeMinutes = Math.ceil(wordCount / 200);

  const { processedContent, qaComponents } = React.useMemo(() => {
    return processCustomTags(markdownContent);
  }, [markdownContent]);

  useEffect(() => {
    let timer;
    if (isComplete) {
      if (isArchiveView) {
        // For archive view, show after 3 seconds
        timer = setTimeout(() => {
          setShowRatingModal(true);
        }, 10000);
      } else {
        // For generation pipeline, show after 10 seconds
        timer = setTimeout(() => {
          setShowRatingModal(true);
        }, 10000);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isComplete, isArchiveView]);

  // Save scroll position when content changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollTop;
    }
  }, [markdownContent]);

  // Restore scroll position after content update
  useEffect(() => {
    if (scrollContainerRef.current && markdownContent) {
      // Only maintain scroll position if content was added (length increased)
      if (markdownContent.length > previousContentLength) {
        scrollContainerRef.current.scrollTop = scrollPositionRef.current;
      }
      setPreviousContentLength(markdownContent.length);
    }
  }, [markdownContent, previousContentLength]);

  // Only scroll to top on initial load or when switching between different articles
  useEffect(() => {
    if (!markdownContent || isArchiveView) {
      window.scrollTo(0, 0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [isArchiveView, conversationId]);

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

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-full py-16">
      <div className="w-16 h-16 mb-8">
        <Loader2 className="w-full h-full text-gray-400 animate-spin" />
      </div>
      <h3 className="text-xl font-medium text-gray-700 mb-2 font-quicksand">Generating your content</h3>
      <p className="text-gray-500 text-center max-w-md font-quicksand">
        We're preparing a comprehensive explanation. This may take a moment as we gather and organize the information.
      </p>
    </div>
  );

  const customComponentsWithHandlers = {
    ...customComponents,
    div: ({ node, ...props }) => {
      if (props.id && props.id.startsWith('qa-')) {
        const qaComponent = qaComponents.find(qa => qa.id === props.id);
        return qaComponent ? qaComponent.component : null;
      }
      return <div {...props} />;
    }
  };

  const shouldShowDiagram = (isArchiveView || isComplete) && userId && conversationId;

  const handleMobileBack = () => {
    if (isArchiveView) {
      navigate('/archive');
    } else {
      // For new articles, clear data and navigate home
      localStorage.removeItem('current_article_user_id');
      localStorage.removeItem('current_article_conversation_id');
      localStorage.removeItem('conversation_id');
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="flex-1 flex h-full bg-[#F0F0F0] relative">
      {/* Desktop Sidebar */}
      <div className="hidden sm:block">
        <SidebarTrigger 
          onHomeClick={() => navigate('/')}
          onProfileClick={() => navigate('/profile')}
          onArchivesClick={() => navigate('/archive')}
          onUploadClick={() => navigate('/upload')}
        />
      </div>

      {/* Mobile Header */}
      <div className="sm:hidden fixed top-0 left-0 right-0 bg-[#F0F0F0] border-b border-[#CCCCCC] z-30">
        <div className="h-14 border-b border-[#CCCCCC] flex items-center justify-between px-4">
          <button
            onClick={handleMobileBack}
            className="p-2 hover:bg-[#F0F0F0] rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSectionMenuOpen(!isSectionMenuOpen)}
              className="px-3 py-1.5 bg-[#F0F0F0] text-gray-600 text-sm rounded-lg font-quicksand border border-[#CCCCCC]"
            >
              OUTLINE
            </button>
          </div>
        </div>

        {isSectionMenuOpen && (
          <div className="border-b border-[#CCCCCC] bg-[#F0F0F0] mx-4">
            <div className="max-h-[50vh] overflow-y-auto">
              <DocumentSectionsPanel 
                userId={userId} 
                conversationId={conversationId}
                isArchiveView={isArchiveView}
              />
            </div>
          </div>
        )}
      </div>

      <div 
        className="hidden sm:grid w-full" 
        style={{ 
          gridTemplateColumns: `${LEFT_COLUMN_WIDTH}% ${CENTER_COLUMN_WIDTH}% ${RIGHT_COLUMN_WIDTH}%`,
          paddingLeft: `${LEFT_PAGE_MARGIN}%`
        }}
      >
        <div className="p-4 pt-14">
          <DocumentSectionsPanel 
            userId={userId}
            conversationId={conversationId}
            isArchiveView={isArchiveView}
          />
        </div>

        <div className="relative">
          <div className="fixed top-0 left-0 right-0 z-20">
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
          
          <div 
            ref={scrollContainerRef}
            className="overflow-auto pt-14 pb-10 h-screen"
            style={{ 
              paddingLeft: `${HORIZONTAL_MARGIN_PERCENTAGE}%`, 
              paddingRight: `${HORIZONTAL_MARGIN_PERCENTAGE}%` 
            }}
          >
            <div 
              ref={contentRef}
              className="mx-auto p-4 sm:p-8 bg-[#F0F0F0] border border-[#CCCCCC] rounded-lg prose markdown-content transform origin-top transition-transform duration-200"
              style={{ 
                transform: `scale(${zoom / 100})`,
                width: `${CONTENT_WIDTH_PERCENTAGE}%`,
                maxWidth: '980px'
              }}
            >
              {isLoading ? (
                <LoadingState />
              ) : (
                <>
                  <ReactMarkdown
                    children={processedContent}
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[
                      rehypeHighlight,
                      [rehypeKatex, { strict: false, throwOnError: false, output: 'html' }],
                      rehypeRaw
                    ]}
                    components={customComponentsWithHandlers}
                    className="font-quicksand generated-content"
                  />

                  {!isComplete && !isArchiveView && (
                    <div className="mt-8 space-y-4">
                      <div className="h-4 sm:h-6 bg-slate-300 rounded-md overflow-hidden">
                        <div className="h-full w-2/3 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 animate-sweep" />
                      </div>
                      <div className="h-4 sm:h-6 bg-slate-300 rounded-md overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 animate-sweep" />
                      </div>
                      <div className="h-4 sm:h-6 bg-slate-300 rounded-md overflow-hidden">
                        <div className="h-full w-4/5 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 animate-sweep" />
                      </div>
                    </div>
                  )}

                  {shouldShowDiagram && (
                    <DiagramRenderer 
                      userId={userId}
                      conversationId={conversationId}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 pt-14">
          <RightSidePanel />
        </div>
      </div>

      <div 
        className="sm:hidden flex-1 overflow-auto pb-10 pt-14"
        style={{ 
          paddingLeft: `${HORIZONTAL_MARGIN_PERCENTAGE + LEFT_PAGE_MARGIN}%`,
          paddingRight: `${HORIZONTAL_MARGIN_PERCENTAGE}%` 
        }}
      >
        <div 
          ref={contentRef}
          className="mx-auto p-4 bg-[#F0F0F0] border border-[#CCCCCC] rounded-lg prose markdown-content transform origin-top transition-transform duration-200"
          style={{ 
            transform: `scale(${zoom / 100})`,
            width: `${CONTENT_WIDTH_PERCENTAGE}%`,
            maxWidth: '980px'
          }}
        >
          {isLoading ? (
            <LoadingState />
          ) : (
            <>
              <ReactMarkdown
                children={processedContent}
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[
                  rehypeHighlight,
                  [rehypeKatex, { strict: false, throwOnError: false, output: 'html' }],
                  rehypeRaw
                ]}
                components={customComponentsWithHandlers}
                className="font-quicksand generated-content"
              />

              {!isComplete && !isArchiveView && (
                <div className="mt-8 space-y-4">
                  <div className="h-4 bg-slate-300 rounded-md overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 animate-sweep" />
                  </div>
                  <div className="h-4 bg-slate-300 rounded-md overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 animate-sweep" />
                  </div>
                </div>
              )}

              {shouldShowDiagram && (
                <DiagramRenderer 
                  userId={userId}
                  conversationId={conversationId}
                />
              )}
            </>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#F0F0F0] border-t border-[#CCCCCC] px-2 sm:px-4 py-2 text-gray-600 z-20 markdown-bottom-bar font-quicksand">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm">
            <div>Reading time: {readingTimeMinutes} min</div>
            <div>Words: {wordCount.toLocaleString()}</div>
            <div>Characters: {charCount.toLocaleString()}</div>
          </div>
          <div className="text-xs sm:text-sm">Zoom: {zoom}%</div>
        </div>
      </div>

      {showRatingModal && (
        <RatingModal
          onClose={() => setShowRatingModal(false)}
          userId={userId}
          conversationId={conversationId}
        />
      )}
    </div>
  );
};

export default MarkdownViewerBase;