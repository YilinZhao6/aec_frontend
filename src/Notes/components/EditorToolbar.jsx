import React from 'react';
import { 
  Bold, 
  Italic, 
  Highlighter, 
  TextQuote,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Download,
  FileText,
  Save,
  MessageSquare,
  Type,
  HelpCircle
} from 'lucide-react';

const ToolbarButton = ({ icon: Icon, label, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`p-1.5 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-200' : ''}`}
    title={label}
  >
    <Icon className="w-4 h-4" />
  </button>
);

const EditorToolbar = ({ 
  editor, 
  onGenerateExplanation, 
  isGenerating,
  activeTab,
  setActiveTab
}) => {
  if (!editor) return null;

  return (
    <div className="border-t border-gray-200">
      <div className="flex items-center px-4 py-1 bg-[#E1E1E1]">
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

          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded ${editor.isActive('underline') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <TextQuote className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <List className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          >
            <ListOrdered className="w-4 h-4" />
          </button>

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

          <div className="h-5 w-px bg-gray-200 mx-2" />

          <button
            onClick={onGenerateExplanation}
            disabled={isGenerating}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
              isGenerating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Generate explanation for selected text"
          >
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex space-x-4 ml-4">
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-1 px-3 rounded-md text-sm font-medium ${
              activeTab === 'notes'
                ? 'bg-[#F0F0F0] text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab('explanation')}
            className={`py-1 px-3 rounded-md text-sm font-medium ${
              activeTab === 'explanation'
                ? 'bg-[#F0F0F0] text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Explanation
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;