import { getUniqueId } from './utils';
import { buildCssMap } from './cssParser';
import { processTextElement } from './elementProcessors/textProcessor';
import { processImage, processSvg, processVideoElement } from './elementProcessors/mediaProcessor';
import { processList } from './elementProcessors/listProcessor';
import { setDomNodeToBricks } from './elementProcessors/listProcessor';
import { processFormElement as processFormElementFromProcessor } from './elementProcessors/formProcessor';
import { processCssClasses } from './processors/cssClassProcessor';
import { processAttributes } from './processors/attributeProcessor';

// Forward declaration for list processor
let domNodeToBricks;

// Set up the domNodeToBricks reference in the list processor
setDomNodeToBricks((...args) => domNodeToBricks(...args));

/**
 * Processes a DOM node and converts it to a Bricks element
 * @param {Node} node - The DOM node to convert
 * @param {Object} cssRulesMap - Map of CSS class names to their styles
 * @param {string} parentId - The ID of the parent element
 * @param {Array} globalClasses - Array to store global CSS classes
 * @param {Array} allElements - Array to store all elements for flat structure
 * @returns {Object|null} Bricks element object or null if node should be skipped
 */
// Main conversion function
domNodeToBricks = (node, cssRulesMap = {}, parentId = '0', globalClasses = [], allElements = []) => {
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

  // Initialize element
  let name = 'div';
  const elementId = getUniqueId();
  const element = {
    id: elementId,
    name,
    parent: parentId,
    children: [],
    settings: {}
  };

  // Determine element type
  if (tag === 'section' || tag === 'footer' || tag === 'header' || node.classList.contains('section')) {
    name = 'section';
    element.label = 'Section';
  } else if (tag === 'nav' || node.classList.contains('container')) {
    name = tag === 'nav' ? 'nav' : 'container';
    element.label = tag === 'nav' ? 'Navigation' : 'Container';
  } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
    // Let the text processor handle heading elements
    const element = processTextElement(node, elementId, allElements);
    return element;
  } else if (['time', 'mark'].includes(tag)) {
    name = 'text-basic';
    element.settings.tag = 'custom';
    element.settings.customTag = tag;
    element.label = tag === 'time' ? 'Time' : 'Mark';
  } else if (tag === 'address') {
    // Let the text processor handle address elements
    const element = processTextElement(node, elementId, allElements);
    return element;
  } else if (['p', 'span'].includes(tag)) {
    name = 'text-basic';
    element.label = tag === 'p' ? 'Paragraph' : tag === 'span' ? 'Inline Text' : 'Address';
  } else if (['blockquote'].includes(tag)) {
    name = 'text-basic';
    element.settings.tag = 'custom';
    element.settings.customTag = tag;
    element.label = 'Blockquote';

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
    allElements.push(textElement);
    return [element, textElement];
  } else if (tag === 'img') {
    name = 'image';
    element.label = 'Image';
  } else if (tag === 'a') {
    name = 'text-link';
    element.label = 'Link';
  } else if (tag === 'button') {
    name = 'button';
    element.label = 'Button';
    element.settings.style = "primary";
    element.settings.tag = "button";
    element.settings.size = "md";
  } else if (tag === 'svg') {
    name = 'svg';
    element.label = 'SVG';
  } else if (tag === 'form') {
    name = 'form';
    element.label = 'Form';
    const formElement = processFormElementFromProcessor(node);
    formElement.id = elementId;
    formElement.parent = parentId;
    Object.assign(element, formElement);
  } else if (['ul', 'ol'].includes(tag)) {
    name = 'list';
    element.label = tag === 'ul' ? 'Unordered List' : 'Ordered List';
  } else if (tag === 'li') {
    name = 'list-item';
    element.label = 'List Item';
  } else if (['table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td'].includes(tag)) {
    name = 'div';
    element.label = 'Table';
    element.settings.tag = 'custom';
    element.settings.customTag = tag;
    if (tag === 'tr') {
      element.label = 'Table Row';
      element.settings.style = 'display: flex; width: 100%;';
    } else if (['tbody'].includes(tag)) {
      element.label = 'Table Body';
      element.settings.style = 'flex: 1; padding: 8px;';
    } else if (['thead'].includes(tag)) {
      element.label = 'Table Header';
      element.settings.style = 'flex: 1; padding: 8px;';
    } else if (['tfoot'].includes(tag)) {
      element.label = 'Table Footer';
      element.settings.style = 'flex: 1; padding: 8px;';
    } else if (['th'].includes(tag)) {
      element.label = 'Table Head';
      element.settings.style = 'flex: 1; padding: 8px;';
    } else if (['td'].includes(tag)) {
      element.label = 'Cell';
      element.settings.style = 'flex: 1; padding: 8px;';
    }
  } else if (['canvas', 'details', 'summary', 'dialog', 'meter', 'progress'].includes(tag)) {
    name = 'div';
    element.label = 'Canvas';
    element.settings.tag = 'custom';
    element.settings.customTag = tag;
  } else if (['figure', 'figcaption'].includes(tag)) {
    name = 'section';
    element.label = 'Figure';
    element.settings.tag = 'custom';
    element.settings.customTag = tag;
  } else if (['pre', 'code'].includes(tag)) {
    name = 'text-basic';
    element.label = 'Pre';
    element.settings.tag = 'custom';
    element.settings.customTag = tag;
  } else if (tag === 'audio') {
    name = 'audio';
    element.label = 'Audio';
    element.settings.source = 'external';
    element.settings.external = node.querySelector('source')?.getAttribute('src') || node.getAttribute('src') || '';
    element.settings.loop = node.hasAttribute('loop');
    element.settings.autoplay = node.hasAttribute('autoplay');
  } else if (tag === 'video') {
    const videoElement = processVideoElement(node, elementId);
    videoElement.parent = parentId;
    return videoElement;
  }

  element.name = name;

  // Determine / create primary global class for this element
  const attrClassNames = node.classList ? Array.from(node.classList) : [];
  const randomId = Math.random().toString(36).substring(2, 8);
  const primaryClassName = attrClassNames.length > 0 ? attrClassNames[0] : `${tag}-${randomId}`;

  // Generate default class if element has no classes
  if (!node.className && !['form', 'input', 'select', 'textarea', 'button', 'label'].includes(tag)) {
    const defaultClass = primaryClassName;
    node.classList.add(defaultClass);
    if (!globalClasses.some(c => c.name === defaultClass)) {
      globalClasses.push({
        id: getUniqueId(),
        name: defaultClass,
        settings: {}
      });
    }
  }

  // Route list elements to the list processor
  if (['ul', 'ol'].includes(tag)) {
    const listElement = processList(node, elementId, cssRulesMap, globalClasses, allElements, parentId);
    allElements.push(listElement);
    return listElement;
  }

  // Process children for non-list elements
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

  // Process attributes first
  const attributeSettings = processAttributes(node, tag);
  // Process CSS classes
  const { elementSettings: classSettings } = processCssClasses(node, cssRulesMap, globalClasses);
  
  // Route to appropriate processor based on element type
  if (['p', 'span', 'a', 'button', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'address'].includes(tag)) {
    const textElement = processTextElement(node, elementId, allElements);
    if (textElement) {
      // Merge previously extracted attribute & class settings so they aren't lost
      Object.assign(textElement.settings, attributeSettings, classSettings);
      textElement.parent = parentId;
      return textElement;
    }
  }

  // Apply attribute & class settings to the generic element
  Object.assign(element.settings, attributeSettings, classSettings);

  if (tag === 'img') {
    const imgElement = processImage(node, elementId);
    imgElement.parent = parentId;
    return imgElement;
  } else if (tag === 'svg') {
    const svgElement = processSvg(node, elementId);
    svgElement.parent = parentId;
    return svgElement;
  }

  // Skip form fields handled by processFormElement
  if (node.closest('form') && ['input', 'select', 'textarea', 'button', 'label'].includes(tag)) {
    return null;
  }

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
