import React from 'react';
import { ArrowLeft, Edit2, Share2, Trash2 } from 'lucide-react';

const NoteViewer = ({ note, onClose, onEdit, onDelete }) => {
  if (!note) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Note Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg mr-2"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold font-quicksand">{note.title}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(note)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Note Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="prose max-w-none">
          <div className="text-sm text-gray-500 mb-4 font-quicksand">
            Last modified: {new Date(note.createdAt).toLocaleString()}
          </div>
          <div className="font-quicksand whitespace-pre-wrap">
            {note.content || 'No content yet. Click edit to start writing.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteViewer;