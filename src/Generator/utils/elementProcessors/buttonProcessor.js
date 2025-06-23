import { getUniqueId } from '../utils';

const processButton = (node, elementId) => {
  return {
    id: elementId,
    name: 'button',
    parent: '0',
    children: [],
    settings: {
      style: 'primary',
      tag: 'button',
      size: 'md',
      text: node.textContent.trim()
    },
    label: 'Button'
  };
};

export { processButton };
