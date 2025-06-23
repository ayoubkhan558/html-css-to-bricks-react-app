import { getUniqueId } from '../utils';

export const processListElement = (node, cssRulesMap, parentId, globalClasses, allElements) => {
  const tag = node.tagName.toLowerCase();
  const elementId = getUniqueId();
  
  const element = {
    id: elementId,
    name: 'div',
    parent: parentId,
    children: [],
    settings: { tag }
  };

  const listItems = Array.from(node.children).filter(child => child.tagName.toLowerCase() === 'li');
  const hasComplexContent = listItems.some(li =>
    Array.from(li.childNodes).some(n =>
      n.nodeType === Node.ELEMENT_NODE && n.tagName.toLowerCase() !== 'br'
    )
  );

  if (!hasComplexContent) {
    // Text-only list: convert to rich text
    element.name = 'text';
    element.settings.text = node.innerHTML.trim();
    return element;
  }

  // Complex list: convert to div with nested divs for li
  listItems.forEach((li, index) => {
    const liId = getUniqueId();
    const liElement = {
      id: liId,
      name: 'div',
      parent: elementId,
      children: [],
      settings: { tag: 'li' }
    };

    // Process li children
    Array.from(li.childNodes).forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const childElement = domNodeToBricks(child, cssRulesMap, liId, globalClasses, allElements);
        if (childElement) {
          liElement.children.push(childElement.id);
        }
      } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
        const textElement = {
          id: getUniqueId(),
          name: 'text-basic',
          parent: liId,
          children: [],
          settings: {
            text: child.textContent.trim(),
            tag: 'span'
          }
        };
        allElements.push(textElement);
        liElement.children.push(textElement.id);
      }
    });

    allElements.push(liElement);
    element.children.push(liId);
  });

  return element;
};

export const processListItemElement = (node, cssRulesMap, parentId, globalClasses, allElements) => {
  const elementId = getUniqueId();
  const element = {
    id: elementId,
    name: 'div',
    parent: parentId,
    children: [],
    settings: { tag: 'li' }
  };

  // Process children
  Array.from(node.childNodes).forEach(child => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const childElement = domNodeToBricks(child, cssRulesMap, elementId, globalClasses, allElements);
      if (childElement) {
        element.children.push(childElement.id);
      }
    } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
      const textElement = {
        id: getUniqueId(),
        name: 'text-basic',
        parent: elementId,
        children: [],
        settings: {
          text: child.textContent.trim(),
          tag: 'span'
        }
      };
      allElements.push(textElement);
      element.children.push(textElement.id);
    }
  });

  return element;
};
