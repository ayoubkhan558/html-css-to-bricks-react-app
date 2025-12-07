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
import { getElementLabel } from './elementProcessors/labelUtils';
import { processTextElement } from './elementProcessors/textElementProcessor';
import { processAttributes } from './processors/attributeProcessor';
import { processAlertElement } from './elementProcessors/alertProcessor';
import { processNavElement } from './elementProcessors/navProcessor';

// Context values will be passed as parameters to the functions
/**
 * Converts inline styles to a CSS class
 * @param {string} styleString - The inline style string (e.g., 'color: red; font-size: 16px;')
 * @returns {Object} - Object containing className and CSS rules
 */
const convertStylesToClass = (styleString) => {
  if (!styleString) return { className: '', css: '' };

  // Generate a unique class name
  const className = `bricks-style-${Math.random().toString(36).substr(2, 8)}`;

  // Convert style string to CSS rules
  const rules = styleString
    .split(';')
    .filter(rule => rule.trim() !== '')
    .map(rule => {
      const [property, value] = rule.split(':').map(part => part.trim());
      return property && value ? `${property}: ${value};` : '';
    })
    .filter(Boolean)
    .join('\n  ');

  const css = `.${className} {\n  ${rules}\n}`;

  return { className, css };
};

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

  // Check for exact matches only
  return ALERT_CLASS_PATTERNS.some(pattern =>
    classes.includes(pattern)
  );
};

// Helper function to check if element has container/layout classes
const hasContainerClasses = (node) => {
  if (!node.classList || node.classList.length === 0) return false;

  const containerClasses = ['container', 'boxed', 'wrapper', 'content'];
  return containerClasses.some(cls => node.classList.contains(cls));
};

const handleInlineStyles = (node, element, globalClasses, variables = {}, options = {}) => {

  const styleAttr = node.getAttribute('style');
  console.log('111 Inline styles for element:', options?.context?.inlineStyleHandling);
  if (!styleAttr || !styleAttr.trim()) return;

  switch (options?.context?.inlineStyleHandling) {
    case 'skip':
      // Do nothing - skip the inline styles completely
      console.log('Skipping inline styles for element:', element.id);
      // Remove the style attribute
      node.removeAttribute('style');
      break;

    case 'inline':
      // This case is now handled in processAttributes
      console.log('Inline styles handled in processAttributes for element:', element.id);
      // Remove the style attribute since processAttributes already added it
      node.removeAttribute('style');
      break;

    case 'class':
      // Find the first global class for this element
      let targetClass = null;
      if (element.settings._cssGlobalClasses && element.settings._cssGlobalClasses.length > 0) {
        const firstClassId = element.settings._cssGlobalClasses[0];
        targetClass = globalClasses.find(c => c.id === firstClassId);
      }

      // Convert inline styles to a class and merge with existing settings
      console.log('Converting inline styles to class for element:', element.id, styleAttr, targetClass?.name, variables);

      if (targetClass) {
        // Parse the inline styles
        const parsedInlineStyles = parseCssDeclarations(styleAttr, targetClass.name, variables);

        // Ensure _typography exists in the target class
        if (!targetClass.settings._typography) {
          targetClass.settings._typography = {};
        }

        // Deep merge the inline styles with existing styles
        if (parsedInlineStyles._typography) {
          targetClass.settings._typography = {
            ...targetClass.settings._typography, // Keep existing typography
            ...parsedInlineStyles._typography,   // Apply inline styles on top
          };
        }

        // Merge any other settings (like _cssCustom, etc.)
        Object.entries(parsedInlineStyles).forEach(([key, value]) => {
          if (key !== '_typography') {
            if (targetClass.settings[key] && typeof targetClass.settings[key] === 'object' && !Array.isArray(targetClass.settings[key])) {
              // Merge objects
              targetClass.settings[key] = {
                ...targetClass.settings[key],
                ...value
              };
            } else {
              // Overwrite primitives and arrays
              targetClass.settings[key] = value;
            }
          }
        });
      } else {
        // No class exists - add inline styles as custom CSS
        console.log('No target class found, adding inline styles as custom CSS');

        // Parse inline styles and convert to custom CSS
        const styleDeclarations = styleAttr.split(';').filter(s => s.trim());
        const formattedStyles = styleDeclarations.map(s => s.trim()).join(';\n  ');

        // Add to element's custom CSS or settings
        if (!element.settings._cssCustom) {
          element.settings._cssCustom = '';
        }

        // Use element ID or tag as selector
        const selector = element.settings._cssId ? `#${element.settings._cssId}` : `%element%`;
        // Escape dots in selectors to prevent malformed CSS
        const escapedSelector = selector.replace(/\./g, '\\.');
        element.settings._cssCustom += `\n${escapedSelector} {\n  ${formattedStyles};\n}`;
      }

      // Remove the style attribute since we've processed it
      node.removeAttribute('style');
      break;

    default:
      console.warn('Unknown inlineStyleHandling value:', options?.context?.inlineStyleHandling);
      break;
  }
};

