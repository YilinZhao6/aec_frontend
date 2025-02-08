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
import { Loader2 } from 'lucide-react';

const MarkdownViewer = ({ markdownContent: initialContent }) => {
  const [zoom, setZoom] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightColor, setHighlightColor] = useState(HIGHLIGHT_COLORS[0].class);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [markdownContent, setMarkdownContent] = useState(initialContent);
  const [isComplete, setIsComplete] = useState(false);
  const contentRef = useRef(null);
  const { contextMenu, handleContextMenu, ContextMenuComponent } = useContextMenu();
  
  const wordCount = markdownContent.trim().split(/\s+/).length;
  const charCount = markdownContent.length;
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  const estimatedPages = Math.ceil(markdownContent.length / 3000);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    const conversationId = localStorage.getItem('conversation_id');
    
    if (!userId || !conversationId) return;

    const fetchProgress = async () => {
      try {
        const response = await fetch('https://backend-ai-cloud-explains.onrender.com/get_progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            conversation_id: conversationId
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
  }, []);

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
      {/* Fixed Top Toolbar */}
      <div className="fixed top-0 left-[70px] right-0 z-20">
        <Toolbar 
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          isHighlightMode={isHighlightMode}
          onHighlightToggle={() => setIsHighlightMode(!isHighlightMode)}
          highlightColor={highlightColor}
          onColorChange={setHighlightColor}
          currentPage={currentPage}
          estimatedPages={estimatedPages}
          onPageChange={setCurrentPage}
          onPrint={handlePrint}
          onSavePDF={handleSaveAsPDF}
        />
      </div>

      {ContextMenuComponent}
      
      {/* Main Content with Padding for Fixed Toolbars */}
      <div 
        className="flex-1 overflow-auto px-4"
        onContextMenu={handleContextMenu}
        style={{ 
          paddingTop: "56px",
          paddingBottom: "40px"
        }}
      >
        <div 
          ref={contentRef}
          className={`max-w-[980px] mx-auto p-8 bg-white prose markdown-content ${
            isDarkMode ? 'dark:bg-gray-800 dark:prose-invert' : ''
          }`}
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease',
          }}
        >
          <ReactMarkdown
            children={markdownContent}
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[
              rehypeHighlight,
              [rehypeKatex, {
                strict: false,
                throwOnError: false,
                output: 'html'
              }],
              rehypeRaw
            ]}
          />

          {!isComplete && (
            <div className="mt-8 p-6 border-2 border-orange-200 rounded-lg bg-orange-50">
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                <p className="text-orange-700 font-medium">
                  Generating more content...
                </p>
              </div>
              <div className="mt-4 w-full h-2 bg-orange-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 animate-pulse rounded-full" 
                     style={{ width: '100%' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Stats Bar */}
      <div className="fixed bottom-0 left-[70px] right-0 bg-white border-t px-4 py-2 text-gray-600 z-20 markdown-bottom-bar">
        <div className="flex justify-between items-center">
          <div className="flex space-x-6">
            <div>Reading time: {readingTimeMinutes} min</div>
            <div>Words: {wordCount.toLocaleString()}</div>
            <div>Characters: {charCount.toLocaleString()}</div>
          </div>
          <div>Zoom: {zoom}%</div>
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