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
          // Auto-closing features
          autoClosingBrackets: 'languageDefined',
          autoClosingQuotes: 'languageDefined',
          autoClosingDelete: 'auto',
          autoClosingOvertype: 'auto',

          // Suggestions
          quickSuggestions: {
            other: 'on',
            comments: 'off',
            strings: 'on',
          },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
          wordBasedSuggestions: 'matchingDocuments',

          // Emmet
          'emmet.showExpandedAbbreviation': 'always',
          'emmet.showSuggestionsAsSnippets': true,

          // Bracket features
          bracketPairColorization: {
            enabled: true,
          },
          guides: {
            bracketPairs: true,
            indentation: true,
          },

          // Basic settings
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          contextmenu: false,
          wordWrap: 'on',
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
