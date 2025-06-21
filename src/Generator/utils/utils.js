/**
 * Generates a unique ID
 * @returns {string} A unique ID string
 */
const getUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Sanitizes a string to be used as a CSS class name
 * @param {string} str - The string to sanitize
 * @returns {string} Sanitized class name
 */
const sanitizeClassName = (str) => {
  return str
    .replace(/[^\w-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
};

export { getUniqueId, sanitizeClassName };
