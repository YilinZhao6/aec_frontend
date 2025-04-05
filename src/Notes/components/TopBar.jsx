import React from 'react';
import { 
  File, 
  FolderPlus, 
  Grid, 
  List,
  Settings,
  Maximize2,
  Minimize2,
  Minus,
  X
} from 'lucide-react';

const TopBar = ({ 
  viewMode, 
  onViewModeChange,
  isFullscreen,
  onToggleFullscreen,
  onNewFolder,
  onNewNote
}) => {
  return (
    <div className="bg-[#F0F0F0] border-b border-gray-300">
      {/* Window Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-quicksand">File Explorer</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-gray-300 rounded">
            <Minus className="w-4 h-4" />
          </button>
          <button 
            onClick={onToggleFullscreen}
            className="p-1 hover:bg-gray-300 rounded"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button className="p-1 hover:bg-gray-300 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onNewNote}
            className="flex items-center space-x-2 px-3 py-1 hover:bg-gray-200 rounded"
          >
            <File className="w-4 h-4" />
            <span className="text-sm font-quicksand">New Note</span>
          </button>
          <button 
            onClick={onNewFolder}
            className="flex items-center space-x-2 px-3 py-1 hover:bg-gray-200 rounded"
          >
            <FolderPlus className="w-4 h-4" />
            <span className="text-sm font-quicksand">New Folder</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;