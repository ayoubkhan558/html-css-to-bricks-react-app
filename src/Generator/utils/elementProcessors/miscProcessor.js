/**
 * Processes miscellaneous elements like canvas, details, summary, dialog, meter, progress
 */
export const processMiscElement = (node, element, tag) => {
  // Default mapping: treat as generic div preserving tag
  element.name = 'div';
  element.settings.tag = 'custom';
  element.settings.customTag = tag;

  switch(tag) {
    case 'canvas':
      element.label = 'Canvas';
      break;
    case 'details':
      element.label = 'Details';
      break;
    case 'summary':
      element.label = 'Summary';
      break;
    case 'dialog':
      element.label = 'Dialog';
      break;
    case 'meter':
      element.label = 'Meter';
      break;
    case 'progress':
      element.label = 'Progress';
      break;
    default:
      element.label = tag.charAt(0).toUpperCase() + tag.slice(1);
  }

  return element;
};
