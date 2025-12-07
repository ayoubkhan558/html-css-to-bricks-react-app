/**
 * Heading Processor
 * Processes heading elements (h1-h6)
 */

import { BaseProcessor } from './BaseProcessor';

export class HeadingProcessor extends BaseProcessor {
    /**
     * Processes heading element
     * @param {Node} node - DOM node
     * @param {Object} context - Processing context
     * @returns {Object} Bricks heading element
     */
    process(node, context = {}) {
        const tag = node.tagName.toLowerCase();
        const element = this.createElement(node, context);

        element.name = 'heading';
        element.label = this.getElementLabel(node, `${tag.toUpperCase()} Heading`, context);
        element.settings.tag = tag;
        element.settings.text = this.getTextContent(node);

        // Skip processing text nodes in children
        element._skipTextNodes = true;

        return element;
    }

    /**
     * Check if can process this node
     * @param {Node} node - DOM node
     * @returns {boolean} True if h1-h6
     */
    canProcess(node) {
        const tag = node.tagName?.toLowerCase();
        return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag);
    }
}
