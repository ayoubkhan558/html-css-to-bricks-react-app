/**
 * SVG Processor
 * Processes SVG elements
 */

import { BaseProcessor } from './BaseProcessor';

export class SvgProcessor extends BaseProcessor {
    /**
     * Processes SVG element
     * @param {Node} node - DOM node
     * @param {Object} context - Processing context
     * @returns {Object} Bricks SVG element
     */
    process(node, context = {}) {
        const element = this.createElement(node, context);

        element.name = 'svg';
        element.label = this.getElementLabel(node, 'SVG', context);
        element.settings.source = 'code';
        element.settings.code = node.outerHTML;

        // Skip processing children since we're storing the entire SVG as code
        element._skipChildren = true;

        return element;
    }

    /**
     * Check if can process this node
     * @param {Node} node - DOM node
     * @returns {boolean} True if SVG
     */
    canProcess(node) {
        return node.tagName?.toLowerCase() === 'svg';
    }
}
