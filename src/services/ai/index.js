/**
 * AI Service
 * Factory and facade for AI providers
 */

import { AI_PROVIDERS } from '../../config/constants';
import { GeminiProvider } from './providers/GeminiProvider';
import { OpenAiProvider } from './providers/OpenAiProvider';
import { OpenRouterProvider } from './providers/OpenRouterProvider';

/**
 * Creates an AI provider instance
 * @param {string} type - Provider type (gemini, openai, openrouter)
 * @param {string} apiKey - API key
 * @param {string} model - Optional model override
 * @returns {BaseProvider} Provider instance
 */
export function createProvider(type, apiKey, model = null) {
    switch (type) {
        case AI_PROVIDERS.GEMINI:
            return new GeminiProvider(apiKey, model);

        case AI_PROVIDERS.OPENAI:
            return new OpenAiProvider(apiKey, model);

        case AI_PROVIDERS.OPENROUTER:
            return new OpenRouterProvider(apiKey, model);

        default:
            throw new Error(`Unknown AI provider: ${type}`);
    }
}

/**
 * AI Service class for managing code generation
 */
export class AiService {
    constructor() {
        this.provider = null;
    }

    /**
     * Configures the AI service with a provider
     * @param {string} type - Provider type
     * @param {string} apiKey - API key
     * @param {string} model - Optional model
     */
    configure(type, apiKey, model = null) {
        this.provider = createProvider(type, apiKey, model);
    }

    /**
     * Checks if the service is configured
     * @returns {boolean} True if configured
     */
    isConfigured() {
        return this.provider?.isConfigured() || false;
    }

    /**
     * Generates code from a prompt
     * @param {string} prompt - Generation prompt
     * @param {Object} options - Generation options
     * @returns {Promise<Object>} Generated code { html, css, js }
     */
    async generate(prompt, options = {}) {
        if (!this.isConfigured()) {
            throw new Error('AI service is not configured. Please set an API key.');
        }

        return this.provider.generate(prompt, options);
    }

    /**
     * Gets the current provider name
     * @returns {string|null} Provider name or null
     */
    getProviderName() {
        return this.provider?.getName() || null;
    }
}

// Export singleton instance
export const aiService = new AiService();

// Export providers for direct use
export { GeminiProvider, OpenAiProvider, OpenRouterProvider };
