import { getUniqueId } from '../utils';

const processTableElement = (node, elementId) => {
  const tag = node.tagName.toLowerCase();
  const element = {
    id: elementId,
    name: 'div',
    parent: '0',
    children: [],
    settings: {
      tag: 'custom',
      customTag: tag
    },
    label: 'Table'
  };

  switch (tag) {
    case 'tr':
      element.label = 'Table Row';
      element.settings.style = 'display: flex; width: 100%;';
      break;
    case 'tbody':
      element.label = 'Table Body';
      element.settings.style = 'flex: 1; padding: 8px;';
      break;
    case 'thead':
      element.label = 'Table Header';
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
  }

  return element;
};

export { processTableElement };
