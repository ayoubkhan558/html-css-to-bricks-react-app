/**
 * Vitest Test Setup
 * Global setup for all tests
 */

// Add global DOM APIs if needed
global.Node = typeof window !== 'undefined' ? window.Node : {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9
};

// Mock console methods if needed
const originalConsole = { ...console };

// Suppress console errors/warnings during tests if desired
// console.error = jest.fn();
// console.warn = jest.fn();

export { originalConsole };
