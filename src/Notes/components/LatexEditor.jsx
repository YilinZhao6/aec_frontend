import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { X } from 'lucide-react';

const LatexEditor = ({ onInsert, onClose }) => {
  const [formula, setFormula] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!formula) {
      setPreview('');
      setError('');
      return;
    }

    try {
      const rendered = katex.renderToString(formula, {
        throwOnError: false,
        displayMode: true,
      });
      setPreview(rendered);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [formula]);

  const handleInsert = () => {
    if (!formula) return;
    onInsert(formula);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-[#F0F0F0] rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="space-y-4">
            <textarea
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="Enter your LaTeX formula (e.g., \frac{1}{2})"
              className="w-full h-32 px-3 py-2 bg-[#EEEEEE] border border-[#CCCCCC] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 font-quicksand text-sm"
            />

            <div className="border border-[#CCCCCC] rounded-md p-4 min-h-[100px] flex items-center justify-center bg-[#EEEEEE]">
              {error ? (
                <p className="text-red-500 text-sm font-quicksand">{error}</p>
              ) : preview ? (
                <div
                  ref={previewRef}
                  dangerouslySetInnerHTML={{ __html: preview }}
                />
              ) : (
                <p className="text-gray-400 text-sm font-quicksand">Preview will appear here</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#E5E5E5] rounded-b-lg flex justify-end space-x-3 border-t border-[#CCCCCC]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-[#EEEEEE] hover:bg-[#E0E0E0] rounded-md border border-[#CCCCCC] font-quicksand"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            disabled={!formula || error}
            className={`px-4 py-2 text-sm font-medium rounded-md border font-quicksand ${
              !formula || error
                ? 'bg-[#E0E0E0] text-gray-500 cursor-not-allowed border-[#CCCCCC]'
                : 'bg-gray-900 text-white hover:bg-gray-800 border-transparent'
            }`}
          >
            Insert Formula
          </button>
        </div>
      </div>
    </div>
  );
};

export default LatexEditor;