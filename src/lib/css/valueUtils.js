/**
 * CSS Value Utilities
 * Parsing and manipulation of CSS values
 */

/**
 * Parse numeric values, removing 'px' unit but keeping other units
 * @param {string} value - CSS value to parse
 * @returns {string|number} Parsed value
 */
export const parseValue = (value) => {
    if (typeof value !== 'string') return value;

    // Handle CSS variables
    if (value.startsWith('var(')) return value;

    // Handle calc() and other CSS functions
    if (value.includes('(')) return value;

    // Handle numbers with units
    const numMatch = value.match(/^(-?\d*\.?\d+)([a-z%]*)$/);
    if (numMatch) {
        const num = numMatch[1];
        const unit = numMatch[2];

        // For px values, we just want the number
        if (unit === 'px') return num;

        // For other units (%, em, rem, deg, etc.), keep the unit
        return value;
    }

    return value;
};

/**
 * Split CSS values while preserving functions like clamp(), calc(), etc.
 * @param {string} value - The CSS value to split
 * @returns {Array} Array of individual values
 */
export const splitCSSValue = (value) => {
    if (!value || typeof value !== 'string') return [];

    const values = [];
    let current = '';
    let depth = 0;

    for (let i = 0; i < value.length; i++) {
        const char = value[i];

        if (char === '(') {
            depth++;
            current += char;
        } else if (char === ')') {
            depth--;  // Fixed: Added semicolon here
            current += char;
        } else if (char === ' ' && depth === 0) {
            // Only split on spaces outside of functions
            if (current.trim()) {
                values.push(current.trim());
                current = '';
            }
        } else {
            current += char;
        }
    }

    // Add the last value
    if (current.trim()) {
        values.push(current.trim());
    }

    return values;
};