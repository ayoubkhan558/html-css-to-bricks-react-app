import { ENABLE_LOGS } from '@config/constants';

/**
 * Enhanced logger with context information
 * Provides clear context about file, function, and what's being processed
 */

// ANSI color codes for better console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',

    // Foreground colors
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',

    // Background colors
    bgRed: '\x1b[41m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
};

/**
 * Format log prefix with context
 * @param {string} level - Log level (LOG, ERROR, WARN, INFO)
 * @param {string} file - File name or path
 * @param {string} step - Current processing step
 * @param {string} feature - HTML/CSS/JS feature being processed
 */
const formatPrefix = (level, file, step, feature) => {
    const timestamp = new Date().toLocaleTimeString();
    let levelColor = colors.gray;
    let levelIcon = '●';

    switch (level) {
        case 'ERROR':
            levelColor = colors.red;
            levelIcon = '✖';
            break;
        case 'WARN':
            levelColor = colors.yellow;
            levelIcon = '⚠';
            break;
        case 'INFO':
            levelColor = colors.blue;
            levelIcon = 'ℹ';
            break;
        case 'LOG':
            levelColor = colors.green;
            levelIcon = '●';
            break;
        case 'SUCCESS':
            levelColor = colors.green;
            levelIcon = '✓';
            break;
    }

    const parts = [];

    // Timestamp
    parts.push(`${colors.gray}[${timestamp}]${colors.reset}`);

    // Level with icon
    parts.push(`${levelColor}${levelIcon} ${level}${colors.reset}`);

    // File (if provided)
    if (file) {
        const fileName = file.split('/').pop().split('\\').pop();
        parts.push(`${colors.cyan}[${fileName}]${colors.reset}`);
    }

    // Step (if provided)
    if (step) {
        parts.push(`${colors.magenta}→ ${step}${colors.reset}`);
    }

    // Feature (if provided)
    if (feature) {
        parts.push(`${colors.blue}(${feature})${colors.reset}`);
    }

    return parts.join(' ');
};

/**
 * Enhanced logger with context
 */
export const logger = {
    /**
     * General log
     * @param {string} message - Log message
     * @param {Object} context - Optional context {file, step, feature}
     * @param {...any} args - Additional arguments
     */
    log: (message, context = {}, ...args) => {
        if (ENABLE_LOGS) {
            const prefix = formatPrefix('LOG', context.file, context.step, context.feature);
            console.log(prefix, message, ...args);
        }
    },

    /**
     * Error log
     * @param {string} message - Error message
     * @param {Object} context - Optional context {file, step, feature}
     * @param {...any} args - Additional arguments (typically the error object)
     */
    error: (message, context = {}, ...args) => {
        if (ENABLE_LOGS) {
            const prefix = formatPrefix('ERROR', context.file, context.step, context.feature);
            console.error(prefix, message, ...args);

            // If there's an error object with stack, log it separately
            const errorObj = args.find(arg => arg instanceof Error);
            if (errorObj && errorObj.stack) {
                console.error(`${colors.gray}Stack trace:${colors.reset}`, errorObj.stack);
            }
        }
    },

    /**
     * Warning log
     * @param {string} message - Warning message
     * @param {Object} context - Optional context {file, step, feature}
     * @param {...any} args - Additional arguments
     */
    warn: (message, context = {}, ...args) => {
        if (ENABLE_LOGS) {
            const prefix = formatPrefix('WARN', context.file, context.step, context.feature);
            console.warn(prefix, message, ...args);
        }
    },

    /**
     * Info log
     * @param {string} message - Info message
     * @param {Object} context - Optional context {file, step, feature}
     * @param {...any} args - Additional arguments
     */
    info: (message, context = {}, ...args) => {
        if (ENABLE_LOGS) {
            const prefix = formatPrefix('INFO', context.file, context.step, context.feature);
            console.info(prefix, message, ...args);
        }
    },

    /**
     * Success log
     * @param {string} message - Success message
     * @param {Object} context - Optional context {file, step, feature}
     * @param {...any} args - Additional arguments
     */
    success: (message, context = {}, ...args) => {
        if (ENABLE_LOGS) {
            const prefix = formatPrefix('SUCCESS', context.file, context.step, context.feature);
            console.log(prefix, message, ...args);
        }
    },

    /**
     * Group start for related logs
     * @param {string} groupName - Name of the log group
     * @param {Object} context - Optional context
     */
    group: (groupName, context = {}) => {
        if (ENABLE_LOGS) {
            const prefix = formatPrefix('LOG', context.file, context.step, context.feature);
            console.group(`${prefix} ${colors.bright}${groupName}${colors.reset}`);
        }
    },

    /**
     * Collapsed group start
     * @param {string} groupName - Name of the log group
     * @param {Object} context - Optional context
     */
    groupCollapsed: (groupName, context = {}) => {
        if (ENABLE_LOGS) {
            const prefix = formatPrefix('LOG', context.file, context.step, context.feature);
            console.groupCollapsed(`${prefix} ${colors.bright}${groupName}${colors.reset}`);
        }
    },

    /**
     * End log group
     */
    groupEnd: () => {
        if (ENABLE_LOGS) {
            console.groupEnd();
        }
    },

    /**
     * Log table data
     * @param {any} data - Data to display as table
     * @param {Object} context - Optional context
     */
    table: (data, context = {}) => {
        if (ENABLE_LOGS) {
            if (context.file || context.step || context.feature) {
                const prefix = formatPrefix('LOG', context.file, context.step, context.feature);
                console.log(prefix);
            }
            console.table(data);
        }
    }
};

// Convenience export for backward compatibility
export default logger;
