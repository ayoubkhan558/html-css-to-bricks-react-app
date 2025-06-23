import { getUniqueId } from '../utils';

export const processTextElement = (node) => {
  const tag = node.tagName.toLowerCase();
  const elementId = getUniqueId();
  
  let name, label;
  
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
    name = 'heading';
    label = `Heading ${tag.replace('h', '')}`;
  } else if (['p', 'span', 'address'].includes(tag)) {
    name = 'text-basic';
    label = tag === 'p' ? 'Paragraph' : tag === 'span' ? 'Inline Text' : 'Address';
  } else if (['time', 'mark'].includes(tag)) {
    name = 'text-basic';
    label = tag === 'time' ? 'Time' : 'Mark';
  } else if (tag === 'blockquote') {
    name = 'text-basic';
    label = 'Blockquote';
  } else if (['pre', 'code'].includes(tag)) {
    name = 'text-basic';
    label = 'Code';
  }

  const element = {
    id: elementId,
    name,
    parent: 0,
    children: [],
    settings: {
      text: node.textContent.trim(),
      tag: ['time', 'mark', 'blockquote', 'pre', 'code'].includes(tag) ? 'custom' : tag
    }
  };

  if (['time', 'mark', 'blockquote', 'pre', 'code'].includes(tag)) {
    element.settings.customTag = tag;
  }

  if (tag === 'blockquote') {
    // Create child element for the actual text content
    const textElement = {
      id: getUniqueId(),
      name: 'text-basic',
      parent: elementId,
      children: [],
      settings: {
        text: node.textContent.trim(),
        tag: 'p'
      }
    };
    element.children.push(textElement.id);
    return [element, textElement];
  }

  return element;
};

export const processLinkElement = (node) => {
  const elementId = getUniqueId();
  
  const element = {
    id: elementId,
    name: 'text-link',
    parent: 0,
    children: [],
    settings: {
      text: node.textContent.trim(),
      link: {
        type: 'external',
        url: node.getAttribute('href') || '',
        noFollow: node.getAttribute('rel')?.includes('nofollow') || false,
        openInNewWindow: node.getAttribute('target') === '_blank',
        noReferrer: node.getAttribute('rel')?.includes('noreferrer') || false
      }
    }
  };

  return element;
};
