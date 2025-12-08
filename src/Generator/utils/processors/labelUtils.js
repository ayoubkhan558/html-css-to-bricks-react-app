/**
 * Gets the appropriate label for an element based on context and classes
 * @param {Node} node - The DOM node
 * @param {string} defaultLabel - The default label to use if no class is found
 * @param {Object} context - The context object containing showNodeClass
 * @returns {string} The label to use
 */
export const getElementLabel = (node, defaultLabel, context = {}) => {
  const firstClass = node.classList?.length > 0 ? node.classList[0] : null;
  return context.showNodeClass && firstClass ? firstClass : defaultLabel;
};
