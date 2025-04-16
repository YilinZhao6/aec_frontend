import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { contentAPI } from '../../../api/markdownViewer/content';
import DocumentSectionsPanel from './components/DocumentSectionsPanel';
import RightSidePanel from './components/RightSidePanel';
import { processCustomTags } from './utils/markdownUtils';
import { Toolbar } from './components/Toolbar';
import MarkdownContent from './MarkdownContent';
import './MarkdownViewer.css';

interface Section {
  section_id: string;
  title: string;
  learning_goals: string[];
  status: 'waiting' | 'text_complete' | 'complete';
  content_points?: string[];
}

const MIN_CONTENT_WIDTH = 30;
const MAX_CONTENT_WIDTH = 70;
const DEFAULT_CONTENT_WIDTH = 64;

const MarkdownViewer = () => {
  const { source, userId, conversationId } = useParams();
  const [content, setContent] = useState('');
  const [processedContent, setProcessedContent] = useState('');
  const [qaComponents, setQaComponents] = useState<{ id: string; component: React.ReactNode }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [diagramData, setDiagramData] = useState<{ diagram: string; related_topics: string[] } | null>(null);
  const [isDiagramLoading, setIsDiagramLoading] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(100);
  const [isHighlightMode, setIsHighlightMode] = useState(false);
  const [highlightColor, setHighlightColor] = useState('bg-yellow-200');
  
  const [isDragging, setIsDragging] = useState(false);
  const [contentWidth, setContentWidth] = useState(DEFAULT_CONTENT_WIDTH);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    setIsDragging(true);
    document.body.classList.add('resizing');
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current || !mainContentRef.current || !rightPanelRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const leftOffset = containerRect.left + (containerWidth * 0.1667);
    const mouseX = e.clientX;
    
    let newWidthPercentage = ((mouseX - leftOffset) / containerWidth) * 100;
    newWidthPercentage = Math.max(MIN_CONTENT_WIDTH, Math.min(MAX_CONTENT_WIDTH, newWidthPercentage));

    setContentWidth(newWidthPercentage);
    mainContentRef.current.style.width = `${newWidthPercentage}%`;
    rightPanelRef.current.style.width = `${100 - newWidthPercentage - 16.67}%`;
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.classList.remove('resizing');
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mouseleave', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isComplete && userId && conversationId && !isDiagramLoading && !diagramData) {
      const generateDiagramAndTopics = async () => {
        setIsDiagramLoading(true);
        try {
          const response = await fetch('https://backend-ai-cloud-explains.onrender.com/generate_diagram_and_topics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId,
              conversation_id: conversationId
            }),
          });

          if (!response.ok) throw new Error('Failed to generate diagram');

          const data = await response.json();
          
          if (data) {
            if (data.diagram) {
              data.diagram = data.diagram.replace(/```mermaid\s*|\s*```/g, '').trim();
            }
            
            if (!data.related_topics) {
              data.related_topics = [];
            }
            
            setDiagramData(data);
          }
        } catch (error) {
          console.error('Error generating diagram:', error);
        } finally {
          setIsDiagramLoading(false);
        }
      };

      generateDiagramAndTopics();
    }
  }, [isComplete, userId, conversationId, isDiagramLoading, diagramData]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem('user_id', userId);
    }
    
    if (conversationId) {
      localStorage.setItem('current_article_conversation_id', conversationId);
    }
  }, [userId, conversationId]);

  useEffect(() => {
    const fetchSectionProgress = async () => {
      if (!userId || !conversationId) return;

      try {
        const response = await fetch('https://backend-ai-cloud-explains.onrender.com/get_section_progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            conversation_id: conversationId
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch sections');

        const data = await response.json();
        if (data.sections) {
          setSections(data.sections);
          setIsComplete(data.is_complete || false);
        }

        if (!data.is_complete && source !== 'explanations') {
          setTimeout(fetchSectionProgress, 5000);
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
        if (!isComplete && source !== 'explanations') {
          setTimeout(fetchSectionProgress, 5000);
        }
      }
    };

    fetchSectionProgress();
  }, [userId, conversationId, source, isComplete]);

  useEffect(() => {
    const fetchContent = async () => {
      if (!userId || !conversationId) return;

      try {
        if (source === 'explanations') {
          const response = await contentAPI.getMarkdownContent(userId, conversationId);
          if (response.success && response.content) {
            const { processedContent, qaComponents } = processCustomTags(
              response.content,
              userId,
              conversationId
            );
            setProcessedContent(processedContent);
            setQaComponents(qaComponents);
          } else {
            setError(response.error || 'Failed to load content');
          }
          setIsLoading(false);
        } else {
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
          if (data.completed_sections && data.completed_sections.trim()) {
            const { processedContent, qaComponents } = processCustomTags(
              data.completed_sections,
              userId,
              conversationId
            );
            setProcessedContent(processedContent);
            setQaComponents(qaComponents);
            setIsLoading(false);
          }

          if (!data.is_complete && !isComplete) {
            setTimeout(fetchContent, 5000);
          }
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        setError('Error loading content');
        if (!isComplete && source !== 'explanations') {
          setTimeout(fetchContent, 5000);
        }
      }
    };

    fetchContent();
  }, [userId, conversationId, source, isComplete]);

  const handleBack = () => {
    if (source === 'explanations') {
      navigate('/explanations');
    } else {
      navigate('/');
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = () => {
    // Implement PDF saving logic
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const rightPanelWidth = (100 - contentWidth - 16.67);

  return (
    <div className="markdown-viewer-container">
      <div className="flex-none">
        <Toolbar 
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onPrint={handlePrint}
          onSavePDF={handleSavePDF}
          onBack={handleBack}
        />
      </div>
      
      <div ref={containerRef} className="markdown-viewer-content">
        <div className="w-1/6 p-4 flex-none overflow-hidden">
          <div className="h-full overflow-y-auto">
            <DocumentSectionsPanel
              userId={userId || ''}
              conversationId={conversationId || ''}
              isArchiveView={source === 'explanations'}
            />
          </div>
        </div>

        <div 
          ref={mainContentRef} 
          style={{ width: `${contentWidth}%` }} 
          className="main-content-area"
        >
          <div className="content-scroll-container">
            <div 
              className="bg-gray-100 rounded-lg shadow-lg p-8 border border-[#CCCCCC]"
              style={{ zoom: `${zoom}%` }}
            >
              <MarkdownContent
                content={processedContent}
                isLoading={isLoading}
                qaComponents={qaComponents}
                zoom={zoom}
                userId={userId || ''}
                conversationId={conversationId || ''}
                isComplete={isComplete}
                diagramData={diagramData}
                isDiagramLoading={isDiagramLoading}
              />
            </div>
          </div>
        </div>

        <div
          className={`w-1 cursor-col-resize relative group flex-none ${
            isDragging ? 'bg-gray-300' : 'bg-transparent hover:bg-gray-300'
          }`}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-gray-300 transition-colors" />
        </div>

        <div 
          ref={rightPanelRef} 
          style={{ width: `${rightPanelWidth}%` }} 
          className="right-panel-container"
        >
          <div className="right-panel-scroll">
            <RightSidePanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownViewer;