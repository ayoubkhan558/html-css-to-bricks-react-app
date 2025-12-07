/**
 * Base AI Provider
 * Abstract base class for AI providers
 */

export class BaseProvider {
    constructor(apiKey) {
        if (new.target === BaseProvider) {
            throw new Error('BaseProvider is abstract and cannot be instantiated directly');
        }
        this.apiKey = apiKey;
    }

    /**
     * Generates code from a prompt
     * @param {string} prompt - The prompt to send to the AI
     * @param {Object} options - Generation options
     * @returns {Promise<Object>} Generated code { html, css, js }
     */
    async generate(prompt, options = {}) {
        throw new Error('generate() must be implemented by subclass');
    }

    /**
     * Extracts code blocks from AI response
     * @param {string} response - Raw AI response
     * @returns {Object} Extracted code { html, css, js }
     */
    extractCode(response) {
        const html = this.extractBlock(response, 'html');
        const css = this.extractBlock(response, 'css');
        const js = this.extractBlock(response, ['javascript', 'js']);

        return { html, css, js };
    }

    /**
     * Extracts a specific code block from response
     * @param {string} response - AI response text
     * @param {string|string[]} language - Language identifier(s)
     * @returns {string} Extracted code or empty string
     */
    extractBlock(response, language) {
        const languages = Array.isArray(language) ? language : [language];

        for (const lang of languages) {
            const regex = new RegExp(`\`\`\`${lang}\\s*([\\s\\S]*?)\`\`\``, 'i');
            const match = response.match(regex);
            if (match) {
                return match[1].trim();
            }
        }

        return '';
    }

    /**
     * Validates the API key
     * @returns {boolean} True if valid
     */
    isConfigured() {
        return Boolean(this.apiKey && this.apiKey.trim());
    }

    /**
     * Gets the provider name
     * @returns {string} Provider name
     */
    getName() {
        return this.constructor.name.replace('Provider', '');
    }
}
