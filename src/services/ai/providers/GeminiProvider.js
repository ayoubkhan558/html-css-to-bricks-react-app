/**
 * Gemini AI Provider
 * Integration with Google's Gemini API
 */

import { BaseProvider } from './BaseProvider';
import { AI_MODELS } from '../../../config/constants';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export class GeminiProvider extends BaseProvider {
    constructor(apiKey, model = AI_MODELS.GEMINI.FLASH) {
        super(apiKey);
        this.model = model;
    }

    async generate(prompt, options = {}) {
        if (!this.isConfigured()) {
            throw new Error('Gemini API key is not configured');
        }

        const { temperature = 0.7, maxTokens = 4096 } = options;

        try {
            const response = await fetch(
                `${GEMINI_API_URL}/${this.model}:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }],
                        generationConfig: {
                            temperature,
                            maxOutputTokens: maxTokens
                        }
                    })
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Gemini API error');
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            return this.extractCode(text);
        } catch (error) {
            console.error('Gemini generation error:', error);
            throw error;
        }
    }
}
