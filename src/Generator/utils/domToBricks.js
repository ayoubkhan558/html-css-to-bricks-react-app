import { getUniqueId } from './utils';
import { getBricksFieldType, processFormField, processFormElement } from "./elementProcessors/formProcessor"
import { buildCssMap, parseCssDeclarations, matchCSSSelectors } from './cssParser';
import { processAudioElement } from './elementProcessors/audioProcessor';
import { processVideoElement } from './elementProcessors/videoProcessor';
import { processTableElement } from './elementProcessors/tableProcessor';
import { processImageElement } from './elementProcessors/imageProcessor';
import { processSvgElement } from './elementProcessors/svgProcessor';
import { processHeadingElement } from './elementProcessors/headingProcessor';
import { processListElement } from './elementProcessors/listProcessor';
import { processLinkElement } from './elementProcessors/linkProcessor';
import { processButtonElement } from './elementProcessors/buttonProcessor';
import { processMiscElement } from './elementProcessors/miscProcessor';
import { processStructureLayoutElement } from './elementProcessors/structureLayoutProcessor';
import { processTextElement } from './elementProcessors/textElementProcessor';
import { processAttributes } from './processors/attributeProcessor';
import { processAlertElement } from './elementProcessors/alertProcessor';
import { processNavElement } from './elementProcessors/navProcessor';

// Alert/message class patterns to check
const ALERT_CLASS_PATTERNS = [
  'alert', 'notification', 'message', 'toast', 'msg', 'flash',
  'banner', 'notice', 'warning', 'error', 'success', 'info',
  'callout', 'hint', 'tip', 'note', 'status'
];

// Helper function to check if element has alert-related classes
const hasAlertClasses = (node) => {
  if (!node.classList || node.classList.length === 0) return false;

  const classes = Array.from(node.classList);

  // Check for exact matches or classes that start with alert patterns
  return ALERT_CLASS_PATTERNS.some(pattern =>
    classes.some(cls =>
      cls === pattern ||
      cls.startsWith(pattern + '-') ||
      cls.startsWith(pattern + '_') ||
      cls.endsWith('-' + pattern) ||
      cls.endsWith('_' + pattern)
    )
  );
};

// Helper function to check if element has container/layout classes
const hasContainerClasses = (node) => {
  if (!node.classList || node.classList.length === 0) return false;

  const containerClasses = ['container', 'boxed', 'wrapper', 'content'];
  return containerClasses.some(cls => node.classList.contains(cls));
};

/**
 * Processes a DOM node and converts it to a Bricks element
 */
