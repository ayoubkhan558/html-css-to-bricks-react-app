/**
 * Base Processor
 * Abstract base class for all element processors
 */

import { generateId } from '../lib/bricks/elementFactory';
import { getTagLabel } from '../config/elementMappings';

export class BaseProcessor {
    constructor() {
        if (new.target === BaseProcessor) {
            throw new Error('BaseProcessor is abstract and cannot be instantiated directly');
        }
    }

    /**
     * Processes a DOM node into a Bricks element
     * @param {Node} node - DOM node to process
     * @param {Object} context - Processing context
     * @returns {Object|Array} Bricks element(s)
     */
    process(node, context = {}) {
        throw new Error('process() must be implemented by subclass');
    }

    /**
     * Creates a base element structure
     * @param {Node} node - DOM node
     * @param {Object} context - Processing context
     * @returns {Object} Base element
     */
    createElement(node, context = {}) {
        const tag = node.tagName?.toLowerCase() || 'div';

        return {
            id: generateId(),
            name: 'div',
            label: this.getElementLabel(node, tag, context),
            parent: context.parentId || '0',
            children: [],
            settings: {
                tag
            }
        };
    }

    /**
     * Gets element label based on context
     * @param {Node} node - DOM node
     * @param {string} tag - HTML tag
     * @param {Object} context - Processing context
     * @returns {string} Element label
     */
    getElementLabel(node, tag, context = {}) {
        // Use first class if showNodeClass is enabled
        if (context.showNodeClass && node.classList?.length > 0) {
            return node.classList[0];
        }

        // Fall back to tag label
        return getTagLabel(tag);
    }

    /**
     * Gets text content from node
     * @param {Node} node - DOM node
     * @returns {string} Text content
     */
    getTextContent(node) {
        return node.textContent?.trim() || '';
    }

    /**
     * Checks if node has child elements
     * @param {Node} node - DOM node
     * @returns {boolean} True if has children
     */
    hasChildren(node) {
        return node.children && node.children.length > 0;
    }

    /**
     * Gets attribute value from node
     * @param {Node} node - DOM node
     * @param {string} attr - Attribute name
     * @param {*} defaultValue - Default value
     * @returns {*} Attribute value or default
     */
    getAttribute(node, attr, defaultValue = null) {
        return node.getAttribute(attr) || defaultValue;
    }

    /**
     * Checks if node has a specific class
     * @param {Node} node - DOM node
     * @param {string} className - Class name to check
     * @returns {boolean} True if has class
     */
    hasClass(node, className) {
        return node.classList?.contains(className) || false;
    }

    /**
     * Gets the processor name
     * @returns {string} Processor name
     */
    getName() {
        return this.constructor.name.replace('Processor', '');
    }

    /**
     * Determines if this processor can handle the given node
     * @param {Node} node - DOM node
     * @returns {boolean} True if can process
     */
    canProcess(node) {
        return true; // Default: can process any node
    }
}
