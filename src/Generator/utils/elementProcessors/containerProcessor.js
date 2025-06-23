import { getUniqueId } from '../utils';

const processContainer = (node, elementId, tag) => {
  const containerTypes = {
    'section': { name: 'section', label: 'Section' },
    'nav': { name: 'nav', label: 'Navigation' },
    'div': { name: 'div', label: 'Container' },
    'header': { name: 'header', label: 'Header' },
    'footer': { name: 'footer', label: 'Footer' },
    'article': { name: 'article', label: 'Article' },
    'aside': { name: 'aside', label: 'Aside' },
    'main': { name: 'main', label: 'Main' }
  };

  const containerType = containerTypes[tag] || containerTypes['div'];
  
  return {
    id: elementId,
    name: containerType.name,
    parent: '0',
    children: [],
    settings: {},
    label: containerType.label
  };
};

export { processContainer };
