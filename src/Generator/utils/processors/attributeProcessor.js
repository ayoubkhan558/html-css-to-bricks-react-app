import { getUniqueId } from '../utils';

export const processAttributes = (node, tag) => {
  const elementSpecificAttrs = ['id', 'class', 'style', 'href', 'src', 'alt', 'title', 'type', 'name', 'value', 'placeholder', 'required', 'disabled', 'checked', 'selected', 'multiple', 'rows', 'cols', 'controls', 'autoplay', 'loop', 'muted', 'playsinline', 'preload', 'poster'];
  const customAttributes = [];
  const elementSettings = {};

  // Special handling for links
  if (tag === 'a' && node.hasAttribute('href')) {
    elementSettings.link = {
      type: 'external',
      url: node.getAttribute('href') || '',
      noFollow: node.getAttribute('rel')?.includes('nofollow') || false,
      openInNewWindow: node.getAttribute('target') === '_blank',
      noReferrer: node.getAttribute('rel')?.includes('noreferrer') || false
    };
  }

  // Handle id attribute
  if (node.hasAttribute('id')) {
    elementSettings._cssId = node.getAttribute('id');
  }

  // Handle inline styles
  if (node.hasAttribute('style')) {
    const styleAttributes = [];
    node.getAttribute('style').split(';').forEach(style => {
      const [name, value] = style.split(':');
      if (name && value) {
        styleAttributes.push({
          id: getUniqueId(),
          name: name.trim(),
          value: value.trim()
        });
      }
    });
    if (styleAttributes.length > 0) {
      elementSettings._attributes = styleAttributes;
    }
  }

  // Process other attributes
  Array.from(node.attributes).forEach(attr => {
    if (!elementSpecificAttrs.includes(attr.name) && 
        !attr.name.startsWith('data-bricks-') && 
        attr.name !== 'href' && 
        !(tag === 'a' && ['target', 'rel'].includes(attr.name))) {
      customAttributes.push({
        id: getUniqueId(),
        name: attr.name,
        value: attr.value
      });
    }
  });

  if (customAttributes.length > 0) {
    elementSettings._attributes = [
      ...(elementSettings._attributes || []),
      ...customAttributes
    ];
  }

  return elementSettings;
};
