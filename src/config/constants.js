/**
 * Brickify Constants
 * Centralized configuration constants used throughout the application
 */

// Bricks Builder version this tool targets
export const BRICKS_VERSION = '2.1.4';

// Source identifier for copied elements
export const BRICKS_SOURCE = 'bricksCopiedElements';
export const BRICKS_SOURCE_URL = 'https://brickify.netlify.app';

// Style handling modes
export const STYLE_MODES = {
    SKIP: 'skip',      // Ignore inline styles
    INLINE: 'inline',  // Keep as inline style attributes
    CLASS: 'class'     // Convert to Bricks global classes
};

// Supported HTML tags for conversion
export const SUPPORTED_TAGS = {
    STRUCTURE: ['div', 'section', 'header', 'footer', 'main', 'aside', 'article', 'nav'],
    TEXT: ['p', 'span', 'blockquote', 'address', 'time', 'mark'],
    HEADINGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    LISTS: ['ul', 'ol', 'li'],
    TABLE: ['table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td'],
    FORM: ['form', 'input', 'select', 'textarea', 'button', 'label'],
    MEDIA: ['img', 'video', 'audio', 'svg'],
    MISC: ['a', 'canvas', 'details', 'summary', 'dialog', 'meter', 'progress', 'script']
};

// Alert/notification class patterns
export const ALERT_CLASS_PATTERNS = [
    'alert', 'notification', 'message', 'toast', 'msg', 'flash',
    'banner', 'notice', 'warning', 'error', 'success', 'info',
    'callout', 'hint', 'tip', 'note', 'status'
];

// Container/layout class patterns
export const CONTAINER_CLASS_PATTERNS = [
    'container', 'boxed', 'wrapper', 'content'
];

// Navigation class patterns
export const NAV_CLASS_PATTERNS = [
    'nav', 'menu', 'navigation', 'links', 'navbar',
    'main-nav', 'primary-nav', 'header-nav', 'site-nav',
    'top-nav', 'subnav', 'submenu', 'breadcrumb', 'pagination'
];

// AI Provider types
export const AI_PROVIDERS = {
    GEMINI: 'gemini',
    OPENAI: 'openai',
    OPENROUTER: 'openrouter'
};

// AI Model identifiers
export const AI_MODELS = {
    GEMINI: {
        FLASH: 'gemini-2.0-flash-exp',
        PRO: 'gemini-1.5-pro'
    },
    OPENAI: {
        GPT4_MINI: 'gpt-4o-mini',
        GPT4: 'gpt-4o'
    },
    OPENROUTER: {
        FREE: 'mistralai/mistral-7b-instruct:free'
    }
};
