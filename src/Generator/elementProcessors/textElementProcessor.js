import { getElementLabel } from '@lib/bricks';

/**
 * Helper to check if element contains formatting tags
 * @param {Node} node - The DOM node to check
 * @returns {boolean} True if node contains formatting tags
 */
const hasFormattingTags = (node) => {
  // Inline formatting tags that should trigger rich text mode
  const formattingTags = ['strong', 'em', 'b', 'i', 'u', 's', 'mark', 'small', 'sub', 'sup', 'del', 'ins', 'code', 'kbd', 'var', 'samp', 'abbr', 'cite', 'q', 'dfn', 'span', 'a'];

  // Check if any child elements are formatting tags
  const children = Array.from(node.children || []);
  return children.some(child => formattingTags.includes(child.tagName.toLowerCase()));
};

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
  const hasFormatting = hasFormattingTags(node);

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
    // Check if element has formatting tags - if so, use rich text
    if (hasFormatting) {
      element.settings.text = node.innerHTML; // Use innerHTML to preserve formatting
      element.name = 'text'; // Use rich text element
      element.label = getElementLabel(node, tag === 'p' ? 'Paragraph' : 'Block Quote', context);
    } else {
      element.settings.text = textContent;
      element.name = 'text-basic';
      element.label = getElementLabel(node, tag === 'p' ? 'Paragraph' : 'Block Quote', context);
    }

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
  // Check for formatting in inline elements as well
  if (hasFormatting) {
    element.settings.text = node.innerHTML;
    element.name = 'text';
    element.label = getElementLabel(node, 'Rich Text', context);
  } else {
    element.settings.text = textContent;
    element.name = 'text-basic';
    element.label = getElementLabel(node, 'Text', context);
  }

  element.settings.tag = 'span';
  element._skipTextNodes = true;

  return element;
};
