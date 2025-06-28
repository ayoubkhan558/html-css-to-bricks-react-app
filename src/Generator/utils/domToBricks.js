import { getUniqueId } from './utils';
import { getBricksFieldType, processFormField, processFormElement } from "./elementProcessors/formProcessor"
import { buildCssMap, parseCssDeclarations } from './cssParser';

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
  if (tag === 'section' || tag === 'footer' || tag === 'header' || node.classList.contains('section')) {
    name = 'section';
    element.label = 'Section';
  } else if (tag === 'nav' || node.classList.contains('container')) {
    name = tag === 'nav' ? 'nav' : 'container';
    element.label = tag === 'nav' ? 'Navigation' : 'Container';
  } else if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
    name = 'heading';
    element.label = `Heading ${tag.replace('h', '')}`;
  } else if (['p', 'span', 'address', 'blockquote'].includes(tag)) {
    name = 'text-basic';
    element.label = tag === 'p' ? 'Paragraph' : tag === 'span' ? 'Inline Text' : tag === 'address' ? 'P Class' : 'Rich Text';
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
  }

  element.name = name;

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

  // **KEY FIX**: Handle nested text elements properly
  // **KEY FIX**: Handle nested text elements properly
  if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
    // Check if this element contains formatting tags
    const formattingTags = ['strong', 'b', 'em', 'i', 'code', 'mark', 'cite', 'u', 's', 'del', 'ins', 'sup', 'sub', 'small', 'abbr', 'q'];
    const hasFormatting = Array.from(node.querySelectorAll('*')).some(child =>
      formattingTags.includes(child.tagName.toLowerCase())
    );

    if (hasFormatting) {
      // Use rich text element for formatted content
      name = 'text';
      element.name = 'text';
      element.label = 'Rich Text';
      element.settings.text = node.innerHTML; // Use innerHTML to preserve formatting
      element.settings.tag = tag;
      // Don't process children since we're using innerHTML
      allElements.push(element);
      return element;
    }

    // Check if this element has a single child element that should be merged
    const childElements = Array.from(node.children);
    if (childElements.length === 1 && ['address', 'span', 'em', 'strong', 'code'].includes(childElements[0].tagName.toLowerCase())) {
      // Merge the child's content into this element with the child's tag
      const childTag = childElements[0].tagName.toLowerCase();
      element.settings.text = childElements[0].textContent.trim();
      element.settings.tag = childTag;
      element.label = "P Class";
      return element;
    } else {
      // Normal text processing for plain text
      const textContent = node.textContent.trim();
      if (textContent) {
        element.settings.text = textContent;
        element.settings.tag = tag;
      }
    }
  } else if (tag === 'blockquote') {
    const textContent = node.textContent.trim();
    if (textContent) {
      element.settings.text = textContent;
      element.settings.tag = 'custom';
      element.settings.customTag = 'blockquote';
    }
  } else if (['button', 'address', 'span', 'a'].includes(tag)) {
    const textContent = node.textContent.trim();
    if (textContent) {
      element.settings.text = textContent;
      element.settings.tag = tag;
    }
  } else if (tag === 'img') {
    element.settings.src = node.getAttribute('src') || '';
    element.settings.alt = node.getAttribute('alt') || '';
    element.settings.image = {
      url: node.getAttribute('src') || '',
      external: true,
      filename: (node.getAttribute('src') || 'image.jpg').split('/').pop()
    };
  } else if (tag === 'svg') {
    element.settings.source = 'code';
    element.settings.code = node.outerHTML;
  } else {
    // Process children for container elements
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

  if (node.closest('form') && ['input', 'select', 'textarea', 'button', 'label'].includes(tag)) {
    return null;
  }

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