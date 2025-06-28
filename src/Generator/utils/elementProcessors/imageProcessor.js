/**
 * Processes image elements for Bricks conversion
 */
export const processImageElement = (node, element) => {
  element.name = 'image';
  element.label = 'Image';
  
  element.settings.src = node.getAttribute('src') || '';
  element.settings.alt = node.getAttribute('alt') || '';
  
  element.settings.image = {
    url: node.getAttribute('src') || '',
    external: true,
    filename: (node.getAttribute('src') || 'image.jpg').split('/').pop()
  };
  
  return element;
};
