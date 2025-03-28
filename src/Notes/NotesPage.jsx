import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft,
  ChevronRight,
  Search,
  Folder,
  FileText,
  Edit2,
  Trash2,
  Plus,
  Home
} from 'lucide-react';
import { SidebarTrigger } from '../LeftSidebar';
import * as NotesAPI from './api';

const NotesPage = () => {
  const [currentPath, setCurrentPath] = useState([]);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [renamingItem, setRenamingItem] = useState(null);
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    fetchNoteTree();
  }, [currentPath]);

  const fetchNoteTree = async () => {
    try {
      const response = await NotesAPI.getUserNoteTree(userId);
      if (response.success) {
        let current = response.folder_tree;
        // Navigate to current path
        for (const folder of currentPath) {
          current = current.subfolders.find(f => f.folder_name === folder);
          if (!current) break;
        }
        
        if (current) {
          setFolders(current.subfolders || []);
          setFiles(current.files || []);
        }
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleCreateFolder = async () => {
    try {
      const currentDirectory = currentPath.join('/');
      const response = await NotesAPI.createFolder(userId, currentDirectory);
      if (response.success) {
        await fetchNoteTree();
        setRenamingItem({ type: 'folder', name: response.folder_name });
        setNewName(response.folder_name);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleCreateFile = async () => {
    try {
      const currentDirectory = currentPath.join('/');
      const response = await NotesAPI.createFile(userId, currentDirectory);
      if (response.success) {
        await fetchNoteTree();
        setRenamingItem({ type: 'file', name: response.file_name });
        setNewName(response.file_name.replace('.md', ''));
      }
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  const handleRename = async () => {
    if (!renamingItem || !newName.trim()) return;

    try {
      let response;
      if (renamingItem.type === 'folder') {
        const currentDirectory = [...currentPath, renamingItem.name].join('/');
        response = await NotesAPI.renameFolder(userId, currentDirectory, newName);
      } else {
        const currentName = renamingItem.name;
        const newNameWithExt = newName.endsWith('.md') ? newName : `${newName}.md`;
        response = await NotesAPI.renameFile(
          userId,
          currentName,
          newNameWithExt
        );
      }

      if (response.success) {
        await fetchNoteTree();
      }
    } catch (error) {
      console.error('Error renaming item:', error);
    } finally {
      setRenamingItem(null);
      setNewName('');
    }
  };

  const handleDelete = async (type, name) => {
    try {
      const directory = [...currentPath, name].join('/');
      const response = type === 'folder' 
        ? await NotesAPI.deleteFolder(userId, directory)
        : await NotesAPI.deleteFile(userId, directory);

      if (response.success) {
        await fetchNoteTree();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleItemClick = (e, item) => {
    e.stopPropagation(); // Prevent event bubbling
    
    // If we're currently renaming this item, don't navigate
    if (renamingItem?.name === (item.type === 'folder' ? item.folder_name : item.name)) {
      return;
    }

    if (item.type === 'folder') {
      setCurrentPath(prev => [...prev, item.folder_name]);
    } else {
      navigate(`/notes/${item.name}`);
    }
  };

  // Filter folders and files separately
  const filteredFolders = folders.filter(folder => 
    folder.folder_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredFiles = files.filter(file => 
    file.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create combined items array with type information
  const filteredItems = [
    ...filteredFolders.map(folder => ({ type: 'folder', ...folder })),
    ...filteredFiles.map(file => ({ type: 'file', name: file }))
  ];

  return (
    <div className="relative min-h-screen bg-[#F0F0F0]">
      <SidebarTrigger 
        onHomeClick={() => navigate('/')}
        onProfileClick={() => navigate('/profile')}
        onArchivesClick={() => navigate('/archive')}
        onUploadClick={() => navigate('/upload')}
      />
      
      <div className="w-[65%] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Notes</h1>
          <p className="text-sm text-gray-500">Manage your notes and folders</p>
        </div>

        {/* Combined Navigation Bar */}
        <div className="mb-6 flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#EEEEEE] border border-[#CCCCCC] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPath([])}
              className="p-2 bg-[#EEEEEE] hover:bg-[#E5E5E5] rounded-lg text-gray-600"
              title="Home"
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPath(prev => prev.slice(0, -1))}
              disabled={currentPath.length === 0}
              className={`p-2 rounded-lg text-gray-600 ${
                currentPath.length > 0 
                  ? 'bg-[#EEEEEE] hover:bg-[#E5E5E5]' 
                  : 'bg-[#E5E5E5] opacity-50 cursor-not-allowed'
              }`}
              title="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              disabled={true}
              className="p-2 bg-[#E5E5E5] rounded-lg text-gray-600 opacity-50 cursor-not-allowed"
              title="Forward"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Current Path Display */}
          <div className="flex items-center bg-[#EEEEEE] px-3 py-1.5 rounded-lg border border-[#CCCCCC]">
            <span className="text-sm text-gray-600">
              {currentPath.length === 0 ? 'Notes' : `Notes / ${currentPath.join(' / ')}`}
            </span>
          </div>

          {/* Create Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={handleCreateFolder}
              className="p-2 bg-[#EEEEEE] hover:bg-[#E5E5E5] rounded-lg text-gray-600"
              title="New Folder"
            >
              <Folder className="w-5 h-5" />
            </button>
            <button
              onClick={handleCreateFile}
              className="p-2 bg-[#EEEEEE] hover:bg-[#E5E5E5] rounded-lg text-gray-600"
              title="New Note"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isFolder = item.type === 'folder';
            const itemName = isFolder ? item.folder_name : item.name;
            const displayName = isFolder ? itemName : itemName.replace('.md', '');
            
            return (
              <div
                key={itemName}
                className="group relative bg-[#EEEEEE] border border-[#CCCCCC] rounded-lg p-6 hover:border-gray-400 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={(e) => handleItemClick(e, item)}
              >
                <div className="flex items-center space-x-3">
                  {isFolder ? (
                    <Folder className="w-6 h-6 text-gray-400" />
                  ) : (
                    <FileText className="w-6 h-6 text-gray-400" />
                  )}
                  {renamingItem?.name === itemName ? (
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onBlur={handleRename}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRename();
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 px-2 py-1 bg-white border rounded"
                      autoFocus
                    />
                  ) : (
                    <span className="flex-1 font-medium text-gray-900">
                      {displayName}
                    </span>
                  )}
                </div>
                
                <div className="absolute top-2 right-2 hidden group-hover:flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenamingItem({ 
                        type: isFolder ? 'folder' : 'file', 
                        name: itemName 
                      });
                      setNewName(displayName);
                    }}
                    className="p-1 hover:bg-[#E5E5E5] rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(isFolder ? 'folder' : 'file', itemName);
                    }}
                    className="p-1 hover:bg-[#E5E5E5] rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;