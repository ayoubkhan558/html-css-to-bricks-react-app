import { getElementLabel } from './labelUtils';

/**
 * Processes SVG elements for Bricks conversion
 * @param {Node} node - The DOM node to process
 * @param {Object} element - The element object to populate
 * @param {string} tag - The HTML tag name
 * @param {Object} context - Optional context values (showNodeClass, etc.)
 * @returns {Object} The processed element
 */
export const processSvgElement = (node, element, tag = 'svg', context = {}) => {
  element.name = 'svg';
  element.label = getElementLabel(node, 'SVG', context);
  element.settings.source = 'code';
  element.settings.code = node.outerHTML;
  
  return element;
};
