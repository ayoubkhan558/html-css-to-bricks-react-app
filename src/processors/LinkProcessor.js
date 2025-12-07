/**
 * Link Processor
 * Processes anchor/link elements
 */

import { BaseProcessor } from './BaseProcessor';

export class LinkProcessor extends BaseProcessor {
    /**
     * Processes link element
     * @param {Node} node - DOM node
     * @param {Object} context - Processing context
     * @returns {Object} Bricks link element
     */
    process(node, context = {}) {
        const element = this.createElement(node, context);

        // Check if link contains only text
        const hasOnlyText = this.hasOnlyTextNodes(node);

        if (hasOnlyText) {
            // Simple text link
            element.name = 'text-link';
            element.label = this.getElementLabel(node, 'Link', context);
            element.settings.text = this.getTextContent(node);
            element.settings.link = this.getLinkSettings(node);
            element._skipTextNodes = true;
        } else {
            // Complex link with nested elements - use div with link
            element.name = 'div';
            element.label = this.getElementLabel(node, 'Link Container', context);
            element.settings.tag = 'a';
            element.settings.link = this.getLinkSettings(node);
            element._skipChildren = false; // Allow children to be processed
        }

        return element;
    }

    /**
     * Checks if node contains only text nodes
     * @param {Node} node - DOM node
     * @returns {boolean} True if only text
     */
    hasOnlyTextNodes(node) {
        return Array.from(node.childNodes).every(child =>
            child.nodeType === Node.TEXT_NODE
        );
    }

    /**
     * Gets link settings from node
     * @param {Node} node - DOM node
     * @returns {Object} Link settings
     */
    getLinkSettings(node) {
        const href = this.getAttribute(node, 'href', '');
        const target = this.getAttribute(node, 'target');
        const rel = this.getAttribute(node, 'rel', '');

        return {
            type: href.startsWith('/') ? 'internal' : 'external',
            url: href,
            openInNewWindow: target === '_blank',
            noFollow: rel.includes('nofollow'),
            noReferrer: rel.includes('noreferrer')
        };
    }

    /**
     * Check if can process this node
     * @param {Node} node - DOM node
     * @returns {boolean} True if anchor
     */
    canProcess(node) {
        return node.tagName?.toLowerCase() === 'a';
    }
}
