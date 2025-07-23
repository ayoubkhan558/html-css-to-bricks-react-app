import { getUniqueId } from '../utils';


/**
 * Processes element attributes into Bricks settings
 */
export const processAttributes = (node, element, tag, options = {}) => {
  const elementSpecificAttrs = ['id', 'class', 'href', 'src', 'alt', 'title', 'type', 'name', 'value', 'placeholder', 'required', 'disabled', 'checked', 'selected', 'multiple', 'rows', 'cols'];
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

  // Process style attribute based on inlineStyleHandling
  if (node.hasAttribute('style')) {
    const style = node.getAttribute('style').trim();
    if (!style) return; // Skip if style is empty

    const inlineStyleHandling = options.inlineStyleHandling || options.context?.inlineStyleHandling || 'inline';

    // Only process as attribute if inlineStyleHandling is 'inline'
    if (inlineStyleHandling === 'inline') {
      // For 'inline' mode, we'll keep the styles as inline styles
      element.settings._attributes = element.settings._attributes || [];
      element.settings._attributes.push({
        id: getUniqueId(),
        name: 'style',
        value: style
      });
      console.log('Set inline styles as attribute');

      // Remove the style attribute since we've processed it
      node.removeAttribute('style');
    }
    // For 'class' and 'skip' modes, don't add to attributes - let handleInlineStyles deal with it
  }

  // Process other attributes
  Array.from(node.attributes).forEach(attr => {
    if (attr.name === 'style') return; // Skip style as it's already processed above

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