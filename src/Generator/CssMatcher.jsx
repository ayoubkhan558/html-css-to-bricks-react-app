import React, { useState, useEffect } from 'react';
import { convertHtmlToBricks } from './utils/domToBricks';

const CSSHTMLAnalyzer = () => {
  const [htmlInput, setHtmlInput] = useState(`
<ul class="complex-list">
  <li class="complex-list__item">
    <span class="complex-list__icon">🏠</span>
    <div class="complex-list__content">
      <strong class="complex-list__title">Home</strong>
      <p class="complex-list__description">Main landing page</p>
    </div>
  </li>
  <li class="complex-list__item">
    <span class="complex-list__icon">📄</span>
    <div class="complex-list__content">
      <strong class="complex-list__title">Docs</strong>
      <p class="complex-list__description">API and guides</p>
    </div>
  </li>
  <li class="complex-list__item">
    <span class="complex-list__icon">📞</span>
    <div class="complex-list__content">
      <strong class="complex-list__title">Contact</strong>
      <p class="complex-list__description">Get in touch with us</p>
    </div>
  </li>
</ul>
`);

  const [cssInput, setCssInput] = useState(`
.complex-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-family: sans-serif;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.complex-list__item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.complex-list__item:last-child {
  border-bottom: none;
}

.complex-list__icon {
  font-size: 24px;
  margin-right: 16px;
}

.complex-list__content {
  flex-grow: 1;
}

.complex-list__title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 4px;
  color: #333;
}

.complex-list__description {
  font-size: 14px;
  color: #666;
  margin: 0;
}
`);

  const [bricksJson, setBricksJson] = useState(null);

  const analyzeAndConvert = () => {
    try {
      const jsonOutput = convertHtmlToBricks(htmlInput, cssInput);
      setBricksJson(jsonOutput);
    } catch (error) {
      console.error('Conversion error:', error);
    }
  };

  useEffect(() => {
    analyzeAndConvert();
  }, [htmlInput, cssInput]);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      fontSize: '24px',
      marginBottom: '20px',
      color: '#333'
    },
    inputContainer: {
      display: 'flex',
      gap: '20px',
      marginBottom: '20px'
    },
    inputGroup: {
      flex: 1
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold'
    },
    textarea: {
      width: '100%',
      height: '300px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontFamily: 'monospace',
      fontSize: '12px',
      resize: 'vertical'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginBottom: '20px'
    },
    resultContainer: {
      marginTop: '20px'
    },
    jsonOutput: {
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        padding: '15px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        fontSize: '12px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>HTML to Bricks JSON Converter</h1>
      
      <div style={styles.inputContainer}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>HTML:</label>
          <textarea
            style={styles.textarea}
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="Enter HTML..."
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>CSS:</label>
          <textarea
            style={styles.textarea}
            value={cssInput}
            onChange={(e) => setCssInput(e.target.value)}
            placeholder="Enter CSS..."
          />
        </div>
      </div>

      <button style={styles.button} onClick={analyzeAndConvert}>
        Convert to Bricks JSON
      </button>

      <div style={styles.resultContainer}>
        <h2>Bricks Builder JSON Output:</h2>
        {bricksJson ? (
          <pre style={styles.jsonOutput}>
            {JSON.stringify(bricksJson, null, 2)}
          </pre>
        ) : (
          <p>No JSON generated yet. Click the button to convert.</p>
        )}
      </div>
    </div>
  );
};

export default CSSHTMLAnalyzer;