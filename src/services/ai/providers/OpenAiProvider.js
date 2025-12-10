/**
 * OpenAI Provider
 * Integration with OpenAI's API
 */

import { BaseProvider } from '@services/ai/providers/BaseProvider';
import { AI_MODELS } from '@config/constants';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export class OpenAiProvider extends BaseProvider {
    constructor(apiKey, model = AI_MODELS.OPENAI.GPT4_MINI) {
        super(apiKey);
        this.model = model;
    }

    async generate(prompt, options = {}) {
        if (!this.isConfigured()) {
            throw new Error('OpenAI API key is not configured');
        }

        const { temperature = 0.7, maxTokens = 4096 } = options;

        try {
            const response = await fetch(OPENAI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
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
                throw new Error(error.error?.message || 'OpenAI API error');
            }

            const data = await response.json();
            const text = data.choices?.[0]?.message?.content || '';

            return this.extractCode(text);
        } catch (error) {
            console.error('OpenAI generation error:', error);
            throw error;
        }
    }
}
