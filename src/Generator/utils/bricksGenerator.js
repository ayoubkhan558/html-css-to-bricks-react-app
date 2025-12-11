/**
 * Bricks Generator
 * createBricksStructure() - Main entry point for HTML-to-Bricks conversion
 */

import { converterService } from '@services/converter';

/**
 * Creates a Bricks structure from HTML, CSS, and JavaScript
 * @param {string} html - HTML content
 * @param {string} css - CSS content
 * @param {string} js - JavaScript content
 * @param {Object} options - Conversion options
 * @returns {Object} Bricks structure (content, globalClasses, etc.)
 */
export function createBricksStructure(html, css = '', js = '', options = {}) {
  // Flatten options if they have a 'context' wrapper (for backward compatibility)
  const flatOptions = options.context ? {
    ...options.context,
    ...options  // Merge top-level options too
  } : options;

  // Use the new converter service
  return converterService.convert(html, css, js, flatOptions);
}
