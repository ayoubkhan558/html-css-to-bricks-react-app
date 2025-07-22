import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

// Base theme
const baseTheme = EditorView.theme({
  '&': {
    color: '#e0e0e0',
    backgroundColor: '#1e1e1e',
    height: '100%',
  },
  '.cm-content': {
    caretColor: '#e0e0e0',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: '#e0e0e0',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#264f78',
  },
  '.cm-panels': {
    backgroundColor: '#1e1e1e',
    color: '#e0e0e0',
  },
  '.cm-panels.cm-panels-top': {
    borderBottom: '1px solid #333',
  },
  '.cm-searchMatch': {
    backgroundColor: '#4a4a4a',
  },
  '.cm-searchMatch.selected': {
    backgroundColor: '#264f78',
  },
  '.cm-activeLine': {
    backgroundColor: '#2a2a2a',
  },
  '.cm-selectionMatch': {
    backgroundColor: '#264f78',
  },
  '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
    backgroundColor: '#515a6b',
    outline: '1px solid #888',
  },
  '.cm-gutters': {
    backgroundColor: '#1e1e1e',
    color: '#858585',
    borderRight: '1px solid #333',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#2a2a2a',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    padding: '0 8px 0 16px',
  },
  '.cm-foldGutter': {
    width: '14px',
  },
  '.cm-foldPlaceholder': {
    backgroundColor: 'transparent',
    border: '1px solid #666',
    color: '#888',
  },
});

// Syntax highlighting
const highlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#569cd6' },
  { tag: tags.operator, color: '#d4d4d4' },
  { tag: tags.variableName, color: '#9cdcfe' },
  { tag: tags.string, color: '#ce9178' },
  { tag: tags.number, color: '#b5cea8' },
  { tag: tags.bool, color: '#569cd6' },
  { tag: tags.null, color: '#569cd6' },
  { tag: tags.propertyName, color: '#9cdcfe' },
  { tag: tags.comment, color: '#6a9955', fontStyle: 'italic' },
  { tag: tags.bracket, color: '#ffd700' },
  { tag: tags.tagName, color: '#569cd6' },
  { tag: tags.attributeName, color: '#9cdcfe' },
  { tag: tags.attributeValue, color: '#ce9178' },
  { tag: tags.heading, color: '#569cd6', fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strong, fontWeight: 'bold' },
]);

// Combine everything
export const darkTheme = [
  baseTheme,
  syntaxHighlighting(highlightStyle),
  EditorState.tabSize.of(2),
  EditorView.lineWrapping,
];

export default darkTheme;
