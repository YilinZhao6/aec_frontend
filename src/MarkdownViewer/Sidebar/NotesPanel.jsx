import React, { useState, useEffect } from 'react';
import { Bookmark, X, Send, Plus, Folder, Loader2, ChevronRight, File, ChevronDown } from 'lucide-react';

const NotesPanel = () => {
  const [note, setNote] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [userNotes, setUserNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [showNoteSelector, setShowNoteSelector] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isNotificationExiting, setIsNotificationExiting] = useState(false);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    fetchUserNotes();

    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      setSelectedText(text);
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  const fetchUserNotes = async () => {
    if (!userId) return;

    try {
      const response = await fetch('https://backend-ai-cloud-explains.onrender.com/note/get_user_note_tree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      const data = await response.json();
      if (data.success) {
        setUserNotes([data.folder_tree]);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleAddToNote = async () => {
    if (!selectedNote) return;
    
    const content = selectedText || note;
    if (!content) return;

    setLoading(true);
    try {
      const response = await fetch('https://backend-ai-cloud-explains.onrender.com/note/add_content_to_notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          note_filename: selectedNote.filename,
          note_content: content
        })
      });

      if (response.ok) {
        if (selectedText) {
          setSelectedText('');
          window.getSelection().removeAllRanges();
        }
        setNote('');
        setSuccessMessage(`Note added successfully to ${selectedNote.filename}`);
        setIsNotificationExiting(false);
        
        // Handle notification disappearing with transition
        setTimeout(() => {
          setIsNotificationExiting(true);
          setTimeout(() => {
            setSuccessMessage('');
            setIsNotificationExiting(false);
          }, 300); // Match this with CSS transition duration
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding content to note:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (path) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderFileTree = (item, path = '') => {
    const currentPath = path ? `${path}/${item.folder_name}` : item.folder_name || '';
    
    return (
      <div key={currentPath || 'root'} className="ml-2">
        {item.folder_name && (
          <button
            onClick={() => toggleFolder(currentPath)}
            className="flex items-center gap-2 px-2 py-1 w-full hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A30] rounded text-left"
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                expandedFolders.has(currentPath) ? 'rotate-90' : ''
              }`}
            />
            <Folder className="w-4 h-4 text-gray-400" />
            <span className="text-sm truncate">{item.folder_name}</span>
          </button>
        )}
        
        {expandedFolders.has(currentPath) && (
          <div className="ml-4 bg-[#F0F0F0] dark:bg-[#1E1E24] rounded-md my-1">
            {item.files?.filter(f => f.endsWith('.md')).map(file => (
              <button
                key={file}
                onClick={() => {
                  setSelectedNote({ filename: file, path: currentPath });
                  setShowNoteSelector(false);
                }}
                className={`flex items-center gap-2 px-2 py-1 w-full hover:bg-[#E5E5E5] dark:hover:bg-[#2A2A30] rounded text-left ${
                  selectedNote?.filename === file ? 'bg-[#E5E5E5] dark:bg-[#2A2A30]' : ''
                }`}
              >
                <File className="w-4 h-4 text-gray-400" />
                <span className="text-sm truncate">{file}</span>
              </button>
            ))}
            {item.subfolders?.map(subfolder => renderFileTree(subfolder, currentPath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Current Note Selection */}
      <div className="p-3 border-b border-[#CCCCCC] dark:border-[#2A2A30]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Note:</span>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {selectedNote ? selectedNote.filename : 'None selected'}
            </span>
          </div>
          <button
            onClick={() => setShowNoteSelector(!showNoteSelector)}
            className="px-3 py-1.5 text-sm bg-[#E5E5E5] dark:bg-cyber-gray text-gray-700 dark:text-gray-300 rounded hover:bg-[#D5D5D5] dark:hover:bg-[#2A2A35] flex items-center gap-1"
          >
            Select Note
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Note Tree */}
        {showNoteSelector && (
          <div className="mt-2 bg-[#F0F0F0] dark:bg-cyber-dark border border-[#CCCCCC] dark:border-[#2A2A30] rounded h-48 overflow-y-auto">
            {userNotes.map(note => renderFileTree(note))}
          </div>
        )}
      </div>

      {/* Main Content Area with Fixed Height */}
      <div className="flex-1 overflow-hidden flex flex-col" style={{ minHeight: 0 }}>
        {/* Notes Input */}
        <div className="p-3 border-b border-[#CCCCCC] dark:border-[#2A2A30]">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full p-2 bg-[#F0F0F0] dark:bg-cyber-dark border border-[#CCCCCC] dark:border-[#2A2A30] rounded resize-none h-20 text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
          />
        </div>

        {/* Selected Text Display */}
        <div className="p-3 border-b border-[#CCCCCC] dark:border-[#2A2A30] overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Text</span>
            {selectedText && (
              <button
                onClick={() => setSelectedText('')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedText || "No text selected"}
          </div>
        </div>
      </div>

      {/* Add Button with Success Message - Fixed at Bottom */}
      <div className="p-3 border-t border-[#CCCCCC] dark:border-[#2A2A30] bg-[#F0F0F0] dark:bg-cyber-dark">
        {successMessage && (
          <div className={`mb-3 transform transition-all duration-300 ease-in-out ${
            isNotificationExiting ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
          }`}>
            <div className="px-3 py-2 bg-[#E5E5E5] dark:bg-[#2A2A30] text-gray-700 dark:text-gray-300 text-sm rounded-md border border-[#CCCCCC] dark:border-[#3A3A45]">
              {successMessage}
            </div>
          </div>
        )}
        <button
          onClick={handleAddToNote}
          disabled={!selectedNote || (!note && !selectedText) || loading}
          className="w-full px-3 py-2 bg-gray-800 dark:bg-neon-green text-white dark:text-cyber-black rounded hover:bg-gray-700 dark:hover:bg-neon-cyan disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-1"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Add to Note</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NotesPanel;