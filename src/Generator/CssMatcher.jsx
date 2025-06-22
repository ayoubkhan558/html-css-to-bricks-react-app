import React, { useState, useEffect } from 'react';

const CSSHTMLAnalyzer = () => {
  const [htmlInput, setHtmlInput] = useState(`<div class="container">
  <h1 id="title">Title</h1>
  <p class="text">Sample text</p>
</div>`);

  const [cssInput, setCssInput] = useState(`.container {
  padding: 20px;
}

#title {
  color: blue;
}

.text {
  font-size: 16px;
}

.non-existent {
  color: red;
}`);

  const [analysis, setAnalysis] = useState([]);

  const parseCSS = (cssString) => {
    const selectors = [];
    const rules = cssString.split('}').filter(rule => rule.trim());
    
    rules.forEach(rule => {
      const parts = rule.split('{');
      if (parts.length === 2) {
        const selector = parts[0].trim();
        const properties = parts[1].trim();
        selectors.push({ selector, properties });
      }
    });
    
    return selectors;
  };

  const analyzeSelectors = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlInput, 'text/html');
      const selectors = parseCSS(cssInput);
      
      const results = selectors.map(({ selector, properties }) => {
        try {
          const elements = doc.querySelectorAll(selector);
          const matches = Array.from(elements).map(el => ({
            tagName: el.tagName.toLowerCase(),
            id: el.id || null,
            className: el.className || null,
            textContent: el.textContent?.trim()
          }));

          return {
            selector,
            properties,
            matches,
            isValid: elements.length > 0,
            count: elements.length
          };
        } catch (error) {
          return {
            selector,
            properties,
            matches: [],
            isValid: false,
            count: 0,
            error: error.message
          };
        }
      });

      setAnalysis(results);
    } catch (error) {
      console.error('Analysis error:', error);
    }
  };

  useEffect(() => {
    analyzeSelectors();
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
      height: '200px',
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
    resultItem: {
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '15px',
      marginBottom: '10px'
    },
    validItem: {
      backgroundColor: '#f0f8f0',
      borderColor: '#28a745'
    },
    invalidItem: {
      backgroundColor: '#f8f0f0',
      borderColor: '#dc3545'
    },
    selectorCode: {
      fontFamily: 'monospace',
      backgroundColor: '#f5f5f5',
      padding: '2px 4px',
      borderRadius: '2px',
      fontSize: '14px'
    },
    properties: {
      fontFamily: 'monospace',
      backgroundColor: '#f5f5f5',
      padding: '10px',
      borderRadius: '4px',
      fontSize: '12px',
      whiteSpace: 'pre-wrap',
      marginTop: '10px'
    },
    matchItem: {
      backgroundColor: 'white',
      border: '1px solid #eee',
      padding: '8px',
      borderRadius: '4px',
      marginTop: '5px',
      fontSize: '12px'
    },
    status: {
      fontWeight: 'bold',
      marginRight: '10px'
    },
    valid: {
      color: '#28a745'
    },
    invalid: {
      color: '#dc3545'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>CSS-HTML Analyzer</h1>
      
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

      <button style={styles.button} onClick={analyzeSelectors}>
        Analyze
      </button>

      <div style={styles.resultContainer}>
        <h2>Results:</h2>
        {analysis.length === 0 ? (
          <p>No results yet.</p>
        ) : (
          analysis.map((item, index) => (
            <div
              key={index}
              style={{
                ...styles.resultItem,
                ...(item.isValid ? styles.validItem : styles.invalidItem)
              }}
            >
              <div>
                <span style={{...styles.status, ...(item.isValid ? styles.valid : styles.invalid)}}>
                  {item.isValid ? '✓' : '✗'}
                </span>
                <code style={styles.selectorCode}>{item.selector}</code>
                <span> - {item.count} matches</span>
              </div>

              {item.error && (
                <div style={{color: '#dc3545', marginTop: '5px'}}>
                  Error: {item.error}
                </div>
              )}

              <div style={styles.properties}>
                {item.properties}
              </div>

              {item.matches.length > 0 && (
                <div style={{marginTop: '10px'}}>
                  <strong>Matched Elements:</strong>
                  {item.matches.map((match, matchIndex) => (
                    <div key={matchIndex} style={styles.matchItem}>
                      &lt;{match.tagName}
                      {match.id && ` id="${match.id}"`}
                      {match.className && ` class="${match.className}"`}
                      &gt;
                      {match.textContent && (
                        <div style={{color: '#666', fontSize: '11px'}}>
                          "{match.textContent}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CSSHTMLAnalyzer;