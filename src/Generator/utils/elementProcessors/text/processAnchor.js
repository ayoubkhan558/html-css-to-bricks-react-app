/**
 * Process anchor (link) elements
 * @param {Element} node - The anchor element to process
 * @param {string} elementId - The ID for the new element
 * @returns {Object} The processed anchor element
 */
const processAnchor = (node, elementId) => ({
  id: elementId,
  name: 'text-basic',
  parent: '0',
  children: [],
  settings: {
    text: node.textContent.trim(),
    tag: 'a',
    link: {
      type: 'external',
      url: node.getAttribute('href') || '#',
      noFollow: node.getAttribute('rel')?.includes('nofollow') || false,
      openInNewWindow: node.getAttribute('target') === '_blank',
      noReferrer: node.getAttribute('rel')?.includes('noreferrer') || false
    }
  }
});

export default processAnchor;
