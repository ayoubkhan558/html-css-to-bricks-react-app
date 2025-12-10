import React, { useMemo, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { lineNumbers, highlightActiveLineGutter, highlightActiveLine, EditorView } from '@codemirror/view';
import { bracketMatching, indentOnInput } from '@codemirror/language';
import { darkTheme } from '@generator/theme/codemirror-theme';


// HTML autocompletions
const htmlCompletions = (context) => {
  const word = context.matchBefore(/[\w-]*/);
  if (!word || word.from === word.to && !context.explicit) return null;

  const tagBefore = context.matchBefore(/<\/?[\w-]+/);
  const tagName = tagBefore ? tagBefore.text.match(/<\/?([\w-]+)/)?.[1] : '';

  // If inside an opening tag
  if (tagName && !tagBefore.text.endsWith('/')) {
    return {
      from: word.from,
      options: [
        { label: 'class', type: 'property', info: 'class="..."' },
        { label: 'id', type: 'property', info: 'id="..."' },
        { label: 'style', type: 'property', info: 'style="..."' },
        { label: 'href', type: 'property', info: 'href="..."' },
        { label: 'src', type: 'property', info: 'src="..."' },
        { label: 'alt', type: 'property', info: 'alt="..."' },
        { label: 'title', type: 'property', info: 'title="..."' },
        { label: 'data-*', type: 'property', info: 'data-*="..."' },
      ]
    };
  }

  // Default HTML tag completions
  return {
    from: word.from,
    options: [
      { label: 'div', type: 'tag', info: '<div>...</div>' },
      { label: 'span', type: 'tag', info: '<span>...</span>' },
      { label: 'p', type: 'tag', info: '<p>...</p>' },
      { label: 'a', type: 'tag', info: '<a href="">...</a>' },
      { label: 'img', type: 'tag', info: '<img src="" alt="">' },
      { label: 'h1', type: 'tag', info: '<h1>...</h1>' },
      { label: 'h2', type: 'tag', info: '<h2>...</h2>' },
      { label: 'h3', type: 'tag', info: '<h3>...</h3>' },
      { label: 'h4', type: 'tag', info: '<h4>...</h4>' },
      { label: 'h5', type: 'tag', info: '<h5>...</h5>' },
      { label: 'h6', type: 'tag', info: '<h6>...</h6>' },
      { label: 'ul', type: 'tag', info: '<ul>...</ul>' },
      { label: 'ol', type: 'tag', info: '<ol>...</ol>' },
      { label: 'li', type: 'tag', info: '<li>...</li>' },
      { label: 'button', type: 'tag', info: '<button>...</button>' },
      { label: 'input', type: 'tag', info: '<input type="">' },
      { label: 'form', type: 'tag', info: '<form>...</form>' },
      { label: 'label', type: 'tag', info: '<label>...</label>' },
      { label: 'select', type: 'tag', info: '<select>...</select>' },
      { label: 'option', type: 'tag', info: '<option>...</option>' },
      { label: 'textarea', type: 'tag', info: '<textarea>...</textarea>' },
      { label: 'table', type: 'tag', info: '<table>...</table>' },
      { label: 'tr', type: 'tag', info: '<tr>...</tr>' },
      { label: 'td', type: 'tag', info: '<td>...</td>' },
      { label: 'th', type: 'tag', info: '<th>...</th>' },
      { label: 'header', type: 'tag', info: '<header>...</header>' },
      { label: 'footer', type: 'tag', info: '<footer>...</footer>' },
      { label: 'nav', type: 'tag', info: '<nav>...</nav>' },
      { label: 'section', type: 'tag', info: '<section>...</section>' },
      { label: 'article', type: 'tag', info: '<article>...</article>' },
      { label: 'aside', type: 'tag', info: '<aside>...</aside>' },
      { label: 'main', type: 'tag', info: '<main>...</main>' },
      { label: 'div', type: 'tag', info: '<div>...</div>' },
      { label: 'span', type: 'tag', info: '<span>...</span>' },
    ]
  };
};

// CSS autocompletions
const cssCompletions = (context) => {
  const word = context.matchBefore(/[\w-]*/);
  if (!word || word.from === word.to && !context.explicit) return null;

  // Check if we're completing a property or a value
  const before = context.state.doc.toString().substring(0, word.from).trim();
  const isValue = before.endsWith(':');

  if (isValue) {
    const property = before.substring(0, before.length - 1).trim().toLowerCase();
    const valueOptions = [];

    // Common value completions based on property
    switch (property) {
      case 'display':
        valueOptions.push(
          { label: 'block', type: 'value', info: 'display: block' },
          { label: 'flex', type: 'value', info: 'display: flex' },
          { label: 'grid', type: 'value', info: 'display: grid' },
          { label: 'inline', type: 'value', info: 'display: inline' },
          { label: 'inline-block', type: 'value', info: 'display: inline-block' },
          { label: 'none', type: 'value', info: 'display: none' }
        );
        break;
      case 'position':
        valueOptions.push(
          { label: 'static', type: 'value', info: 'position: static' },
          { label: 'relative', type: 'value', info: 'position: relative' },
          { label: 'absolute', type: 'value', info: 'position: absolute' },
          { label: 'fixed', type: 'value', info: 'position: fixed' },
          { label: 'sticky', type: 'value', info: 'position: sticky' }
        );
        break;
      case 'justify-content':
      case 'justify-items':
      case 'justify-self':
        valueOptions.push(
          { label: 'flex-start', type: 'value' },
          { label: 'flex-end', type: 'value' },
          { label: 'center', type: 'value' },
          { label: 'space-between', type: 'value' },
          { label: 'space-around', type: 'value' },
          { label: 'space-evenly', type: 'value' },
          { label: 'stretch', type: 'value' }
        );
        break;
      case 'align-items':
      case 'align-self':
      case 'align-content':
        valueOptions.push(
          { label: 'flex-start', type: 'value' },
          { label: 'flex-end', type: 'value' },
          { label: 'center', type: 'value' },
          { label: 'baseline', type: 'value' },
          { label: 'stretch', type: 'value' }
        );
        break;
      case 'flex-direction':
        valueOptions.push(
          { label: 'row', type: 'value' },
          { label: 'row-reverse', type: 'value' },
          { label: 'column', type: 'value' },
          { label: 'column-reverse', type: 'value' }
        );
        break;
      case 'flex-wrap':
        valueOptions.push(
          { label: 'nowrap', type: 'value' },
          { label: 'wrap', type: 'value' },
          { label: 'wrap-reverse', type: 'value' }
        );
        break;
      case 'color':
      case 'background-color':
      case 'border-color':
      case 'border-top-color':
      case 'border-right-color':
      case 'border-bottom-color':
      case 'border-left-color':
        valueOptions.push(
          { label: 'transparent', type: 'value' },
          { label: 'currentColor', type: 'value' },
          { label: 'inherit', type: 'value' },
          { label: 'initial', type: 'value' },
          { label: 'unset', type: 'value' },
          { label: 'var(--primary)', type: 'value' },
          { label: 'var(--secondary)', type: 'value' },
          { label: 'var(--accent)', type: 'value' },
          { label: 'var(--text)', type: 'value' },
          { label: 'var(--background)', type: 'value' }
        );
        break;
      default:
        // Default value completions for any property
        valueOptions.push(
          { label: 'inherit', type: 'value' },
          { label: 'initial', type: 'value' },
          { label: 'unset', type: 'value' },
          { label: 'auto', type: 'value' },
          { label: '0', type: 'value' },
          { label: '1px', type: 'value' },
          { label: '100%', type: 'value' },
          { label: 'var(--custom-property)', type: 'value' }
        );
    }

    return {
      from: word.from,
      options: valueOptions
    };
  }

  // Property completions
  return {
    from: word.from,
    options: [
      // Layout
      { label: 'display', type: 'property', info: 'Defines the display type of an element' },
      { label: 'position', type: 'property', info: 'Specifies the type of positioning for an element' },
      { label: 'top', type: 'property', info: 'Specifies the top position of a positioned element' },
      { label: 'right', type: 'property', info: 'Specifies the right position of a positioned element' },
      { label: 'bottom', type: 'property', info: 'Specifies the bottom position of a positioned element' },
      { label: 'left', type: 'property', info: 'Specifies the left position of a positioned element' },
      { label: 'z-index', type: 'property', info: 'Sets the stack order of an element' },

      // Flexbox
      { label: 'flex', type: 'property', info: 'Shorthand for flex-grow, flex-shrink and flex-basis' },
      { label: 'flex-direction', type: 'property', info: 'Specifies the direction of the flexible items' },
      { label: 'flex-wrap', type: 'property', info: 'Specifies whether the flex items should wrap or not' },
      { label: 'justify-content', type: 'property', info: 'Aligns the flexible container\'s items when the items do not use all available space' },
      { label: 'align-items', type: 'property', info: 'Aligns the flexible container\'s items' },
      { label: 'align-content', type: 'property', info: 'Aligns the lines in a flex container when there is extra space' },

      // Grid
      { label: 'grid', type: 'property', info: 'Shorthand for grid-template-rows, grid-template-columns, and grid-areas' },
      { label: 'grid-template-columns', type: 'property', info: 'Specifies the size of the columns in a grid layout' },
      { label: 'grid-template-rows', type: 'property', info: 'Specifies the size of the rows in a grid layout' },
      { label: 'grid-gap', type: 'property', info: 'Shorthand for grid-row-gap and grid-column-gap' },
      { label: 'grid-column', type: 'property', info: 'Shorthand for grid-column-start and grid-column-end' },
      { label: 'grid-row', type: 'property', info: 'Shorthand for grid-row-start and grid-row-end' },

      // Box Model
      { label: 'width', type: 'property', info: 'Sets the width of an element' },
      { label: 'height', type: 'property', info: 'Sets the height of an element' },
      { label: 'max-width', type: 'property', info: 'Sets the maximum width of an element' },
      { label: 'max-height', type: 'property', info: 'Sets the maximum height of an element' },
      { label: 'min-width', type: 'property', info: 'Sets the minimum width of an element' },
      { label: 'min-height', type: 'property', info: 'Sets the minimum height of an element' },
      { label: 'margin', type: 'property', info: 'Shorthand for margin-top, margin-right, margin-bottom, and margin-left' },
      { label: 'padding', type: 'property', info: 'Shorthand for padding-top, padding-right, padding-bottom, and padding-left' },
      { label: 'box-sizing', type: 'property', info: 'Defines how the width and height of an element are calculated' },

      // Typography
      { label: 'color', type: 'property', info: 'Sets the color of text' },
      { label: 'font-family', type: 'property', info: 'Specifies the font family for text' },
      { label: 'font-size', type: 'property', info: 'Specifies the size of the font' },
      { label: 'font-weight', type: 'property', info: 'Specifies the weight of the font' },
      { label: 'line-height', type: 'property', info: 'Specifies the height of a line' },
      { label: 'text-align', type: 'property', info: 'Specifies the horizontal alignment of text' },
      { label: 'text-decoration', type: 'property', info: 'Specifies the decoration added to text' },

      // Background
      { label: 'background', type: 'property', info: 'Shorthand for background properties' },
      { label: 'background-color', type: 'property', info: 'Sets the background color of an element' },
      { label: 'background-image', type: 'property', info: 'Sets one or more background images on an element' },
      { label: 'background-position', type: 'property', info: 'Specifies the position of a background image' },
      { label: 'background-size', type: 'property', info: 'Specifies the size of the background images' },
      { label: 'background-repeat', type: 'property', info: 'Sets if/how a background image will be repeated' },

      // Border
      { label: 'border', type: 'property', info: 'Shorthand for border-width, border-style, and border-color' },
      { label: 'border-radius', type: 'property', info: 'Defines the radius of the element\'s corners' },
      { label: 'box-shadow', type: 'property', info: 'Attaches one or more shadows to an element' },

      // Effects
      { label: 'opacity', type: 'property', info: 'Sets the opacity level for an element' },
      { label: 'transform', type: 'property', info: 'Applies a 2D or 3D transformation to an element' },
      { label: 'transition', type: 'property', info: 'Shorthand for transition properties' },
      { label: 'animation', type: 'property', info: 'Shorthand for animation properties' }
    ]
  };
};

const CodeEditor = ({
  value,
  onChange,
  language = 'html',
  placeholder = '',
  className = '',
  height = '100%',
  readOnly = false,
  onCursorTagIndexChange
}) => {
  // Configure extensions based on language
  const extensions = useMemo(() => {
    const baseExtensions = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      autocompletion({
        activateOnTyping: true,
        override: [language === 'html' ? htmlCompletions : language === 'css' ? cssCompletions : null].filter(Boolean)
      }),
      EditorView.lineWrapping,
      darkTheme
    ];

    if (language === 'html') {
      // return [...baseExtensions, html({ autoCloseTags: true, matchClosingTags: true })];
    } else if (language === 'css') {
      return [...baseExtensions, css()];
    } else if (language === 'javascript' || language === 'js') {
      return [...baseExtensions, javascript({ jsx: true, typescript: false })];
    }
    return baseExtensions;
  }, [language]);

  const handleEditorUpdate = useCallback((update) => {
    if (update.selectionSet) {
      const state = update.state;
      const pos = state.selection.main.head;
      const doc = state.doc.toString();
      const line = state.doc.lineAt(pos);
      const lineNumber = line.number;
      const column = pos - line.from + 1;

      // console.log(`Cursor at line ${lineNumber}, column ${column}`);
      // console.log('Context:', doc.slice(Math.max(0, pos - 50), Math.min(doc.length, pos + 50)));

      if (language === 'html' && onCursorTagIndexChange) {
        const textUntilPos = doc.slice(0, pos);
        const tags = textUntilPos.match(/<([a-zA-Z][\w-]*)(\s|>)/g) || [];
        const tagIndex = Math.max(tags.length - 1, 0);
        // console.log('Current tag index:', tagIndex, 'Tag:', tags[tagIndex - 1] || 'none');
        onCursorTagIndexChange(tagIndex);
      }
    }
  }, [language, onCursorTagIndexChange]);

  return (
    <div className={`code-editor ${className}`} style={{ height }}>
      <CodeMirror
        value={value}
        height="100%"
        extensions={extensions}
        onChange={onChange}
        onUpdate={handleEditorUpdate}
        placeholder={placeholder}
        readOnly={readOnly}
        indentWithTab={true}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          indentOnInput: true,
          tabSize: 2,
        }}
        theme="dark"
      />
    </div>
  );
};

export default CodeEditor;