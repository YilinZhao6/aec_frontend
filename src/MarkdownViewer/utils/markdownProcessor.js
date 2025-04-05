// Utility functions for processing custom markdown tags and components

/**
 * Process custom tags in markdown content
 * @param {string} content - Raw markdown content
 * @returns {string} - Processed content with HTML replacements
 */
export const processCustomTags = (content) => {
  if (!content) return '';
  
  let processedContent = content;

  // Process citations
  processedContent = processedContent.replace(
    /<CITE:\s*([^,]+),\s*([^>]+)>/g, 
    (match, source, url) => {
      const id = 'citation-' + Math.random().toString(36).substring(2, 12);
      return `<a id="${id}" href="${url.trim()}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-2 py-1 bg-off-white hover:bg-gray-200 text-gray-700 text-xs rounded-md border border-[#CCCCCC] transition-colors ml-1 font-quicksand">
        <span>${source.trim()}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>`;
    }
  );

  // Process highlights
  processedContent = processedContent.replace(
    /<highlight>(.*?)<\/highlight>/g,
    '<span class="font-bold bg-yellow-200 px-1 rounded">$1</span>'
  );

  // Process concepts
  processedContent = processedContent.replace(
    /<concept>(.*?)<\/concept>/g,
    (match, conceptText) => {
      const conceptId = 'concept-' + Math.random().toString(36).substring(2, 12);
      return `<button id="${conceptId}" class="concept-button font-medium text-blue-600 underline underline-offset-2 cursor-pointer" data-concept="${conceptText}">${conceptText}</button>`;
    }
  );

  return processedContent;
};

/**
 * Custom components for ReactMarkdown
 */
export const customComponents = {
  'question_area': ({node, ...props}) => {
    const questions = node.children
      .filter(child => child.tagName === 'question')
      .map(child => child.children[0].value);

    const handleQuestionClick = (question) => {
      console.log('Question clicked:', question);
    };

    return (
      <div className="question-area">
        <h4>Related Questions</h4>
        {questions.map((question, index) => (
          <button
            key={index}
            className="question-button"
            onClick={() => handleQuestionClick(question)}
          >
            {question}
          </button>
        ))}
      </div>
    );
  }
};