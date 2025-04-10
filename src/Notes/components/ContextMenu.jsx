import React from 'react';
import { MessageSquare, Zap } from 'lucide-react';

const ContextMenu = ({ x, y, onClose, onAction }) => {
  const menuStyle = {
    position: 'fixed',
    top: `${y}px`,
    left: `${x}px`,
    zIndex: 1000,
  };

  return (
    <>
      <div className="fixed inset-0" onClick={onClose} />
      <div 
        style={menuStyle}
        className="bg-white dark:bg-cyber-dark rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden min-w-[200px]"
      >
        <div className="p-1">
          <button
            onClick={() => onAction('generate', 'normal')}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-cyber-gray rounded"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Explain
          </button>
        </div>
      </div>
    </>
  );
};

export default ContextMenu;