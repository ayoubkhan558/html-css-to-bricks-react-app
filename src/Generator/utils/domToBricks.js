import { getUniqueId } from './utils';
import { getBricksFieldType, processFormField, processFormElement } from "./elementProcessors/formProcessor"
import { buildCssMap, parseCssDeclarations } from './cssParser';
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
import { processBlockquoteElement } from './elementProcessors/blockquoteProcessor';
import { processStructureLayoutElement } from './elementProcessors/structureLayoutProcessor';

/**
 * Processes a DOM node and converts it to a Bricks element
 */
const domNodeToBricks = (node, cssRulesMap = {}, parentId = '0', globalClasses = [], allElements = []) => {
  // Handle text nodes
  if (node.nodeType !== Node.ELEMENT_NODE) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      const parentEl = node.parentElement;
      if (parentEl) {
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

  // -------------------------------------------------------------------
  // Skip empty placeholder elements automatically injected by the HTML
  // parser when the source markup is invalid (e.g. a <p> that ends up
  // empty because the browser closed it before a disallowed child like
  // <address>). These empty nodes generate redundant Bricks elements and
  // should be ignored completely.
  // -------------------------------------------------------------------
  if (['p', 'span', 'div'].includes(tag) && node.textContent.trim() === '' && node.children.length === 0) {
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

  // Determine element type
  if (processStructureLayoutElement(node, element, tag)) {
    return element;
  }

  // Generic div handling
  if (tag === 'div') {
    name = 'div';
    element.label = 'Div';
    element.settings.tag = 'custom';
    element.settings.customTag = tag;
  }

  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
    processHeadingElement(node, element, tag);
  } else if (['time', 'mark', 'span', 'address', 'p'].includes(tag)) {
    // Unified text element handler
    const textContent = node.textContent.trim();

    // Handle formatted paragraphs
    if (tag === 'p') {
      const formattingTags = ['strong', 'b', 'em', 'i', 'code', 'mark', 'cite', 'u', 's', 'del', 'ins', 'sup', 'sub', 'small', 'abbr', 'q'];
      const hasFormatting = Array.from(node.querySelectorAll('*')).some(child =>
        formattingTags.includes(child.tagName.toLowerCase())
      );

      if (hasFormatting) {
        element.name = 'text';
        element.label = 'Rich Text';
        element.settings.text = node.innerHTML;
        element.settings.tag = tag;
        allElements.push(element);
        return element;
      }

      // Handle single child merging
      const childElements = Array.from(node.children);
      if (childElements.length === 1 && ['address', 'span', 'em', 'strong', 'code'].includes(childElements[0].tagName.toLowerCase())) {
        const childTag = childElements[0].tagName.toLowerCase();
        element.settings.text = childElements[0].textContent.trim();
        element.settings.tag = childTag;
        element.name = 'text-basic';
        element.label = 'Paragraph';
        return element;
      }
    }

    // Set common text properties
    if (textContent) {
      element.settings.text = textContent;
      element.name = tag === 'p' ? 'text-basic' : 'text-basic';
      element.label = tag === 'p' ? 'Paragraph' :
        tag === 'span' ? 'Inline Text' :
          tag === 'address' ? 'P Class' :
            tag === 'time' ? 'Time' : 'Mark';

      // Handle special cases
      if (['time', 'mark'].includes(tag)) {
        element.settings.tag = 'custom';
        element.settings.customTag = tag;
      } else if (tag === 'span' || tag === 'address') {
        element.settings.tag = tag;
      } else if (tag === 'p') {
        element.settings.tag = tag;
      }
    }
  } else if (tag === 'img') {
    processImageElement(node, element);
  } else if (tag === 'a') {
    processLinkElement(node, element);
  } else if (tag === 'button') {
    processButtonElement(node, element);
  } else if (tag === 'svg') {
    processSvgElement(node, element);
  } else if (tag === 'form') {
    name = 'form';
    element.label = 'Form';
    const formElement = processFormElement(node);
    formElement.id = elementId;
    formElement.parent = parentId;
    Object.assign(element, formElement);
  } else if (['ul', 'ol', 'li'].includes(tag)) {
    processListElement(node, element, tag);
  } else if (tag === 'audio') {
    processAudioElement(node, element);
  } else if (tag === 'video') {
    processVideoElement(node, element);
  } else if (tag === 'blockquote') {
    processBlockquoteElement(node, element);
  } else if (['canvas', 'details', 'summary', 'dialog', 'meter', 'progress'].includes(tag)) {
    processMiscElement(node, element, tag);
  } else if (['ul', 'ol', 'li'].includes(tag)) {
    const processedElement = processListElement(node, element, tag);
    if (processedElement && processedElement.name === 'text') {
      // For simple lists, return early (like tables do)
      allElements.push(processedElement);
      return processedElement;
    }
    // For complex lists, continue with normal processing (just like tables)
  }
  // Process children (remove ul, ol from exclusion list)
  if (!['table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td'].includes(tag)) {
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
  }
  // Process children for non-list elements
  if (!['ul', 'ol'].includes(tag)) {

  }

  if (node.closest('form') && ['input', 'select', 'textarea', 'button', 'label'].includes(tag)) {
    return null;
  }

  // Handle CSS classes and generate primary class name
  const attrClassNames = node.classList ? Array.from(node.classList) : [];
  // Generate class name in format [tag][randomID][classAppend]
  const randomId = Math.random().toString(36).substring(2, 6); // 4-char random ID
  const primaryClassName = attrClassNames.length > 0 ? attrClassNames[0] : `${tag}-tag-${randomId}-class`;

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


  // Handle CSS classes
  if (node.classList && node.classList.length > 0) {
    const classNames = Array.from(node.classList);
    const cssGlobalClasses = [];

    classNames.forEach(cls => {
      let existingClass = globalClasses.find(c => c.name === cls);
      if (!existingClass) {
        const classId = getUniqueId();
        let targetClass = {
          id: classId,
          name: cls,
          settings: {}
        };

        if (cssRulesMap[cls]) {
          const baseStyles = parseCssDeclarations(cssRulesMap[cls], cls);
          Object.assign(targetClass.settings, baseStyles);
        }

        globalClasses.push(targetClass);
        cssGlobalClasses.push(classId);
      } else {
        cssGlobalClasses.push(existingClass.id);
      }
    });

    if (cssGlobalClasses.length > 0) {
      element.settings._cssGlobalClasses = cssGlobalClasses;
    }
  }

  // Handle attributes
  const handleAttributes = (node, element) => {
    const elementSpecificAttrs = ['id', 'class', 'style', 'href', 'src', 'alt', 'title', 'type', 'name', 'value', 'placeholder', 'required', 'disabled', 'checked', 'selected', 'multiple', 'rows', 'cols'];
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

  handleAttributes(node, element);

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

    // Build CSS map
    const cssMap = {};
    const rawCssMap = buildCssMap(css);
    Object.entries(rawCssMap).forEach(([key, value]) => {
      const cleanKey = key.replace(/^[.\s]+/, '');
      cssMap[cleanKey] = value;
    });

    const content = [];
    const globalClasses = [];
    const allElements = [];

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