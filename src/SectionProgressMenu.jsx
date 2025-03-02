import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Loader2, Check, ChevronLeft } from 'lucide-react';

const SectionProgressMenu = ({ userId, conversationId, isArchiveView }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [sections, setSections] = useState([]);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [outline, setOutline] = useState(null);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    let timeoutId;
    const fetchProgress = async () => {
      if (!userId || !conversationId) {
        console.log('Missing userId or conversationId');
        return;
      }

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

        if (!response.ok) {
          throw new Error('Failed to fetch progress');
        }

        const data = await response.json();
        
        if (data.outline) {
          setOutline(data.outline);
          if (!sections.length && data.outline.sections) {
            const initialSections = data.outline.sections.map(section => ({
              section_id: section.section_id,
              title: section.title,
              learning_goals: section.learning_goals,
              status: 'waiting'
            }));
            setSections(initialSections);
          }
        }

        if (data.sections && Array.isArray(data.sections)) {
          setSections(prevSections => {
            if (!prevSections.length) return data.sections;
            
            return prevSections.map(prevSection => {
              const updatedSection = data.sections.find(s => s.section_id === prevSection.section_id);
              return updatedSection || prevSection;
            });
          });
        }

        setError(null);

        if (!data.is_complete && !isArchiveView) {
          timeoutId = setTimeout(fetchProgress, 3000);
        }
      } catch (error) {
        console.error('Error fetching section progress:', error);
        setError(error.message);
        if (!isArchiveView) {
          timeoutId = setTimeout(fetchProgress, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!isArchiveView || sections.length === 0) {
      setLoading(true);
      fetchProgress();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [userId, conversationId, isArchiveView]);

  if (!userId || !conversationId) {
    return null;
  }

  if (loading && !outline) {
    return (
      <div className="fixed top-[56px] left-[70px] z-10 bg-white border-r border-b border-gray-200 shadow-md w-80 p-4">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          <span className="text-gray-600">Loading outline...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed top-[56px] left-[70px] z-10 bg-white border-r border-b border-gray-200 shadow-md transition-all duration-300 ${isExpanded ? 'w-80' : 'w-12'}`}>
      {/* Header - Show arrows only on desktop */}
      <div 
        className="hidden sm:flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded && <span className="font-medium text-gray-700">Section Progress</span>}
        {isExpanded ? (
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500" />
        )}
      </div>

      {/* Mobile Header - No arrows */}
      <div className="sm:hidden flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        {isExpanded && <span className="font-medium text-gray-700">Section Progress</span>}
      </div>

      {/* Error Message */}
      {error && isExpanded && (
        <div className="p-3 text-sm text-red-600 bg-red-50">
          Failed to load sections: {error}
        </div>
      )}

      {/* Sections List */}
      {isExpanded && sections.length > 0 && (
        <div className="max-h-[calc(100vh-96px)] overflow-y-auto">
          {sections.map((section) => (
            <div key={section.section_id} className="border-b border-gray-100">
              <div 
                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleSection(section.section_id)}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0 w-8">
                  {section.status === 'waiting' && (
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                      <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-1 rounded">T</span>
                    </div>
                  )}
                  {section.status === 'text_complete' && (
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                      <span className="ml-1 text-xs bg-orange-100 text-orange-700 px-1 rounded">I</span>
                    </div>
                  )}
                  {section.status === 'complete' && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </div>

                {/* Title and Expand Icon */}
                <span className="flex-1 text-sm text-gray-700 ml-2">{section.title}</span>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    expandedSections.has(section.section_id) ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {/* Learning Goals */}
              {expandedSections.has(section.section_id) && section.learning_goals && section.learning_goals.length > 0 && (
                <div className="bg-gray-50 p-3 text-sm">
                  <div className="text-xs font-medium text-gray-500 mb-2">Learning Goals:</div>
                  <ul className="list-disc pl-4 space-y-1">
                    {section.learning_goals.map((goal, index) => (
                      <li key={index} className="text-gray-600 text-xs">{goal}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SectionProgressMenu;