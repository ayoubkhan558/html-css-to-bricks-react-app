import { getElementLabel } from '@generator/elementUtils';

/**
 * Processes link elements (a) for Bricks conversion
 * @param {Node} node - The DOM node to process
 * @param {Object} element - The element object to populate
 * @param {string} tag - The HTML tag name
 * @param {Object} context - Optional context values (showNodeClass, etc.)
 * @returns {Object} The processed element
 */
export const processLinkElement = (node, element, tag = 'a', context = {}) => {
  element.name = 'text-link';
  element.label = getElementLabel(node, 'Link', context);

  // Handle href attribute and link settings
  if (node.hasAttribute('href')) {
    element.settings.link = {
      type: 'external',
      url: node.getAttribute('href') || '',
      noFollow: node.getAttribute('rel')?.includes('nofollow') || false,
      openInNewWindow: node.getAttribute('target') === '_blank',
      noReferrer: node.getAttribute('rel')?.includes('noreferrer') || false
    };
  }

  // Handle text content directly
  const textContent = node.textContent.trim();
  if (textContent) {
    element.settings.text = textContent;
    element.settings.tag = 'a';
  } else {
    element.settings.text = 'Link';
    element.settings.tag = 'a';
  }

  // Prevent processing of child text nodes
  element._skipTextNodes = true;

  return element;
};
