/**
 * Div Processor
 * Default processor for div and generic elements
 */

import { BaseProcessor } from './BaseProcessor';

export class DivProcessor extends BaseProcessor {
    /**
     * Processes div element
     * @param {Node} node - DOM node
     * @param {Object} context - Processing context
     * @returns {Object} Bricks div element
     */
    process(node, context = {}) {
        const tag = node.tagName?.toLowerCase() || 'div';
        const element = this.createElement(node, context);

        element.name = 'div';
        element.label = this.getElementLabel(node, this.getDefaultLabel(tag), context);
        element.settings.tag = tag;

        return element;
    }

    /**
     * Gets default label for a tag
     * @param {string} tag - HTML tag
     * @returns {string} Default label
     */
    getDefaultLabel(tag) {
        const labels = {
            div: 'Div',
            section: 'Section',
            header: 'Header',
            footer: 'Footer',
            main: 'Main',
            aside: 'Aside',
            article: 'Article',
            nav: 'Navigation'
        };

        return labels[tag] || tag.charAt(0).toUpperCase() + tag.slice(1);
    }

    /**
     * Check if can process this node
     * @param {Node} node - DOM node
     * @returns {boolean} Always true (default processor)
     */
    canProcess(node) {
        return true; // Default processor, can handle any element
    }
}
