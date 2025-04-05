import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Printer, 
  BookmarkPlus,
  Highlighter,
  Share2,
  Palette,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const HIGHLIGHT_COLORS = [
  { name: 'Yellow', class: 'bg-yellow-200', color: '#fef08a' },
  { name: 'Green', class: 'bg-green-200', color: '#bbf7d0' },
  { name: 'Blue', class: 'bg-blue-200', color: '#bfdbfe' },
  { name: 'White', class: 'bg-white', color: '#ffffff' },
  { name: 'Gray', class: 'bg-gray-200', color: '#e5e7eb' },
  { name: 'Orange', class: 'bg-orange-200', color: '#fed7aa' },
];

export const ToolbarButton = ({ icon: Icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-md text-gray-900 dark:text-terminal-white
               hover:bg-gray-300 dark:hover:bg-[#3A3A45] transition-all duration-300 ${
                 active ? 'bg-gray-300 dark:bg-[#3A3A45]' : ''
               }`}
    title={label}
  >
    <Icon className="w-4 h-4" />
  </button>
);

export const ColorPicker = ({ selectedColor, onColorChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-900 dark:text-terminal-white
                  hover:bg-gray-300 dark:hover:bg-[#3A3A45] transition-all duration-300"
        title="Select highlight color"
      >
        <div className="relative">
          <Palette className="w-4 h-4" />
          <div 
            className="w-1.5 h-1.5 rounded-full absolute -bottom-0.5 -right-0.5"
            style={{ backgroundColor: HIGHLIGHT_COLORS.find(c => c.class === selectedColor)?.color }}
          />
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 p-2 bg-off-white dark:bg-cyber-dark rounded-lg shadow-lg border border-slate-300 dark:border-slate-600 flex flex-col space-y-1 z-50">
          {HIGHLIGHT_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => {
                onColorChange(color.class);
                setIsOpen(false);
              }}
              className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-terminal-light dark:hover:bg-cyber-gray min-w-[100px]"
            >
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color.color }}
              />
              <span className="text-sm text-gray-700 dark:text-terminal-silver font-quicksand">{color.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const Toolbar = ({ 
  zoom,
  onZoomIn,
  onZoomOut,
  isHighlightMode,
  onHighlightToggle,
  highlightColor,
  onColorChange,
  onPrint,
  onSavePDF
}) => {
  return (
    <div className="bg-gray-200 dark:bg-[#2A2A30] border-b border-[#CCCCCC] dark:border-[#2A2A30] transition-colors duration-300 w-full">
      <div className="flex items-center justify-between h-11 px-4">
        {/* Left Tools Group */}
        <div className="flex items-center space-x-1">
          <ToolbarButton icon={ChevronLeft} label="Back" onClick={() => {}} />
          <ToolbarButton icon={ChevronRight} label="Forward" onClick={() => {}} />
          <div className="mx-2 h-4 w-px bg-gray-300 dark:bg-gray-600" />
          <ToolbarButton icon={ZoomOut} label="Zoom Out" onClick={onZoomOut} />
          <div className="px-2 text-sm text-gray-900 dark:text-terminal-white font-quicksand">{zoom}%</div>
          <ToolbarButton icon={ZoomIn} label="Zoom In" onClick={onZoomIn} />
          <div className="mx-2 h-4 w-px bg-gray-300 dark:bg-gray-600" />
          <ToolbarButton icon={BookmarkPlus} label="Save" onClick={() => {}} />
          <ToolbarButton icon={Share2} label="Share" onClick={() => {}} />
          <ToolbarButton icon={Printer} label="Print" onClick={onPrint} />
          <ToolbarButton icon={Download} label="PDF" onClick={onSavePDF} />
        </div>

        {/* Right Tools Group */}
        <div className="flex items-center space-x-1">
          <ToolbarButton 
            icon={Highlighter} 
            label="Highlight" 
            onClick={onHighlightToggle}
            active={isHighlightMode}
          />
          <ColorPicker 
            selectedColor={highlightColor}
            onColorChange={onColorChange}
          />
        </div>
      </div>
    </div>
  );
};