/**
 * Processes text-related elements (p, span, address, time, mark, blockquote)
 */
export const processTextElement = (node, element, tag, allElements) => {
  const textContent = node.textContent.trim();

  // Handle blockquote
  if (tag === 'blockquote') {
    element.name = 'text-basic';
    element.label = 'Block Quote';
    element.settings.tag = 'custom';
    element.settings.customTag = 'blockquote';
    if (textContent) {
      element.settings.text = textContent;
    }
    return element;
  }

  // Handle formatted paragraphs
  if (tag === 'p') {
    const formattingTags = ['strong', 'b', 'em', 'i', 'code', 'mark', 'cite', 'u', 's', 'del', 'ins', 'sup', 'sub', 'small', 'abbr', 'q'];
    const hasFormatting = Array.from(node.querySelectorAll('*')).some(child =>
      formattingTags.includes(child.tagName.toLowerCase())
    );

    if (hasFormatting) {
      element.name = 'text';
      element.label = 'Rich Text';
      element.settings.text = node.innerHTML;
      element.settings.tag = tag;
      allElements.push(element);
      return element;
    }

    // Handle single child merging
    const childElements = Array.from(node.children);
    if (childElements.length === 1 && ['address', 'span', 'em', 'strong', 'code'].includes(childElements[0].tagName.toLowerCase())) {
      const childTag = childElements[0].tagName.toLowerCase();
      element.settings.text = childElements[0].textContent.trim();
      element.settings.tag = childTag;
      element.name = 'text-basic';
      element.label = 'Paragraph';
      return element;
    }
  }

  // Set common text properties
  if (textContent) {
    element.settings.text = textContent;
    element.name = tag === 'p' ? 'text-basic' : 'text-basic';
    element.label = tag === 'p' ? 'Paragraph' :
      tag === 'span' ? 'Inline Text' :
        tag === 'address' ? 'P Class' :
          tag === 'time' ? 'Time' : 'Mark';

    // Handle special cases
    if (['time', 'mark', 'blockquote'].includes(tag)) {
      element.settings.tag = 'custom';
      element.settings.customTag = tag;
    } else if (tag === 'span' || tag === 'address') {
      element.settings.tag = tag;
    } else if (tag === 'p') {
      element.settings.tag = tag;
    }
  }

  return element;
};
