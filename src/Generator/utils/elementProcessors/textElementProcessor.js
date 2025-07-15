/**
 * Processes text-related elements (p, span, address, time, mark, blockquote)
 */
export const processTextElement = (node, element, tag, allElements) => {
  const textContent = node.textContent.trim();
  
  // Handle inline elements within paragraphs
  const isInlineInParagraph = ['strong', 'em', 'small'].includes(tag) && 
    node.parentElement?.tagName?.toLowerCase() === 'p';
  
  if (isInlineInParagraph) {
    // For inline elements inside paragraphs, use custom tags
    element.settings.text = textContent;
    element.name = 'text-basic';
    element.label = tag === 'strong' ? 'Bold Text' : 
                   tag === 'em' ? 'Italic Text' : 'Small Text';
    
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
    element.label = tag === 'p' ? 'Paragraph' : 'Block Quote';
    
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
  element.label = 'Text';
  element.settings.tag = 'span';
  element._skipTextNodes = true;
  
  return element;
};
