/**
 * Test Helpers
 * Shared utilities for all tests
 */

import { expect } from 'vitest';

// Create HTML element from string
export function html(string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(string, 'text/html');
    return doc.body.firstElementChild;
}

// Create full document from HTML
export function doc(string) {
    const parser = new DOMParser();
    return parser.parseFromString(string, 'text/html');
}

// Check if result is valid Bricks structure
export function isBricksStructure(result) {
    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(result.version).toBe('2.1.4');
    expect(Array.isArray(result.content)).toBe(true);
}
