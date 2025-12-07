/**
 * Video Processor
 * Processes video elements
 */

import { BaseProcessor } from './BaseProcessor';

export class VideoProcessor extends BaseProcessor {
    /**
     * Processes video element
     * @param {Node} node - DOM node
     * @param {Object} context - Processing context
     * @returns {Object} Bricks video element
     */
    process(node, context = {}) {
        const element = this.createElement(node, context);

        element.name = 'video';
        element.label = this.getElementLabel(node, 'Video', context);

        // Get video source
        const src = this.getAttribute(node, 'src');
        const sourceElement = node.querySelector('source');
        const videoUrl = src || (sourceElement ? sourceElement.getAttribute('src') : '');

        element.settings.videoUrl = videoUrl || '';

        // Get video attributes
        element.settings.autoplay = this.getAttribute(node, 'autoplay') !== null;
        element.settings.loop = this.getAttribute(node, 'loop') !== null;
        element.settings.muted = this.getAttribute(node, 'muted') !== null;
        element.settings.controls = this.getAttribute(node, 'controls') !== null;

        const poster = this.getAttribute(node, 'poster');
        if (poster) {
            element.settings.poster = poster;
        }

        element._skipChildren = true;

        return element;
    }

    /**
     * Check if can process this node
     * @param {Node} node - DOM node
     * @returns {boolean} True if video
     */
    canProcess(node) {
        return node.tagName?.toLowerCase() === 'video';
    }
}