const domNodeToBricks = (node, cssRulesMap = {}, parentId = '0', globalClasses = [], allElements = [], variables = {}) => {
  // Handle text nodes
  if (node.nodeType !== Node.ELEMENT_NODE) {
    // Skip text nodes that are inside a form element (labels, button text, etc.)
    if (node.parentElement && node.parentElement.closest && node.parentElement.closest('form')) {
      return null;
    }
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {

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

  // -------------------------------------------------------------------
  // Skip empty placeholder elements automatically injected by the HTML
  // parser when the source markup is invalid (e.g. a <p> that ends up
  // empty because the browser closed it before a disallowed child like
  // <address>). These empty nodes generate redundant Bricks elements and
  // should be ignored completely.
  // -------------------------------------------------------------------
  // Skip empty placeholder elements automatically injected by the HTML
  // parser when the source markup is invalid, but preserve divs with classes
  if (['p', 'span'].includes(tag) && node.textContent.trim() === '' && node.children.length === 0) {
    return null;
  }

  // Only skip empty divs if they have no classes and no attributes
  if (tag === 'div' && node.textContent.trim() === '' && node.children.length === 0 &&
    !node.className && node.attributes.length <= 1) { // length <= 1 to account for just the tag name
    return null;
  }

  let name = 'div';
  const elementId = getUniqueId();
  const element = {
    id: elementId,
    name,
    parent: parentId,
    children: [],
    settings: {}
  };

  // Check for alert elements first (higher priority)
  if (tag === 'div' && hasAlertClasses(node)) {
    return processAlertElement(node);
  }
  // Check for nav elements
  if (tag === 'nav' || (tag === 'div' && (
    node.classList.contains('nav') ||
    node.classList.contains('menu') ||
    node.classList.contains('navigation') ||
    node.classList.contains('links') ||
    node.classList.contains('navbar') ||
    node.classList.contains('main-nav') ||
    node.classList.contains('primary-nav') ||
    node.classList.contains('header-nav') ||
    node.classList.contains('site-nav') ||
    node.classList.contains('top-nav') ||
    node.classList.contains('subnav') ||
    node.classList.contains('submenu') ||
    node.classList.contains('breadcrumb') ||
    node.classList.contains('pagination')
  ))) {
    return processNavElement(node);
  }
  // Structure/layout elements
  else if (['div', 'article', 'aside', 'main', 'nav', 'figure', 'section', 'footer', 'header'].includes(tag) ||
    node.classList.contains('section') ||
    (tag === 'div' && hasContainerClasses(node))) {
    processStructureLayoutElement(node, element, tag);
  }
  else if (tag === 'div') {
    // Process as generic div if no special classes are present
    element.name = 'div';
    element.label = 'Div';
    element.settings.tag = 'div';
  }
  else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
    processHeadingElement(node, element, tag);
  }
  else if (['time', 'mark', 'span', 'address', 'p', 'blockquote'].includes(tag)) {
    processTextElement(node, element, tag, allElements);
  }
  else if (['a'].includes(tag)) {
    processLinkElement(node, element);
  }
  else if (tag === 'img') {
    processImageElement(node, element);
  }
  else if (tag === 'button') {
    processButtonElement(node, element);
  }
  else if (tag === 'svg') {
    processSvgElement(node, element);
  }
  else if (tag === 'form') {
    name = 'form';
    element.label = 'Form';
    const formElement = processFormElement(node);
    formElement.id = elementId;
    formElement.parent = parentId;
    Object.assign(element, formElement);
  }
  else if (['table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td'].includes(tag)) {
    const processedElement = processTableElement(node, element, tag);
    if (['td', 'th'].includes(tag)) {
      // For cells, return early to avoid duplicate processing
      allElements.push(processedElement);
      return processedElement;
    }
    // For other table elements, continue with normal processing
  }
  else if (['ul', 'ol', 'li'].includes(tag)) {
    const processedElement = processListElement(node, element, tag);
    if (processedElement && processedElement.name === 'text') {
      // For simple lists, return early (like tables do)
      allElements.push(processedElement);
      return processedElement;
    }
    // For complex lists, continue with normal processing (just like tables)
  }
  else if (tag === 'audio') {
    processAudioElement(node, element);
  }
  else if (tag === 'video') {
    processVideoElement(node, element);
  }
  else if (['canvas', 'details', 'summary', 'dialog', 'meter', 'progress'].includes(tag)) {
    processMiscElement(node, element, tag);
  }

  // Process children (only skip td/th to avoid duplication, allow other table elements to process children)
  // Skip traversing children for table cells and for <form> – form fields are already extracted by processFormElement
  if (!['td', 'th', 'form'].includes(tag)) {
    Array.from(node.childNodes).forEach(childNode => {
      if (childNode.nodeType === Node.TEXT_NODE && !childNode.textContent.trim()) {
        return;
      }
      const childElement = domNodeToBricks(childNode, cssRulesMap, elementId, globalClasses, allElements, variables);
      if (childElement) {
        if (Array.isArray(childElement)) {
          childElement.forEach(c => element.children.push(c.id));
        } else {
          element.children.push(childElement.id);
        }
      }
    });
  }

  if (node.closest('form') && ['input', 'select', 'textarea', 'button', 'label'].includes(tag)) {
    return null;
  }

  // ------------------------------------------------------------------
  // CSS CLASS / STYLE AGGREGATION
  // ------------------------------------------------------------------
  // Get all matching CSS properties for this element
  const combinedProperties = matchCSSSelectors(node, cssRulesMap);

  // Ensure every element has a class, generating one if necessary
  const existingClasses = node.classList && node.classList.length > 0 ? Array.from(node.classList) : [];
  const randomId = Math.random().toString(36).substring(2, 6);
  const generatedClass = existingClasses.length === 0 ? `${tag}-tag-${randomId}-class` : null;
  const classNames = generatedClass ? [generatedClass, ...existingClasses] : existingClasses;

  // Store the mapping between this element and the CSS global classes
  const cssGlobalClasses = [];

  classNames.forEach((cls, index) => {
    // Find or create the corresponding global class
    let targetClass = globalClasses.find(c => c.name === cls);
    if (!targetClass) {
      targetClass = { id: getUniqueId(), name: cls, settings: {} };
      globalClasses.push(targetClass);
    }

    // Apply combined styles only to the primary class (the first one)
    if (index === 0 && Object.keys(combinedProperties).length > 0) {
      const parsedSettings = parseCssDeclarations(combinedProperties, cls, variables);
      Object.assign(targetClass.settings, parsedSettings);
    }

    // Handle pseudo-classes
    Object.keys(cssRulesMap).forEach(selector => {
      const pseudoMatch = selector.match(new RegExp(`^\\.${cls}:(\\w+)`));
      if (pseudoMatch) {
        const pseudoClass = pseudoMatch[1];
        const pseudoStyles = parseCssDeclarations(cssRulesMap[selector], cls, variables);
        Object.entries(pseudoStyles).forEach(([prop, value]) => {
          targetClass.settings[`${prop}:${pseudoClass}`] = value;
        });
      }
    });

    // Link this element to the global class
    if (!cssGlobalClasses.includes(targetClass.id)) {
      cssGlobalClasses.push(targetClass.id);
    }
  });

  if (cssGlobalClasses.length > 0) {
    element.settings._cssGlobalClasses = cssGlobalClasses;
  }

  // Process attributes
  processAttributes(node, element, tag);

  allElements.push(element);
  return element;
};

/**
 * Converts HTML and CSS to Bricks structure
 */
const convertHtmlToBricks = (html, css) => {
  try {
    let doc;
    if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
      const parser = new DOMParser();
      doc = parser.parseFromString(html, 'text/html');
    } else {
      const { JSDOM } = require('jsdom');
      const dom = new JSDOM(`<!DOCTYPE html>${html}`);
      doc = dom.window.document;
      if (typeof global.Node === 'undefined') global.Node = dom.window.Node;
    }

    const { cssMap, variables, rootStyles } = buildCssMap(css);

    const content = [];
    const globalClasses = [];
    const allElements = [];

    Array.from(doc.body.childNodes).forEach(node => {
      const element = domNodeToBricks(node, cssMap, '0', globalClasses, allElements, variables);
      if (element) {
        if (Array.isArray(element)) {
          content.push(...element);
        } else {
          content.push(element);
        }
      }
    });

    allElements.forEach(el => {
      if (!content.some(c => c.id === el.id)) {
        content.push(el);
      }
    });

    if (rootStyles) {
      if (globalClasses.length > 0) {
        const firstClass = globalClasses[0];
        if (!firstClass.settings._cssCustom) {
          firstClass.settings._cssCustom = '';
        }
        firstClass.settings._cssCustom = `:root {\n  ${rootStyles}\n}\n${firstClass.settings._cssCustom}`;
      } else {
        globalClasses.push({
          id: getUniqueId(),
          name: 'custom-css',
          settings: {
            _cssCustom: `:root {\n  ${rootStyles}\n}`,
          },
        });
      }
    }

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