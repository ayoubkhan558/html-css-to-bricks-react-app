/**
 * Processes heading elements (h1-h6) for Bricks conversion
 */
export const processHeadingElement = (node, element, tag) => {
  element.name = 'heading';
  element.label = `Heading ${tag.replace('h', '')}`;
  element.settings.tag = 'custom';
  element.settings.customTag = tag;
  
  return element;
};
