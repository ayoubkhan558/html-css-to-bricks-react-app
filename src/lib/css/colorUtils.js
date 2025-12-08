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

    // Named colors map
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
