import { getUniqueId } from '../utils';

// This will be set by domToBricks.js
let domNodeToBricks = null;

// This is called by domToBricks.js to set the reference
const setDomNodeToBricks = (fn) => {
  domNodeToBricks = fn;
};

// Helper to get the domNodeToBricks function with error handling
const getDomNodeToBricks = () => {
  if (!domNodeToBricks) {
    throw new Error('domNodeToBricks reference not set. Call setDomNodeToBricks first.');
  }
  return domNodeToBricks;
};

const processList = (node, elementId, cssRulesMap, globalClasses, allElements, parentId = '0') => {
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
      parent: parentId,
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
    parent: parentId,
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

      // Process li children
    Array.from(li.childNodes).forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const processNode = getDomNodeToBricks();
        const childElement = processNode(child, cssRulesMap, liId, globalClasses, allElements, liId);
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

export { processList, setDomNodeToBricks };
