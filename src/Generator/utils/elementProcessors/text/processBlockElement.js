/**
 * Process block elements (blockquote, figure, etc.)
 * @param {Element} node - The block element to process
 * @param {string} elementId - The ID for the new element
 * @returns {Object} The processed block element
 */
const processBlockElement = (node, elementId) => {
  const tag = node.tagName.toLowerCase();
  return {
    id: elementId,
    name: tag === 'blockquote' ? 'quote' : 'div',
    parent: '0',
    children: [],
    settings: {
      text: node.textContent.trim(),
      ...(tag === 'blockquote' && { tag: 'blockquote' })
    }
  };
};

export default processBlockElement;
