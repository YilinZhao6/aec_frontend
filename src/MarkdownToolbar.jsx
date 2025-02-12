import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Printer, 
  BookmarkPlus,
  Highlighter,
  Share2,
  Palette
} from 'lucide-react';

export const HIGHLIGHT_COLORS = [
  { name: 'Yellow', class: 'bg-yellow-200', color: '#fef08a' },
  { name: 'Green', class: 'bg-green-200', color: '#bbf7d0' },
  { name: 'Blue', class: 'bg-blue-200', color: '#bfdbfe' },
  { name: 'Pink', class: 'bg-pink-200', color: '#fbcfe8' },
  { name: 'Purple', class: 'bg-purple-200', color: '#e9d5ff' },
  { name: 'Orange', class: 'bg-orange-200', color: '#fed7aa' },
];

export const ToolbarButton = ({ icon: Icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-md text-gray-500 
               hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 ${
                 active ? 'text-gray-900 bg-gray-50' : ''
               }`}
    title={label}
  >
    <Icon className="w-5 h-5" />
    <span className="text-xs">{label}</span>
  </button>
);

export const ColorPicker = ({ selectedColor, onColorChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-500 
                  hover:text-gray-900 hover:bg-gray-50 transition-all duration-300"
        title="Select highlight color"
      >
        <div className="relative">
          <Palette className="w-5 h-5" />
          <div 
            className="w-1.5 h-1.5 rounded-full absolute -bottom-0.5 -right-0.5"
            style={{ backgroundColor: HIGHLIGHT_COLORS.find(c => c.class === selectedColor)?.color }}
          />
        </div>
        <span className="text-xs">Color</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-lg border flex flex-col space-y-1 z-50">
          {HIGHLIGHT_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => {
                onColorChange(color.class);
                setIsOpen(false);
              }}
              className="flex items-center space-x-2 px-2 py-1 rounded hover:bg-gray-100 min-w-[100px]"
            >
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color.color }}
              />
              <span className="text-sm">{color.name}</span>
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
    <div className="bg-white border-b border-gray-100 h-11">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Tools Group */}
        <div className="flex items-center space-x-1">
          <ToolbarButton icon={ZoomOut} label="Zoom Out" onClick={onZoomOut} />
          <div className="px-2 text-sm text-gray-600">{zoom}%</div>
          <ToolbarButton icon={ZoomIn} label="Zoom In" onClick={onZoomIn} />
        </div>

        {/* Center Tools Group */}
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

        {/* Right Tools Group */}
        <div className="flex items-center space-x-1">
          <ToolbarButton icon={BookmarkPlus} label="Save" onClick={() => {}} />
          <ToolbarButton icon={Share2} label="Share" onClick={() => {}} />
          <ToolbarButton icon={Printer} label="Print" onClick={onPrint} />
          <ToolbarButton icon={Download} label="PDF" onClick={onSavePDF} />
        </div>
      </div>
    </div>
  );
};