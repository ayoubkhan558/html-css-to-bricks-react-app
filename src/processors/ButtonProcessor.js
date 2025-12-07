/**
 * Button Processor
 * Processes button elements
 */

import { BaseProcessor } from './BaseProcessor';

export class ButtonProcessor extends BaseProcessor {
    /**
     * Processes button element
     * @param {Node} node - DOM node
     * @param {Object} context - Processing context
     * @returns {Object} Bricks button element
     */
    process(node, context = {}) {
        const element = this.createElement(node, context);

        element.name = 'button';
        element.label = this.getElementLabel(node, 'Button', context);
        element.settings = {
            style: 'primary',
            tag: 'button',
            size: 'md',
            text: this.getTextContent(node) || 'Button'
        };

        // Handle disabled attribute
        if (this.getAttribute(node, 'disabled') !== null) {
            element.settings.disabled = true;
        }

        // Handle button type
        const type = this.getAttribute(node, 'type', 'button');
        if (type) {
            element.settings.type = type;
        }

        element._skipTextNodes = true;

        return element;
    }

    /**
     * Check if can process this node
     * @param {Node} node - DOM node
     * @returns {boolean} True if button
     */
    canProcess(node) {
        return node.tagName?.toLowerCase() === 'button';
    }
}
