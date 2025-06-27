import React, { useState, useMemo } from 'react';
import { createBricksStructure } from '../utils/bricksGenerator';
import Preview from './Preview';
import './GeneratorComponent.scss';

const GeneratorComponent = () => {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [output, setOutput] = useState('');
  const [isMinified, setIsMinified] = useState(false);
  const [includeJs, setIncludeJs] = useState(false);
  const [showJsonPreview, setShowJsonPreview] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [styleHandling, setStyleHandling] = useState('inline'); // 'skip', 'inline', 'class'

  const handleGenerate = () => {
    try {
      const result = createBricksStructure(html, css, includeJs ? js : '', styleHandling);
      const json = isMinified
        ? JSON.stringify(result)
        : JSON.stringify(result, null, 2);
      setOutput(json);
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

  return (
    <div className="generator">
      <div className="generator__header">
        <h2 className="generator__title">Bricks Structure Generator</h2>
        <p className="generator__description">
          Paste your raw HTML, CSS, and JavaScript below. Click <strong>Generate</strong> to get a JSON structure that you can copy &amp; paste
          directly into Bricks' structure panel.
        </p>
      </div>

      <div className="generator__grid">
        <div className="generator__left">
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

          <div className="generator__inputs">
            <div className="generator__code-group">
              <label>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={16}
                  viewBox="0 0 124 141.53199999999998"
                  fill="none"
                >
                  <path
                    d="M10.383 126.894L0 0l124 .255-10.979 126.639-50.553 14.638z"
                    fill="#e34f26"
                  />
                  <path d="M62.468 129.277V12.085l51.064.17-9.106 104.851z" fill="#ef652a" />
                  <path
                    d="M99.49 41.362l1.446-15.49H22.383l4.34 47.49h54.213L78.81 93.617l-17.362 4.68-17.617-5.106-.936-12.085H27.319l2.128 24.681 32 8.936 32.255-8.936 4.34-48.17H41.107L39.49 41.362z"
                    fill="#fff"
                  />
                </svg>
                HTML
              </label>
              <textarea
                className="generator__textarea"
                placeholder="<div>Your HTML here…</div>"
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                rows={6}
              />
            </div>

            <div className="generator__code-group">
              <label>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={16}
                  viewBox="0 0 124 141.53"
                  fill="none"
                >
                  <path
                    d="M10.383 126.892L0 0l124 .255-10.979 126.637-50.553 14.638z"
                    fill="#1b73ba"
                  />
                  <path d="M62.468 129.275V12.085l51.064.17-9.106 104.85z" fill="#1c88c7" />
                  <path
                    d="M100.851 27.064H22.298l2.128 15.318h37.276l-36.68 15.745 2.127 14.808h54.043l-1.958 20.68-18.298 3.575-16.595-4.255-1.277-11.745H27.83l2.042 24.426 32.681 9.106 31.32-9.957 4-47.745H64.765l36.085-14.978z"
                    fill="#fff"
                  />
                </svg>
                CSS
              </label>
              <textarea
                className="generator__textarea"
                placeholder="/* Your CSS here… */"
                value={css}
                onChange={(e) => setCss(e.target.value)}
                rows={6}
              />
            </div>

            <div className="generator__code-group">
              <div className="generator__toggle">
                <input
                  type="checkbox"
                  checked={includeJs}
                  onChange={(e) => setIncludeJs(e.target.checked)}
                  id="includeJs"
                />
                <label htmlFor="includeJs" className="generator__toggle-label">
                  Include
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={16}
                    viewBox="0 0 1052 1052"
                  >
                    <path fill="#f0db4f" d="M0 0h1052v1052H0z" />
                    <path
                      d="M965.9 801.1c-7.7-48-39-88.3-131.7-125.9-32.2-14.8-68.1-25.399-78.8-49.8-3.8-14.2-4.3-22.2-1.9-30.8 6.9-27.9 40.2-36.6 66.6-28.6 17 5.7 33.1 18.801 42.8 39.7 45.4-29.399 45.3-29.2 77-49.399-11.6-18-17.8-26.301-25.4-34-27.3-30.5-64.5-46.2-124-45-10.3 1.3-20.699 2.699-31 4-29.699 7.5-58 23.1-74.6 44-49.8 56.5-35.6 155.399 25 196.1 59.7 44.8 147.4 55 158.6 96.9 10.9 51.3-37.699 67.899-86 62-35.6-7.4-55.399-25.5-76.8-58.4-39.399 22.8-39.399 22.8-79.899 46.1 9.6 21 19.699 30.5 35.8 48.7 76.2 77.3 266.899 73.5 301.1-43.5 1.399-4.001 10.6-30.801 3.199-72.101zm-394-317.6h-98.4c0 85-.399 169.4-.399 254.4 0 54.1 2.8 103.7-6 118.9-14.4 29.899-51.7 26.2-68.7 20.399-17.3-8.5-26.1-20.6-36.3-37.699-2.8-4.9-4.9-8.7-5.601-9-26.699 16.3-53.3 32.699-80 49 13.301 27.3 32.9 51 58 66.399 37.5 22.5 87.9 29.4 140.601 17.3 34.3-10 63.899-30.699 79.399-62.199 22.4-41.3 17.6-91.3 17.4-146.6.5-90.2 0-180.4 0-270.9z"
                      fill="#323330"
                    />
                  </svg>
                  JavaScript
                </label>
              </div>
              {includeJs &&
                <textarea
                  className="generator__textarea"
                  placeholder="// Your JavaScript here…"
                  value={js}
                  onChange={(e) => setJs(e.target.value)}
                  rows={3}
                />
              }
            </div>

            <button
              className="generator__button"
              onClick={handleGenerate}
              disabled={!html.trim()}
            >
              Generate
            </button>
          </div>
        </div>

        <div className="generator__right">
          <div className="generator__view-toggle">
            <button
              className={`generator__view-toggle-btn ${showJsonPreview ? 'active' : ''}`}
              onClick={() => setShowJsonPreview(true)}
            >
              JSON Output
            </button>
            <button
              className={`generator__view-toggle-btn ${!showJsonPreview ? 'active' : ''}`}
              onClick={() => setShowJsonPreview(false)}
            >
              Preview
            </button>
          </div>

          {showJsonPreview ? (
            <>
              <div className="generator__output-options">
                <label className="generator__toggle">
                  <input
                    type="checkbox"
                    checked={isMinified}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setIsMinified(isChecked);
                      if (output) {
                        try {
                          const parsed = JSON.parse(output);
                          setOutput(
                            isChecked
                              ? JSON.stringify(parsed)
                              : JSON.stringify(parsed, null, 2)
                          );
                        } catch (err) {
                          console.error('Error toggling JSON minification:', err);
                        }
                      }
                    }}
                  />
                  <span className="generator__toggle-label">Minify JSON</span>
                </label>
              </div>
              <textarea
                className="generator__output"
                readOnly
                value={output}
                rows={8}
              />
            </>
          ) : (
            <Preview html={html} css={css} />
          )}
          <button
            type="button"
            className="generator__copy-button"
            disabled={!output}
            onClick={handleCopyJson}
          >
            {isCopied ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratorComponent;
