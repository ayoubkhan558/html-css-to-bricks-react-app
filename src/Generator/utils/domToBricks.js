import { getUniqueId } from './utils';
import { buildCssMap, parseCssDeclarations } from './cssParser';

// Map HTML input types to Bricks form field types
const getBricksFieldType = (node) => {
  const type = (node.getAttribute('type') || 'text').toLowerCase();
  const tagName = node.tagName.toLowerCase();

  if (tagName === 'textarea') return 'textarea';
  if (tagName === 'select') return 'select';

  switch (type) {
    case 'email': return 'email';
    case 'password': return 'password';
    case 'file': return 'file';
    case 'checkbox': return 'checkbox';
    case 'submit': return 'submit';
    default: return 'text';
  }
};

// Process form field attributes
const processFormField = (form, node) => {
  const tagName = node.tagName.toLowerCase();
  if (!['input', 'select', 'textarea', 'button'].includes(tagName)) return null;

  const type = node.getAttribute('type')?.toLowerCase() || 'text';

  // Skip hidden and submit buttons (handled separately)
  if (type === 'hidden' || (tagName === 'button' && type === 'submit')) {
    return null;
  }

  const field = {
    type: getBricksFieldType(node),
    id: getUniqueId().substring(0, 6),
    name: node.getAttribute('name') || '',
    label: '',
    placeholder: node.getAttribute('placeholder') || '',
    required: node.hasAttribute('required'),
    value: node.getAttribute('value') || ''
  };

  // Handle labels
  if (node.id) {
    const label = form.querySelector(`label[for="${node.id}"]`);
    if (label) {
      field.label = label.textContent.replace('*', '').replace(':', '').trim();
    }
  }

  // Handle specific field types
  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
      if (node.hasAttribute('minlength')) field.minLength = node.getAttribute('minlength');
      if (node.hasAttribute('maxlength')) field.maxLength = node.getAttribute('maxlength');
      break;

    case 'file':
      field.fileUploadLimit = '1';
      field.fileUploadSize = '1';
      if (node.hasAttribute('accept')) {
        field.fileUploadAllowedTypes = node.getAttribute('accept');
      }
      break;

    case 'checkbox':
      // For checkboxes, use the label text as the option
      field.label = field.label || (node.nextSibling?.nodeValue?.trim() || '');
      field.options = field.label;
      if (!field.placeholder) {
        field.placeholder = field.label || field.name;
      }
      break;

    case 'select':
      field.options = Array.from(node.querySelectorAll('option'))
        .map(opt => opt.textContent.trim())
        .join('\n');
      field.valueLabelOptions = true;
      break;
  }

  return field;
};

