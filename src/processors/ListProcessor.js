/**
 * List Processor
 * Processes list elements (ul, ol, li)
 */

import { BaseProcessor } from './BaseProcessor';

export class ListProcessor extends BaseProcessor {
    /**
     * Processes list element
     * @param {Node} node - DOM node
     * @param {Object} context - Processing context
     * @returns {Object} Bricks list element
     */
    process(node, context = {}) {
        const tag = node.tagName.toLowerCase();
        const element = this.createElement(node, context);

        if (['ul', 'ol'].includes(tag)) {
            // Check if simple list (only text in li elements)
            const isSimple = this.isSimpleList(node);

            if (isSimple) {
                // Convert to text element with list
                element.name = 'text';
                element.label = this.getElementLabel(node, tag === 'ul' ? 'List' : 'Ordered List', context);
                element.settings.tag = tag;
                element.settings.text = this.getListHTML(node);
                element._skipChildren = true;
            } else {
                // Complex list - use div structure
                element.name = 'div';
                element.label = this.getElementLabel(node, tag === 'ul' ? 'List' : 'Ordered List', context);
                element.settings.tag = tag;
            }
        } else if (tag === 'li') {
            // List item
            element.name = 'div';
            element.label = this.getElementLabel(node, 'List Item', context);
            element.settings.tag = 'li';
        }

        return element;
    }

    /**
     * Checks if list is simple (only text in li)
     * @param {Node} node - List node
     * @returns {boolean} True if simple
     */
    isSimpleList(node) {
        const items = node.querySelectorAll('li');
        return Array.from(items).every(li => {
            const hasComplexContent = li.querySelector('div, p, img, button, form');
            return !hasComplexContent;
        });
    }

    /**
     * Gets list HTML for text element
     * @param {Node} node - List node
     * @returns {string} List HTML
     */
    getListHTML(node) {
        return node.innerHTML;
    }

    /**
     * Check if can process this node
     * @param {Node} node - DOM node
     * @returns {boolean} True if list element
     */
    canProcess(node) {
        const tag = node.tagName?.toLowerCase();
        return ['ul', 'ol', 'li'].includes(tag);
    }
}
