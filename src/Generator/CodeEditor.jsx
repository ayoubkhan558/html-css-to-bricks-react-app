import React, { useRef, useMemo } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';
import './CodeEditor.css';

// Self-closing HTML tags that don't need closing tags
const SELF_CLOSING_TAGS = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];

const CodeEditor = ({
  value,
  onChange,
  language = 'html',
  placeholder = '',
  className = '',
  height = '100%',
  readOnly = false,
}) => {
  const editorRef = useRef(null);

  // Calculate line numbers
  const lineNumbers = useMemo(() => {
    const lines = value.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1);
  }, [value]);

  // Map language to Prism language
  const getPrismLanguage = (lang) => {
    switch (lang) {
      case 'html':
        return languages.markup;
      case 'css':
        return languages.css;
      case 'javascript':
      case 'js':
        return languages.javascript;
      default:
        return languages.markup;
    }
  };

  const highlightCode = (code) => {
    try {
      return highlight(code, getPrismLanguage(language), language === 'html' ? 'markup' : language);
    } catch (e) {
      return code;
    }
  };

  const handleKeyDown = (e) => {
    // Only auto-close tags in HTML mode
    if (language !== 'html') return;

    const textarea = editorRef.current?.querySelector('textarea');
    if (!textarea) return;

    // Auto-close tags when > is typed
    if (e.key === '>') {
      const cursorPos = textarea.selectionStart;
      const beforeCursor = value.substring(0, cursorPos);

      // Check if we just closed an opening tag
      const tagMatch = beforeCursor.match(/<([a-zA-Z][a-zA-Z0-9-]*)(?:\s[^>]*)?$/);

      if (tagMatch) {
        const tagName = tagMatch[1];

        // Don't auto-close self-closing tags
        if (SELF_CLOSING_TAGS.includes(tagName.toLowerCase())) {
          return;
        }

        // Don't auto-close if it's already a closing tag
        if (beforeCursor.trim().endsWith('</')) {
          return;
        }

        e.preventDefault();

        const afterCursor = value.substring(cursorPos);
        const newValue = beforeCursor + '>' + `</${tagName}>` + afterCursor;
        onChange(newValue);

        // Set cursor between the tags
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = cursorPos + 1;
          textarea.focus();
        }, 0);
      }
    }
  };

  return (
    <div className={`code-editor ${className}`} style={{ height, overflow: 'auto', position: 'relative' }} ref={editorRef}>
      <div className="editor-container">
        {/* Line numbers */}
        <div className="line-numbers">
          {lineNumbers.map(num => (
            <div key={num} className="line-number">{num}</div>
          ))}
        </div>

        {/* Code editor */}
        <div className="editor-content">
          <Editor
            value={value}
            onValueChange={onChange}
            highlight={highlightCode}
            padding={10}
            disabled={readOnly}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              minHeight: height,
              backgroundColor: 'transparent',
              color: '#d4d4d4',
            }}
            textareaClassName="code-textarea"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
