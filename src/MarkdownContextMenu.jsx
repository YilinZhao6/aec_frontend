import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const ContextMenu = ({ position, onClose, selectedText, onSubmitFollowUp }) => {
  const [showInput, setShowInput] = useState(false);
  const [followUpText, setFollowUpText] = useState('');
  const [menuPosition, setMenuPosition] = useState(position);

  useEffect(() => {
    const menu = document.getElementById('context-menu');
    if (!menu) return;

    const rect = menu.getBoundingClientRect();
    const newPosition = { ...position };

    if (rect.right > window.innerWidth) {
      newPosition.x = window.innerWidth - rect.width - 10;
    }
    if (rect.bottom > window.innerHeight) {
      newPosition.y = window.innerHeight - rect.height - 10;
    }

    setMenuPosition(newPosition);
  }, [position]);

  const handleSubmit = async () => {
    if (!followUpText.trim()) return;
    onSubmitFollowUp({
      selectedText,
      followUpQuestion: followUpText.trim()
    });
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!showInput) {
    return (
      <div
        id="context-menu"
        className="fixed bg-white border border-gray-200 shadow-md z-50"
        style={{
          left: `${menuPosition.x}px`,
          top: `${menuPosition.y}px`,
          minWidth: '200px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-1">
          <button
            onClick={() => setShowInput(true)}
            className="w-full text-left px-4 py-1.5 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Ask Follow-Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="context-menu"
      className="fixed bg-[#fbf7f0] rounded-lg shadow-lg border border-[#e6dcca] z-50 w-[360px]
                font-serif animate-in fade-in duration-200"
      style={{
        left: `${menuPosition.x}px`,
        top: `${menuPosition.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3 flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Ask a follow-up question..."
            value={followUpText}
            onChange={(e) => setFollowUpText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full px-3 py-1.5 text-sm bg-white border border-[#e6dcca] rounded-md
                     placeholder:text-[#b3a89f] text-[#4b4541]
                     focus:outline-none focus:ring-1 focus:ring-[#d4c4b0] focus:border-[#d4c4b0]
                     transition-all duration-200"
          />
          <span className="absolute right-2 top-1.5 text-xs text-[#b3a89f]">
            ↵
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowInput(false)}
            className="p-1.5 text-sm font-medium text-[#8c8177] hover:text-[#4b4541]
                     hover:bg-[#f3ede3] rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            onClick={handleSubmit}
            disabled={!followUpText.trim()}
            className="p-1.5 text-sm font-medium text-[#8c8177] hover:text-[#4b4541]
                     hover:bg-[#f3ede3] rounded transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText) {
      setContextMenu({
        position: { x: event.pageX, y: event.pageY },
        selectedText
      });
    } else {
      setContextMenu(null);
    }
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

 // In MarkdownContextMenu.jsx - update the handleSubmitFollowUp function

    const handleSubmitFollowUp = useCallback(async ({ selectedText, followUpQuestion }) => {
        try {
            const response = await fetch('http://localhost:5000/submit_feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    concept: selectedText,
                    question: followUpQuestion,
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
            }

            if (data.status === 'success' && data.data) {
                // Dispatch custom event with the concept data
                const event = new CustomEvent('feedbackSuccess', {
                    detail: {
                        concept: selectedText,
                        explanation: data.data.explanation
                    }
                });
                window.dispatchEvent(event);
            }
        } catch (error) {
            console.error("Error sending request:", error);
        }
    }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (contextMenu && !e.target.closest('#context-menu')) {
        closeContextMenu();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [contextMenu, closeContextMenu]);

  return {
    contextMenu,
    handleContextMenu,
    closeContextMenu,
    ContextMenuComponent: contextMenu ? (
      <ContextMenu
        position={contextMenu.position}
        selectedText={contextMenu.selectedText}
        onClose={closeContextMenu}
        onSubmitFollowUp={handleSubmitFollowUp}
      />
    ) : null
  };
};

export default ContextMenu;
