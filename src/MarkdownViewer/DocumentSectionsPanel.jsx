import React from 'react';
import { BookOpen } from 'lucide-react';
import SectionProgressMenu from '../SectionProgressMenu';

/**
 * Document Sections Panel component
 * Displays the document sections in a fixed panel on the left side
 */
const DocumentSectionsPanel = ({ userId, conversationId, isArchiveView }) => {
  return (
    <div className="bg-[#F0F0F0] dark:bg-cyber-dark border border-[#CCCCCC] dark:border-[#2A2A30] rounded-lg overflow-hidden w-full">
      <div className="bg-[#F0F0F0] dark:bg-cyber-dark p-3 border-b border-[#CCCCCC] dark:border-[#2A2A30]">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 dark:text-terminal-silver font-quicksand">Document Sections</span>
        </div>
      </div>
      <div className="p-2 max-h-[calc(100vh-120px)] overflow-y-auto">
        <SectionProgressMenu 
          userId={userId} 
          conversationId={conversationId}
          isArchiveView={isArchiveView}
          isInPanel={true}
        />
      </div>
    </div>
  );
};

export default DocumentSectionsPanel;