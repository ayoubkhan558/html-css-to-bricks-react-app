import { getElementLabel } from './labelUtils';

/**
 * Processes text-related elements (p, span, address, time, mark, blockquote)
 * @param {Node} node - The DOM node to process
 * @param {Object} element - The element object to populate
 * @param {string} tag - The HTML tag name
 * @param {Array} allElements - Array of all elements being processed
 * @param {Object} context - Optional context values (showNodeClass, etc.)
 * @returns {Object|null} The processed element or null if invalid
 */
export const processTextElement = (node, element, tag, allElements, context = {}) => {
  const textContent = node.textContent.trim();
  
  // Handle inline elements within paragraphs
  const isInlineInParagraph = ['strong', 'em', 'small'].includes(tag) && 
    node.parentElement?.tagName?.toLowerCase() === 'p';
  
  if (isInlineInParagraph) {
    // For inline elements inside paragraphs, use custom tags
    element.settings.text = textContent;
    element.name = 'text-basic';
    element.label = getElementLabel(node, tag === 'strong' ? 'Bold Text' : 
                   tag === 'em' ? 'Italic Text' : 'Small Text', context);
    
    // Use custom tag for semantic meaning
    element.settings.tag = 'custom';
    element.settings.customTag = tag;
    
    element._skipTextNodes = true;
    return element;
  }
  
  // Handle standalone block elements
  if (['p', 'blockquote'].includes(tag)) {
    element.settings.text = textContent;
    element.name = 'text-basic';
    element.label = getElementLabel(node, tag === 'p' ? 'Paragraph' : 'Block Quote', context);
    
    if (tag === 'blockquote') {
      element.settings.tag = 'custom';
      element.settings.customTag = 'blockquote';
    } else {
      element.settings.tag = tag;
    }
    
    element._skipTextNodes = true;
    return element;
  }
  
  // Default case for other elements
  element.settings.text = textContent;
  element.name = 'text-basic';
  element.label = getElementLabel(node, 'Text', context);
  element.settings.tag = 'span';
  element._skipTextNodes = true;
  
  return element;
};
