import { getUniqueId } from '@generator/utils';
import { getElementLabel } from './labelUtils';

/**
 * Processes navigation elements into Bricks nested nav components
 * @param {Node} node - The DOM node to process
 * @param {Object} context - Optional context values (showNodeClass, etc.)
 * @returns {Array} Array of processed elements
 */
export const processNavElement = (node, context = {}) => {
  const elements = []; // Array to collect all elements

  const navElement = {
    id: getUniqueId(),
    name: 'nav-nested',
    parent: '0',
    children: [],
    label: getElementLabel(node, 'Navigation', context),
    settings: {
      dropdownPadding: {
        top: '12',
        right: '12',
        bottom: '12',
        left: '12'
      },
      'dropdownItemBackground:hover': {
        hex: '#398378',
        rgb: 'rgba(57, 131, 120, 0.1)',
        hsl: 'hsla(171, 39%, 37%, 0.1)'
      }
    },
    themeStyles: {}
  };

  elements.push(navElement); // Add nav element to collection

  // Process nav items
  const itemsBlock = {
    id: getUniqueId(),
    name: 'block',
    parent: navElement.id,
    children: [],
    settings: {
      tag: 'ul',
      _hidden: {
        _cssClasses: 'brx-nav-nested-items'
      }
    },
    label: 'Nav items',
    cloneable: false,
    deletable: false
  };

  elements.push(itemsBlock); // Add items block to collection

  // Process regular links
  const regularLinks = Array.from(node.querySelectorAll('a:not(.dropdown-toggle):not([data-toggle="dropdown"])'));
  regularLinks.forEach(link => {
    if (!link.closest('.dropdown-menu, .dropdown-content')) { // Skip dropdown items for now
      const linkElement = createLinkElement(link, itemsBlock.id);
      itemsBlock.children.push(linkElement.id);
      elements.push(linkElement); // Add link element to collection
    }
  });

  // Process dropdowns
  const dropdowns = Array.from(node.querySelectorAll('.dropdown, .has-dropdown, [data-toggle="dropdown"]'));
  dropdowns.forEach(dropdown => {
    const dropdownElement = {
      id: getUniqueId(),
      name: 'dropdown',
      parent: itemsBlock.id,
      children: [],
      settings: {
        text: dropdown.querySelector('.dropdown-toggle, a')?.textContent.trim() || 'Dropdown'
      },
      label: 'Dropdown'
    };

    elements.push(dropdownElement); // Add dropdown element to collection

    const dropdownContent = {
      id: getUniqueId(),
      name: 'div',
      parent: dropdownElement.id,
      children: [],
      settings: {
        _hidden: {
          _cssClasses: 'brx-dropdown-content'
        },
        tag: 'ul'
      },
      label: 'Content',
      cloneable: false,
      deletable: false
    };

    elements.push(dropdownContent); // Add dropdown content to collection

    // Process dropdown links
    const dropdownLinks = Array.from(dropdown.querySelectorAll('.dropdown-menu a, .dropdown-content a'));
    dropdownLinks.forEach(link => {
      const linkElement = createLinkElement(link, dropdownContent.id);
      dropdownContent.children.push(linkElement.id);
      elements.push(linkElement); // Add dropdown link to collection
    });

    dropdownElement.children.push(dropdownContent.id);
    itemsBlock.children.push(dropdownElement.id);
  });

  // Add mobile toggle elements
  const closeToggle = {
    id: getUniqueId(),
    name: 'toggle',
    parent: itemsBlock.id,
    children: [],
    settings: {
      _hidden: {
        _cssClasses: 'brx-toggle-div'
      }
    },
    label: 'Toggle (Close: Mobile)',
  };

  const openToggle = {
    id: getUniqueId(),
    name: 'toggle',
    parent: navElement.id,
    children: [],
    settings: {},
    label: 'Toggle (Open: Mobile)'
  };

  elements.push(closeToggle); // Add close toggle to collection
  elements.push(openToggle); // Add open toggle to collection

  itemsBlock.children.push(closeToggle.id);
  navElement.children.push(itemsBlock.id, openToggle.id);

  return elements; // Return all elements, not just the nav element
};

// Helper function to create link elements
const createLinkElement = (link, parentId) => {
  return {
    id: getUniqueId(),
    name: 'text-link',
    parent: parentId,
    children: [],
    settings: {
      text: link.textContent.trim(),
      link: {
        type: 'external',
        url: link.getAttribute('href') || '#'
      }
    },
    label: 'Nav link'
  };
};