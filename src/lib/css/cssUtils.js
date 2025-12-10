/**
 * Color Utilities
 * Convert color names to hex values
 */


// Convert basic color names to hex; pass through hex values
export function toHex(val) {
    if (!val) return null;

    // Preserve rgb/rgba colors as-is
    if (val.startsWith('rgb')) {
        return val;
    }

    // Handle hex colors
    if (val.startsWith('#')) {
        return val.length === 4 || val.length === 7 ? val : null;
    }

    // Handle named colors
    const namedColors = {
        'black': '#000000',
        'white': '#ffffff',
        'gray': '#808080',
        'lightgray': '#d3d3d3',
        'darkgray': '#a9a9a9',
        'red': '#ff0000',
        'darkred': '#8b0000',
        'blue': '#0000ff',
        'navy': '#000080',
        'skyblue': '#87ceeb',
        'dodgerblue': '#1e90ff',
        'royalblue': '#4169e1',
        'green': '#008000',
        'lime': '#00ff00',
        'limegreen': '#32cd32',
        'seagreen': '#2e8b57',
        'teal': '#008080',
        'aqua': '#00ffff',
        'cyan': '#00ffff',
        'yellow': '#ffff00',
        'orange': '#ffa500',
        'orangered': '#ff4500',
        'gold': '#ffd700',
        'pink': '#ffc0cb',
        'hotpink': '#ff69b4',
        'purple': '#800080',
        'violet': '#ee82ee',
        'magenta': '#ff00ff',
        'silver': '#c0c0c0',
        'whitesmoke': '#f5f5f5',
        'lightblue': '#add8e6',
        'lightgreen': '#90ee90',
        'lightpink': '#ffb6c1'
    };


    return namedColors[val.toLowerCase()] || null;
}

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
