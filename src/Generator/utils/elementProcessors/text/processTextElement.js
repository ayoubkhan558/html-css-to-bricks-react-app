import processHeading from './processHeading';
import processAddress from './processAddress';
import processInlineElement from './processInlineElement';
import processCodeElement from './processCodeElement';
import processBlockElement from './processBlockElement';
import { processButton } from '../buttonProcessor';
import processParagraph from './processParagraph';

/**
 * Main text element processor that routes to specific processors based on element type
 * @param {Element} node - The element to process
 * @param {string} elementId - The ID for the new element
 * @param {Array} allElements - Array to store all elements (unused in this function but kept for consistency)
 * @returns {Object} The processed element
 */
const processTextElement = (node, elementId, allElements = []) => {
  const tag = node.tagName.toLowerCase();
  
  // Route to appropriate processor based on element type
  if (/^h[1-6]$/.test(tag)) {
    return processHeading(node, elementId);
  }
  
  if (tag === 'address') {
    return processAddress(node, elementId);
  }
  
  if (['a', 'span', 'strong', 'em', 'mark', 'time'].includes(tag)) {
    return processInlineElement(node, elementId);
  }
  
  if (['pre', 'code'].includes(tag)) {
    return processCodeElement(node, elementId);
  }
  
  if (['blockquote', 'figure', 'figcaption'].includes(tag)) {
    return processBlockElement(node, elementId);
  }
  
  // Handle button and paragraph elements
  if (tag === 'button') {
    return processButton(node, elementId);
  }
  
  if (tag === 'p') {
    return processParagraph(node, elementId);
  }
  
  // Default case for other text elements
  return {
    id: elementId,
    name: 'text-basic',
    parent: '0',
    children: [],
    settings: {
      text: node.textContent.trim(),
      tag: 'div'
    }
  };
};

export default processTextElement;
