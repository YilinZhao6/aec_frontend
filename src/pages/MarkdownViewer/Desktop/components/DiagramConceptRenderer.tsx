import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Loader2 } from 'lucide-react';

interface DiagramConceptRendererProps {
  userId: string;
  conversationId: string;
  isArchiveView: boolean;
}

const DiagramConceptRenderer: React.FC<DiagramConceptRendererProps> = ({ 
  userId, 
  conversationId,
  isArchiveView 
}) => {
  const [diagram, setDiagram] = useState('');
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const diagramContainerRef = useRef<HTMLDivElement>(null);
  const diagramId = useRef(`mermaid-${Math.random().toString(36).substring(2, 9)}`);
  const renderAttemptRef = useRef(0);

  // Initialize mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Quicksand',
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        rankSpacing: 50,
        nodeSpacing: 50,
        padding: 15
      },
      themeVariables: {
        fontSize: '16px',
        fontFamily: 'Quicksand',
        primaryColor: '#e5e7eb',
        primaryBorderColor: '#d1d5db',
        primaryTextColor: '#374151',
        lineColor: '#4b5563',
        secondaryColor: '#e5e7eb',
        tertiaryColor: '#e5e7eb'
      },
      themeCSS: `
        .edgeLabel { background-color: transparent; }
        .node rect { 
          fill: #e5e7eb !important;
          stroke: #d1d5db !important;
          stroke-width: 1px !important;
        }
        .node .label { 
          font-family: Quicksand !important;
          color: #374151 !important;
        }
        .edgeLabel { 
          font-family: Quicksand !important;
          color: #4b5563 !important;
        }
        g[id*="-link-"] { display: none !important; }
        .marker { display: none !important; }
        .flowchart-link { 
          stroke: #4b5563 !important;
          stroke-width: 1.5px !important;
        }
        .node .label foreignObject { overflow: visible; }
        .node foreignObject { overflow: visible; }
        .node .label div { 
          text-align: center;
          color: #374151 !important;
        }
      `
    });
  }, []);

  useEffect(() => {
    const fetchDiagram = async () => {
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

        if (!response.ok) {
          throw new Error('Failed to fetch diagram');
        }

        const data = await response.json();
        if (data.diagram) {
          // Extract Mermaid code from markdown code block
          const mermaidCode = data.diagram.replace(/```mermaid\n|\n```/g, '').trim();
          setDiagram(mermaidCode);
        }
        // Fix: Correctly access related_concepts array
        if (data.related_topics && data.related_topics.related_concepts) {
          setRelatedTopics(data.related_topics.related_concepts);
        }
      } catch (error) {
        console.error('Error fetching diagram:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch diagram');
      } finally {
        setLoading(false);
      }
    };

    if (userId && conversationId) {
      fetchDiagram();
    }
  }, [userId, conversationId]);

  // Render diagram when data is available
  useEffect(() => {
    if (!diagram || !diagramContainerRef.current) return;

    const renderDiagram = async () => {
      try {
        const container = diagramContainerRef.current;
        if (!container) return;
        
        // Clear previous content
        container.innerHTML = '';
        
        // Create new diagram div
        const diagramDiv = document.createElement('div');
        diagramDiv.id = diagramId.current;
        diagramDiv.className = 'mermaid';
        diagramDiv.textContent = diagram;
        container.appendChild(diagramDiv);
        
        // Render diagram
        await mermaid.run({
          nodes: [diagramDiv]
        });

        // Style the SVG after rendering
        const svg = diagramDiv.querySelector('svg');
        if (svg) {
          svg.querySelectorAll('[id*="-link-"],[id*="-marker-"]').forEach(el => el.remove());
          
          if (!svg.getAttribute('viewBox')) {
            const bbox = svg.getBBox();
            svg.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
          }
          
          svg.style.width = '100%';
          svg.style.height = 'auto';
        }
        
        // Reset render attempts
        renderAttemptRef.current = 0;
      } catch (error) {
        console.error('Error rendering diagram:', error);
        
        // Retry up to 3 times
        if (renderAttemptRef.current < 3) {
          renderAttemptRef.current += 1;
          setTimeout(renderDiagram, 500);
        } else {
          setError('Failed to render diagram');
        }
      }
    };

    // Small delay to ensure container is ready
    setTimeout(renderDiagram, 100);
  }, [diagram]);

  if (loading) {
    return (
      <div className="mt-8 space-y-4">
        <div className="h-4 sm:h-6 bg-gray-200 rounded-md overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-sweep" />
        </div>
        <div className="h-4 sm:h-6 bg-gray-200 rounded-md overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-sweep" />
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating concept diagram...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-6">
        {error}
      </div>
    );
  }

  if (!diagram && !relatedTopics.length) {
    return null;
  }

  return (
    <>
      {/* Related Topics Box */}
      {relatedTopics.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 font-quicksand">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {relatedTopics.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Concept Map Box */}
      {diagram && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 font-quicksand">Concept Map</h3>
            <div 
              ref={diagramContainerRef}
              className="overflow-auto"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DiagramConceptRenderer;