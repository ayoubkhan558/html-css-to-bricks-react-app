/**
 * Processes list elements (ul, ol, li) for Bricks conversion
 */
export const processListElement = (node, element, tag) => {
  if (['ul', 'ol'].includes(tag)) {
    element.name = 'list';
    element.label = tag === 'ul' ? 'Unordered List' : 'Ordered List';
  } else if (tag === 'li') {
    element.name = 'list-item';
    element.label = 'List Item';
  }
  
  element.settings.tag = 'custom';
  element.settings.customTag = tag;
  
  return element;
};