/**
 * Processes a DOM node and converts it to a Bricks element
 */
const domNodeToBricks = (node, cssRulesMap = {}, parentId = '0', globalClasses = [], allElements = [], variables = {}, options = {}) => {
  // Get context values from options with defaults
  const {
    inlineStyleHandling = 'inline',
    showNodeClass = false
  } = options.context || {};
  // Debug logs
  console.log('Context in domNodeToBricks:', { showNodeClass, inlineStyleHandling });
  // Handle text nodes
  if (node.nodeType !== Node.ELEMENT_NODE) {
    // Skip text nodes that are inside a form element (labels, button text, etc.)
    // or inside a heading element
    if ((node.parentElement && node.parentElement.closest &&
      (node.parentElement.closest('form') ||
        node.parentElement.matches('h1, h2, h3, h4, h5, h6'))) ||
      !node.textContent.trim()) {
      return null;
    }

    if (node.nodeType === Node.TEXT_NODE) {
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

  // Include all divs in the output, even empty ones
  // We'll handle empty divs by setting appropriate defaults

  let name = 'div';
  const elementId = getUniqueId();
  const element = {
    id: elementId,
    name,
    parent: parentId,
    children: [],
    settings: {}
  };

  // Check if this is a standalone inline element that should be converted to text-basic
  const isStandaloneInline = ['strong', 'em', 'small', 'blockquote'].includes(tag) &&
    node.parentElement &&
    !['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th', 'div', 'section', 'article', 'aside', 'header', 'footer', 'nav'].includes(node.parentElement.tagName.toLowerCase());

  if (isStandaloneInline) {
    const textElement = {
      id: getUniqueId(),
      name: 'text-basic',
      parent: parentId,
      children: [],
      settings: {
        text: node.textContent.trim(),
        tag: 'custom',
        customTag: tag
      }
    };

    allElements.push(textElement);
    return textElement;
  }

  // Check for alert elements first (higher priority)
  if (tag === 'div' && hasAlertClasses(node)) {
    return processAlertElement(node, options.context || {});
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
    return processNavElement(node, options.context || {});
  }
  // Structure/layout elements
  else if (tag === 'section' ||
    node.classList.contains('container') ||
    node.classList.contains('row') ||
    node.classList.contains('col-') ||
    node.classList.contains('section') ||
    (tag === 'div' && hasContainerClasses(node))) {
    processStructureLayoutElement(node, element, tag, options.context || {});
  }
  else if (tag === 'div') {
    // Process as generic div if no special classes are present
    element.name = 'div';
    element.label = getElementLabel(node, 'Div', options.context || {});
    element.settings.tag = 'div';
  }
  else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
    processHeadingElement(node, element, tag, options.context || {});
  }
  else if (['time', 'mark', 'span', 'address', 'p', 'blockquote'].includes(tag)) {
    processTextElement(node, element, tag, allElements, options.context || {});
  }
  else if (['a'].includes(tag)) {
    // Check if anchor contains only text nodes
    const hasOnlyText = Array.from(node.childNodes).every(n => n.nodeType === Node.TEXT_NODE);
    if (hasOnlyText) {
      processLinkElement(node, element, tag, options.context || {});
    } else {
      // Use div brick with link settings
      element.name = 'div';
      element.settings.tag = 'a';
      // Set link settings (external or internal)
      element.settings.link = {
        type: node.getAttribute('href') && node.getAttribute('href').startsWith('/') ? 'external' : 'internal',
        url: node.getAttribute('href') || ''
      };
      // Process and nest children
      Array.from(node.childNodes).forEach(childNode => {
        const childElement = domNodeToBricks(childNode, cssRulesMap, elementId, globalClasses, allElements, variables, options);
        if (childElement) {
          if (Array.isArray(childElement)) {
            childElement.forEach(c => {
              element.children.push(c.id);
              if (!allElements.some(e => e.id === c.id)) allElements.push(c);
            });
          } else {
            element.children.push(childElement.id);
            if (!allElements.some(e => e.id === childElement.id)) allElements.push(childElement);
          }
        }
      });

      // Mark that children have been processed to avoid double processing
      element._skipChildren = true;
    }
  }
  else if (tag === 'img') {
    processImageElement(node, element, tag, options.context || {});
  }
  else if (tag === 'button') {
    processButtonElement(node, element, tag, options.context || {});
  }
  else if (tag === 'svg') {
    processSvgElement(node, element, tag, options.context || {});
    element._skipChildren = true; // SVG children are already included in outerHTML
  }
  else if (tag === 'form') {
    const formElement = processFormElement(node, options.context || {});
    formElement.id = elementId;
    formElement.parent = parentId;
    Object.assign(element, formElement);
    // Mark that children have been processed to avoid double processing
    element._skipChildren = true;
  }
  else if (['table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td'].includes(tag)) {
    const processedElement = processTableElement(node, element, tag, options.context || {});
    // Note: Don't return early for td/th here - let CSS processing happen first
  }
  else if (['ul', 'ol', 'li'].includes(tag)) {
    const processedElement = processListElement(node, element, tag, options.context || {});
    // Note: Don't return early here - let CSS processing happen first
  }
  else if (tag === 'audio') {
    processAudioElement(node, element, tag, options.context || {});
  }
  else if (tag === 'video') {
    processVideoElement(node, element, tag, options.context || {});
  }
  else if (['canvas', 'details', 'summary', 'dialog', 'meter', 'progress', 'script'].includes(tag)) {
    processMiscElement(node, element, tag, options.context || {});
  }

  // Process children (only skip td/th to avoid duplication, allow other table elements to process children)
  // Skip traversing children for table cells, forms, and elements that handle their own text content
  if (!['td', 'th', 'form'].includes(tag) && !element._skipTextNodes && !element._skipChildren) {
    Array.from(node.childNodes).forEach(childNode => {
      // Skip empty text nodes and text nodes when the parent handles its own text content
      if (childNode.nodeType === Node.TEXT_NODE && (!childNode.textContent.trim() || element._skipTextNodes)) {
        return;
      }
      // Skip processing text nodes for elements that handle their own text content
      if (element._skipTextNodes && childNode.nodeType === Node.TEXT_NODE) {
        return;
      }
      const childElement = domNodeToBricks(childNode, cssRulesMap, elementId, globalClasses, allElements, variables, options);
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
  const matchResult = matchCSSSelectors(node, cssRulesMap);
  const combinedProperties = matchResult.properties || matchResult; // Handle both old and new format
  const pseudoSelectors = matchResult.pseudoSelectors || [];
  const { cssSelectorTarget = 'class' } = options;

  if (cssSelectorTarget === 'id') {
    // Apply styles directly to the element's ID
    if (Object.keys(combinedProperties).length > 0) {
      const parsedSettings = parseCssDeclarations(combinedProperties, `#brx-${element.id}`, variables);
      Object.assign(element.settings, parsedSettings);
    }

    // Handle pseudo-elements for ID
    if (pseudoSelectors.length > 0) {
      let customCss = '';
      pseudoSelectors.forEach(({ selector, properties }) => {
        // Check if this is a pseudo-class selector
        const pseudoClassMatch = selector.match(/:(\w+)$/);
        if (pseudoClassMatch) {
          // Extract pseudo-class and base selector
          const pseudoClass = pseudoClassMatch[1];
          const baseSelector = selector.substring(0, selector.lastIndexOf(':'));

          // Check if the base selector matches our element
          if (baseSelector === `#${node.id}` || baseSelector === tag ||
            (baseSelector.startsWith('.') && node.classList.contains(baseSelector.substring(1)))) {
            // Parse the pseudo-class styles
            const pseudoStyles = parseCssDeclarations(properties, selector, variables);
            Object.entries(pseudoStyles).forEach(([prop, value]) => {
              element.settings[`${prop}:${pseudoClass}`] = value;
            });
          } else {
            // Add as custom CSS if it doesn't match
            const propsFormatted = properties.split(';').filter(p => p.trim()).join(';\n  ');
            // Escape dots in selectors to prevent malformed CSS
            const escapedSelector = selector.replace(/\./g, '\\.');
            customCss += `${escapedSelector} {\n  ${propsFormatted};\n}\n`;
          }
        } else {
          // Handle as regular custom CSS
          const propsFormatted = properties.split(';').filter(p => p.trim()).join(';\n  ');
          // Escape dots in selectors to prevent malformed CSS
          const escapedSelector = selector.replace(/\./g, '\\.');
          customCss += `${escapedSelector} {\n  ${propsFormatted};\n}\n`;
        }
      });
      if (customCss) {
        element.settings._cssCustom = (element.settings._cssCustom || '') + customCss;
      }
    }

    // Handle pseudo-classes for ID
    Object.keys(cssRulesMap).forEach(selector => {
      const pseudoMatch = selector.match(new RegExp(`^#${node.id}:(\w+)`));
      if (pseudoMatch) {
        const pseudoClass = pseudoMatch[1];
        const pseudoStyles = parseCssDeclarations(cssRulesMap[selector], `#brx-${element.id}`, variables);
        Object.entries(pseudoStyles).forEach(([prop, value]) => {
          element.settings[`${prop}:${pseudoClass}`] = value;
        });
      }

      // Handle pseudo-classes for tag selectors
      const tagPseudoMatch = selector.match(new RegExp(`^${tag}:(\w+)`));
      if (tagPseudoMatch) {
        const pseudoClass = tagPseudoMatch[1];
        const pseudoStyles = parseCssDeclarations(cssRulesMap[selector], tag, variables);
        Object.entries(pseudoStyles).forEach(([prop, value]) => {
          element.settings[`${prop}:${pseudoClass}`] = value;
        });
      }
    });
  } else {
    // Apply styles via global classes (existing logic)
    const existingClasses = node.classList && node.classList.length > 0 ? Array.from(node.classList) : [];
    const randomId = Math.random().toString(36).substring(2, 6);
    const generatedClass = existingClasses.length === 0 ? `${tag}-tag-${randomId}-class` : null;
    const classNames = generatedClass ? [generatedClass, ...existingClasses] : existingClasses;
    const cssGlobalClasses = [];

    classNames.forEach((cls, index) => {
      let targetClass = globalClasses.find(c => c.name === cls);
      if (!targetClass) {
        targetClass = { id: getUniqueId(), name: cls, settings: {} };
        globalClasses.push(targetClass);
      }

      if (index === 0 && Object.keys(combinedProperties).length > 0) {
        const parsedSettings = parseCssDeclarations(combinedProperties, cls, variables);
        Object.assign(targetClass.settings, parsedSettings);
      }

      // Handle pseudo-elements for this class
      if (index === 0 && pseudoSelectors.length > 0) {
        let customCss = '';
        pseudoSelectors.forEach(({ selector, properties }) => {
          // Check if this is a pseudo-class selector
          const pseudoClassMatch = selector.match(/:(\w+)$/);
          if (pseudoClassMatch) {
            // Extract pseudo-class and base selector
            const pseudoClass = pseudoClassMatch[1];
            const baseSelector = selector.substring(0, selector.lastIndexOf(':'));

            // Check if the base selector matches our element
            if (baseSelector === `#${node.id}` || baseSelector === tag ||
              (baseSelector.startsWith('.') && node.classList.contains(baseSelector.substring(1)))) {
              // Parse the pseudo-class styles
              const pseudoStyles = parseCssDeclarations(properties, selector, variables);
              Object.entries(pseudoStyles).forEach(([prop, value]) => {
                targetClass.settings[`${prop}:${pseudoClass}`] = value;
              });
            } else {
              // Add as custom CSS if it doesn't match
              const propsFormatted = properties.split(';').filter(p => p.trim()).join(';\n  ');
              // Escape dots in selectors to prevent malformed CSS
              const escapedSelector = selector.replace(/\./g, '\\.');
              customCss += `${escapedSelector} {\n  ${propsFormatted};\n}\n`;
            }
          } else {
            // Handle as regular custom CSS
            const propsFormatted = properties.split(';').filter(p => p.trim()).join(';\n  ');
            // Escape dots in selectors to prevent malformed CSS
            const escapedSelector = selector.replace(/\./g, '\\.');
            customCss += `${escapedSelector} {\n  ${propsFormatted};\n}\n`;
          }
        });
        if (customCss) {
          targetClass.settings._cssCustom = (targetClass.settings._cssCustom || '') + customCss;
        }
      }

      Object.keys(cssRulesMap).forEach(selector => {
        const pseudoMatch = selector.match(new RegExp(`^\.${cls}:(\w+)`));
        if (pseudoMatch) {
          const pseudoClass = pseudoMatch[1];
          const pseudoStyles = parseCssDeclarations(cssRulesMap[selector], cls, variables);
          Object.entries(pseudoStyles).forEach(([prop, value]) => {
            targetClass.settings[`${prop}:${pseudoClass}`] = value;
          });
        }

        // Handle pseudo-classes for tag selectors when processing the first (generated) class
        if (index === 0) {
          const tagPseudoMatch = selector.match(new RegExp(`^${tag}:(\w+)`));
          if (tagPseudoMatch) {
            const pseudoClass = tagPseudoMatch[1];
            const pseudoStyles = parseCssDeclarations(cssRulesMap[selector], tag, variables);
            Object.entries(pseudoStyles).forEach(([prop, value]) => {
              targetClass.settings[`${prop}:${pseudoClass}`] = value;
            });
          }
        }
      });

      if (!cssGlobalClasses.includes(targetClass.id)) {
        cssGlobalClasses.push(targetClass.id);
      }
    });

    if (cssGlobalClasses.length > 0) {
      element.settings._cssGlobalClasses = cssGlobalClasses;
    }
  }

  // Process element attributes with options before handling inline styles
  processAttributes(node, element, tag, options);

  // Pass the options to handleInlineStyles
  handleInlineStyles(node, element, globalClasses, variables, options);

  // Special handling for simple lists that were converted to text elements
  // They need to return early AFTER CSS processing
  if (['ul', 'ol'].includes(tag) && element.name === 'text') {
    allElements.push(element);
    return element;
  }

  // Special handling for table cells (td, th) - return AFTER CSS processing
  if (['td', 'th'].includes(tag)) {
    allElements.push(element);
    return element;
  }

  allElements.push(element);
  return element;
};

/**
 * Converts HTML and CSS to Bricks structure
 */
const convertHtmlToBricks = (html, css, options) => {
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

    const { cssMap, variables, rootStyles, keyframes } = buildCssMap(css);

    const content = [];
    const globalClasses = [];
    const allElements = [];

    const processNodes = nodeList => {
      Array.from(nodeList).forEach(node => {
        const element = domNodeToBricks(
          node,
          cssMap,
          '0',
          globalClasses,
          allElements,
          variables,
          {
            ...options,
            context: {
              ...options.context, // Spread existing context first
              showNodeClass: options.context?.showNodeClass || false,
              inlineStyleHandling: options.context?.inlineStyleHandling || 'inline',
              activeTab: options.context?.activeTab || 'html'
            }
          }
        );
        if (element) {
          if (Array.isArray(element)) {
            content.push(...element);
          } else {
            content.push(element);
          }
        }
      });
    };

    processNodes(doc.body.childNodes);
    // Also process head nodes like <script> when body is empty
    if (content.length === 0) {
      processNodes(doc.head.childNodes);
    }

    allElements.forEach(el => {
      if (!content.some(c => c.id === el.id)) {
        content.push(el);
      }
    });

    if (rootStyles) {
      // Find the first top-level element's class (parent element)
      let targetClass = null;
      if (content.length > 0 && content[0].settings._cssGlobalClasses) {
        const firstElementClassId = content[0].settings._cssGlobalClasses[0];
        targetClass = globalClasses.find(c => c.id === firstElementClassId);
      }

      // If we found the first element's class, add root styles there
      // Otherwise fallback to first global class or create new one
      if (targetClass) {
        if (!targetClass.settings._cssCustom) {
          targetClass.settings._cssCustom = '';
        }
        targetClass.settings._cssCustom = `${rootStyles}\n${targetClass.settings._cssCustom}`.trim();
      } else if (globalClasses.length > 0) {
        const firstClass = globalClasses[0];
        if (!firstClass.settings._cssCustom) {
          firstClass.settings._cssCustom = '';
        }
        firstClass.settings._cssCustom = `${rootStyles}\n${firstClass.settings._cssCustom}`.trim();
      } else {
        globalClasses.push({
          id: getUniqueId(),
          name: 'custom-css',
          settings: {
            _cssCustom: rootStyles,
          },
        });
      }
    }

    // Handle @keyframes rules
    if (keyframes && keyframes.length > 0) {
      const keyframesCSS = keyframes.map(kf => kf.rule).join('\n\n');

      // Find the first top-level element's class to add keyframes
      let targetClass = null;
      if (content.length > 0 && content[0].settings._cssGlobalClasses) {
        const firstElementClassId = content[0].settings._cssGlobalClasses[0];
        targetClass = globalClasses.find(c => c.id === firstElementClassId);
      }

      // Add keyframes to the target class or first global class
      if (targetClass) {
        if (!targetClass.settings._cssCustom) {
          targetClass.settings._cssCustom = '';
        }
        targetClass.settings._cssCustom = `${targetClass.settings._cssCustom}\n\n${keyframesCSS}`.trim();
      } else if (globalClasses.length > 0) {
        const firstClass = globalClasses[0];
        if (!firstClass.settings._cssCustom) {
          firstClass.settings._cssCustom = '';
        }
        firstClass.settings._cssCustom = `${firstClass.settings._cssCustom}\n\n${keyframesCSS}`.trim();
      } else {
        // Create a new global class for keyframes if none exists
        globalClasses.push({
          id: getUniqueId(),
          name: 'animations',
          settings: {
            _cssCustom: keyframesCSS,
          },
        });
      }
    }

    return {
      content,
      source: 'bricksCopiedElements',
      sourceUrl: 'https://brickify.netlify.app',
      version: '2.0',
      globalClasses,
      globalElements: []
    };
  } catch (error) {
    console.error('Error converting HTML to Bricks:', error);
    throw error;
  }
};

export { domNodeToBricks, convertHtmlToBricks };