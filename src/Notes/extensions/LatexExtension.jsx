import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React from 'react';
import katex from 'katex';

const LatexComponent = ({ node }) => {
  return (
    <NodeViewWrapper className="latex-wrapper">
      <span 
        data-type="latex"
        className="latex-formula"
        contentEditable={false}
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(node.attrs.formula, {
            throwOnError: false,
            displayMode: false
          })
        }}
      />
    </NodeViewWrapper>
  );
};

export const LatexExtension = Node.create({
  name: 'latex',
  
  group: 'inline',
  inline: true,
  atom: true,
  draggable: true,
  selectable: true,
  
  addAttributes() {
    return {
      formula: {
        default: ''
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="latex"]',
        getAttrs: node => ({
          formula: node.textContent.trim()
        })
      }
    ];
  },

  renderHTML({ node }) {
    return [
      'span',
      { 
        'data-type': 'latex',
        'class': 'latex-formula'
      },
      node.attrs.formula
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LatexComponent);
  }
});