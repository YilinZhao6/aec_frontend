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
import SectionProgressMenu from '../SectionProgressMenu';
import DiagramRenderer from '../DiagramRenderer';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Base component for markdown viewing functionality
 * Handles common markdown rendering, toolbar actions, and UI elements
 */
const MarkdownViewerBase = ({ 
  markdownContent,
  isComplete,
  userId,
  conversationId,
  isArchiveView,
  onBackClick,
  navigationItems
}) => {
  const [zoom, setZoom] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightColor, setHighlightColor] = useState(HIGHLIGHT_COLORS[0].class);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);
  const contentRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const { contextMenu, handleContextMenu, ContextMenuComponent } = useContextMenu();
  const navigate = useNavigate();
  
  const wordCount = markdownContent.trim().split(/\s+/).length;
  const charCount = markdownContent.length;
  const readingTimeMinutes = Math.ceil(wordCount / 200);

  // Process citations in markdown content
  const processedContent = React.useMemo(() => {
    if (!markdownContent) return '';
    
    // Replace citation tags with direct HTML
    return markdownContent.replace(/<CITE:\s*([^,]+),\s*([^>]+)>/g, (match, source, url) => {
      // Generate a unique ID for each citation
      const id = 'citation-' + Math.random().toString(36).substring(2, 12);
      
      return `<a id="${id}" href="${url.trim()}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-md border border-gray-300 transition-colors ml-1">
  <span>${source.trim()}</span>
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
</a>`;
    });
  }, [markdownContent]);

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

  return (
    <div className="flex-1 flex flex-col h-full bg-[#ffffff] relative">
      {/* Mobile Header */}
      <div className="sm:hidden fixed top-0 left-0 right-0 bg-white z-30">
        {/* Top Bar */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4">
          <button
            onClick={onBackClick}
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
        {navigationItems && navigationItems.mobileMenu}

        {/* Section Menu Dropdown */}
        {isSectionMenuOpen && (
          <div className="border-b border-gray-200 bg-white mx-4">
            <div className="max-h-[50vh] overflow-y-auto">
              <SectionProgressMenu 
                userId={userId} 
                conversationId={conversationId}
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
          conversationId={conversationId}
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
            children={processedContent}
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

          {/* Render diagram only when content is complete */}
          {isComplete && userId && conversationId && (
            <DiagramRenderer 
              userId={userId}
              conversationId={conversationId}
            />
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

export default MarkdownViewerBase;