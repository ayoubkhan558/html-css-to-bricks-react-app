/**
 * Process code and pre elements
 * @param {Element} node - The code/pre element to process
 * @param {string} elementId - The ID for the new element
 * @returns {Object} The processed code element
 */
const processCodeElement = (node, elementId) => {
  const tag = node.tagName.toLowerCase();
  const isPre = tag === 'pre';
  const isInlineCode = tag === 'code' && !isPre && !(node.parentElement?.tagName.toLowerCase() === 'pre');
  
  // For pre elements, we want to preserve whitespace and line breaks
  const content = isPre ? node.innerHTML.trim() : node.textContent.trim();
  
  return {
    id: elementId,
    name: isPre ? 'pre' : 'code',
    parent: '0',
    children: [],
    settings: {
      content: content,
      tag: isPre ? 'pre' : 'code',
      ...(isPre ? {
        whiteSpace: 'pre',
        overflow: 'auto'
      } : {
        display: isInlineCode ? 'inline' : 'block',
        fontFamily: 'monospace',
        backgroundColor: '#f5f5f5',
        padding: isInlineCode ? '0.2em 0.4em' : '1em',
        borderRadius: '3px'
      })
    },
    label: isPre ? 'Preformatted Text' : 'Code Snippet'
  };
};

export default processCodeElement;
