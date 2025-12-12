/**
 * Color utilities for CSS color handling and conversion
 */

// Helper function to check if a value is a color
export const isColor = (value) => {
    if (typeof value !== 'string') return false;
    const lowerCaseValue = value.toLowerCase();
    const colorKeywords = ['transparent', 'currentcolor'];
    if (colorKeywords.includes(lowerCaseValue)) return true;

    // Enhanced hex color detection - supports 3, 4, 6, and 8 digit hex colors
    if (lowerCaseValue.startsWith('#')) {
        const hexPart = lowerCaseValue.slice(1);
        return /^[0-9a-f]{3,8}$/i.test(hexPart);
    }

    if (lowerCaseValue.startsWith('rgb') || lowerCaseValue.startsWith('hsl')) return true;

    // Basic color name check (can be expanded)
    const namedColors = ['red', 'green', 'blue', 'white', 'black', 'yellow', 'purple', 'orange'];
    return namedColors.includes(lowerCaseValue);
};

/**
 * Create a color value object in the format expected by Bricks
 * Preserves the original color value (names, CSS variables, rgb, hsl, hex)
 * @param {string} value - Color value in any valid CSS format
 * @returns {Object} Color object with raw property
 */
export const createColorValue = (value) => {
    if (!value) return null;
    return { raw: value };
};

/**
 * Convert basic color names to hex; pass through hex values
 */
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
        'powderblue': '#000000',
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
