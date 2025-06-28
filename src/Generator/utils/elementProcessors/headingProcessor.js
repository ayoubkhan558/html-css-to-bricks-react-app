/**
 * Processes heading elements (h1-h6) for Bricks conversion
 */
export const processHeadingElement = (node, element, tag) => {
  element.name = 'heading';
  element.label = node.textContent.trim() || `Heading ${tag.replace('h', '')}`;

  // Use the native heading tag (h1-h6)
  element.settings.tag = tag;

  // Store the heading text so it renders properly in Bricks
  element.settings.text = node.textContent.trim();

  return element;
};
