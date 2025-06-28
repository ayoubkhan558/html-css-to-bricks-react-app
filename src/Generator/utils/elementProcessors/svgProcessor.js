/**
 * Processes SVG elements for Bricks conversion
 */
export const processSvgElement = (node, element) => {
  element.name = 'svg';
  element.label = 'SVG';
  element.settings.source = 'code';
  element.settings.code = node.outerHTML;
  
  return element;
};
