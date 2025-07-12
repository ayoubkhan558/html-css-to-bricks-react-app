import React, { useCallback } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

const CodeEditor = ({ value, onChange, language, placeholder = '' }) => {
  const highlight = useCallback(
    (code) => {
      if (!code.trim()) return '';
      try {
        return Prism.highlight(
          code,
          Prism.languages[language] || Prism.languages.markup,
          language
        );
      } catch (e) {
        return code;
      }
    },
    [language]
  );

  return (
    <div className="code-editor__wrapper">
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={highlight}
        padding={16}
        textareaClassName="code-editor__textarea"
        className="code-editor__editor"
        style={{
          fontFamily: '"Fira Code", "Fira Mono", monospace',
          fontSize: '14px',
          minHeight: '200px',
          outline: 'none',
        }}
        placeholder={placeholder}
        spellCheck={false}
      />
    </div>
  );
};

export default CodeEditor;
