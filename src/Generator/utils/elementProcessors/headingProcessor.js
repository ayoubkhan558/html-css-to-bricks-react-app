/**
 * Processes heading elements (h1-h6) for Bricks conversion
 */
export const processHeadingElement = (node, element, tag) => {
  const hasFormatting = Array.from(node.querySelectorAll('*')).length > 0;
  element.name = 'heading';
  
  // Use heading level (h1, h2 etc.) or first class name as label
  const firstClass = node.classList?.length > 0 ? node.classList[0] : null;
  element.label = firstClass || `${tag.toUpperCase()} Heading`;

  // Use the native heading tag (h1-h6)
  element.settings.tag = tag;

  // Store the heading text so it renders properly in Bricks
  element.settings.text = node.innerHTML.trim();

  return element;
};
