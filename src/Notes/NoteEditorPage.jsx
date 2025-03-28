import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import {
  Upload, 
  Book, 
  CheckCircle, 
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Home,
  RefreshCw
} from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import * as NotesAPI from './api';
import { ConceptExtension } from './extensions/ConceptExtension';
import { ImportedContentExtension } from './extensions/ImportedContentExtension';
import { LatexExtension } from './extensions/LatexExtension';
import EditorToolbar from './components/EditorToolbar';
import ConceptExplanations from './components/ConceptExplanations';
import './styles/editor.css';

const NoteEditorPage = () => {
  const { noteId } = useParams();
  const [title, setTitle] = useState(noteId ? noteId.replace('.md', '') : 'Untitled Document');
  const [concepts, setConcepts] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isNotificationExiting, setIsNotificationExiting] = useState(false);
  const [lastGeneratedText, setLastGeneratedText] = useState('');
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      ImportedContentExtension.configure({
        HTMLAttributes: {
          class: 'imported-content',
        },
      }),
      ConceptExtension.configure({
        HTMLAttributes: {
          class: 'concept-mark',
        },
      }),
      LatexExtension,
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'resizable-image',
        },
      }),
    ],
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const marks = editor.state.doc.rangeHasMark(from, to, editor.schema.marks.concept);
      
      if (marks) {
        const node = editor.state.doc.nodeAt(from);
        if (node) {
          const mark = node.marks.find(m => m.type.name === 'concept');
          if (mark) {
            const concept = concepts.find(c => c.tag === mark.attrs.tag);
            if (concept?.explanation) {
              setSelectedConcept(concept);
            }
          }
        }
      }
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
  });

  // Add custom styles for resizable images
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .resizable-image {
        display: inline-block;
        resize: both;
        overflow: hidden;
        min-width: 100px;
        min-height: 100px;
        cursor: pointer;
      }
      .resizable-image:hover {
        outline: 2px solid #3B82F6;
      }
      .resizable-image img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const extractConcepts = (content) => {
    const extractedConcepts = [];
    
    const conceptRegex = /<span[^>]*?class="concept-mark"[^>]*?data-concept-tag="([^"]+)"[^>]*>(.*?)<\/span>|<concept><([^>]+)>(.*?)<\/\3><\/concept>/g;
    
    let match;
    while ((match = conceptRegex.exec(content)) !== null) {
      const tag = match[1] || match[3];
      const text = match[2] || match[4];
      
      if (tag && text) {
        extractedConcepts.push({
          tag,
          text,
          explanation: '',
        });
      }
    }
    
    return extractedConcepts;
  };

  useEffect(() => {
    const loadContent = async () => {
      if (!userId || !noteId || !editor) return;

      const response = await NotesAPI.getFileInfo(userId, noteId);
      if (response.success && response.content) {
        // Process LaTeX formulas in the content
        const processedContent = response.content.replace(
          /<span data-type="latex" class="latex-formula">\s*(.*?)\s*<\/span>/g,
          (_, formula) => {
            // Create a properly formatted LaTeX node
            return `<span data-type="latex" class="latex-formula">${formula.trim()}</span>`;
          }
        );

        editor.commands.setContent(processedContent);

        const extractedConcepts = extractConcepts(processedContent);
        const explanationsResponse = await NotesAPI.getExplanationsPerConcept(userId, noteId);
        
        if (explanationsResponse.success) {
          const conceptsWithExplanations = extractedConcepts.map(concept => ({
            ...concept,
            explanation: explanationsResponse.explanations.find(exp => exp.tag === concept.tag)?.explanation || '',
          }));
          setConcepts(conceptsWithExplanations);
        } else {
          setConcepts(extractedConcepts);
        }
      }
    };

    if (editor) {
      loadContent();
    }
  }, [editor, userId, noteId]);

  useEffect(() => {
    if (!editor) return;

    const autoSaveInterval = setInterval(() => {
      handleSave();
    }, 2 * 60 * 1000);

    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [editor]);

  const handleGenerateExplanation = async () => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    if (from === to) return;

    const selectedText = editor.state.doc.textBetween(from, to);
    setIsGenerating(true);
    setLastGeneratedText(selectedText);

    const response = await NotesAPI.generateConceptExplanation(
      userId,
      noteId,
      selectedText
    );

    if (response.success) {
      const newConcept = {
        text: selectedText,
        explanation: response.explanation,
        tag: response.tag,
      };

      editor
        .chain()
        .focus()
        .setTextSelection({ from, to })
        .setMark('concept', { tag: response.tag })
        .run();

      setConcepts(prev => [...prev, newConcept]);
      setSelectedConcept(newConcept);
      
      setIsNotificationExiting(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setIsNotificationExiting(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsNotificationExiting(false);
        }, 300);
      }, 2700);

      setTimeout(() => {
        handleSave();
      }, 3000);
    }
    
    setIsGenerating(false);
  };

  const handleSave = async () => {
    if (!editor || !userId || !noteId) return;
    
    setIsSaving(true);
    try {
      // Get content and clean up any extra whitespace in LaTeX formulas
      const content = editor.getHTML().replace(
        /<span data-type="latex" class="latex-formula">\s*(.*?)\s*<\/span>/g,
        (_, formula) => `<span data-type="latex" class="latex-formula">${formula.trim()}</span>`
      );
      
      const response = await NotesAPI.saveFileContent(userId, noteId, content);
      if (response.success) {
        const saveButton = document.getElementById('save-button');
        if (saveButton) {
          saveButton.classList.add('bg-green-500');
          setTimeout(() => {
            saveButton.classList.remove('bg-green-500');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
    setIsSaving(false);
  };

  const handleDownloadPDF = async () => {
    if (!editor) return;
    
    const element = document.createElement('div');
    element.innerHTML = editor.getHTML();
    element.className = 'pdf-content';
    
    const opt = {
      margin: 1,
      filename: `${title}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    await html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-[#EEEEEE]">
      {showSuccess && (
        <div className={`fixed bottom-4 right-4 bg-[#EEEEEE] text-gray-800 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 z-50 ${isNotificationExiting ? 'notification-exit' : 'notification-enter'}`}>
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium">Explanation generated successfully!</p>
            <p className="text-sm text-gray-600 mt-0.5">"{lastGeneratedText}"</p>
          </div>
        </div>
      )}

      <div className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="flex items-center justify-between px-4 h-16 bg-[#EEEEEE]">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/notes')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-medium text-gray-900 border-0 focus:ring-0 focus:outline-none bg-transparent"
                placeholder="Untitled"
              />
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Book className="w-4 h-4" />
                <span>Document</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPDF}
              className="p-2 hover:bg-gray-100 rounded-full"
              title="Download as PDF"
            >
              <Upload className="w-5 h-5 text-gray-600" />
            </button>
            <button
              id="save-button"
              onClick={handleSave}
              disabled={isSaving}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <RefreshCw className={`w-5 h-5 ${isSaving ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Home className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <EditorToolbar
          editor={editor}
          onGenerateExplanation={handleGenerateExplanation}
          isGenerating={isGenerating}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <div className="pt-32 flex justify-center">
        <div className="relative w-full max-w-4xl">
          <div ref={editorRef} className="bg-white shadow-sm min-h-[calc(100vh-10rem)]">
            <EditorContent
              editor={editor}
              className="min-h-[calc(100vh-10rem)] bg-white shadow-sm"
            />
          </div>

          {/* Concept Explanations */}
          <ConceptExplanations 
            concepts={concepts}
            editorRef={editorRef}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEditorPage;