/**
 * Processes blockquote elements for Bricks conversion
 */
export const processBlockquoteElement = (node, element) => {
  const textContent = node.textContent.trim();
  element.name = 'text-basic';
  element.label = 'Block Quote';
  element.settings.tag = 'custom';
  element.settings.customTag = 'blockquote';
  if (textContent) {
    element.settings.text = textContent;
  }
  return element;
};
