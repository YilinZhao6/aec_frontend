import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Loader2 } from 'lucide-react';

// Initialize mermaid with specific settings to prevent flickering
mermaid.initialize({
  startOnLoad: false, // We'll manually render
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: '"Source Sans 3", sans-serif',
  fontSize: 14,
  flowchart: {
    htmlLabels: true,
    curve: 'basis'
  }
});

const DiagramRenderer = ({ userId, conversationId }) => {
  const [diagram, setDiagram] = useState('');
  const [relatedTopics, setRelatedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diagramId] = useState(`mermaid-${Math.random().toString(36).substring(2, 11)}`);
  const diagramContainerRef = useRef(null);
  const renderAttemptRef = useRef(0);

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
          // Extract the Mermaid code from the markdown code block
          const mermaidCode = data.diagram.replace(/```mermaid\n|\n```/g, '');
          setDiagram(mermaidCode);
        }
        if (data.related_topics && data.related_topics.related_concepts) {
          setRelatedTopics(data.related_topics.related_concepts);
        }
      } catch (error) {
        console.error('Error fetching diagram:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId && conversationId) {
      fetchDiagram();
    }
  }, [userId, conversationId]);

  // Render the diagram when diagram data is available
  useEffect(() => {
    if (!diagram || !diagramContainerRef.current) return;

    const renderDiagram = async () => {
      try {
        // Clear previous content
        const container = diagramContainerRef.current;
        container.innerHTML = '';
        
        // Create a new div for the diagram
        const diagramDiv = document.createElement('div');
        diagramDiv.id = diagramId;
        diagramDiv.className = 'mermaid';
        diagramDiv.textContent = diagram;
        container.appendChild(diagramDiv);
        
        // Render the diagram
        await mermaid.run({
          nodes: [diagramDiv]
        });
        
        // Reset render attempts
        renderAttemptRef.current = 0;
      } catch (error) {
        console.error('Error rendering diagram:', error);
        
        // If rendering fails, try again up to 3 times with a delay
        if (renderAttemptRef.current < 3) {
          renderAttemptRef.current += 1;
          setTimeout(renderDiagram, 500);
        }
      }
    };

    // Add a small delay to ensure the DOM is ready
    setTimeout(renderDiagram, 100);
  }, [diagram, diagramId]);

  if (error) {
    return null;
  }

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

  if (!diagram) {
    return null;
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Related Topics Box */}
      {relatedTopics.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {relatedTopics.map((topic, index) => (
              <button
                key={index}
                className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-md border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Concept Map Box */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Concept Map</h3>
        <div ref={diagramContainerRef} className="overflow-auto">
          {/* Mermaid diagram will be rendered here */}
        </div>
      </div>
    </div>
  );
};

export default DiagramRenderer;