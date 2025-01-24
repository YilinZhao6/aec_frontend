import React, { useState, useEffect } from 'react';
import { 
  Palette,
  ZoomIn, 
  ZoomOut, 
  Download, 
  Printer, 
  BookmarkPlus,
  Highlighter,
  Share2,
  Search
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
    className={`flex flex-col items-center px-2 py-1 rounded hover:bg-gray-100 
    ${active ? 'text-blue-600' : 'text-gray-700'}`}
    title={label}
    style={{
      fontFamily: '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif'
    }}
  >
    <Icon className="h-5 w-5" />
    <span className="text-xs mt-1">{label}</span>
  </button>
);

export const ColorPicker = ({ selectedColor, onColorChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col items-center px-2 py-1 rounded hover:bg-gray-100"
        title="Select highlight color"
        style={{
          fontFamily: '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif'
        }}
      >
        <div className="relative">
          <Palette className="h-5 w-5" />
          <div 
            className="w-2 h-2 rounded-full absolute bottom-0 right-0"
            style={{ backgroundColor: HIGHLIGHT_COLORS.find(c => c.class === selectedColor)?.color }}
          />
        </div>
        <span className="text-xs mt-1">Color</span>
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
              style={{
                fontFamily: '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif'
              }}
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
    <div className="bg-white border-b shadow-sm p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ToolbarButton icon={ZoomOut} label="Zoom Out" onClick={onZoomOut} />
          <span className="text-sm text-gray-700" style={{
            fontFamily: '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif'
          }}>{zoom}%</span>
          <ToolbarButton icon={ZoomIn} label="Zoom In" onClick={onZoomIn} />
          <div className="h-6 w-px bg-gray-300 mx-2" />
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
          {isHighlightMode && (
            <span className="text-xs text-gray-500 ml-2" style={{
              fontFamily: '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif'
            }}>
              Select text to highlight
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <ToolbarButton icon={BookmarkPlus} label="Bookmark" onClick={() => alert('Bookmark added!')} />
          <ToolbarButton icon={Share2} label="Share" onClick={() => alert('Share dialog')} />
          <div className="h-6 w-px bg-gray-300 mx-2" />
          <ToolbarButton icon={Printer} label="Print" onClick={onPrint} />
          <ToolbarButton icon={Download} label="Save PDF" onClick={onSavePDF} />
        </div>
      </div>
    </div>
  );
};