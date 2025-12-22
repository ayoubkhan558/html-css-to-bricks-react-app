/**
 * OpenRouter Provider
 * Integration with OpenRouter's API
 */

import { BaseProvider } from '@services/ai/providers/BaseProvider';
import { AI_MODELS } from '@config/constants';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export class OpenRouterProvider extends BaseProvider {
    constructor(apiKey, model = AI_MODELS.OPENROUTER.FREE) {
        super(apiKey);
        this.model = model;
    }

    async generate(prompt, options = {}) {
        if (!this.isConfigured()) {
            throw new Error('OpenRouter API key is not configured');
        }

        const { temperature = 0.7, maxTokens = 4096 } = options;

        try {
            const response = await fetch(OPENROUTER_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': 'https://brickify.netlify.app',
                    'X-Title': 'Brickify'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert web developer. Generate clean, semantic HTML with CSS styling.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature,
                    max_tokens: maxTokens
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'OpenRouter API error');
            }

            const data = await response.json();
            const text = data.choices?.[0]?.message?.content || '';

            return this.extractCode(text);
        } catch (error) {
            logger.error('OpenRouter generation error:', error);
            throw error;
        }
    }
}
