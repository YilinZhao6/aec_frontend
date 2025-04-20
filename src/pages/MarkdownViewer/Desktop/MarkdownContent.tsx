import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Loader2 } from 'lucide-react';
import { customComponents } from './utils/markdownUtils';
import ConceptExplanations from './components/ConceptExplanations';
import DiagramConceptRenderer from './components/DiagramConceptRenderer';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';

interface MarkdownContentProps {
  content: string;
  isLoading: boolean;
  qaComponents: { id: string; component: React.ReactNode }[];
  zoom: number;
  userId: string;
  conversationId: string;
  isComplete: boolean;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({
  content,
  isLoading,
  qaComponents,
  zoom,
  userId,
  conversationId,
  isComplete
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [conceptTopics, setConceptTopics] = useState<{tag: string; text: string; explanation: string}[]>([]);

  const extractConceptsFromContent = (content: string) => {
    const conceptRegex = /<span\s+data-concept-tag="([^"]+)"[^>]*>([^<]+)<\/span>/g;
    const boldTermsRegex = /\*\*([^*]+)\*\*/g;
    const simpleVarRegex = /\$([a-zA-Z][a-zA-Z0-9_]{0,2})\$/g;

    const excludedTerms = [
      'problem', 'solution', 'example', '第一部分', '第二部分', '第三部分',
      '一', '二', '三', '四', '五', '引言', '结论', 'introduction', 'conclusion',
      'summary', '摘要', '概述', '总结', 'exercise', '练习', 'question', '问题',
      'answer', 'part', 'section'
    ];

    const concepts: {tag: string; text: string; explanation: string}[] = [];
    const processedTags = new Set<string>();
    const maxConcepts = 30;

    const removePrefixes = (text: string) => {
      return text.replace(/^(example|例子|例题|练习|问题|solution|解答|解决方案|问题)\s*[:：]\s*/i, '').trim();
    };

    const shouldExcludeTerm = (text: string) => {
      const lowerText = text.toLowerCase();
      
      if (excludedTerms.some(term => lowerText === term || lowerText.startsWith(term + ':'))) {
        return true;
      }
      
      if (text.length < 3) {
        return true;
      }
      
      return false;
    };

    let match;
    while ((match = conceptRegex.exec(content)) !== null) {
      const tag = match[1];
      let text = match[2].trim();
      
      text = removePrefixes(text);
      
      if (shouldExcludeTerm(text)) continue;
      
      if (!processedTags.has(tag) && concepts.length < maxConcepts) {
        concepts.push({
          tag,
          text,
          explanation: `${text}是本文中的一个重要概念。`
        });
        processedTags.add(tag);
      }
    }

    while ((match = boldTermsRegex.exec(content)) !== null) {
      let text = match[1].trim();
      
      text = removePrefixes(text);
      
      if (text.length > 40 || shouldExcludeTerm(text)) continue;
      
      const tag = text.toLowerCase().replace(/\s+/g, '_');
      
      if (!processedTags.has(tag) && concepts.length < maxConcepts) {
        concepts.push({
          tag,
          text,
          explanation: `${text}是本文中的一个重要术语。`
        });
        processedTags.add(tag);
      }
    }

    if (concepts.length < 5) {
      while ((match = simpleVarRegex.exec(content)) !== null && concepts.length < maxConcepts) {
        const text = match[1];
        const tag = `math_${text}`;
        
        if (!processedTags.has(tag)) {
          concepts.push({
            tag,
            text: `$${text}$`,
            explanation: `变量 ${text} 是本文中出现的数学符号。`
          });
          processedTags.add(tag);
        }
      }
    }

    return concepts.slice(0, maxConcepts);
  };

  useEffect(() => {
    if (content) {
      const extractedConcepts = extractConceptsFromContent(content);
      setConceptTopics(extractedConcepts);
    }
  }, [content]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <>
      <div ref={contentRef}>
        <ReactMarkdown
          children={content}
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[
            rehypeHighlight,
            [rehypeKatex, { strict: false, throwOnError: false, output: 'html' }],
            rehypeRaw
          ]}
          className="markdown-content"
          components={customComponents(qaComponents)}
        />

        {!isComplete && (
          <div className="space-y-4 mt-8">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-sweep" />
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-sweep" />
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-sweep" />
            </div>
          </div>
        )}
      </div>

      <ConceptExplanations concepts={conceptTopics} editorRef={contentRef} />

      {isComplete && (
        <DiagramConceptRenderer
          userId={userId}
          conversationId={conversationId}
          isArchiveView={false}
        />
      )}
    </>
  );
};

export default MarkdownContent;