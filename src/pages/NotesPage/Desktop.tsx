import React, { useState, useEffect, useRef } from 'react';
import { Plus, FolderPlus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import MainLayout from '../../components/Layout/MainLayout';
import ParticleBackground from '../../components/ParticleBackground';
import FileRow from './components/FileRow';
import FolderRow from './components/FolderRow';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';
import { notesAPI } from '../../api/notes';
import { NOTES_PAGE_STRINGS } from '../../constants/strings';
import './NotesPage.css';

interface NoteFile {
  file_name: string;
  created_at: string;
  last_modified: string;
}

interface NoteFolder {
  folder_name: string;
  created_at: string;
  files: NoteFile[];
  subfolders: NoteFolder[];
}

interface FolderTree {
  files: NoteFile[];
  folders: NoteFolder[];
}

interface EditingItem {
  type: 'file' | 'folder';
  path: string;
  name: string;
  isNew?: boolean;
}

interface DeleteConfirmation {
  type: 'file' | 'folder';
  name: string;
  isVisible: boolean;
}

const Desktop = () => {
  const { t } = useLanguage();
  const [folderTree, setFolderTree] = useState<FolderTree | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (editingItem && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingItem]);

  const fetchNotes = async () => {
    if (!userId) {
      setError(t(NOTES_PAGE_STRINGS.ERRORS.USER));
      setLoading(false);
      return;
    }

    try {
      const response = await notesAPI.getNoteTree(userId);
      if (response.success && response.folder_tree) {
        setFolderTree(response.folder_tree);
      } else {
        setError(response.message || t(NOTES_PAGE_STRINGS.ERRORS.FETCH));
      }
    } catch (error) {
      setError(t(NOTES_PAGE_STRINGS.ERRORS.SERVER));
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (currentDirectory: string = '') => {
    if (!userId) return;

    try {
      const response = await notesAPI.createFolder(userId, currentDirectory);
      if (response.success) {
        if (currentDirectory) {
          setExpandedFolders(prev => [...prev, currentDirectory]);
        }
        setEditingItem({
          type: 'folder',
          path: currentDirectory,
          name: response.folder_name,
          isNew: true
        });
        fetchNotes();
      }
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleCreateFile = async (currentDirectory: string = '') => {
    if (!userId) return;

    try {
      const response = await notesAPI.createFile(userId, currentDirectory);
      if (response.success) {
        if (currentDirectory) {
          setExpandedFolders(prev => [...prev, currentDirectory]);
        }
        setEditingItem({
          type: 'file',
          path: currentDirectory,
          name: response.file_name,
          isNew: true
        });
        fetchNotes();
      }
    } catch (error) {
      console.error('Failed to create file:', error);
    }
  };

  const handleRenameFolder = async (currentDirectory: string, newName: string) => {
    if (!userId) return;

    try {
      const response = await notesAPI.renameFolder(userId, currentDirectory, newName);
      if (response.success) {
        setEditingItem(null);
        fetchNotes();
      }
    } catch (error) {
      console.error('Failed to rename folder:', error);
    }
  };

  const handleRenameFile = async (currentFilename: string, newName: string) => {
    if (!userId) return;

    const cleanCurrentFilename = currentFilename.replace('.md', '');
    const cleanNewName = newName.replace('.md', '');

    try {
      const response = await notesAPI.renameFile(
        userId, 
        `${cleanCurrentFilename}.md`, 
        `${cleanNewName}.md`
      );
      if (response.success) {
        setEditingItem(null);
        fetchNotes();
      }
    } catch (error) {
      console.error('Failed to rename file:', error);
    }
  };

  const handleDeleteFolder = async (folderName: string) => {
    if (!userId) return;

    try {
      const response = await notesAPI.deleteFolder(userId, folderName);
      if (response.success) {
        setDeleteConfirmation(null);
        fetchNotes();
      }
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  };

  const handleDeleteFile = async (filename: string) => {
    if (!userId) return;

    try {
      const response = await notesAPI.deleteFile(userId, filename);
      if (response.success) {
        setDeleteConfirmation(null);
        fetchNotes();
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const handleSubmitRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editInputRef.current) return;

    const newName = editInputRef.current.value.trim();
    if (!newName) return;

    if (editingItem.type === 'folder') {
      await handleRenameFolder(editingItem.path, newName);
    } else {
      await handleRenameFile(editingItem.name, newName);
    }
  };

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderPath)
        ? prev.filter(path => path !== folderPath)
        : [...prev, folderPath]
    );
  };

  const renderFile = (file: NoteFile, path: string = '') => (
    <FileRow
      key={`${path}/${file.file_name}`}
      file={file}
      path={path}
      isEditing={editingItem?.type === 'file' && editingItem.name === file.file_name}
      editInputRef={editInputRef}
      onEdit={() => setEditingItem({ type: 'file', path, name: file.file_name })}
      onDelete={() => setDeleteConfirmation({ type: 'file', name: file.file_name, isVisible: true })}
      onSubmitRename={handleSubmitRename}
      onCancelEdit={() => setEditingItem(null)}
    />
  );

  const renderFolder = (folder: NoteFolder, path: string = '') => {
    const currentPath = path ? `${path}/${folder.folder_name}` : folder.folder_name;
    const isExpanded = expandedFolders.includes(currentPath);

    return (
      <div key={currentPath} className="folder-container">
        <FolderRow
          folder={folder}
          path={currentPath}
          isExpanded={isExpanded}
          isEditing={editingItem?.type === 'folder' && editingItem.path === currentPath}
          editInputRef={editInputRef}
          onToggle={() => toggleFolder(currentPath)}
          onEdit={() => setEditingItem({ type: 'folder', path: currentPath, name: folder.folder_name })}
          onDelete={() => setDeleteConfirmation({ type: 'folder', name: folder.folder_name, isVisible: true })}
          onCreateFile={() => handleCreateFile(currentPath)}
          onCreateFolder={() => handleCreateFolder(currentPath)}
          onSubmitRename={handleSubmitRename}
          onCancelEdit={() => setEditingItem(null)}
        />

        {isExpanded && (
          <div className="folder-content">
            {folder.files.map(file => renderFile(file, currentPath))}
            {folder.subfolders?.map(subfolder => renderFolder(subfolder, currentPath))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="notes-container">
          <div className="loading-state">
            <Loader2 className="animate-spin" size={24} />
            <p>{t(NOTES_PAGE_STRINGS.LOADING)}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="notes-container">
          <div className="error-state">
            <p>{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="notes-container">
        <div className="notes-header">
          <h1 className="page-title">{t(NOTES_PAGE_STRINGS.PAGE_TITLE)}</h1>
          <div className="notes-actions">
            <button 
              className="action-button"
              onClick={() => handleCreateFile()}
            >
              <Plus size={16} />
              <span>{t(NOTES_PAGE_STRINGS.ACTIONS.NEW_FILE)}</span>
            </button>
            <button 
              className="action-button"
              onClick={() => handleCreateFolder()}
            >
              <FolderPlus size={16} />
              <span>{t(NOTES_PAGE_STRINGS.ACTIONS.NEW_FOLDER)}</span>
            </button>
          </div>
        </div>

        <div className="notes-content">
          <ParticleBackground />
          
          <div className="notes-list-header">
            <div className="name-cell">{t(NOTES_PAGE_STRINGS.LIST_HEADERS.NAME)}</div>
            <div className="created-cell">{t(NOTES_PAGE_STRINGS.LIST_HEADERS.CREATED)}</div>
            <div className="meta-cell">{t(NOTES_PAGE_STRINGS.LIST_HEADERS.LAST_MODIFIED)}</div>
            <div className="meta-cell">{t(NOTES_PAGE_STRINGS.LIST_HEADERS.OWNER)}</div>
            <div className="actions-cell">{t(NOTES_PAGE_STRINGS.LIST_HEADERS.ACTIONS)}</div>
          </div>

          <div className="notes-list">
            {folderTree && (
              <>
                {folderTree.files.map(file => renderFile(file))}
                {folderTree.folders.map(folder => renderFolder(folder))}
              </>
            )}
          </div>

          {deleteConfirmation?.isVisible && (
            <DeleteConfirmationDialog
              type={deleteConfirmation.type}
              onConfirm={() => {
                if (deleteConfirmation.type === 'folder') {
                  handleDeleteFolder(deleteConfirmation.name);
                } else {
                  handleDeleteFile(deleteConfirmation.name);
                }
              }}
              onCancel={() => setDeleteConfirmation(null)}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Desktop;