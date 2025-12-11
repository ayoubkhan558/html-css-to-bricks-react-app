import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({
  value,
  onChange,
  language = 'html',
  placeholder = '',
  className = '',
  height = '100%',
  readOnly = false,
}) => {
  const handleEditorChange = (newValue) => {
    onChange(newValue || '');
  };

  return (
    <div className={`code-editor ${className}`} style={{ height }}>
      <Editor
        height={height}
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          // readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: '"Fira code", "Fira Mono", monospace',
          // lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          autoClosingTags: 'always',
          folding: true,
          matchBrackets: 'always',
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
          },
        }}
      />
    </div>
  );
};

export default CodeEditor;
