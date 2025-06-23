import { getUniqueId } from '../utils';

const processTextNode = (node, parentId, allElements) => {
  if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
    const textElement = {
      id: getUniqueId(),
      name: 'text-basic',
      parent: parentId,
      children: [],
      settings: {
        text: node.textContent.trim(),
        tag: 'p'
      }
    };
    allElements.push(textElement);
    return textElement;
  }
  return null;
};

const processTextElement = (node, elementId, allElements) => {
  const tag = node.tagName.toLowerCase();
  const element = {
    id: elementId,
    name: 'text-basic',
    parent: '0',
    children: [],
    settings: {
      tag: ['p', 'span', 'address'].includes(tag) ? tag : 'custom',
      ...(['time', 'mark', 'blockquote', 'pre', 'code'].includes(tag) && { customTag: tag })
    }
  };

  if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'address', 'span', 'a'].includes(tag)) {
    element.settings.text = node.textContent.trim();
  }

  allElements.push(element);
  return element;
};

export { processTextNode, processTextElement };
