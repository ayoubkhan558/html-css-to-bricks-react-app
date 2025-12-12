import { useState, useEffect } from 'react';
import { logger } from '@lib/logger';

/**
 * Custom hook for AI code generation functionality
 * Handles API key management, provider selection, and quick generation
 */
export const useAIGeneration = (activeTab, html, css, js, setHtml, setCss, setJs) => {
    const [isQuickGenerating, setIsQuickGenerating] = useState(false);
    const [quickError, setQuickError] = useState(null);
    const [quickPrompt, setQuickPrompt] = useState('');
    const [hasApiKey, setHasApiKey] = useState(false);
    const [apiKeys, setApiKeys] = useState({
        gemini: '',
        openrouter: '',
        openai: ''
    });
    const [currentProvider, setCurrentProvider] = useState('gemini');
    const [selectedQuickModel, setSelectedQuickModel] = useState('');
    const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);

    // Check for API key on mount and when settings close
    useEffect(() => {
        const checkApiKeys = () => {
            const keys = {
                gemini: localStorage.getItem('ai_api_key_gemini') || '',
                openrouter: localStorage.getItem('ai_api_key_openrouter') || '',
                openai: localStorage.getItem('ai_api_key_openai') || ''
            };

            setApiKeys(keys);

            const provider = localStorage.getItem('ai_provider') || 'gemini';
            const model = localStorage.getItem('ai_model');

            setCurrentProvider(provider);
            setHasApiKey(!!keys[provider]);

            // Set selected model from localStorage or default
            if (model) {
                setSelectedQuickModel(model);
            } else {
                const defaultModel = provider === 'gemini' ? 'gemini-2.5-flash' :
                    provider === 'openrouter' ? 'google/gemini-2.0-flash-exp:free' :
                        'gpt-4o-mini';
                setSelectedQuickModel(defaultModel);
            }
        };

        checkApiKeys();

        // Re-check when component mounts or settings modal state changes
        if (!isAISettingsOpen) {
            checkApiKeys();
        }
    }, [isAISettingsOpen]);

    const handleAICodeGenerated = (generatedCode) => {
        if (generatedCode.html) setHtml(generatedCode.html);
        if (generatedCode.css) setCss(generatedCode.css);
        if (generatedCode.js) setJs(generatedCode.js);
    };

    const handleQuickGenerate = async () => {
        if (!quickPrompt.trim() || isQuickGenerating) return;

        // Get the API key for the current provider
        const currentApiKey = apiKeys[currentProvider];
        if (!currentApiKey) {
            setQuickError('Please set your AI API key in settings first.');
            setTimeout(() => setQuickError(null), 3000);
            return;
        }

        setIsQuickGenerating(true);
        setQuickError(null);

        try {
            // Temporarily save the selected model to localStorage for this request
            const originalModel = localStorage.getItem('ai_model');
            localStorage.setItem('ai_model', selectedQuickModel);

            const { aiService } = await import('@services/ai');

            // Build context based on active tab and existing code
            const currentCode = activeTab === 'html' ? html : activeTab === 'css' ? css : js;
            const hasExistingCode = currentCode.trim();

            let systemPrompt = `
        You are an expert web developer. Generate clean, modern code based on the user's request.

          IMPORTANT:
          - Dont provide html, body, head tag etc
          - Return ONLY the ${activeTab.toUpperCase()} code, no explanations
          - Use proper formatting and indentation
          - For updates, return the COMPLETE updated code
          - Do NOT wrap CSS in <style> tags - provide raw CSS only
          - Do NOT wrap JavaScript in <script> tags - provide raw JavaScript only
          - Keep HTML, CSS, and JavaScript separate`;

            if (hasExistingCode) {
                systemPrompt += `

          CURRENT ${activeTab.toUpperCase()} CODE:
          \`\`\`${activeTab}
          ${currentCode}
          \`\`\``;
            }

            // Configure AI service
            aiService.configure(currentProvider, currentApiKey, selectedQuickModel);

            // Generate code
            const response = await aiService.generate(quickPrompt.trim(), {
                systemPrompt
            });

            // Clean the response
            let cleanedCode = response.trim();

            // Remove markdown code blocks if present
            const codeBlockRegex = /^```[\w]*\n([\s\S]*?)\n```$/;
            const match = cleanedCode.match(codeBlockRegex);
            if (match) {
                cleanedCode = match[1];
            }

            // Update the appropriate code field
            if (activeTab === 'html') {
                setHtml(cleanedCode);
            } else if (activeTab === 'css') {
                setCss(cleanedCode);
            } else if (activeTab === 'js') {
                setJs(cleanedCode);
            }

            setQuickPrompt('');

            // Restore original model
            if (originalModel) {
                localStorage.setItem('ai_model', originalModel);
            }
        } catch (error) {
            logger.error('AI code generation failed', {
                file: 'useAIGeneration.js',
                step: 'handleQuickGenerate',
                feature: `AI - ${activeTab?.toUpperCase() || 'Unknown'}`
            }, error);
            setQuickError(error.message || 'Failed to generate code. Please try again.');
        } finally {
            setIsQuickGenerating(false);
        }
    };

    return {
        // State
        isQuickGenerating,
        quickError,
        quickPrompt,
        hasApiKey,
        apiKeys,
        currentProvider,
        selectedQuickModel,
        isAISettingsOpen,

        // Setters
        setQuickPrompt,
        setSelectedQuickModel,
        setIsAISettingsOpen,

        // Handlers
        handleAICodeGenerated,
        handleQuickGenerate
    };
};
