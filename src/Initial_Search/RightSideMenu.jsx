import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Library, StickyNote, Loader2 } from 'lucide-react';

const RightSideMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('history');
  const [searchHistory, setSearchHistory] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [historyResponse, notesResponse] = await Promise.all([
          fetch('https://backend-ai-cloud-explains.onrender.com/get_generated_explanations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
          }),
          fetch('https://backend-ai-cloud-explains.onrender.com/note/get_user_note_tree', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
          })
        ]);

        const [historyData, notesData] = await Promise.all([
          historyResponse.json(),
          notesResponse.json()
        ]);

        if (historyData.success && historyData.data.articles) {
          const sortedHistory = historyData.data.articles
            .sort((a, b) => new Date(b.generated_at) - new Date(a.generated_at))
            .slice(0, 5);
          setSearchHistory(sortedHistory);
        } else {
          setSearchHistory([]);
        }

        if (notesData.success && notesData.folder_tree) {
          const allNotes = extractNotes(notesData.folder_tree);
          const sortedNotes = allNotes
            .sort((a, b) => new Date(b.modified_at) - new Date(a.modified_at))
            .slice(0, 5);
          setNotes(sortedNotes);
        } else {
          setNotes([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setSearchHistory([]);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const extractNotes = (folder, path = '') => {
    let notes = [];
    if (folder.files) {
      notes = folder.files.map(file => ({
        name: file,
        path: path ? `${path}/${file}` : file,
        modified_at: new Date().toISOString()
      }));
    }
    if (folder.subfolders) {
      folder.subfolders.forEach(subfolder => {
        const subPath = path ? `${path}/${subfolder.folder_name}` : subfolder.folder_name;
        notes = [...notes, ...extractNotes(subfolder, subPath)];
      });
    }
    return notes;
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!menuRef.current) return;
      
      const menuRect = menuRef.current.getBoundingClientRect();
      const threshold = 100;
      
      if (e.clientX > window.innerWidth - threshold) {
        setIsExpanded(true);
      } else if (e.clientX < menuRect.left - 50) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleHistoryClick = (article) => {
    navigate(`/archive/paper/${article.conversation_id}`);
  };

  const handleNoteClick = (note) => {
    navigate(`/notes/${note.name}`);
  };

  const TabButton = ({ isActive, onClick, icon: Icon, label }) => (
    <button 
      onClick={onClick}
      className={`
        relative group cursor-pointer w-12 
        ${isActive ? 'bg-[#E5E5E5]' : 'hover:bg-[#E5E5E5]'}
      `}
    >
      <div
        className={`
          flex items-center gap-2 px-3 py-2.5 min-h-[2.5rem]
          ${isActive ? 'text-gray-900' : 'text-gray-600'}
        `}
      >
        <Icon className="w-6.5 h-6.5 flex-shrink-0" />
        {isExpanded && (
          <span className="text-sm font-medium truncate">{label}</span>
        )}
      </div>
      {isActive && (
        <div className="absolute inset-y-0 right-0 w-0.5 bg-gray-600" />
      )}
    </button>
  );

  const EmptyState = ({ message, actionText }) => (
    <div className="flex flex-col items-center justify-center h-32 px-4 text-center">
      <p className="text-sm text-gray-500">{message}</p>
      <button 
        onClick={() => navigate(activeTab === 'history' ? '/' : '/notes')}
        className="mt-2 text-sm text-gray-900 hover:underline font-medium"
      >
        {actionText} →
      </button>
    </div>
  );

  if (!userId) {
    return (
      <div
        ref={menuRef}
        className={`
          fixed top-24 right-0 shadow-lg
          transition-all duration-300 ease-in-out z-20
          ${isExpanded ? 'w-72' : 'w-12'}
        `}
      >
        <div className="flex">
          <div className="flex flex-col">
            <TabButton
              isActive={activeTab === 'history'}
              onClick={() => setActiveTab('history')}
              icon={Library}
              label="History"
            />
            <TabButton
              isActive={activeTab === 'notes'}
              onClick={() => setActiveTab('notes')}
              icon={StickyNote}
              label="Notes"
            />
          </div>
          {isExpanded && (
            <div className="flex-1 overflow-auto bg-white">
              <EmptyState 
                message="Please sign in to view your history and notes" 
                actionText="Sign in to continue"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className={`
        fixed top-24 right-0 shadow-lg
        transition-all duration-300 ease-in-out z-20
        ${isExpanded ? 'w-72' : 'w-12'}
      `}
    >
      <div className="flex">
        <div className="flex flex-col">
          <TabButton
            isActive={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
            icon={Library}
            label="History"
          />
          <TabButton
            isActive={activeTab === 'notes'}
            onClick={() => setActiveTab('notes')}
            icon={StickyNote}
            label="Notes"
          />
        </div>

        {isExpanded && (
          <div className="flex-1 overflow-auto bg-white">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {activeTab === 'history' ? (
                  searchHistory.length > 0 ? (
                    searchHistory.map((article) => (
                      <button
                        key={article.conversation_id}
                        onClick={() => handleHistoryClick(article)}
                        className="w-full text-left p-2 hover:bg-[#F0F0F0] rounded group"
                      >
                        <h3 className="text-sm text-gray-900 truncate group-hover:text-gray-700">
                          {article.topic}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDate(article.generated_at)}
                        </p>
                      </button>
                    ))
                  ) : (
                    <EmptyState 
                      message="No search history yet" 
                      actionText="Start your first search"
                    />
                  )
                ) : (
                  notes.length > 0 ? (
                    notes.map((note) => (
                      <button
                        key={note.path}
                        onClick={() => handleNoteClick(note)}
                        className="w-full text-left p-2 hover:bg-[#F0F0F0] rounded group"
                      >
                        <h3 className="text-sm text-gray-900 truncate group-hover:text-gray-700">
                          {note.name.replace('.md', '')}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDate(note.modified_at)}
                        </p>
                      </button>
                    ))
                  ) : (
                    <EmptyState 
                      message="No notes yet" 
                      actionText="Create your first note"
                    />
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSideMenu;