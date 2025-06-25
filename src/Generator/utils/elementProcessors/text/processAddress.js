/**
 * Process address elements
 * @param {Element} node - The address element to process
 * @param {string} elementId - The ID for the new element
 * @returns {Object} The processed address element
 */
const processAddress = (node, elementId) => ({
  id: elementId,
  name: 'text-basic',
  parent: '0',
  children: [],
  settings: {
    text: node.textContent.trim(),
    tag: 'address'
  },
  label: 'Address'
});

export default processAddress;
