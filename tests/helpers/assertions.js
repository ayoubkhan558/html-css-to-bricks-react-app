/**
 * Custom Test Assertions
 * 
 * This file contains custom assertion helpers that make tests more readable
 * and reduce code duplication. These helpers wrap common test patterns.
 */

import { expect } from 'vitest';

/**
 * Assert that a Bricks element has the expected basic structure
 * Every Bricks element should have: id, name, parent, children, settings
 * 
 * @param {Object} element - Bricks element to check
 * 
 * @example
 * assertBricksElement(result.content[0]);
 */
export function assertBricksElement(element) {
    expect(element).toBeDefined();
    expect(element).toHaveProperty('id');
    expect(element).toHaveProperty('name');
    expect(element).toHaveProperty('parent');
    expect(element).toHaveProperty('children');
    expect(element).toHaveProperty('settings');
    expect(Array.isArray(element.children)).toBe(true);
}

/**
 * Assert that a Bricks structure has the expected top-level properties
 * Every Bricks structure should have: content, globalClasses, version, source
 * 
 * @param {Object} structure - Bricks structure to check
 * 
 * @example
 * assertBricksStructure(converterService.convert(html, css));
 */
export function assertBricksStructure(structure) {
    expect(structure).toBeDefined();
    expect(structure).toHaveProperty('content');
    expect(structure).toHaveProperty('globalClasses');
    expect(structure).toHaveProperty('version');
    expect(structure).toHaveProperty('source');
    expect(Array.isArray(structure.content)).toBe(true);
    expect(Array.isArray(structure.globalClasses)).toBe(true);
    expect(structure.version).toBe('2.1.4');
    expect(structure.source).toBe('bricksCopiedElements');
}

/**
 * Assert that an element has specific settings
 * Checks if the element's settings object contains the expected key-value pairs
 * 
 * @param {Object} element - Bricks element
 * @param {Object} expectedSettings - Expected settings object
 * 
 * @example
 * assertElementSettings(heading, { tag: 'h1', text: 'Title' });
 */
export function assertElementSettings(element, expectedSettings) {
    assertBricksElement(element);

    Object.entries(expectedSettings).forEach(([key, value]) => {
        expect(element.settings).toHaveProperty(key);
        expect(element.settings[key]).toBe(value);
    });
}

/**
 * Assert that a global class exists with a specific name
 * 
 * @param {Array} globalClasses - Array of global classes
 * @param {string} className - Expected class name
 * 
 * @example
 * assertGlobalClass(result.globalClasses, 'container');
 */
export function assertGlobalClass(globalClasses, className) {
    expect(Array.isArray(globalClasses)).toBe(true);
    const foundClass = globalClasses.find(c => c.name === className);
    expect(foundClass).toBeDefined();
    return foundClass;
}

/**
 * Assert that CSS properties are correctly applied
 * 
 * @param {Object} styles - Styles object to check
 * @param {Object} expectedProps - Expected CSS properties
 * 
 * @example
 * assertCssProperties(element.settings._styles.desktop.default, {
 *   color: 'red',
 *   'font-size': '16px'
 * });
 */
export function assertCssProperties(styles, expectedProps) {
    expect(styles).toBeDefined();

    Object.entries(expectedProps).forEach(([property, value]) => {
        expect(styles).toHaveProperty(property);
        expect(styles[property]).toBe(value);
    });
}

/**
 * Assert that an element has a specific number of children
 * 
 * @param {Object} element - Bricks element
 * @param {number} count - Expected number of children
 * 
 * @example
 * assertChildCount(container, 3);
 */
export function assertChildCount(element, count) {
    assertBricksElement(element);
    expect(element.children).toHaveLength(count);
}

/**
 * Find an element in content array by name
 * 
 * @param {Array} content - Bricks content array
 * @param {string} name - Element name to find
 * @returns {Object} - Found element
 * 
 * @example
 * const heading = findElementByName(result.content, 'heading');
 */
export function findElementByName(content, name) {
    const element = content.find(el => el.name === name);
    expect(element).toBeDefined();
    return element;
}

/**
 * Find an element by ID
 * 
 * @param {Array} content - Bricks content array
 * @param {string} id - Element ID
 * @returns {Object} - Found element
 * 
 * @example
 * const element = findElementById(result.content, 'abc123');
 */
export function findElementById(content, id) {
    const element = content.find(el => el.id === id);
    expect(element).toBeDefined();
    return element;
}
