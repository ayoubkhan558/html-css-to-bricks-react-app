import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { RiJavascriptLine, RiHtml5Line } from "react-icons/ri";
import { FaCss3, FaCode, FaCopy, FaPlay, FaCheck, FaDownload, FaChevronDown, FaPaperPlane, FaSpinner } from "react-icons/fa6";
import { MdOutlineSettings } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import { VscCopy } from "react-icons/vsc";
import AboutModal from './../../components/AboutModal/index';
import AISettings from './../../components/AISettings/index';
import Tooltip from '../../components/Tooltip';

import { useGenerator } from '../../contexts/GeneratorContext';
import { createBricksStructure } from '../utils/bricksGenerator';
import Preview from './Preview';
import CodeEditor from '@generator/CodeEditor';
import StructureView from './StructureView';
import prettier from 'prettier/standalone';
import * as parserHtml from 'prettier/parser-html';
import * as parserCss from 'prettier/parser-postcss';
import * as parserBabel from 'prettier/parser-babel';
import './GeneratorComponent.scss';
import aiModels from '@config/aiModels.json';
import { logger } from '@lib/logger';

const GeneratorComponent = () => {
  const {
    activeTab,
    setActiveTab,
    inlineStyleHandling,
    setInlineStyleHandling,
    showNodeClass,
    setShowNodeClass,
    mergeNonClassSelectors,
    setMergeNonClassSelectors,
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [quickPrompt, setQuickPrompt] = useState('');
  const [isQuickGenerating, setIsQuickGenerating] = useState(false);
  const [quickError, setQuickError] = useState(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    gemini: '',
    openrouter: '',
    openai: ''
  });
  const [currentProvider, setCurrentProvider] = useState('gemini');
  const [selectedQuickModel, setSelectedQuickModel] = useState('');

  // Check for API key on mount and when settings close
  useEffect(() => {
    const checkApiKeys = () => {
      const keys = {
        gemini: localStorage.getItem('ai_api_key_gemini') || '',
        openrouter: localStorage.getItem('ai_api_key_openrouter') || '',
        openai: localStorage.getItem('ai_api_key_openai') || ''
      };

      setApiKeys(keys);

      const provider = localStorage.getItem('ai_provider') || 'gemini';
      const model = localStorage.getItem('ai_model');

      setCurrentProvider(provider);
      setHasApiKey(!!keys[provider]);

      // Set selected model from localStorage or default
      if (model) {
        setSelectedQuickModel(model);
      } else {
        const defaultModel = provider === 'gemini' ? 'gemini-2.5-flash' :
          provider === 'openrouter' ? 'google/gemini-2.0-flash-exp:free' :
            'gpt-4o-mini';
        setSelectedQuickModel(defaultModel);
      }
    };

    checkApiKeys();

    // Re-check when component mounts or settings modal state changes
    if (!isAISettingsOpen) {
      checkApiKeys();
    }
  }, [isAISettingsOpen]);

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
        logger.error(`Error formatting ${parser}:`, error);
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
      logger.error('Error formatting code:', error);
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
      logger.error('Failed to copy JSON:', err);
    }
  };

  const handleExportJson = () => {
    if (!output) return;
    try {
      const blob = new Blob([output], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bricks-structure-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      logger.error('Failed to export JSON:', err);
    }
  };

  const handleAICodeGenerated = (generatedCode) => {
    if (generatedCode.html) setHtml(generatedCode.html);
    if (generatedCode.css) setCss(generatedCode.css);
    if (generatedCode.js) setJs(generatedCode.js);
  };

  const handleQuickGenerate = async () => {
    if (!quickPrompt.trim() || isQuickGenerating) return;

    // Get the API key for the current provider
    const currentApiKey = apiKeys[currentProvider];
    if (!currentApiKey) {
      setQuickError('Please set your AI API key in settings first.');
      setTimeout(() => setQuickError(null), 3000);
      return;
    }

    setIsQuickGenerating(true);
    setQuickError(null);

    try {
      // Temporarily save the selected model to localStorage for this request
      const originalModel = localStorage.getItem('ai_model');
      localStorage.setItem('ai_model', selectedQuickModel);

      const { aiService } = await import('@services/ai');

      // Build context based on active tab and existing code
      const currentCode = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
      const hasExistingCode = currentCode.trim();

      let systemPrompt = `
        You are an expert web developer. Generate clean, modern code based on the user's request.

          IMPORTANT:
          - Dont provide html, body, head tag etc
          - Return ONLY the ${activeTab.toUpperCase()} code, no explanations
          - Use proper formatting and indentation
          - For updates, return the COMPLETE updated code
          - Do NOT wrap CSS in <style> tags - provide raw CSS only
          - Do NOT wrap JavaScript in <script> tags - provide raw JavaScript only
          - Keep HTML, CSS, and JavaScript separate`;

      if (hasExistingCode) {
        systemPrompt += `

          CURRENT ${activeTab.toUpperCase()} CODE:
          \`\`\`${activeTab}
          ${currentCode}
          \`\`\``;
      }

      // Configure AI service
      aiService.configure(currentProvider, currentApiKey, selectedQuickModel);

      // Generate code
      const response = await aiService.generate(quickPrompt.trim(), {
        systemPrompt
      });

      // Restore original model
      if (originalModel) {
        localStorage.setItem('ai_model', originalModel);
      } else {
        localStorage.removeItem('ai_model');
      }

      // Extract code based on active tab
      let generatedCode = '';
      if (activeTab === 'html' && response.html) {
        generatedCode = response.html;
      } else if (activeTab === 'css' && response.css) {
        generatedCode = response.css;
      } else if (activeTab === 'js' && response.js) {
        generatedCode = response.js;
      } else {
        // Fallback: try to extract from message
        const codeBlockRegex = new RegExp(`\`\`\`${activeTab}\n([\s\S]*?)\`\`\``, 'i');
        const match = response.message.match(codeBlockRegex);
        if (match) {
          generatedCode = match[1].trim();
        } else {
          // Just use the message as-is
          generatedCode = response.message;
        }
      }

      // Update the appropriate code
      if (generatedCode) {
        if (activeTab === 'html') setHtml(generatedCode);
        else if (activeTab === 'css') setCss(generatedCode);
        else setJs(generatedCode);

        // If HTML was generated and it had embedded CSS/JS, update those tabs too
        if (activeTab === 'html') {
          if (response.css) setCss(response.css);
          if (response.js) setJs(response.js);
        }

        setQuickPrompt('');
      } else {
        setQuickError('No code generated. Try rephrasing your prompt.');
        setTimeout(() => setQuickError(null), 3000);
      }

    } catch (err) {
      setQuickError(err.message || 'Failed to generate code');
      logger.error('Quick AI Error:', err);
      setTimeout(() => setQuickError(null), 5000);
    } finally {
      setIsQuickGenerating(false);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.split-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);


  useEffect(() => {
    try {
      if (html.trim()) {
        const includeJs = activeTab === 'js';
        // console.log('Creating bricks structure with context:', { showNodeClass, inlineStyleHandling });
        const result = createBricksStructure(html, css, includeJs ? js : '', {
          context: {
            showNodeClass,
            inlineStyleHandling,
            mergeNonClassSelectors
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
      logger.error('Failed to generate structure:', err);
      // Optionally, you can set an error state here to show in the UI
    }
  }, [html, css, js, includeJs, inlineStyleHandling, isMinified, showNodeClass, mergeNonClassSelectors]);

  return (
    <div className="generator">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__logo">
          {/* <img height="45" src="/brickify-logo.svg" alt="logo" /> */}
          <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 732.42">
            <rect width="750" height="732.422" rx="35" fill="#FFD53E"></rect>
            <path d="M300.691 278C326.025 278 348.025 283.833 366.691 295.5C385.691 306.833 400.358 323 410.691 344C421.358 364.667 426.691 389.167 426.691 417.5C426.691 444.5 421.525 468.333 411.191 489C401.191 509.667 386.858 525.667 368.191 537C349.858 548.333 328.025 554 302.691 554C280.025 554 260.358 548.5 243.691 537.5C227.358 526.167 214.691 510.333 205.691 490C197.025 469.333 192.691 445 192.691 417C192.691 388.333 197.025 363.667 205.691 343C214.358 322 226.691 306 242.691 295C259.025 283.667 278.358 278 300.691 278ZM278.691 346.5C267.691 346.5 257.691 349.5 248.691 355.5C240.025 361.167 233.191 369.167 228.191 379.5C223.525 389.5 221.191 401.333 221.191 415C221.191 428.333 223.525 440.333 228.191 451C233.191 461.333 240.025 469.333 248.691 475C257.691 480.667 267.691 483.5 278.691 483.5C290.358 483.5 300.525 480.667 309.191 475C318.191 469 325.025 460.833 329.691 450.5C334.691 440.167 337.191 428.333 337.191 415C337.191 401.667 334.691 389.833 329.691 379.5C325.025 369.167 318.191 361.167 309.191 355.5C300.525 349.5 290.358 346.5 278.691 346.5ZM132.191 180H221.191V551H132.191V180ZM648.465 357.5C630.798 355.5 615.298 357 601.965 362C588.965 367 578.798 374.667 571.465 385C564.465 395 560.965 407.167 560.965 421.5L539.965 417.5C539.965 388.167 544.298 363 552.965 342C561.965 321 574.632 305 590.965 294C607.298 282.667 626.465 277 648.465 277V357.5ZM472.465 281H561.465V551H472.465V281Z" fill="#1E1E1E"></path>
          </svg>

          <span>Brickify </span>
          <div className="app-header__buttons">
            <button
              className="button buttn-sm primary"
              onClick={() => setIsAboutOpen(true)}
              title="About"
            >
              <FaInfoCircle size={16} />
            </button>
          </div>
        </div>
        <div className="app-header__controls">
          <div className="generator-options">
            <div className="form-control">
              <span className="form-control__label">Inline Styles</span>
              <div className="form-control__options">
                <label className="form-control__option">
                  <input type="radio" name="inlineStyleHandling" value="skip" checked={inlineStyleHandling === 'skip'} onChange={() => setInlineStyleHandling('skip')} className="form-control__radio" />
                  <span className="form-control__text">Skip</span>
                </label>
                <label className="form-control__option">
                  <input type="radio" name="inlineStyleHandling" value="inline" checked={inlineStyleHandling === 'inline'} onChange={() => setInlineStyleHandling('inline')} className="form-control__radio" />
                  <span className="form-control__text">Inline</span>
                </label>
                <label className="form-control__option">
                  <input type="radio" name="inlineStyleHandling" value="class" checked={inlineStyleHandling === 'class'} onChange={() => setInlineStyleHandling('class')} className="form-control__radio" />
                  <span className="form-control__text">Class</span>
                </label>
              </div>
            </div>
            <div className="form-control">
              <label className="form-control__label">Selectors</label>

              <div className="form-control__options----">
                <span className="form-control__option">

                  <label className="form-control__switch">
                    <input
                      type="checkbox"
                      checked={mergeNonClassSelectors}
                      onChange={(e) => setMergeNonClassSelectors(e.target.checked)}
                    />
                    <span className="form-control__slider"></span>
                  </label>

                  <span className="form-control__text">Merge Selectors</span>
                </span>
              </div>
            </div>
          </div>

          <AboutModal
            isOpen={isAboutOpen}
            onClose={() => setIsAboutOpen(false)}
          />
          <div className="app-header__actions">
            <div className="split-dropdown">
              <button
                className="button primary split-dropdown__main"
                onClick={handleGenerateAndCopy}
                disabled={typeof html !== 'string' || !html.trim()}
              >
                <VscCopy />
                {/* {isCopied ? 'Copied to Clipboard!' : 'Copy Bricks Builder Structure'} */}
                {isCopied ? 'Copied to Clipboard!' : 'Copy Bricks Structure'}
              </button>
              <button
                className="button primary split-dropdown__toggle"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={typeof html !== 'string' || !html.trim()}
                aria-expanded={isDropdownOpen}
              >
                <FaChevronDown size={12} />
              </button>
              {isDropdownOpen && (
                <div className="split-dropdown__menu">
                  <button
                    className="split-dropdown__item"
                    onClick={() => {
                      handleExportJson();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <FaDownload size={14} />
                    <span>Export as JSON</span>
                  </button>
                  <button
                    className="split-dropdown__item"
                    onClick={() => {
                      handleGenerateAndCopy();
                      setIsDropdownOpen(false);
                    }}
                  >
                    <FaCopy size={14} />
                    <span>Copy to Clipboard</span>
                  </button>
                </div>
              )}
            </div>
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
                        onClick={() => setIsAISettingsOpen(true)}
                        title="AI Settings"
                      >
                        <MdOutlineSettings size={16} /> AI
                      </button>
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
                            ?
                            `<!-- Your HTML here… -->
                            
<section>
  <h1>My First Heading</h1>
  <p>My first paragraph.</p>
</section>
                            `
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

                  {/* Quick AI Prompt - Show always to allow key setup */}
                  <div className="quick-ai-prompt">
                    {quickError && (
                      <div className="quick-ai-error">
                        ⚠️ {quickError}
                      </div>
                    )}

                    <div className="quick-ai-header">
                      {/* Provider and Key Status */}
                      <div className="quick-ai-status">
                        <span className="provider-info">
                          Provider: <strong>{currentProvider.charAt(0).toUpperCase() + currentProvider.slice(1)}</strong>
                        </span>
                        <span className={`key-status ${hasApiKey ? 'valid' : 'invalid'}`}>
                          {hasApiKey ? '✓ Key Set' : '✗ No Key'}
                        </span>
                      </div>

                      {/* Model Selector - Show for all providers */}
                      <div className="quick-ai-model-selector">
                        <label htmlFor="quick-model">Model:</label>
                        <select
                          id="quick-model"
                          value={selectedQuickModel}
                          onChange={(e) => setSelectedQuickModel(e.target.value)}
                          className="quick-model-select"
                          disabled={isQuickGenerating}
                        >
                          {aiModels[currentProvider]?.map((model) => (
                            <option key={model.value} value={model.value}>
                              {model.label}
                              {/* - {model.description ? ` (${model.description})` : ''} */}
                            </option>
                          )) || (
                              <option value="">No models available</option>
                            )}
                        </select>
                      </div>

                    </div>

                    <div className="quick-ai-input">
                      <textarea
                        type="text"
                        value={quickPrompt}
                        onChange={(e) => setQuickPrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleQuickGenerate();
                          }
                        }}
                        placeholder={`Ask AI to create/modify ${activeTab.toUpperCase()} code... (e.g., ${activeTab === "html"
                          ? '"Create a new section with a button and image"'
                          : activeTab === "jsx"
                            ? '"Create a React component with state"'
                            : activeTab === "css"
                              ? '"Change the background color to blue"'
                              : '"Add a click event to toggle visibility"'
                          })`}
                        rows={3}
                        disabled={isQuickGenerating}
                        className="quick-ai-input-field"
                        autoComplete="off"
                      />
                      <button
                        onClick={handleQuickGenerate}
                        disabled={!quickPrompt.trim() || isQuickGenerating}
                        className="quick-ai-send"
                        title="Generate/Modify Code"
                      >
                        {isQuickGenerating ? <FaSpinner className="spinning" /> : <FaPaperPlane />}
                      </button>
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
                <div className="form-control__option">
                  <label className="form-control__label">
                    Labels
                  </label>
                  <label className="form-control__switch" style={{ marginRight: 8 }}>
                    <input
                      type="checkbox"
                      checked={showNodeClass}
                      onChange={() => setShowNodeClass((prev) => !prev)}
                    />
                    <span className="form-control__slider"></span>
                  </label>
                  <span style={{ fontSize: 13, color: 'var(--color-text-2)', minWidth: 72 }}>
                    {showNodeClass ? 'Class Label' : 'Tag Label'}
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

      {/* AI Components */}
      <AISettings
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
      />
    </div>
  );
};

export default GeneratorComponent;