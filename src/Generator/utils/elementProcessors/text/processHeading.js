/**
 * Process heading elements (h1-h6)
 * @param {Element} node - The heading element to process
 * @param {string} elementId - The ID for the new element
 * @returns {Object} The processed heading element
 */
const processHeading = (node, elementId) => {
  const level = node.tagName.toLowerCase().substring(1);
  return {
    id: elementId,
    name: 'heading',
    parent: '0',
    children: [],
    settings: {
      text: node.textContent.trim(),
      tag: `h${level}`
    },
    label: `Heading ${level}`
  };
};

export default processHeading;
