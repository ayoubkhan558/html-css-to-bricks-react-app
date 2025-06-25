import { getUniqueId } from '../../utils';

/**
 * Process text nodes (raw text content)
 * @param {Node} node - The text node to process
 * @param {string} parentId - The ID of the parent element
 * @param {Array} allElements - Array to store all elements
 * @returns {Object|null} The processed text element or null if empty
 */
const processTextNode = (node, parentId, allElements) => {
  if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
    const textElement = {
      id: getUniqueId(),
      name: 'text-basic',
      parent: parentId,
      children: [],
      settings: {
        text: node.textContent.trim(),
        tag: 'p'
      }
    };
    allElements.push(textElement);
    return textElement;
  }
  return null;
};

export default processTextNode;
