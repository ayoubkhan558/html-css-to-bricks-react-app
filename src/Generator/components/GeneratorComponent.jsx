import React, { useState, useMemo, useEffect } from 'react';

import { RiJavascriptLine } from "react-icons/ri";
import { RiHtml5Line } from "react-icons/ri";
import { FaCss3 } from "react-icons/fa6";
import { RiSunLine, RiMoonLine } from "react-icons/ri";

import { createBricksStructure } from '../utils/bricksGenerator';
import Preview from './Preview';
import CodeEditor from './CodeEditor';
import prettier from 'prettier/standalone';
import parserHtml from 'prettier/parser-html';
import parserCss from 'prettier/parser-postcss';
import parserBabel from 'prettier/parser-babel';
import './GeneratorComponent.scss';

const GeneratorComponent = () => {
  const formatCurrent = () => {
    if (activeTab === 'html') {
      try {
        setHtml(prettier.format(html, { parser: 'html', plugins: [parserHtml] }));
      } catch { }
    } else if (activeTab === 'css') {
      try {
        setCss(prettier.format(css, { parser: 'css', plugins: [parserCss] }));
      } catch { }
    } else if (activeTab === 'js') {
      try {
        setJs(prettier.format(js, { parser: 'babel', plugins: [parserBabel] }));
      } catch { }
    }
  };
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('html');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const [isMinified, setIsMinified] = useState(false);
  const [includeJs, setIncludeJs] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [styleHandling, setStyleHandling] = useState('inline'); // 'skip', 'inline', 'class'

  const handleGenerateAndCopy = () => {
    try {
      const result = createBricksStructure(html, css, includeJs ? js : '', styleHandling);
      const json = isMinified
        ? JSON.stringify(result)
        : JSON.stringify(result, null, 2);
      setOutput(json);

      // Copy to clipboard
      navigator.clipboard.writeText(json);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to generate structure:', err);
      alert('Failed to generate structure. Please check your input.');
    }
  };

  const handleCopyJson = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  // Get preview HTML with sanitized content
  const previewHtml = useMemo(() => {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.innerHTML || '';
    } catch (e) {
      return html;
    }
  }, [html]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <div className="generator">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#2E7D32" />
            <path d="M2 17L12 22L22 17" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" />
            <path d="M2 12L12 17L22 12" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Code2Bricks</span>
        </div>
        <div className="app-header__controls">
          <button
            className="app-header__button"
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <RiSunLine size={16} /> : <RiMoonLine size={16} />}
          </button>
          <div className="app-header__actions">
            <button
              className="app-header__button primary"
              style={{ minWidth: '223px' }}
              onClick={handleGenerateAndCopy}
              disabled={!html.trim()}
            >
              {isCopied ? 'Copied to Clipboard!' : 'Copy Bricks Builder Structure'}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Left Panel - Code Editors */}
        <div className="app-panel app-panel--left">
          <div className="code-editor">
            <div className="code-editor__header">
              <div className="code-editor__tabs">
                <button
                  className={`code-editor__tab ${activeTab === 'html' ? 'active' : ''}`}
                  onClick={() => setActiveTab('html')}
                >
                  <RiHtml5Line size={16} style={{ marginRight: 6 }} />
                  HTML
                </button>
                <button
                  className={`code-editor__tab ${activeTab === 'css' ? 'active' : ''}`}
                  onClick={() => setActiveTab('css')}
                >
                  <FaCss3 size={16} style={{ marginRight: 6 }} />
                  CSS
                </button>
                <button
                  className={`code-editor__tab ${activeTab === 'js' ? 'active' : ''}`}
                  onClick={() => setActiveTab('js')}
                >
                  <RiJavascriptLine size={16} style={{ marginRight: 6 }} />
                  JS
                </button>
              </div>

              <div className="code-editor__actions">
                <button className="code-editor__action">
                  Format
                </button>
              </div>
            </div>
            <div className="code-editor__content">
              <div className="code-editor__pane active">
                {activeTab === 'html' && (
                  <>
                    <div className="code-editor__label">HTML</div>
                    <CodeEditor
                      value={html}
                      onChange={setHtml}
                      language="markup"
                      placeholder="<!-- Your HTML here… -->"
                    />
                  </>
                )}
                {activeTab === 'css' && (
                  <>
                    <div className="code-editor__label">CSS</div>
                    <CodeEditor
                      value={css}
                      onChange={setCss}
                      language="css"
                      placeholder="/* Your CSS here… */"
                    />
                  </>
                )}
                {activeTab === 'js' && (
                  <>
                    <div className="code-editor__label">JavaScript</div>
                    <CodeEditor
                      value={js}
                      onChange={setJs}
                      language="javascript"
                      placeholder="// Your JavaScript here…"
                    />
                  </>
                )}
              </div>
            </div>

          </div>

          <div className="generator-options">
            <div className="inline-styles-handling">
              <label className="inline-styles-handling__label">Inline Style Handling:</label>
              <div className="inline-styles-handling__options">
                <label className="inline-styles-handling__option">
                  <input
                    type="radio"
                    name="styleHandling"
                    value="skip"
                    checked={styleHandling === 'skip'}
                    onChange={() => setStyleHandling('skip')}
                    className="inline-styles-handling__radio"
                  />
                  <span className="inline-styles-handling__text">Skip</span>
                </label>
                <label className="inline-styles-handling__option">
                  <input
                    type="radio"
                    name="styleHandling"
                    value="inline"
                    checked={styleHandling === 'inline'}
                    onChange={() => setStyleHandling('inline')}
                    className="inline-styles-handling__radio"
                  />
                  <span className="inline-styles-handling__text">Inline</span>
                </label>
                <label className="inline-styles-handling__option">
                  <input
                    type="radio"
                    name="styleHandling"
                    value="class"
                    checked={styleHandling === 'class'}
                    onChange={() => setStyleHandling('class')}
                    className="inline-styles-handling__radio"
                  />
                  <span className="inline-styles-handling__text">Class</span>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Center Panel - Preview */}
        <div className="app-panel app-panel--center">
          <div className="preview-container">
            <div className="preview-header">
              <h3>Preview</h3>
              <div className="preview-actions"></div>
            </div>
            <div className="preview-content">
              {html || css || js ? (
                <Preview html={html} css={css} />
              ) : (
                <div className="preview-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                  <p>Preview will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Structure */}
        <div className="app-panel app-panel--right">
          <div className="structure-panel">
            <div className="structure-panel__header">
              <h3>Structure</h3>
              <div className="structure-actions">
              </div>
            </div>
            <div className="structure-panel__content">
              {output ? (
                <div className="json-viewer">
                  <pre>{JSON.stringify(JSON.parse(output), null, 2)}</pre>
                </div>
              ) : (
                <div className="structure-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <p>Generated structure will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GeneratorComponent;
