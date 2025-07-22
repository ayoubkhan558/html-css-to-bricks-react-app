import React from 'react';
import './Preview.scss';

const Preview = ({ html, css, activeTagIndex, highlight }) => {
  const iframeRef = React.useRef(null);

  // Utility: Wrap each HTML tag with data-tag-index
  const addTagIndices = (rawHtml) => {
    let tagIndex = 0;
    return rawHtml.replace(/<([a-zA-Z][\w-]*)([^>]*)>/g, (match, tag, attrs) => {
      // Skip self-closing tags
      if (/\/$/.test(attrs)) return match;
      const result = `<${tag} data-tag-index="${tagIndex++}"${attrs}>`;
      return result;
    });
  };

  React.useEffect(() => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // Prepare HTML with tag indices
    const htmlWithIndices = addTagIndices(html);

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            ${css}
            body { 
              margin: 0; 
              padding: 1rem;
              min-height: 100%;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              background: white;
              color: #333;
            }
            .brickify-preview-highlight {
              outline: 1px solid #edb706;
              position: relative;
              z-index: 10;
              transition: outline 0.2s;
            }
          </style>
        </head>
        <body>${htmlWithIndices}</body>
      </html>
    `);
    iframeDoc.close();

    // Highlight the active tag
    setTimeout(() => {
      // Always remove previous highlights
      iframeDoc.querySelectorAll('.brickify-preview-highlight').forEach(e => {
        e.classList.remove('brickify-preview-highlight');
      });
      // Only add highlight if highlight prop is true
      if (!highlight) return;
      if (typeof activeTagIndex !== 'number') return;
      const el = iframeDoc.querySelector(`[data-tag-index="${activeTagIndex}"]`);
      if (el) {
        el.classList.add('brickify-preview-highlight');
        // Scroll into view if needed
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 60);
  }, [html, css, activeTagIndex, highlight]);

  return (
    <div className="preview"> 
        <iframe
          ref={iframeRef}
          title="HTML/CSS Preview"
          className="preview__iframe"
          sandbox="allow-same-origin allow-scripts"
        />  
    </div>
  );
};

export default Preview;
