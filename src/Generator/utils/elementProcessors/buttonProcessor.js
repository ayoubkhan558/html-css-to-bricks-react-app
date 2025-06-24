import { getUniqueId } from '../utils';

/**
 * Process button elements
 * @param {Element} node - The button element to process
 * @param {string} elementId - The ID for the new element
 * @returns {Object} The processed button element
 */
const processButton = (node, elementId) => {
  const settings = {
    style: 'primary',
    tag: node.tagName.toLowerCase() === 'a' ? 'a' : 'button',
    size: 'md',
    text: node.textContent.trim()
  };

  // Handle button attributes
  const buttonType = node.getAttribute('type');
  if (buttonType) {
    settings.type = buttonType;
  }

  // Handle link attributes for anchor buttons
  if (settings.tag === 'a' && node.hasAttribute('href')) {
    settings.link = {
      type: 'external',
      url: node.getAttribute('href') || '#',
      noFollow: node.getAttribute('rel')?.includes('nofollow') || false,
      openInNewWindow: node.getAttribute('target') === '_blank'
    };
  }

  // Handle disabled state
  if (node.hasAttribute('disabled')) {
    settings.disabled = true;
  }

  // Handle form attributes
  const formId = node.getAttribute('form');
  if (formId) {
    settings.form = formId;
  }

  return {
    id: elementId,
    name: 'button',
    parent: '0',
    children: [],
    settings,
    label: 'Button'
  };
};

export { processButton };
