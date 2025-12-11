/**
 * Bricks Utilities
 * Element factory and ID generation utilities
 */

import { getTagLabel } from '@config/elementMappings';
import { sanitizeClassName } from './helpers';

// Counter for unique IDs
let idCounter = 0;

/**
 * Generates a unique ID for Bricks elements
 * @returns {string} Unique ID in format 'abc123'
 */
export function generateId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    idCounter++;
    return `${timestamp}${random}${idCounter.toString(36)}`;
}

/**
 * Gets element label based on context and classes
 * @param {Node} node - DOM node
 * @param {string} tag - HTML tag name
 * @param {Object} context - Context with settings
 * @returns {string} Label
 */
export function getElementLabel(node, tag, context = {}) {
    // Use first class if showNodeClass is enabled
    if (context.showNodeClass && node.classList?.length > 0) {
        return node.classList[0];
    }

    // Fall back to tag label
    return getTagLabel(tag);
}

// Re-export sanitizeClassName for convenience
export { sanitizeClassName };
