import React from 'react';
import TabSelector from './TabSelector';

const ExplanationPanel = ({ explanation, onClose }) => {
  const tabs = [
    { id: 'explanation', label: 'Explanation' }
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-cyber-dark">
      <TabSelector 
        tabs={tabs} 
        activeTab="explanation" 
        onTabChange={() => {}} 
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {explanation || 'Select text and choose "Explain" to see an explanation here.'}
        </div>
      </div>
    </div>
  );
};

export default ExplanationPanel;