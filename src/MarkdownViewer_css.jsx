// KaTeX and markdown viewer styles
export const getMarkdownStyles = () => `
  @font-face {
    font-family: 'STIX Two Math';
    src: url('https://cdn.jsdelivr.net/npm/@stix/stix-fonts@2.13/fonts/STIX2Math.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }

  /* Base KaTeX size for block math */
  .katex-display > .katex {
    font-size: 0.85em !important;
  }
  
  /* Increased size for inline math */
  .katex {
    font-size: 1.1em !important;
  }

  /* Increased size for math in bullet points */
  li .katex {
    font-size: 1.1em !important;
  }
  
  .katex .math {
    font-family: 'STIX Two Math', KaTeX_Math !important;
    font-style: italic !important;
    font-feature-settings: "ss01" 1;
  }

  .katex .mathit {
    font-family: KaTeX_Math, 'STIX Two Math' !important;
    font-style: italic !important;
    font-feature-settings: "ss01" 1;
  }

  .katex .mathnormal {
    font-family: KaTeX_Math, 'STIX Two Math' !important;
    font-style: italic !important;
    font-feature-settings: "ss01" 1;
  }

  .katex .mathdefault {
    font-family: KaTeX_Math, 'STIX Two Math' !important;
    font-style: italic !important;
    font-feature-settings: "ss01" 1;
  }

  .katex .mord {
    font-family: KaTeX_Main, 'STIX Two Math' !important;
    font-style: !important;
    font-feature-settings: "ss01" 1;
  }

  /* Style for numbers */
  .katex .mord.mtight {
    font-style: normal !important;
  }
  
  .katex .mord.text {
    font-style: normal !important;
  }
  
  /* Ensure numbers are not italicized */
  .katex .mord.text > .text {
    font-style: normal !important;
  }
  
  /* Target specific number classes */
  .katex .mord.text > span[class*="mathtt"],
  .katex .mord.text > span[class*="mathsf"],
  .katex .mord.text > span[class*="mathrm"] {
    font-style: normal !important;
  }
  
  /* Additional number-specific styles */
  .katex .mord.text.mtight {
    font-style: normal !important;
  }
  
  /* Ensure digits are not italicized */
  .katex .mord.text > span[class*="mathord"] {
    font-style: normal !important;
  }

  .katex .mop {
    font-family: 'STIX Two Math', KaTeX_Size2 !important;
    font-style: normal !important;
  }
  
  /* Specific style for pi */
  .katex .mop + .mord.mathdefault[style*="margin-left"] {
    font-family: KaTeX_Size2, 'Latin Modern Math' !important;
    font-style: normal !important;
  }
  
  /* Additional pi-specific selector */
  .katex mi[mathvariant="normal"] {
    font-family: KaTeX_Size2, 'Latin Modern Math' !important;
    font-style: normal !important;
  }

  .katex .mbin {
    font-family: 'STIX Two Math', KaTeX_Main !important;
    font-style: normal !important;
  }

  .katex .mrel {
    font-family: 'STIX Two Math', KaTeX_Main !important;
    font-style: normal !important;
  }

  .katex .mopen, .katex .mclose {
    font-family: 'STIX Two Math', KaTeX_Main !important;
    font-style: normal !important;
  }

  .katex .minner {
    font-family: 'STIX Two Math', KaTeX_Math !important;
    font-style: normal !important;
  }

  .katex .mord.textrm {
    font-family: 'STIX Two Math', KaTeX_Main !important;
    font-style: normal !important;
  }

  .katex .mord.mathbb {
    font-family: 'STIX Two Math', KaTeX_AMS !important;
    font-style: normal !important;
  }
  
  /* Ensure all numbers use upright style */
  .katex .mord.text > span[class*="mathord"]:matches([data-c="0"], [data-c="1"], [data-c="2"], [data-c="3"], [data-c="4"], [data-c="5"], [data-c="6"], [data-c="7"], [data-c="8"], [data-c="9"]) {
    font-style: normal !important;
    font-family: KaTeX_Main, 'STIX Two Math' !important;
  }

  /* Custom markdown styles */
  .markdown-content {
    color: #000000;
    font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
    font-size: 15px; /* Base font size for main text */
    line-height: 1.6;
    letter-spacing: 0.15px;
  }

  .markdown-content h1 {
    font-family: "Segoe UI Semibold", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
    font-size: 32px; /* Largest heading */
    font-weight: 600;
    margin-bottom: 16px;
    margin-top: 24px;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 8px;
    line-height: 1.2;
  }

  .markdown-content h2 {
    font-family: "Segoe UI Semibold", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
    font-size: 24px; /* Second largest heading */
    font-weight: 600;
    margin-bottom: 14px;
    margin-top: 20px;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 6px;
    line-height: 1.2;
  }

  .markdown-content h3 {
    font-family: "Segoe UI Semibold", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
    font-size: 18px; /* Third level heading */
    font-weight: 600;
    margin-bottom: 12px;
    margin-top: 18px;
    line-height: 1.2;
  }

  .markdown-content p {
    font-size: 15px; /* Same as base font size */
    margin-bottom: 12px;
    margin-top: 0;
  }

  .markdown-content ul, .markdown-content ol {
    font-size: 15px; /* Same as base font size */
    margin-bottom: 12px;
    margin-top: 0;
    padding-left: 2em;
  }

  .markdown-content li {
    font-size: 15px; /* Same as base font size */
    margin-bottom: 4px;
    line-height: 1.6;
  }

  .markdown-content blockquote {
    font-size: 15px; /* Same as base font size */
    border-left: 4px solid #dfe2e5;
    color: #6a737d;
    margin-bottom: 12px;
    margin-top: 0;
    padding-left: 16px;
    line-height: 1.6;
  }

  .markdown-content code {
    font-family: Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace;
    font-size: 13px; /* Slightly smaller than base text */
    padding: 0.2em 0.4em;
    background-color: rgba(27,31,35,0.05);
    border-radius: 3px;
  }

  .markdown-content pre {
    padding: 16px;
    overflow: auto;
    font-size: 13px; /* Slightly smaller than base text */
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 3px;
    margin-bottom: 12px;
    margin-top: 0;
  }

  .markdown-content pre code {
    padding: 0;
    font-size: inherit;
    background-color: transparent;
  }

  .markdown-content strong {
    font-weight: 600;
  }

  .markdown-bottom-bar {
    font-size: 11.76px;
  }
`;