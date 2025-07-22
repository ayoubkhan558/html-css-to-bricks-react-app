import { getElementLabel } from './labelUtils';

/**
 * Processes button elements for Bricks conversion
 * @param {Node} node - The DOM node to process
 * @param {Object} element - The element object to populate
 * @param {string} tag - The HTML tag name
 * @param {Object} context - Optional context values (showNodeClass, etc.)
 * @returns {Object} The processed element
 */
export const processButtonElement = (node, element, tag = 'button', context = {}) => {
  element.name = 'button';
  element.label = getElementLabel(node, 'Button', context);
  
  // Set default button styles with text content
  element.settings = {
    style: "primary",
    tag: "button",
    size: "md",
    text: node.textContent.trim() || 'Button'
  };
  
  // Handle button attributes
  if (node.hasAttribute('disabled')) {
    element.settings.disabled = true;
  }
  
  // Prevent processing of child text nodes
  element._skipTextNodes = true;
  
  return element;
};
