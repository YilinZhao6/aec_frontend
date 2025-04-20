import React, { useState, useEffect, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Printer, 
  BookmarkPlus,
  Share2,
  ArrowLeft,
  Bold,
  Italic,
  TextQuote,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  HelpCircle,
  X,
  FunctionSquare as Functions,
  Image as ImageIcon
} from 'lucide-react';

interface ToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPrint: () => void;
  onSavePDF: () => void;
  onBack: () => void;
  editor?: any;
}

export const Toolbar: React.FC<ToolbarProps> = ({ 
  zoom,
  onZoomIn,
  onZoomOut,
  onPrint,
  onSavePDF,
  onBack,
  editor
}) => {
  return (
    <div className="bg-gray-200 border-b border-[#CCCCCC] transition-colors duration-300 w-full">
      <div className="flex flex-col">
        {/* Top Toolbar */}
        <div className="flex items-center justify-between h-11 px-4">
          {/* Left Tools Group */}
          <div className="flex items-center space-x-1">
            <ToolbarButton icon={ArrowLeft} label="Back" onClick={onBack} />
            <div className="mx-2 h-4 w-px bg-gray-300" />
            <ToolbarButton icon={ZoomOut} label="Zoom Out" onClick={onZoomOut} />
            <div className="px-2 text-sm text-gray-900 font-quicksand">{zoom}%</div>
            <ToolbarButton icon={ZoomIn} label="Zoom In" onClick={onZoomIn} />
            <div className="mx-2 h-4 w-px bg-gray-300" />
            <ToolbarButton icon={BookmarkPlus} label="Save" onClick={() => {}} />
            <ToolbarButton icon={Share2} label="Share" onClick={() => {}} />
            <ToolbarButton icon={Printer} label="Print" onClick={onPrint} />
            <ToolbarButton icon={Download} label="PDF" onClick={onSavePDF} />
          </div>
        </div>

        {/* Editor Toolbar */}
        {editor && (
          <div className="flex items-center px-4 py-1 bg-[#E1E1E1] border-t border-gray-300">
            <div className="flex-1 flex items-center space-x-2">
              <select
                onChange={e => {
                  const value = e.target.value;
                  if (value === 'normal') {
                    editor.chain().focus().setParagraph().run();
                  } else {
                    editor.chain().focus().toggleHeading({ level: parseInt(value) }).run();
                  }
                }}
                value={
                  editor.isActive('heading', { level: 1 })
                    ? '1'
                    : editor.isActive('heading', { level: 2 })
                    ? '2'
                    : editor.isActive('heading', { level: 3 })
                    ? '3'
                    : 'normal'
                }
                className="h-8 px-2 rounded border border-gray-300"
              >
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
                <option value="normal">Normal</option>
              </select>

              <div className="h-5 w-px bg-gray-300" />

              <ToolbarButton
                icon={Bold}
                label="Bold"
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
              />

              <ToolbarButton
                icon={Italic}
                label="Italic"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
              />

              <ToolbarButton
                icon={TextQuote}
                label="Underline"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
              />

              <div className="h-5 w-px bg-gray-300" />

              <div className="h-5 w-px bg-gray-300" />

              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
              />
              <button
                onClick={() => imageInputRef.current?.click()}
                className="p-2 rounded hover:bg-gray-100"
                title="Insert Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <div className="h-5 w-px bg-gray-300" />

              <ToolbarButton
                icon={List}
                label="Bullet List"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
              />

              <ToolbarButton
                icon={ListOrdered}
                label="Ordered List"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
              />

              <div className="h-5 w-px bg-gray-300" />

              <div className="flex items-center space-x-1 border border-gray-300 rounded">
                <button
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  className={`p-1.5 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  className={`p-1.5 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  className={`p-1.5 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ToolbarButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon: Icon, label, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-200' : ''}`}
    title={label}
  >
    <Icon className="w-4 h-4" />
  </button>
);