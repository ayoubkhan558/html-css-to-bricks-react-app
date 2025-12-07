/**
 * Processor Registry
 * Manages registration and retrieval of element processors
 */

import { BaseProcessor } from './BaseProcessor';

export class ProcessorRegistry {
    constructor() {
        this.processors = new Map();
        this.defaultProcessor = null;
    }

    /**
     * Registers a processor for specific tags
     * @param {string|string[]} tags - Tag name(s)
     * @param {BaseProcessor} processor - Processor instance
     */
    register(tags, processor) {
        if (!(processor instanceof BaseProcessor)) {
            throw new Error('Processor must extend BaseProcessor');
        }

        const tagArray = Array.isArray(tags) ? tags : [tags];

        tagArray.forEach(tag => {
            const normalizedTag = tag.toLowerCase();
            this.processors.set(normalizedTag, processor);
        });
    }

    /**
     * Sets the default processor for unregistered tags
     * @param {BaseProcessor} processor - Default processor
     */
    setDefault(processor) {
        if (!(processor instanceof BaseProcessor)) {
            throw new Error('Default processor must extend BaseProcessor');
        }
        this.defaultProcessor = processor;
    }

    /**
     * Gets processor for a tag
     * @param {string} tag - HTML tag name
     * @returns {BaseProcessor} Processor instance
     */
    getProcessor(tag) {
        const normalizedTag = tag.toLowerCase();
        return this.processors.get(normalizedTag) || this.defaultProcessor;
    }

    /**
     * Gets processor for a DOM node
     * @param {Node} node - DOM node
     * @returns {BaseProcessor|null} Processor instance or null
     */
    getProcessorForNode(node) {
        if (!node || !node.tagName) {
            return null;
        }

        const tag = node.tagName.toLowerCase();

        // First try to get by tag
        let processor = this.getProcessor(tag);

        // If processor has canProcess, check if it can handle this specific node
        if (processor && typeof processor.canProcess === 'function') {
            if (!processor.canProcess(node)) {
                processor = this.defaultProcessor;
            }
        }

        return processor;
    }

    /**
     * Checks if a tag has a registered processor
     * @param {string} tag - HTML tag name
     * @returns {boolean} True if registered
     */
    hasProcessor(tag) {
        return this.processors.has(tag.toLowerCase());
    }

    /**
     * Gets all registered tags
     * @returns {string[]} Array of registered tags
     */
    getRegisteredTags() {
        return Array.from(this.processors.keys());
    }

    /**
     * Clears all registered processors
     */
    clear() {
        this.processors.clear();
        this.defaultProcessor = null;
    }

    /**
     * Gets the number of registered processors
     * @returns {number} Count
     */
    size() {
        return this.processors.size;
    }
}

// Export singleton instance
export const processorRegistry = new ProcessorRegistry();
