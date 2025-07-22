import { getElementLabel } from './labelUtils';

/**
 * Processes heading elements (h1-h6) for Bricks conversion
 * @param {Node} node - The DOM node to process
 * @param {Object} element - The element object to populate
 * @param {string} tag - The HTML tag name (h1-h6)
 * @param {Object} context - Optional context values (showNodeClass, activeTagIndex, etc.)
 * @returns {Object|null} The processed element or null if invalid
 */
export const processHeadingElement = (node, element, tag, context = {}) => {
  if (node.nodeType === Node.TEXT_NODE) {
    return null;
  }

  element.name = 'heading';
  element.label = getElementLabel(node, `${tag.toUpperCase()} Heading`, context);
  element.settings.tag = tag;
  element.settings.text = node.textContent.trim();

  return element;
};
