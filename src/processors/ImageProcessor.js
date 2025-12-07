/**
 * Image Processor
 * Processes image elements
 */

import { BaseProcessor } from './BaseProcessor';

export class ImageProcessor extends BaseProcessor {
    /**
     * Processes image element
     * @param {Node} node - DOM node
     * @param {Object} context - Processing context
     * @returns {Object} Bricks image element
     */
    process(node, context = {}) {
        const element = this.createElement(node, context);

        element.name = 'image';
        element.label = this.getElementLabel(node, 'Image', context);

        // Get image source
        const src = this.getAttribute(node, 'src', '');
        element.settings.image = { url: src };

        // Get alt text
        const alt = this.getAttribute(node, 'alt', '');
        if (alt) {
            element.settings.altText = alt;
        }

        // Get sizing attributes
        const width = this.getAttribute(node, 'width');
        const height = this.getAttribute(node, 'height');

        if (width) element.settings.width = width;
        if (height) element.settings.height = height;

        // Get loading attribute
        const loading = this.getAttribute(node, 'loading');
        if (loading) {
            element.settings.loading = loading;
        }

        return element;
    }

    /**
     * Check if can process this node
     * @param {Node} node - DOM node
     * @returns {boolean} True if img
     */
    canProcess(node) {
        return node.tagName?.toLowerCase() === 'img';
    }
}
