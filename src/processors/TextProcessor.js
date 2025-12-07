/**
 * Text Processor
 * Processes text elements (p, span, blockquote, etc.)
 */

import { BaseProcessor } from './BaseProcessor';

export class TextProcessor extends BaseProcessor {
    /**
     * Processes text element
     * @param {Node} node - DOM node
     * @param {Object} context - Processing context
     * @returns {Object} Bricks text element
     */
    process(node, context = {}) {
        const tag = node.tagName.toLowerCase();
        const element = this.createElement(node, context);

        element.name = 'text-basic';
        element.settings.text = this.getTextContent(node);

        // Set label based on tag
        const labels = {
            p: 'Paragraph',
            span: 'Span',
            blockquote: 'Block Quote',
            address: 'Address',
            time: 'Time',
            mark: 'Mark'
        };

        element.label = this.getElementLabel(node, labels[tag] || 'Text', context);

        // Set custom tag for certain elements
        if (['blockquote', 'address', 'time', 'mark'].includes(tag)) {
            element.settings.tag = 'custom';
            element.settings.customTag = tag;
        } else {
            element.settings.tag = tag;
        }

        element._skipTextNodes = true;

        return element;
    }

    /**
     * Check if can process this node
     * @param {Node} node - DOM node
     * @returns {boolean} True if text element
     */
    canProcess(node) {
        const tag = node.tagName?.toLowerCase();
        return ['p', 'span', 'blockquote', 'address', 'time', 'mark'].includes(tag);
    }
}
