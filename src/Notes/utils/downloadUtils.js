import { Document as DocxDocument, Packer, Paragraph as DocxParagraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';

// Helper function to convert HTML color to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Process node and create DocX elements
const processNode = (node) => {
  const elements = [];

  if (node.nodeType === Node.TEXT_NODE) {
    let text = node.textContent;
    let textRun = new TextRun({
      text,
      bold: node.parentElement?.style.fontWeight === 'bold',
      italics: node.parentElement?.style.fontStyle === 'italic',
      underline: node.parentElement?.style.textDecoration?.includes('underline'),
      highlight: node.parentElement?.style.backgroundColor ? hexToRgb(node.parentElement.style.backgroundColor) : undefined,
      color: node.parentElement?.style.color ? hexToRgb(node.parentElement.style.color) : undefined,
    });
    elements.push(textRun);
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    let headingLevel;
    switch (node.tagName) {
      case 'H1':
        headingLevel = HeadingLevel.HEADING_1;
        break;
      case 'H2':
        headingLevel = HeadingLevel.HEADING_2;
        break;
      case 'H3':
        headingLevel = HeadingLevel.HEADING_3;
        break;
      default:
        headingLevel = undefined;
    }

    if (node.childNodes.length === 0) {
      elements.push(new DocxParagraph({ text: '' }));
    } else {
      const childElements = Array.from(node.childNodes).flatMap(child => processNode(child));
      if (headingLevel) {
        elements.push(new DocxParagraph({
          children: childElements,
          heading: headingLevel
        }));
      } else if (node.tagName === 'P' || node.tagName === 'DIV') {
        elements.push(new DocxParagraph({
          children: childElements,
          alignment: node.style.textAlign === 'center' ? 'center' : 
                    node.style.textAlign === 'right' ? 'right' : 'left'
        }));
      } else {
        elements.push(...childElements);
      }
    }
  }

  return elements;
};

export const downloadAsWord = async (editor, title) => {
  if (!editor) return;

  // Create temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = editor.getHTML();

  // Process the content
  const docElements = Array.from(tempDiv.childNodes).flatMap(node => processNode(node));

  // Create Word document
  const doc = new DocxDocument({
    sections: [{
      properties: {},
      children: docElements
    }]
  });

  // Generate and save the file
  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `${title}.docx`);
  });
};

export const downloadAsPDF = async (editor, title) => {
  if (!editor) return;
  
  const element = document.createElement('div');
  element.innerHTML = editor.getHTML();
  element.className = 'pdf-content';
  
  const opt = {
    margin: [0.75, 0.75, 1, 0.75], // Increased bottom margin to prevent cutting
    filename: `${title}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      scrollY: -window.scrollY // Fix for scrolling issues
    },
    jsPDF: { 
      unit: 'in', 
      format: 'letter', 
      orientation: 'portrait',
      compress: true
    }
  };
  
  await html2pdf().set(opt).from(element).save();
};