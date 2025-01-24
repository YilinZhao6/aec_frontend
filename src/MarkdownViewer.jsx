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

const MarkdownViewer = ({ markdownContent }) => {
  const [zoom, setZoom] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightColor, setHighlightColor] = useState(HIGHLIGHT_COLORS[0].class);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const contentRef = useRef(null);
  const { contextMenu, handleContextMenu, ContextMenuComponent } = useContextMenu();
  
  const wordCount = markdownContent.trim().split(/\s+/).length;
  const charCount = markdownContent.length;
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  const estimatedPages = Math.ceil(markdownContent.length / 3000);

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

  const baseTextStyle = {
    color: '#000000',
    fontFamily: '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    fontSize: '16.8px',
    lineHeight: '1.4',
    letterSpacing: '0.15px',
  };

  const bottomBarStyle = {
    ...baseTextStyle,
    fontSize: '11.76px', // 30% smaller than 16.8px
  };

  const titleFontStyle = {
    fontFamily: '"Segoe UI Semibold", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
  };

  const codeStyle = {
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
  };

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
          className={`max-w-[980px] mx-auto p-8 bg-white prose ${
            isDarkMode ? 'dark:bg-gray-800 dark:prose-invert' : ''
          }`}
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease',
            ...baseTextStyle
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
            components={{
              strong: ({node, ...props}) => (
                <strong
                  style={{
                    ...baseTextStyle,
                    fontWeight: 600,
                  }}
                  {...props}
                />
              ),
              h1: ({node, ...props}) => (
                <h1 
                  style={{
                    ...baseTextStyle,
                    ...titleFontStyle,
                    fontSize: '28.8px',
                    fontWeight: 600,
                    marginBottom: '14px',
                    marginTop: '20px',
                    borderBottom: '1px solid #eaecef',
                    paddingBottom: '6px',
                    lineHeight: '1.2',
                  }} 
                  {...props}
                />
              ),
              h2: ({node, ...props}) => (
                <h2 
                  style={{
                    ...baseTextStyle,
                    ...titleFontStyle,
                    fontSize: '24px',
                    fontWeight: 600,
                    marginBottom: '12px',
                    marginTop: '20px',
                    borderBottom: '1px solid #eaecef',
                    paddingBottom: '6px',
                    lineHeight: '1.2',
                  }} 
                  {...props}
                />
              ),
              h3: ({node, ...props}) => (
                <h3 
                  style={{
                    ...baseTextStyle,
                    ...titleFontStyle,
                    fontSize: '19.2px',
                    fontWeight: 600,
                    marginBottom: '10px',
                    marginTop: '20px',
                    lineHeight: '1.2',
                  }} 
                  {...props}
                />
              ),
              p: ({node, ...props}) => (
                <p 
                  style={{
                    ...baseTextStyle,
                    marginBottom: '12px',
                    marginTop: '0',
                  }} 
                  {...props}
                />
              ),
              ul: ({node, ...props}) => (
                <ul 
                  style={{
                    ...baseTextStyle,
                    marginBottom: '12px',
                    marginTop: '0',
                    paddingLeft: '2em',
                  }} 
                  {...props}
                />
              ),
              ol: ({node, ...props}) => (
                <ol 
                  style={{
                    ...baseTextStyle,
                    marginBottom: '12px',
                    marginTop: '0',
                    paddingLeft: '2em',
                  }} 
                  {...props}
                />
              ),
              li: ({node, ...props}) => (
                <li 
                  style={{
                    ...baseTextStyle,
                    marginBottom: '2px',
                    lineHeight: '1.4',
                  }} 
                  {...props}
                />
              ),
              blockquote: ({node, ...props}) => (
                <blockquote 
                  style={{
                    ...baseTextStyle,
                    borderLeft: '4px solid #dfe2e5',
                    color: '#6a737d',
                    marginBottom: '12px',
                    marginTop: '0',
                    paddingLeft: '16px',
                    lineHeight: '1.4',
                  }} 
                  {...props}
                />
              ),
              code: ({node, inline, ...props}) => (
                inline 
                  ? <code 
                      style={{
                        ...codeStyle,
                        padding: '0.2em 0.4em',
                        backgroundColor: 'rgba(27,31,35,0.05)',
                        borderRadius: '3px',
                        fontSize: '85%',
                      }} 
                      {...props}
                    />
                  : <code 
                      style={{
                        ...codeStyle,
                        fontSize: '85%',
                      }} 
                      {...props}
                    />
              ),
              pre: ({node, ...props}) => (
                <pre 
                  style={{
                    padding: '16px',
                    overflow: 'auto',
                    fontSize: '85%',
                    lineHeight: '1.45',
                    backgroundColor: '#f6f8fa',
                    borderRadius: '3px',
                    marginBottom: '12px',
                    marginTop: '0',
                  }} 
                  {...props}
                />
              )
            }}
          />
        </div>
      </div>

      {/* Fixed Bottom Stats Bar */}
      <div className="fixed bottom-0 left-[70px] right-0 bg-white border-t px-4 py-2 text-gray-600 z-20" style={bottomBarStyle}>
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