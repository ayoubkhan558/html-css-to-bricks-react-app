import processAnchor from './processAnchor';

/**
 * Process inline text elements (span, strong, em, etc.)
 * Note: Anchor elements are now handled by processAnchor
 * @param {Element} node - The inline element to process
 * @param {string} elementId - The ID for the new element
 * @returns {Object} The processed inline element
 */
const processInlineElement = (node, elementId) => {
  const tag = node.tagName.toLowerCase();
  
  // Special case: anchor tags are now handled by processAnchor
  if (tag === 'a') {
    return processAnchor(node, elementId);
  }

  return {
    id: elementId,
    name: 'text-basic',
    parent: '0',
    children: [],
    settings: {
      text: node.textContent.trim(),
      tag: 'span'
    }
  };
};

export default processInlineElement;
