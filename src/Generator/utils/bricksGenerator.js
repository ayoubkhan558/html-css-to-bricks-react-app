import { converterService } from '../../services/converter';

/**
 * Creates a Bricks-compatible structure from HTML, CSS, and JavaScript
 * Now using the new ConverterService architecture
 * @param {string} html - The HTML content
 * @param {string} css - The CSS content
 * @param {string} js - The JavaScript content
 * @param {Object} options - Conversion options
 * @returns {Object} Bricks structure object
 */
const createBricksStructure = (html, css = '', js = '', options = {}) => {
  try {
    // Use the new ConverterService - it handles everything!
    const result = converterService.convert(html, css, js, {
      ...options,
      // Flatten context into options (new API doesn't need context wrapper)
      inlineStyleHandling: options.context?.inlineStyleHandling || options.inlineStyleHandling || 'class',
      showNodeClass: options.context?.showNodeClass || options.showNodeClass || false,
      mergeNonClassSelectors: options.context?.mergeNonClassSelectors || options.mergeNonClassSelectors || false,
      includeJs: options.includeJs !== false
    });

    return result;
  } catch (error) {
    console.error('Error creating Bricks structure:', error);
    throw error;
  }
};

export { createBricksStructure };

