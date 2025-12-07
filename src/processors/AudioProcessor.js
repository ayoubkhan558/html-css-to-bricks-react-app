/**
 * Audio Processor
 * Processes audio elements
 */

import { BaseProcessor } from './BaseProcessor';

export class AudioProcessor extends BaseProcessor {
    /**
     * Processes audio element
     * @param {Node} node - DOM node
     * @param {Object} context - Processing context
     * @returns {Object} Bricks audio element
     */
    process(node, context = {}) {
        const element = this.createElement(node, context);

        element.name = 'audio';
        element.label = this.getElementLabel(node, 'Audio', context);

        // Get audio source
        const src = this.getAttribute(node, 'src');
        const sourceElement = node.querySelector('source');
        const audioUrl = src || (sourceElement ? sourceElement.getAttribute('src') : '');

        element.settings.audioUrl = audioUrl || '';

        // Get audio attributes
        element.settings.autoplay = this.getAttribute(node, 'autoplay') !== null;
        element.settings.loop = this.getAttribute(node, 'loop') !== null;
        element.settings.controls = this.getAttribute(node, 'controls') !== null;

        element._skipChildren = true;

        return element;
    }

    /**
     * Check if can process this node
     * @param {Node} node - DOM node
     * @returns {boolean} True if audio
     */
    canProcess(node) {
        return node.tagName?.toLowerCase() === 'audio';
    }
}
