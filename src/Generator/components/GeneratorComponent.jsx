import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { RiJavascriptLine, RiHtml5Line } from "react-icons/ri";
import { FaCss3, FaCode, FaCopy, FaPlay, FaCheck } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import AboutModal from './AboutModal';
import Tooltip from '../../components/Tooltip';

import { useGenerator } from '../../contexts/GeneratorContext';
import { createBricksStructure } from '../utils/bricksGenerator';
import Preview from './Preview';
import CodeEditor from '../../components/CodeEditor';
import StructureView from './StructureView';
import prettier from 'prettier/standalone';
import * as parserHtml from 'prettier/parser-html';
import * as parserCss from 'prettier/parser-postcss';
import * as parserBabel from 'prettier/parser-babel';
import './GeneratorComponent.scss';

const GeneratorComponent = () => {
  const { 
    activeTab, 
    setActiveTab,
    inlineStyleHandling,
    setInlineStyleHandling,
    cssTarget,
    setCssTarget,
    showNodeClass,
    setShowNodeClass,
    html,
    setHtml,
    css,
    setCss,
    js,
    setJs,
    output,
    setOutput,
    isDarkMode,
    isMinified,
    toggleMinified,
    includeJs,
    setIncludeJs,
    showJsonPreview, 
    setShowJsonPreview, 
    isCopied, 
    setIsCopied 
  } = useGenerator();
  const [activeTagIndex, setActiveTagIndex] = useState(0);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const formatCurrent = async () => {
    const formatCode = async (code, parser) => {
      if (!code || typeof code !== 'string') return code;

      try {
        let options;

        if (parser === 'html') {
          options = {
            parser: 'html',
            plugins: [parserHtml],
            printWidth: 80,
            tabWidth: 2,
            useTabs: false,
            htmlWhitespaceSensitivity: 'css',
            endOfLine: 'auto',
          };
        } else if (parser === 'css') {
          options = {
            parser: 'css',
            plugins: [parserCss],
            printWidth: 80,
            tabWidth: 2,
            useTabs: false,
            singleQuote: true,
            endOfLine: 'auto',
          };
        } else if (parser === 'babel') {
          options = {
            parser: 'babel',
            plugins: [parserBabel],
            printWidth: 80,
            tabWidth: 2,
            useTabs: false,
            singleQuote: true,
            semi: true,
            trailingComma: 'es5',
            bracketSpacing: true,
            arrowParens: 'avoid',
            endOfLine: 'auto',
          };
        }

        const formatted = await prettier.format(code, options);
        return formatted;
      } catch (error) {
        console.error(`Error formatting ${parser}:`, error);
        return code;
      }
    };

    try {
      if (activeTab === 'html' && html) {
        const formatted = await formatCode(html, 'html');
        setHtml(formatted);
      } else if (activeTab === 'css' && css) {
        const formatted = await formatCode(css, 'css');
        setCss(formatted);
      } else if (activeTab === 'js' && js) {
        const formatted = await formatCode(js, 'babel');
        setJs(formatted);
      }
    } catch (error) {
      console.error('Error formatting code:', error);
    }
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const handleGenerateAndCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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

  const previewHtml = useMemo(() => {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.innerHTML || '';
    } catch (e) {
      return html;
    }
  }, [html]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }, []);


  useEffect(() => {
    try {
      if (html.trim()) {
        const includeJs = activeTab === 'js';
        // console.log('Creating bricks structure with context:', { showNodeClass, inlineStyleHandling, cssTarget });
        const result = createBricksStructure(html, css, includeJs ? js : '', { 
          context: {
            showNodeClass,
            inlineStyleHandling,
            cssTarget
          }
        });
        const json = isMinified
          ? JSON.stringify(result)
          : JSON.stringify(result, null, 2);
        setOutput(json);
      } else {
        setOutput('');
      }
    } catch (err) {
      console.error('Failed to generate structure:', err);
      // Optionally, you can set an error state here to show in the UI
    }
  }, [html, css, js, includeJs, inlineStyleHandling, isMinified, cssTarget, showNodeClass]);

  return (
    <div className="generator">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="var(--color-primary)" />
            <path d="M2 17L12 22L22 17" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
            <path d="M2 12L12 17L22 12" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Brickify </span>
          <div className="app-header__buttons">
            <button
              className="app-header__button"
              onClick={() => setIsAboutOpen(true)}
              title="About"
            >
              <FaInfoCircle size={16} />
            </button>
          </div>
        </div>
        <div className="app-header__controls">
          <div className="generator-options">
            <div className="inline-styles-handling">
              <label className="inline-styles-handling__label">Inline Styles:</label>
              <div className="inline-styles-handling__options">
                <label className="inline-styles-handling__option">
                  <input type="radio" name="inlineStyleHandling" value="skip" checked={inlineStyleHandling === 'skip'} onChange={() => setInlineStyleHandling('skip')} className="inline-styles-handling__radio" />
                  <span className="inline-styles-handling__text">Skip</span>
                </label>
                <label className="inline-styles-handling__option">
                  <input type="radio" name="inlineStyleHandling" value="inline" checked={inlineStyleHandling === 'inline'} onChange={() => setInlineStyleHandling('inline')} className="inline-styles-handling__radio" />
                  <span className="inline-styles-handling__text">Inline</span>
                </label>
                <label className="inline-styles-handling__option">
                  <input type="radio" name="inlineStyleHandling" value="class" checked={inlineStyleHandling === 'class'} onChange={() => setInlineStyleHandling('class')} className="inline-styles-handling__radio" />
                  <span className="inline-styles-handling__text">Class</span>
                </label>
              </div>
            </div>
            <div className="toggle-switch-container">
              <label className="toggle-switch-label">Apply CSS to:</label>
              <div className="toggle-switch">
                <span className={`toggle-option ${cssTarget === 'id' ? 'active' : ''}`}>ID</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={cssTarget === 'class'}
                    onChange={(e) => setCssTarget(e.target.checked ? 'class' : 'id')}
                  />
                  <span className="slider round"></span>
                </label>
                <span className={`toggle-option ${cssTarget === 'class' ? 'active' : ''}`}>Class</span>
              </div>
            </div>
          </div>

          <AboutModal
            isOpen={isAboutOpen}
            onClose={() => setIsAboutOpen(false)}
          />
          <div className="app-header__actions">
            <button
              className="app-header__button primary"
              style={{ minWidth: '223px' }}
              onClick={handleGenerateAndCopy}
              disabled={typeof html !== 'string' || !html.trim()}
            >
              {isCopied ? 'Copied to Clipboard!' : 'Copy Bricks Builder Structure'}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Resizable Panel Layout */}
        <PanelGroup direction="horizontal" className="panel-group">
          {/* Left Panel - Code Editors */}
          <Panel defaultSize={33} minSize={20} className="panel-left" style={{ borderRight: '2px solid var(--color-border)' }}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={30} className="panel-code-editor">
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
                      <button
                        className="code-editor__action"
                        onClick={(e) => {
                          e.stopPropagation();
                          formatCurrent();
                        }}
                        data-tooltip-id="format-tooltip"
                        data-tooltip-content="Auto Format & indent code"
                      >
                        Format
                      </button>
                      <Tooltip id="format-tooltip" place="top" effect="solid" />
                    </div>
                  </div>
                  <div className="code-editor__content">
                    <div className="code-editor__pane active">
                      <CodeEditor
                        value={activeTab === 'html' ? html : activeTab === 'css' ? css : js}
                        onChange={activeTab === 'html' ? setHtml : activeTab === 'css' ? setCss : setJs}
                        language={activeTab}
                        placeholder={
                          activeTab === 'html'
                            ? '<!-- Your HTML here… -->'
                            : activeTab === 'css'
                              ? '/* Your CSS here… */'
                              : '// Your JavaScript here…'
                        }
                        height="100%"
                        className="code-editor__content"
                        onCursorTagIndexChange={setActiveTagIndex}
                      />
                    </div>
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="resize-handle resize-handle--horizontal" />
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="resize-handle resize-handle--vertical" />

          {/* Center Panel - Preview */}
          <Panel defaultSize={34} minSize={20} className="panel-center" style={{ borderRight: '2px solid var(--color-border)' }}>
            <div className="preview-container">
              <div className="preview-header">
                <h3>Preview</h3>
                <div className="preview-actions"></div>
              </div>
              <div className="preview-content">
                {html || css || js ? (
                  <Preview html={html} css={css} activeTagIndex={activeTagIndex} highlight={activeTab === 'html'} />
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
          </Panel>

          <PanelResizeHandle className="resize-handle resize-handle--vertical" />

          {/* Right Panel - Structure */}
          <Panel defaultSize={20} minSize={15} maxSize={25} className="panel-right">
            <div className="structure-panel">
              <div className="structure-panel__header">
                <h3>Layers</h3>
                <div className="structure-actions">
                  <label className="switch" style={{ marginRight: 8 }}>
                    <input
                      type="checkbox"
                      checked={showNodeClass}
                      onChange={() => setShowNodeClass((prev) => !prev)}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', minWidth: 72 }}>
                    {showNodeClass ? 'Show Class' : 'Show Tag'}
                  </span>
                </div>
              </div>
              <div className="structure-panel__content">
                {output ? (
                  <StructureView
                    data={output ? JSON.parse(output).content : []}
                    globalClasses={output ? JSON.parse(output).globalClasses : []}
                    activeIndex={activeTagIndex}
                    showNodeClass={showNodeClass}
                  />
                ) : (
                  <div className="structure-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2V8z"></path>
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
          </Panel>
        </PanelGroup>
      </main>
    </div>
  );
};

export default GeneratorComponent;