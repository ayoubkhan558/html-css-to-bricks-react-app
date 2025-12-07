import { getElementLabel } from './labelUtils';

/**
 * Processes miscellaneous elements like canvas, details, summary, dialog, meter, progress
 * @param {Node} node - The DOM node to process
 * @param {Object} element - The element object to populate
 * @param {string} tag - The HTML tag name
 * @param {Object} context - Optional context values (showNodeClass, etc.)
 * @returns {Object} The processed element
 */
export const processMiscElement = (node, element, tag, context = {}) => {
  // Default mapping: treat as generic div preserving tag
  element.name = 'div';
  element.settings.tag = 'custom';
  element.settings.customTag = tag;

  const defaultLabels = {
    'canvas': 'Canvas',
    'details': 'Details',
    'summary': 'Summary',
    'dialog': 'Dialog',
    'meter': 'Meter',
    'progress': 'Progress'
  };
  
  const defaultLabel = defaultLabels[tag] || tag.charAt(0).toUpperCase() + tag.slice(1);
  element.label = getElementLabel(node, defaultLabel, context);

  // Convert script tags to code elements with JavaScript content
  if (tag === 'script' && node.textContent.trim()) {
    element.name = 'code';
    element.settings = {
      javascriptCode: node.textContent.trim(),
      executeCode: true,
      noRoot: true
    };
    // Prevent processing of the script tag's text node as a separate text element
    element._skipTextNodes = true;
  }

  return element;
};
