import { generateId } from '@lib/bricks';


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
        id: generateId(),
        name: 'style',
        value: style
      });
    }
    // For 'class' and 'skip' modes, don't add to attributes - let handleInlineStyles deal with it
    // Don't remove the style attribute here - let handleInlineStyles handle removal
  }

  // Process other attributes
  Array.from(node.attributes).forEach(attr => {
    if (attr.name === 'style') return; // Skip style as it's already processed above

    if (!elementSpecificAttrs.includes(attr.name) &&
      !attr.name.startsWith('data-bricks-') &&
      attr.name !== 'href' &&
      !(tag === 'a' && ['target', 'rel'].includes(attr.name))) {
      customAttributes.push({
        id: generateId(),
        name: attr.name,
        value: attr.value
      });
    }
  });

  // Merge custom attributes with existing ones (don't overwrite)
  if (customAttributes.length > 0) {
    if (!element.settings._attributes) {
      element.settings._attributes = customAttributes;
    } else {
      // Only add attributes that don't already exist
      customAttributes.forEach(newAttr => {
        const exists = element.settings._attributes.some(existing => existing.name === newAttr.name);
        if (!exists) {
          element.settings._attributes.push(newAttr);
        }
      });
    }
  }
};
