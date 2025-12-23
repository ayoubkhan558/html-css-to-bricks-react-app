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
              padding: 0;
              min-height: 100%;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              // background: #111117;
              background: #fff;
              color: inherit;
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
      {!html && !css ? (
        <div className="preview-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="9" y1="21" x2="9" y2="9"></line>
          </svg>
          <p>Preview will appear here</p>
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          title="HTML/CSS Preview"
          className="preview__iframe"
          sandbox="allow-same-origin allow-scripts"
        />
      )}
    </div>
  );
};

export default Preview;
