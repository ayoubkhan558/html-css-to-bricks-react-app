import { getUniqueId } from './utils';
import { buildCssMap, parseCssDeclarations } from './cssParser';
import { ELEMENT_PROCESSORS } from './elementProcessors';

/**
 * Processes a DOM node and converts it to a Bricks element
 * @param {Node} node - The DOM node to convert
 * @param {Object} cssRulesMap - Map of CSS class names to their styles
 * @param {string} parentId - The ID of the parent element
 * @param {Array} globalClasses - Array to store global CSS classes
 * @param {Array} allElements - Array to store all elements for flat structure
 * @returns {Object|null} Bricks element object or null if node should be skipped
 */
const domNodeToBricks = (node, cssRulesMap = {}, parentId = '0', globalClasses = [], allElements = []) => {
  // Handle text nodes
  if (node.nodeType !== Node.ELEMENT_NODE) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      // Skip text nodes inside forms or buttons
      const parentEl = node.parentElement;
      if (parentEl && parentEl.closest && (parentEl.closest('form') || parentEl.closest('button'))) {
        return null;
      }
      const textElement = {
        id: getUniqueId(),
        name: 'text-basic',
        parent: parentId,
        children: [],
        settings: {
          text: node.textContent.trim(),
          tag: 'p'
        }
      };
      allElements.push(textElement);
      return textElement;
    }
    return null;
  }

  const tag = node.tagName.toLowerCase();

  // Check if we have a specific processor for this element
  if (ELEMENT_PROCESSORS[tag]) {
    const result = ELEMENT_PROCESSORS[tag](node, cssRulesMap, parentId, globalClasses, allElements);
    if (result) {
      if (Array.isArray(result)) {
        result.forEach(el => allElements.push(el));
      } else {
        allElements.push(result);
      }
      return result;
    }
    return null;
  }

  // Default processor for generic elements
  const elementId = getUniqueId();
  const element = {
    id: elementId,
    name: 'div',
    parent: parentId,
    children: [],
    settings: {}
  };

  // Handle attributes
  const handleAttributes = (node, element) => {
    const elementSpecificAttrs = ['id', 'class', 'style', 'href', 'src', 'alt', 'title', 'type', 'name', 'value', 'placeholder', 'required', 'disabled', 'checked', 'selected', 'multiple', 'rows', 'cols', 'controls', 'autoplay', 'loop', 'muted', 'playsinline', 'preload', 'poster'];
    const customAttributes = [];

    // Handle id attribute
    if (node.hasAttribute('id')) {
      element.settings._cssId = node.getAttribute('id');
    }

    // Handle inline styles
    if (node.hasAttribute('style')) {
      if (!element.settings._attributes) {
        element.settings._attributes = [];
      }
      node.getAttribute('style').split(';').forEach(style => {
        const [name, value] = style.split(':');
        if (name && value) {
          element.settings._attributes.push({
            id: getUniqueId(),
            name: name.trim(),
            value: value.trim()
          });
        }
      });
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
      element.settings._attributes = customAttributes;
    }
  };

  // Handle CSS classes
  if (node.classList && node.classList.length > 0) {
    const classNames = Array.from(node.classList);
    const cssGlobalClasses = [];

    classNames.forEach(cls => {
      if (!globalClasses.some(c => c.name === cls)) {
        const classId = getUniqueId();
        let targetClass = {
          id: classId,
          name: cls,
          settings: {}
        };

        // Process base styles
        if (cssRulesMap[cls]) {
          const baseStyles = parseCssDeclarations(cssRulesMap[cls], cls);
          Object.assign(targetClass.settings, baseStyles);
        }

        // Process pseudo-classes
        ['hover', 'active', 'focus', 'visited'].forEach(pseudo => {
          const pseudoKey = `${cls}:${pseudo}`;
          if (cssRulesMap[pseudoKey]) {
            const pseudoStyles = parseCssDeclarations(cssRulesMap[pseudoKey], cls);
            targetClass.settings[pseudo] = {};
            Object.entries(pseudoStyles).forEach(([prop, value]) => {
              targetClass.settings[pseudo][prop] = value;
              targetClass.settings[`${prop}:${pseudo}`] = value;
            });
          }
        });

        // Process responsive styles
        ['tablet', 'tablet_portrait', 'mobile', 'mobile_landscape', 'mobile_portrait'].forEach(breakpoint => {
          const breakpointKey = `${cls}:${breakpoint}`;
          if (cssRulesMap[breakpointKey]) {
            const breakpointStyles = parseCssDeclarations(cssRulesMap[breakpointKey], cls);
            targetClass.settings[`_${breakpoint.replace('_', '-')}`] = breakpointStyles;
          }
        });

        globalClasses.push(targetClass);
        cssGlobalClasses.push(classId);
      } else {
        cssGlobalClasses.push(globalClasses.find(c => c.name === cls).id);
      }
    });

    if (cssGlobalClasses.length > 0) {
      element.settings._cssGlobalClasses = cssGlobalClasses;
    }
  }

  handleAttributes(node, element);

  // Process children
  Array.from(node.childNodes).forEach(childNode => {
    if (childNode.nodeType === Node.TEXT_NODE && !childNode.textContent.trim()) {
      return;
    }
    const childElement = domNodeToBricks(childNode, cssRulesMap, elementId, globalClasses, allElements);
    if (childElement) {
      if (Array.isArray(childElement)) {
        childElement.forEach(c => element.children.push(c.id));
      } else {
        element.children.push(childElement.id);
      }
    }
  });

  allElements.push(element);
  return element;
};

/**
 * Converts HTML and CSS to Bricks structure
 * @param {string} html - The HTML string to convert
 * @param {string} css - The CSS string to process
 * @returns {Object} Bricks structure object
 */
const convertHtmlToBricks = (html, css) => {
  try {
    let doc;
    if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
      const parser = new DOMParser();
      doc = parser.parseFromString(html, 'text/html');
    } else {
      // Fallback for Node.js environment - dynamic import to avoid bundling in browser
      const { JSDOM } = require('jsdom');
      const dom = new JSDOM(`<!DOCTYPE html>${html}`);
      doc = dom.window.document;
      if (typeof global.Node === 'undefined') global.Node = dom.window.Node;
    }

    // Build CSS map with normalized class names (without the leading dot)
    const cssMap = {};
    const rawCssMap = buildCssMap(css);
    Object.entries(rawCssMap).forEach(([key, value]) => {
      const cleanKey = key.replace(/^[.\s]+/, ''); // Remove leading dots and spaces
      cssMap[cleanKey] = value;
    });

    // Process the document
    const content = [];
    const globalClasses = [];
    const allElements = [];

    // Process each root node and collect the root elements
    Array.from(doc.body.childNodes).forEach(node => {
      const element = domNodeToBricks(node, cssMap, '0', globalClasses, allElements);
      if (element) {
        if (Array.isArray(element)) {
          content.push(...element);
        } else {
          content.push(element);
        }
      }
    });

    // Add all elements to the content array to ensure flat structure with all nested elements
    allElements.forEach(el => {
      if (!content.some(c => c.id === el.id)) {
        content.push(el);
      }
    });

    return {
      content,
      source: 'bricksCopiedElements',
      sourceUrl: 'http://localhost/bricks',
      version: '2.0-beta',
      globalClasses,
      globalElements: []
    };
  } catch (error) {
    console.error('Error converting HTML to Bricks:', error);
    throw error;
  }
};

export { domNodeToBricks, convertHtmlToBricks };
