/**
 * Processes table elements for Bricks conversion
 */
export const processTableElement = (node, element, tag) => {
  element.name = 'div';
  element.settings.tag = 'custom';
  element.settings.customTag = tag;

  // Set labels and styles based on table component type
  switch(tag) {
    case 'table':
      element.label = 'Table';
      break;
    case 'tr':
      element.label = 'Table Row';
      element.settings.style = 'display: flex; width: 100%;';
      break;
    case 'thead':
      element.label = 'Table Header';
      element.settings.style = 'flex: 1; padding: 8px;';
      break;
    case 'tbody':
      element.label = 'Table Body';
      element.settings.style = 'flex: 1; padding: 8px;';
      break;
    case 'tfoot':
      element.label = 'Table Footer';
      element.settings.style = 'flex: 1; padding: 8px;';
      break;
    case 'th':
      element.label = 'Table Head';
      element.settings.style = 'flex: 1; padding: 8px;';
      break;
    case 'td':
      element.label = 'Cell';
      element.settings.style = 'flex: 1; padding: 8px;';
      break;
    default:
      element.label = tag.charAt(0).toUpperCase() + tag.slice(1);
  }

  return element;
};