const processFormElement = (formNode) => {
  const formElement = {
    id: getUniqueId().substring(0, 6),
    name: 'form',
    parent: 0,
    children: [],
    settings: {
      fields: [],
      submitButtonStyle: 'primary',
      actions: ['email'],
      successMessage: 'Message successfully sent. We will get back to you as soon as possible.',
      emailSubject: 'Contact form request',
      emailTo: 'admin_email',
      fromName: 'bricks',
      emailErrorMessage: 'Submission failed. Please reload the page and try to submit the form again.',
      htmlEmail: true,
      mailchimpPendingMessage: 'Please check your email to confirm your subscription.',
      mailchimpErrorMessage: 'Sorry, but we could not subscribe you.',
      sendgridErrorMessage: 'Sorry, but we could not subscribe you.',
      showLabels: true,
      submitButtonText: 'Submit'
    }
  };

  // Process all form fields
  const fieldElements = Array.from(formNode.querySelectorAll('input, select, textarea, button'));

  fieldElements.forEach(fieldEl => {
    const field = processFormField(formNode, fieldEl);
    if (field) {
      if (field.type === 'submit') {
        formElement.settings.submitButtonText = fieldEl.textContent.trim() || 'Submit';
      } else {
        formElement.settings.fields.push(field);
      }
    }
  });

  // Add form attributes
  const formAttrs = ['action', 'method', 'enctype', 'autocomplete', 'novalidate', 'target'];
  formAttrs.forEach(attr => {
    if (formNode.hasAttribute(attr)) {
      formElement.settings[attr] = formNode.getAttribute(attr);
    }
  });

  return formElement;
};

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
    name = 'heading';
    element.label = `Heading ${tag.replace('h', '')}`;
  } else if (['time', 'mark'].includes(tag)) {
    name = 'text-basic';
    element.settings.tag = 'custom';
    element.settings.customTag = tag;
    element.label = tag === 'time' ? 'Time' : 'Mark';
  } else if (['p', 'span', 'address'].includes(tag)) {
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
    const formElement = processFormElement(node);
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
    name = 'video';
    element.label = 'Video';
    const videoSrc = node.querySelector('source')?.getAttribute('src') || node.getAttribute('src') || '';
    const posterSrc = node.getAttribute('poster') || '';

    element.settings = {
      videoType: 'file',
      youTubeId: '',
      youtubeControls: true,
      vimeoByline: true,
      vimeoTitle: true,
      vimeoPortrait: true,
      fileControls: node.hasAttribute('controls'),
      fileUrl: videoSrc,
      fileAutoplay: node.hasAttribute('autoplay'),
      fileLoop: node.hasAttribute('loop'),
      fileMute: node.hasAttribute('muted'),
      fileInline: node.hasAttribute('playsinline'),
      filePreload: node.getAttribute('preload') || 'auto',
      ...(posterSrc && {
        videoPoster: {
          url: posterSrc,
          external: true,
          filename: posterSrc.split('/').pop() || 'poster.jpg'
        }
      })
    };

    // Handle width/height as inline styles
    if (node.hasAttribute('width') || node.hasAttribute('height')) {
      element.settings.style = [
        node.getAttribute('width') ? `width: ${node.getAttribute('width')}px` : '',
        node.getAttribute('height') ? `height: ${node.getAttribute('height')}px` : ''
      ].filter(Boolean).join('; ');
    }
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

  // Handle lists (ul/ol)
  if (['ul', 'ol'].includes(tag)) {
    const listItems = Array.from(node.children).filter(child => child.tagName.toLowerCase() === 'li');
    const hasComplexContent = listItems.some(li =>
      Array.from(li.childNodes).some(n =>
        n.nodeType === Node.ELEMENT_NODE && n.tagName.toLowerCase() !== 'br'
      )
    );

    if (!hasComplexContent) {
      // Text-only list: convert to rich text
      element.name = 'text';
      element.label = 'List';
      element.settings.tag = tag;
      element.settings.text = node.innerHTML.trim();
    } else {
      // Complex list: convert to div with nested divs for li
      element.name = 'div';
      element.label = 'List';
      element.settings.tag = tag;

      listItems.forEach((li, index) => {
        const liId = getUniqueId();
        const liElement = {
          id: liId,
          name: 'div',
          parent: elementId,
          children: [],
          settings: { tag: 'li' }
        };

        // Process li children
        Array.from(li.childNodes).forEach(child => {
          if (child.nodeType === Node.ELEMENT_NODE) {
            const childElement = domNodeToBricks(child, cssRulesMap, liId, globalClasses, allElements);
            if (childElement) {
              liElement.children.push(childElement.id);
            }
          } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
            const textElement = {
              id: getUniqueId(),
              name: 'text-basic',
              parent: liId,
              children: [],
              settings: {
                text: child.textContent.trim(),
                tag: 'span'
              }
            };
            allElements.push(textElement);
            liElement.children.push(textElement.id);
          }
        });

        allElements.push(liElement);
        element.children.push(liId);
      });
    }
  }

  // Process children for non-list elements
  if (!['ul', 'ol'].includes(tag)) {
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

  // Handle attributes
  const handleAttributes = (node, element) => {
    const elementSpecificAttrs = ['id', 'class', 'style', 'href', 'src', 'alt', 'title', 'type', 'name', 'value', 'placeholder', 'required', 'disabled', 'checked', 'selected', 'multiple', 'rows', 'cols', 'controls', 'autoplay', 'loop', 'muted', 'playsinline', 'preload', 'poster'];
    const customAttributes = [];

    // Special handling for links
    if (tag === 'a' && node.hasAttribute('href')) {
      element.settings.link = {
        type: 'external',
        url: node.getAttribute('href') || '',
        noFollow: node.getAttribute('rel')?.includes('nofollow') || false,
        openInNewWindow: node.getAttribute('target') === '_blank',
        noReferrer: node.getAttribute('rel')?.includes('noreferrer') || false
      };
    }

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

  handleAttributes(node, element);

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

  // Handle specific element content
  if (['button', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'address', 'span', 'a'].includes(tag)) {
    const hasDirectText = Array.from(node.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
    if (hasDirectText) {
      element.settings.text = node.textContent.trim();
    }
  } else if (tag === 'img') {
    element.settings.src = node.getAttribute('src') || '';
    element.settings.alt = node.getAttribute('alt') || '';
    element.settings.image = {
      url: node.getAttribute('src') || '',
      external: true,
      filename: (node.getAttribute('src') || 'image.jpg').split('/').pop()
    };
    element.settings._attributes = [{
      id: getUniqueId(),
      name: 'loading',
      value: 'lazy'
    }];
  } else if (tag === 'svg') {
    element.settings.source = 'code';
    element.settings.code = node.outerHTML;
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
