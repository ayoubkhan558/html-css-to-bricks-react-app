/**
 * Process paragraph elements
 * @param {Element} node - The paragraph element to process
 * @param {string} elementId - The ID for the new element
 * @returns {Object} The processed paragraph element
 */
const processParagraph = (node, elementId) => ({
  id: elementId,
  name: 'text-basic',
  parent: '0',
  children: [],
  settings: {
    text: node.textContent.trim(),
    tag: 'p'
  }
});

export default processParagraph;
