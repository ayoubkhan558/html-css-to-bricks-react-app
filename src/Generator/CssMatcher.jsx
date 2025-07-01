import React, { useState, useEffect } from 'react';

const CSSHTMLAnalyzer = () => {
  const [htmlInput, setHtmlInput] = useState(`
    <div class="container">
      <h1 id="title">Title</h1>
      <p class="text">Sample text</p>
      <p class="">Another Sample text</p>
    </div>
`);

  const [cssInput, setCssInput] = useState(`
    .container {
      padding: 20px;
    }

    #title {
      color: blue;
    }

    .text {
      font-size: 16px;
    }

    .container .text {
      line-height: 1.5;
    }

    p {
      background-color: lightgray;
    }

    .non-existent {
      color: red;
    }
`);

  const [analysis, setAnalysis] = useState([]);

  const parseCSS = (cssString) => {
    const selectors = [];
    // Remove comments and normalize whitespace
    const cleanCSS = cssString
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Split into rules
    const rules = [];
    let current = '';
    let inBrackets = 0;
    
    for (let i = 0; i < cleanCSS.length; i++) {
      const char = cleanCSS[i];
      if (char === '{') {
        inBrackets++;
      } else if (char === '}') {
        inBrackets--;
        if (inBrackets === 0) {
          rules.push(current.trim() + '}');
          current = '';
          continue;
        }
      }
      current += char;
    }
    
    // Process each rule
    rules.forEach(rule => {
      const [selectorPart, ...rest] = rule.split('{');
      if (!selectorPart || !rest.length) return;
      
      const properties = rest.join('{').replace(/}$/, '').trim();
      if (!properties) return;
      
      // Split multiple selectors and process each one
      selectorPart.split(',').forEach(selector => {
        const trimmed = selector.trim();
        if (trimmed) {
          selectors.push({
            selector: trimmed,
            properties: properties,
            type: getSelectorType(trimmed)
          });
        }
      });
    });
    
    return selectors;
  };
  
  // Helper to determine selector type
  const getSelectorType = (selector) => {
    if (selector.startsWith('#')) return 'id';
    if (selector.startsWith('.')) return 'class';
    if (selector.includes('>') || selector.includes('+') || selector.includes('~') || 
        selector.includes(' ') || selector.includes('[')) return 'complex';
    return 'tag';
  };

  const parseProperties = (propertiesString) => {
    const properties = {};
    const declarations = propertiesString.split(';').filter(decl => decl.trim());
    
    declarations.forEach(decl => {
      const [property, value] = decl.split(':').map(part => part.trim());
      if (property && value) {
        properties[property] = value;
      }
    });
    
    return properties;
  };

  const analyzeElements = () => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlInput, 'text/html');
      const selectors = parseCSS(cssInput);
      
      console.log('=== ALL SELECTORS ===');
      selectors.forEach(({ selector, properties, type }) => {
        console.log(`[${type}] ${selector} => ${properties}`);
      });
      
      // Get all elements from the HTML including body and html
      const allElements = Array.from(doc.querySelectorAll('*'));
      const elementAnalysis = [];

      // First pass: process all elements and collect their info
      const elementsInfo = allElements.map(element => {
        return {
          element,
          info: {
            tagName: element.tagName.toLowerCase(),
            id: element.id || null,
            className: element.className || null,
            textContent: element.textContent?.trim(),
            appliedStyles: {},
            matchingSelectors: [],
            selectorMatches: [] // Store detailed match info
          }
        };
      });

      // Second pass: match all selectors against all elements
      selectors.forEach(({ selector, properties, type }) => {
        try {
          // Try to find matching elements using querySelectorAll
          let matches;
          let matchMethod = 'querySelectorAll';
          try {
            matches = doc.querySelectorAll(selector);
          } catch (e) {
            // If selector is invalid for querySelectorAll, try to handle it manually
            if (type === 'tag') {
              matches = doc.getElementsByTagName(selector);
              matchMethod = 'getElementsByTagName';
            } else if (type === 'class') {
              matches = doc.getElementsByClassName(selector.substring(1));
              matchMethod = 'getElementsByClassName';
            } else if (type === 'id') {
              const el = doc.getElementById(selector.substring(1));
              matches = el ? [el] : [];
              matchMethod = 'getElementById';
            } else {
              // For complex selectors, try to find a parent that matches
              const parts = selector.split(' ');
              const lastPart = parts[parts.length - 1];
              matches = doc.querySelectorAll(lastPart);
              matchMethod = 'querySelectorAll (partial)';
            }
          }

          // Process all matches
          Array.from(matches).forEach(matchedElement => {
            const elementEntry = elementsInfo.find(e => e.element === matchedElement);
            if (elementEntry) {
              const { info } = elementEntry;
              
              // For descendant selectors, verify the full path
              let fullPathValid = true;
              if (selector.includes(' ')) {
                const parentMatch = matchedElement.closest(selector);
                fullPathValid = !!parentMatch;
              }
              
              if (fullPathValid) {
                info.matchingSelectors.push(selector);
                const parsedProperties = parseProperties(properties);
                
                // Log the match details
                const matchInfo = {
                  selector,
                  type,
                  matchMethod,
                  properties: properties,
                  parsedProperties,
                  element: {
                    tag: info.tagName,
                    id: info.id,
                    class: info.className
                  }
                };
                info.selectorMatches.push(matchInfo);
                
                console.log('\n=== MATCH FOUND ===');
                console.log(`Element: <${info.tagName}${info.id ? `#${info.id}` : ''}${info.className ? `.${info.className.split(' ').join('.')}` : ''}>`);
                console.log(`Matched by: ${selector} (${type})`);
                console.log('Properties:', parsedProperties);
                
                // Apply the styles
                Object.assign(info.appliedStyles, parsedProperties);
              }
            }
          });

        } catch (error) {
          console.warn(`Error processing selector: ${selector}`, error);
        }
      });

      // Third pass: collect all elements with matching selectors and log final styles
      elementsInfo.forEach(({ info }) => {
        if (info.matchingSelectors.length > 0) {
          console.log('\n=== ELEMENT STYLES ===');
          console.log(`Element: <${info.tagName}${info.id ? `#${info.id}` : ''}${info.className ? `.${info.className.split(' ').join('.')}` : ''}>`);
          console.log('All matching selectors:', info.matchingSelectors);
          console.log('Final applied styles:', info.appliedStyles);
          
          elementAnalysis.push(info);
        }
      });

      // Combine styles for elements with the same class
      const classMap = new Map();
      elementAnalysis.forEach(info => {
        if (info.className) {
          if (!classMap.has(info.className)) {
            classMap.set(info.className, []);
          }
          classMap.get(info.className).push(info);
        }
      });

      // Merge styles for elements with the same class
      classMap.forEach((elements, className) => {
        if (elements.length > 1) {
          // Get all unique styles from all elements with this class
          const allStyles = {};
          elements.forEach(el => {
            Object.assign(allStyles, el.appliedStyles);
          });
          // Apply all styles to each element with this class
          elements.forEach(el => {
            Object.assign(el.appliedStyles, allStyles);
          });
        }
      });

      setAnalysis(elementAnalysis);
    } catch (error) {
      console.error('Analysis error:', error);
    }
  };

  useEffect(() => {
    analyzeElements();
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
    elementItem: {
      border: '1px solid #28a745',
      borderRadius: '4px',
      padding: '15px',
      marginBottom: '15px',
      backgroundColor: '#f8f9fa'
    },
    elementHeader: {
      fontFamily: 'monospace',
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#333'
    },
    textContent: {
      fontSize: '12px',
      color: '#666',
      marginBottom: '10px',
      fontStyle: 'italic'
    },
    selectorsSection: {
      marginBottom: '15px'
    },
    selectorsList: {
      fontSize: '12px',
      color: '#666',
      marginTop: '5px'
    },
    selectorCode: {
      fontFamily: 'monospace',
      backgroundColor: '#e9ecef',
      padding: '2px 4px',
      borderRadius: '2px',
      margin: '2px'
    },
    propertiesSection: {
      marginTop: '15px'
    },
    propertiesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '8px',
      marginTop: '10px'
    },
    propertyItem: {
      backgroundColor: 'white',
      border: '1px solid #dee2e6',
      borderRadius: '4px',
      padding: '8px',
      fontSize: '12px',
      fontFamily: 'monospace'
    },
    propertyName: {
      fontWeight: 'bold',
      color: '#0056b3'
    },
    propertyValue: {
      color: '#d63384'
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

      <button style={styles.button} onClick={analyzeElements}>
        Analyze
      </button>

      <div style={styles.resultContainer}>
        <h2>Elements with Applied Styles:</h2>
        {analysis.length === 0 ? (
          <p>No elements with matching CSS rules found.</p>
        ) : (
          analysis.map((element, index) => (
            <div key={index} style={styles.elementItem}>
              <div style={styles.elementHeader}>
                &lt;{element.tagName}
                {element.id && ` id="${element.id}"`}
                {element.className && ` class="${element.className}"`}
                &gt;
              </div>

              {element.textContent && (
                <div style={styles.textContent}>
                  Content: "{element.textContent}"
                </div>
              )}

              <div style={styles.selectorsSection}>
                <strong>Matched by selectors:</strong>
                <div style={styles.selectorsList}>
                  {element.matchingSelectors.map((selector, sIndex) => (
                    <span key={sIndex} style={styles.selectorCode}>
                      {selector}
                    </span>
                  ))}
                </div>
              </div>

              <div style={styles.propertiesSection}>
                <strong>Applied CSS Properties:</strong>
                <div style={styles.propertiesGrid}>
                  {Object.entries(element.appliedStyles).map(([property, value]) => (
                    <div key={property} style={styles.propertyItem}>
                      <span style={styles.propertyName}>{property}</span>
                      <span>: </span>
                      <span style={styles.propertyValue}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CSSHTMLAnalyzer;