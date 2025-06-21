import React from 'react';
import './Preview.scss';

const Preview = ({ html, css }) => {
  const iframeRef = React.useRef(null);

  React.useEffect(() => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
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
          </style>
        </head>
        <body>${html}</body>
      </html>
    `);
    iframeDoc.close();
  }, [html, css]);

  return (
    <div className="preview">
      <h3>Live Preview</h3>
      <div className="preview__container">
        <iframe
          ref={iframeRef}
          title="HTML/CSS Preview"
          className="preview__iframe"
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
};

export default Preview;
