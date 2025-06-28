import { getUniqueId } from '../utils';

/**
 * Processes element attributes into Bricks settings
 */
export const processAttributes = (node, element, tag) => {
  const elementSpecificAttrs = ['id', 'class', 'style', 'href', 'src', 'alt', 'title', 'type', 'name', 'value', 'placeholder', 'required', 'disabled', 'checked', 'selected', 'multiple', 'rows', 'cols'];
  const customAttributes = [];

  if (tag === 'a' && node.hasAttribute('href')) {
    element.settings.link = {
      type: 'external',
      url: node.getAttribute('href') || '',
      noFollow: node.getAttribute('rel')?.includes('nofollow') || false,
      openInNewWindow: node.getAttribute('target') === '_blank',
      noReferrer: node.getAttribute('rel')?.includes('noreferrer') || false
    };
  }

  if (node.hasAttribute('id')) {
    element.settings._cssId = node.getAttribute('id');
  }

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
    element.settings._attributes = customAttributes;
  }
};
