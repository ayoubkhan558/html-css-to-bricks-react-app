import { getUniqueId } from '../utils';

/**
 * Processes alert elements into Bricks alert components
 */
export const processAlertElement = (node) => {
  // Default alert settings
  const alertElement = {
    id: getUniqueId(),
    name: 'alert',
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
