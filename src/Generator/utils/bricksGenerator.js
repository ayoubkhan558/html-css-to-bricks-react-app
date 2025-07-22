import { convertHtmlToBricks } from './domToBricks';
import { processJavaScript } from './jsProcessor';

/**
 * Creates a Bricks-compatible structure from HTML, CSS, and JavaScript
 * @param {string} html - The HTML content
 * @param {string} css - The CSS content
 * @param {string} js - The JavaScript content
 * @returns {Object} Bricks structure object
 */
const createBricksStructure = (html, css = '', js = '', options = {}) => {
  try {
    // Convert the provided HTML & CSS into Bricks JSON using tag-based logic
    const result = convertHtmlToBricks(html, css, {
      ...options,
      context: {
        ...(options.context || {}),
        showNodeClass: options.context?.showNodeClass || false,
        inlineStyleHandling: options.context?.inlineStyleHandling || 'inline',
        cssTarget: options.context?.cssTarget || 'class'
      }
    });

    // Optionally process JavaScript additions
    if (js && js.trim()) {
      const rootElement = result.content.find((el) => el.parent === '0');
      const parentId = rootElement ? rootElement.id : '0';
      const jsElement = processJavaScript(js, parentId);

      if (jsElement) {
        result.content.push(jsElement);
        // attach as child of parent element
        const parentEl = result.content.find(el => el.id === parentId);
        if (parentEl && Array.isArray(parentEl.children)) {
          parentEl.children.push(jsElement.id);
        }
      }
    }

    // Ensure version is correct
    result.version = '2.0';

    return result;
  } catch (error) {
    console.error('Error creating Bricks structure:', error);
    throw error;
  }
};

export { createBricksStructure };
