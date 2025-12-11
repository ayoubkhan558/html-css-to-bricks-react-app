/**
 * General Utility Functions
 */

/**
 * Deep merges two objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object to merge
 * @returns {Object} Merged object
 */
export function deepMerge(target, source) {
    const result = { ...target };

    for (const key of Object.keys(source)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(result[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }

    return result;
}

/**
 * Sanitizes a string for use as a CSS class name
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized class name
 */
export function sanitizeClassName(str) {
    return str
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-')
        .toLowerCase();
}
