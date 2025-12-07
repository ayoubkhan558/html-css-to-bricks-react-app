import { getUniqueId } from '../utils';
import { getElementLabel } from './labelUtils';

/**
 * Processes alert elements into Bricks alert components
 * @param {Node} node - The DOM node to process
 * @param {Object} context - Optional context values (showNodeClass, etc.)
 * @returns {Object} The processed alert element
 */
export const processAlertElement = (node, context = {}) => {
  // Default alert settings
  const alertElement = {
    id: getUniqueId(),
    name: 'alert',
    label: getElementLabel(node, 'Alert', context),
    parent: '0',
    children: [],
    settings: {
      content: node.innerHTML || '<p>Alert content</p>',
      type: 'info',
      dismissable: true
    },
    themeStyles: {}
  };

  // Handle alert type from class names
  const alertTypes = ['success', 'info', 'warning', 'danger'];
  Array.from(node.classList).forEach(className => {
    if (className.startsWith('is-')) {
      const type = className.replace('is-', '');
      if (alertTypes.includes(type)) {
        alertElement.settings.type = type;
      }
    } else if (alertTypes.includes(className)) {
      alertElement.settings.type = className;
    }
  });

  // Handle dismissable attribute
  if (node.hasAttribute('data-dismissable')) {
    alertElement.settings.dismissable = node.getAttribute('data-dismissable') !== 'false';
  }

  return alertElement;
};
