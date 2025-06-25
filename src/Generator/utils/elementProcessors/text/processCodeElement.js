/**
 * Process code and pre elements
 * @param {Element} node - The code/pre element to process
 * @param {string} elementId - The ID for the new element
 * @returns {Object} The processed code element
 */
const processCodeElement = (node, elementId) => {
  const isBlock = node.tagName.toLowerCase() === 'pre' || node.parentElement?.tagName.toLowerCase() === 'pre';
  return {
    id: elementId,
    name: 'code',
    parent: '0',
    children: [],
    settings: {
      code: node.textContent,
      inline: !isBlock,
      language: 'html' // Default language, could be made configurable
    }
  };
};

export default processCodeElement;
