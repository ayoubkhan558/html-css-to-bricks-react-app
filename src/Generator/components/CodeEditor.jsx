import React, { useCallback } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

const CodeEditor = ({ value, onChange, language }) => {
  const highlight = useCallback(
    (code) => Prism.highlight(code, Prism.languages[language] || Prism.languages.markup, language),
    [language]
  );

  return (
    <Editor
      value={value}
      onValueChange={onChange}
      highlight={highlight}
      padding={12}
      textareaClassName="code-editor__textarea"
      className="code-editor__editor"
      spellCheck={false}
    />
  );
};

export default CodeEditor;
