/**
 * CSS value parsing utilities
 */

/**
 * Parse numeric values, removing 'px' unit but keeping other units
 * @param {string} value - CSS value to parse
 * @returns {string|number} Parsed value
 */
export const parseValue = (value) => {
    if (typeof value !== 'string') return value;

    const trimmed = value.trim();

    // Remove 'px' unit
    if (trimmed.endsWith('px')) {
        const numValue = parseFloat(trimmed);
        return isNaN(numValue) ? trimmed : numValue;
    }

    // Keep other units intact (%, em, rem, vh, vw, etc.)
    return trimmed;
};

/**
 * Split CSS value while preserving parentheses content
 * Example: "10px 20px calc(100% - 40px)" -> ["10px", "20px", "calc(100% - 40px)"]
 */
export const splitCSSValue = (value) => {
    if (!value) return [];

    const parts = [];
    let current = '';
    let depth = 0;

    for (let i = 0; i < value.length; i++) {
        const char = value[i];

        if (char === '(') {
            depth++;
            current += char;
        } else if (char === ')') {
            depth--;
            current += char;
        } else if (char === ' ' && depth === 0) {
            if (current.trim()) {
                parts.push(current.trim());
                current = '';
            }
        } else {
            current += char;
        }
    }

    if (current.trim()) {
        parts.push(current.trim());
    }

    return parts;
};

/**
 * Split by space while preserving calc() and other functions
 */
export const splitBySpacePreservingCalc = (str) => {
    const parts = [];
    let current = '';
    let depth = 0;

    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (char === '(') {
            depth++;
            current += char;
        } else if (char === ')') {
            depth--;
            current += char;
        } else if (char === ' ' && depth === 0) {
            if (current) {
                parts.push(current);
                current = '';
            }
        } else {
            current += char;
        }
    }

    if (current) {
        parts.push(current);
    }

    return parts;
};
