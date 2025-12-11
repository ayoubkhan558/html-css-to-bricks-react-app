import { getElementLabel } from '@lib/bricks';

/**
 * Processes image elements for Bricks conversion
 * @param {Node} node - The DOM node to process
 * @param {Object} element - The element object to populate
 * @param {string} tag - The HTML tag name
 * @param {Object} context - Optional context values (showNodeClass, etc.)
 * @returns {Object} The processed element
 */
export const processImageElement = (node, element, tag = 'img', context = {}) => {
  element.name = 'image';
  element.label = getElementLabel(node, 'Image', context);

  element.settings.src = node.getAttribute('src') || '';
  element.settings.alt = node.getAttribute('alt') || '';

  element.settings.image = {
    url: node.getAttribute('src') || '',
    external: true,
    filename: (node.getAttribute('src') || 'image.jpg').split('/').pop()
  };

  return element;
};
