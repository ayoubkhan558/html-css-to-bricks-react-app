/**
 * Brickify Default Settings
 * Default configuration values for the application
 */

import { STYLE_MODES } from './constants';

// Default generator settings
export const DEFAULT_GENERATOR_SETTINGS = {
    inlineStyleHandling: STYLE_MODES.CLASS,
    showNodeClass: false,
    minifyOutput: false,
    includeJs: true,
    cssSelectorTarget: 'class'
};

// Default AI settings
export const DEFAULT_AI_SETTINGS = {
    provider: null,
    apiKey: null,
    model: null,
    temperature: 0.7,
    maxTokens: 4096
};

// Default editor settings
export const DEFAULT_EDITOR_SETTINGS = {
    theme: 'dark',
    fontSize: 14,
    tabSize: 2,
    lineNumbers: true,
    wordWrap: true
};

// Combined default settings
export const DEFAULT_SETTINGS = {
    generator: DEFAULT_GENERATOR_SETTINGS,
    ai: DEFAULT_AI_SETTINGS,
    editor: DEFAULT_EDITOR_SETTINGS
};
