/**
 * Bricks Element Factory
 * Utilities for creating Bricks elements
 */

import { getTagLabel } from '@config/elementMappings';

// Counter for unique IDs
let idCounter = 0;

/**
 * Generates a unique ID for Bricks elements
 * @returns {string} Unique ID in format 'abc123'
 */
export function generateId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    idCounter++;
    return `${timestamp}${random}${idCounter.toString(36)}`;
}

/**
 * Resets the ID counter (useful for testing)
 */
export function resetIdCounter() {
    idCounter = 0;
}

/**
 * Creates a base Bricks element structure
 * @param {Object} options - Element options
 * @returns {Object} Bricks element
 */
export function createElement({
    name = 'div',
    label = null,
    parent = '0',
    tag = null,
    settings = {}
} = {}) {
    return {
        id: generateId(),
        name,
        label: label || name,
        parent,
        children: [],
        settings: {
            ...settings,
            ...(tag && { tag })
        }
    };
}

/**
 * Creates a Bricks element from a DOM node
 * @param {Node} node - DOM node
 * @param {Object} options - Options
 * @returns {Object} Bricks element
 */
export function createElementFromNode(node, { parentId = '0', context = {} } = {}) {
    const tag = node.tagName?.toLowerCase() || 'div';

    // Get label from class or default
    const label = getElementLabel(node, tag, context);

    return createElement({
        name: 'div',
        label,
        parent: parentId,
        tag,
        settings: {}
    });
}

/**
 * Gets element label based on context and classes
 * @param {Node} node - DOM node
 * @param {string} tag - HTML tag name
 * @param {Object} context - Context with settings
 * @returns {string} Label
 */
export function getElementLabel(node, tag, context = {}) {
    // Use first class if showNodeClass is enabled
    if (context.showNodeClass && node.classList?.length > 0) {
        return node.classList[0];
    }

    // Fall back to tag label
    return getTagLabel(tag);
}

/**
 * Creates a text element
 * @param {string} text - Text content
 * @param {Object} options - Options
 * @returns {Object} Text element
 */
export function createTextElement(text, { parentId = '0', tag = 'p' } = {}) {
    return createElement({
        name: 'text-basic',
        label: 'Text',
        parent: parentId,
        settings: {
            text,
            tag
        }
    });
}

/**
 * Creates a heading element
 * @param {string} text - Heading text
 * @param {string} tag - Heading tag (h1-h6)
 * @param {Object} options - Options
 * @returns {Object} Heading element
 */
export function createHeadingElement(text, tag = 'h1', { parentId = '0' } = {}) {
    return createElement({
        name: 'heading',
        label: `${tag.toUpperCase()} Heading`,
        parent: parentId,
        settings: {
            text,
            tag
        }
    });
}

/**
 * Creates a button element
 * @param {string} text - Button text
 * @param {Object} options - Options
 * @returns {Object} Button element
 */
export function createButtonElement(text, { parentId = '0' } = {}) {
    return createElement({
        name: 'button',
        label: 'Button',
        parent: parentId,
        settings: {
            text,
            style: 'primary',
            tag: 'button',
            size: 'md'
        }
    });
}

/**
 * Creates an image element
 * @param {string} src - Image source
 * @param {string} alt - Alt text
 * @param {Object} options - Options
 * @returns {Object} Image element
 */
export function createImageElement(src, alt = '', { parentId = '0' } = {}) {
    return createElement({
        name: 'image',
        label: 'Image',
        parent: parentId,
        settings: {
            image: { url: src },
            altText: alt
        }
    });
}

/**
 * Creates a code element (for JS/scripts)
 * @param {string} code - JavaScript code
 * @param {Object} options - Options
 * @returns {Object} Code element
 */
export function createCodeElement(code, { parentId = '0' } = {}) {
    return createElement({
        name: 'code',
        label: 'Code',
        parent: parentId,
        settings: {
            executeCode: true,
            noRoot: true,
            javascriptCode: code
        }
    });
}
