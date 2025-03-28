import React, { useState } from 'react';
import { HelpCircle, Loader2 } from 'lucide-react';

const QuestionWithAnswer = ({ question, answer: initialAnswer, userId, conversationId }) => {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [answer, setAnswer] = useState(initialAnswer);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnswer = async () => {
    if (answer || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://backend-ai-cloud-explains.onrender.com/ask_in_section_question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          conversation_id: conversationId,
          question: question
        }),
      });

      const data = await response.json();
      if (data.explanation) {
        setAnswer(data.explanation);
        setIsAnswerVisible(true);
      }
    } catch (error) {
      console.error('Error fetching answer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (!answer) {
      fetchAnswer();
    } else {
      setIsAnswerVisible(!isAnswerVisible);
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={handleClick}
        className={`question-button w-full text-left px-6 py-4 bg-white dark:bg-cyber-gray rounded-lg border border-gray-200 dark:border-gray-600 hover:border-neon-blue dark:hover:border-neon-teal hover:shadow-md transition-all duration-200 text-gray-800 dark:text-gray-200 text-base font-quicksand ${
          isAnswerVisible ? 'bg-gray-50 dark:bg-cyber-gray/80' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <span>{question}</span>
          {!answer && !isLoading && <HelpCircle className="w-5 h-5 text-gray-400" />}
          {isLoading && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
        </div>
      </button>
      
      {isLoading && (
        <div className="mt-2 px-6 py-4 bg-gray-50 dark:bg-cyber-gray/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-sweep" />
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-sweep" />
            </div>
          </div>
        </div>
      )}
      
      {answer && isAnswerVisible && (
        <div className="mt-2 px-6 py-4 bg-gray-50 dark:bg-cyber-gray/50 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-base font-quicksand">
          {answer}
        </div>
      )}
    </div>
  );
};

/**
 * Process custom tags in markdown content
 * @param {string} content - Raw markdown content
 * @returns {string} - Processed content with HTML replacements
 */
export const processCustomTags = (content) => {
  if (!content) return { processedContent: '', qaComponents: [] };
  
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

  // Find and store all question-answer pairs
  const qaComponents = [];
  let qaIndex = 0;
  
  processedContent = processedContent.replace(
    /<question>([\s\S]*?)<\/question>\s*(?:<answer>([\s\S]*?)<\/answer>)?/g,
    (match, question, answer = '') => {
      const componentId = `qa-${qaIndex++}`;
      qaComponents.push({
        id: componentId,
        component: (
          <QuestionWithAnswer 
            key={componentId} 
            question={question.trim()} 
            answer={answer.trim()}
            userId={localStorage.getItem('user_id')}
            conversationId={localStorage.getItem('current_article_conversation_id')}
          />
        )
      });
      return `<div id="${componentId}"></div>`;
    }
  );

  // Remove the question_area tags but keep their content
  processedContent = processedContent.replace(
    /<question_area>([\s\S]*?)<\/question_area>/g,
    '$1'
  );

  return { processedContent, qaComponents };
};

/**
 * Custom components for ReactMarkdown
 */
export const customComponents = {
  // Simple h2 header without clarify button
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold mb-4">{children}</h2>
  ),
  
  // Simple passthrough for any remaining question areas
  question_area: ({ node, ...props }) => {
    return <div>{props.children}</div>;
  }
};