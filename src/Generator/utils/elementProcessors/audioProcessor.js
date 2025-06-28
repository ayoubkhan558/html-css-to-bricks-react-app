/**
 * Processes audio elements for Bricks conversion
 */
export const processAudioElement = (node, element) => {
  element.name = 'audio';
  element.label = 'Audio';
  element.settings.source = 'external';
  element.settings.external = node.querySelector('source')?.getAttribute('src') || node.getAttribute('src') || '';
  element.settings.loop = node.hasAttribute('loop');
  element.settings.autoplay = node.hasAttribute('autoplay');
  
  return element;
};
