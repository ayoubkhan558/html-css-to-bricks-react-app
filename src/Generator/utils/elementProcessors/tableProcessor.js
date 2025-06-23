import { getUniqueId } from '../utils';

export const processTableElement = (node, cssRulesMap, parentId, globalClasses, allElements) => {
  const tag = node.tagName.toLowerCase();
  const elementId = getUniqueId();
  
  const element = {
    id: elementId,
    name: 'div',
    parent: parentId,
    children: [],
    settings: {
      tag: 'custom',
      customTag: tag
    }
  };

  if (tag === 'tr') {
    element.settings.style = 'display: flex; width: 100%;';
  } else if (['tbody', 'thead', 'tfoot'].includes(tag)) {
    element.settings.style = 'flex: 1; padding: 8px;';
  } else if (tag === 'th') {
    element.settings.style = 'flex: 1; padding: 8px;';
  } else if (tag === 'td') {
    element.settings.style = 'flex: 1; padding: 8px;';
  }

  // Process children
  Array.from(node.childNodes).forEach(childNode => {
    if (childNode.nodeType === Node.TEXT_NODE && !childNode.textContent.trim()) {
      return;
    }
    
    const childElement = domNodeToBricks(childNode, cssRulesMap, elementId, globalClasses, allElements);
    if (childElement) {
      if (Array.isArray(childElement)) {
        childElement.forEach(c => element.children.push(c.id));
      } else {
        element.children.push(childElement.id);
      }
    }
  });

  return element;
};
