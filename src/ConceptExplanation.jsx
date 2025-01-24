import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX styles

// Component to display the concept explanation popup
const ConceptPopup = ({ concept, explanation, onClose, position }) => {
  return (
    <div 
      className="fixed z-50 w-96 bg-white rounded-lg shadow-xl border border-gray-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: 'calc(100vh - 32px)'
      }}
    >
      <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="font-semibold text-gray-900">{concept}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors rounded-full p-1 hover:bg-gray-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4 overflow-auto max-h-[400px]">
        <ReactMarkdown
          children={explanation}
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          className="text-sm text-gray-600"
        />
      </div>
    </div>
  );
};

// Main component to handle concept explanations
const ConceptExplanationProvider = ({ children }) => {
  const [searchedConcepts, setSearchedConcepts] = useState(new Map());
  const [activePopup, setActivePopup] = useState(null);

  useEffect(() => {
    // Listen for successful feedback submissions
    const handleFeedbackSuccess = (event) => {
      const { concept, explanation } = event.detail;
      setSearchedConcepts(prev => new Map(prev).set(concept, explanation));
      
      // Find the concept in the document and highlight it
      highlightConcept(concept);
    };

    window.addEventListener('feedbackSuccess', handleFeedbackSuccess);
    return () => window.removeEventListener('feedbackSuccess', handleFeedbackSuccess);
  }, []);

  const highlightConcept = (concept) => {
    // Find all text nodes in the document
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent;
      if (text.includes(concept)) {
        // Create a wrapper span for the concept
        const span = document.createElement('span');
        span.className = 'concept-link bg-[#FFF3E0] cursor-pointer hover:bg-[#FFE0B2] px-1 rounded';
        span.setAttribute('data-concept', concept);
        
        // Replace the text with the highlighted version
        const regex = new RegExp(`(${concept})`, 'gi');
        const parts = text.split(regex);
        
        const fragment = document.createDocumentFragment();
        parts.forEach(part => {
          if (part.toLowerCase() === concept.toLowerCase()) {
            const highlightSpan = span.cloneNode(true);
            highlightSpan.textContent = part;
            fragment.appendChild(highlightSpan);
          } else {
            fragment.appendChild(document.createTextNode(part));
          }
        });
        
        node.parentNode.replaceChild(fragment, node);
      }
    }
  };

  useEffect(() => {
    // Add click handler for concept links
    const handleConceptClick = (e) => {
      const conceptLink = e.target.closest('.concept-link');
      if (conceptLink) {
        const concept = conceptLink.getAttribute('data-concept');
        const explanation = searchedConcepts.get(concept);
        
        if (explanation) {
          const rect = conceptLink.getBoundingClientRect();
          setActivePopup({
            concept,
            explanation,
            position: {
              x: Math.min(rect.right + 10, window.innerWidth - 384), // 384px is popup width
              y: Math.min(rect.top, window.innerHeight - 200) // Ensure popup stays in viewport
            }
          });
        }
      } else if (!e.target.closest('.concept-popup') && activePopup) {
        setActivePopup(null);
      }
    };

    document.addEventListener('click', handleConceptClick);
    return () => document.removeEventListener('click', handleConceptClick);
  }, [searchedConcepts, activePopup]);

  return (
    <>
      {children}
      {activePopup && (
        <ConceptPopup
          concept={activePopup.concept}
          explanation={activePopup.explanation}
          position={activePopup.position}
          onClose={() => setActivePopup(null)}
        />
      )}
    </>
  );
};

export default ConceptExplanationProvider;
