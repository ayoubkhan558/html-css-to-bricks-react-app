import { getUniqueId } from '../utils';

const processList = (node, elementId, allElements) => {
  const tag = node.tagName.toLowerCase();
  const listItems = Array.from(node.children).filter(child => child.tagName.toLowerCase() === 'li');
  const hasComplexContent = listItems.some(li =>
    Array.from(li.childNodes).some(n =>
      n.nodeType === Node.ELEMENT_NODE && n.tagName.toLowerCase() !== 'br'
    )
  );

  if (!hasComplexContent) {
    // Text-only list: convert to rich text
    return {
      id: elementId,
      name: 'text',
      parent: '0',
      children: [],
      settings: {
        tag,
        text: node.innerHTML.trim()
      },
      label: tag === 'ul' ? 'Unordered List' : 'Ordered List'
    };
  }

  // Complex list: convert to div with nested divs for li
  const element = {
    id: elementId,
    name: 'div',
    parent: '0',
    children: [],
    settings: { tag },
    label: tag === 'ul' ? 'Unordered List' : 'Ordered List'
  };

  listItems.forEach((li, index) => {
    const liId = getUniqueId();
    const liElement = {
      id: liId,
      name: 'div',
      parent: elementId,
      children: [],
      settings: { tag: 'li' }
    };

    allElements.push(liElement);
    element.children.push(liId);
  });

  return element;
};

export { processList };
