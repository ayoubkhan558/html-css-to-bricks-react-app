import { useState, useEffect } from 'react';
import { logger } from '@lib/logger';

/**
 * Custom hook for AI code generation functionality
 * Handles API key management, provider selection, and quick generation
 * @param {Object} aiTemplates - AI templates hook for getting enabled templates
 */
export const useAIGeneration = (activeTab, html, css, js, setHtml, setCss, setJs, aiTemplates = null) => {
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
        // Check if we have either a prompt OR enabled templates
        const hasEnabledTemplates = aiTemplates && aiTemplates.getEnabledTemplates().length > 0;
        const hasPrompt = quickPrompt.trim();

        if (!hasPrompt && !hasEnabledTemplates) {
            setQuickError('Please enter a prompt or enable at least one template.');
            setTimeout(() => setQuickError(null), 3000);
            return;
        }

        if (isQuickGenerating) return;

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

          CRITICAL RULES:
          - Return ONLY raw ${activeTab.toUpperCase()} code - nothing else
          - Do NOT return JSON objects like {"html":"...","css":"...","js":"..."}
          - Do NOT include <!DOCTYPE html>, <html>, <body>, <head> tags
          - Do NOT wrap CSS in <style> tags - provide raw CSS only
          - Do NOT wrap JavaScript in <script> tags - provide raw JavaScript only
          - Do NOT add explanations, comments about refactoring, or notes
          - Use proper formatting and indentation
          - For updates, return the COMPLETE updated code
          - Keep HTML, CSS, and JavaScript separate
          ${hasExistingCode ? `\n- PRESERVE the existing code structure - only update/refactor as requested\n- Do NOT delete or clear existing code unless explicitly asked` : ''}`;

            // Add template requirements if templates are enabled
            if (aiTemplates && aiTemplates.getEnabledTemplates().length > 0) {
                const templatePrompts = aiTemplates.getCombinedPrompt();
                systemPrompt += `\n\n${templatePrompts}`;
            }

            // Add design systems if available - extract variable names from all uploaded JSONs
            const designSystemsData = localStorage.getItem('ai_design_systems');
            if (designSystemsData) {
                try {
                    const systems = JSON.parse(designSystemsData);
                    if (systems && systems.length > 0) {
                        let dsPrompt = '\n\nDESIGN SYSTEM CONSTRAINTS:\nUse ONLY the following variable names from your Bricks design system:\n';

                        systems.forEach((system, index) => {
                            const ds = system.data;
                            dsPrompt += `\n--- From ${system.filename} ---\n`;

                            if (ds.colors) {
                                const colorNames = Object.keys(ds.colors);
                                dsPrompt += `\nColor Variables: ${colorNames.join(', ')}`;
                            }
                            if (ds.typography) {
                                const typoNames = Object.keys(ds.typography);
                                dsPrompt += `\nTypography Variables: ${typoNames.join(', ')}`;
                            }
                            if (ds.spacing) {
                                const spacingNames = Object.keys(ds.spacing);
                                dsPrompt += `\nSpacing Variables: ${spacingNames.join(', ')}`;
                            }
                            if (ds.variables) {
                                const varNames = Object.keys(ds.variables);
                                dsPrompt += `\nCSS Variables: ${varNames.join(', ')}`;
                            }
                            if (ds.classes && Array.isArray(ds.classes)) {
                                dsPrompt += `\nUtility Classes: ${ds.classes.join(', ')}`;
                            }
                        });

                        dsPrompt += '\n\nIMPORTANT: Use EXACTLY these variable names. Do not create new variable names.';
                        systemPrompt += dsPrompt;
                    }
                } catch (e) {
                    // Silently fail if design systems are invalid
                }
            }

            if (hasExistingCode) {
                systemPrompt += `

          CURRENT ${activeTab.toUpperCase()} CODE:
          \`\`\`${activeTab}
          ${currentCode}
          \`\`\``;
            }


            // Configure AI service
            aiService.configure(currentProvider, currentApiKey, selectedQuickModel);

            // Check if we're using naming templates (BEM, OOCSS, Semantic) - these affect both HTML and CSS
            const namingTemplates = aiTemplates?.getEnabledTemplates().filter(t =>
                t.category === 'naming'
            ) || [];
            const isUsingNamingTemplates = namingTemplates.length > 0;

            // Build user prompt with existing code context
            let userPrompt = quickPrompt.trim();

            if (!userPrompt) {
                // No user prompt - use default based on whether code exists
                if (hasExistingCode) {
                    if (isUsingNamingTemplates && (html.trim() || css.trim())) {
                        // For naming templates, request both HTML and CSS updates
                        userPrompt = `I have HTML and CSS code that needs to be refactored according to the naming template guidelines (e.g., BEM, OOCSS). Please update BOTH the HTML classes AND the corresponding CSS selectors while preserving all existing content and structure.

Return your response in this exact JSON format:
{
  "html": "updated HTML code here",
  "css": "updated CSS code here"
}

Current HTML:
\`\`\`html
${html}
\`\`\`

Current CSS:
\`\`\`css
${css}
\`\`\``;
                    } else {
                        // Single tab update
                        userPrompt = `I have the following ${activeTab.toUpperCase()} code that needs to be refactored according to the template guidelines provided in the system prompt. Please update the code while preserving all existing content and structure:\n\n\`\`\`${activeTab}\n${currentCode}\n\`\`\``;
                    }
                } else {
                    userPrompt = 'Generate code following the selected template guidelines.';
                }
            } else if (hasExistingCode) {
                // User provided prompt - append existing code for context
                userPrompt += `\n\nCurrent ${activeTab.toUpperCase()} code:\n\`\`\`${activeTab}\n${currentCode}\n\`\`\``;
            }

            // Generate code
            const response = await aiService.generate(userPrompt, {
                systemPrompt
            });


            // Extract text from response (handle multiple API response formats)
            let responseText = '';

            if (typeof response === 'string') {
                // Simple string response
                responseText = response;
            } else if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
                // Gemini API format: {candidates: [{content: {parts: [{text: "..."}]}}]}
                responseText = response.candidates[0].content.parts[0].text;
            } else if (response?.text) {
                // OpenAI/OpenRouter format: {text: "..."}
                responseText = response.text;
            } else if (response?.content) {
                // Alternative format: {content: "..."}
                responseText = response.content;
            } else {
                // Fallback: try to stringify and extract
                responseText = JSON.stringify(response);
            }

            if (!responseText || !responseText.trim()) {
                throw new Error('AI returned empty response');
            }

            // Clean the response
            let cleanedCode = responseText.trim();

            // Check if AI returned JSON object (e.g., {"html":"...","css":"...","js":""})
            if (cleanedCode.startsWith('{') && cleanedCode.includes('"html"') || cleanedCode.includes('"css"') || cleanedCode.includes('"js"')) {
                try {
                    const parsed = JSON.parse(cleanedCode);
                    // Extract the relevant code based on active tab
                    if (activeTab === 'html' && parsed.html) {
                        cleanedCode = parsed.html;
                    } else if (activeTab === 'css' && parsed.css) {
                        cleanedCode = parsed.css;
                    } else if (activeTab === 'js' && parsed.js) {
                        cleanedCode = parsed.js;
                    }
                } catch (e) {
                    // Not valid JSON, continue with original
                }
            }

            // Remove markdown code blocks if present
            const codeBlockRegex = /^```[\w]*\n([\s\S]*?)\n```$/;
            const match = cleanedCode.match(codeBlockRegex);
            if (match) {
                cleanedCode = match[1];
            }

            // Check if response contains both HTML and CSS (for naming templates)
            if (cleanedCode.startsWith('{') && cleanedCode.includes('"html"') && cleanedCode.includes('"css"')) {
                try {
                    const parsed = JSON.parse(cleanedCode);
                    // Update both HTML and CSS
                    if (parsed.html) {
                        setHtml(parsed.html);
                    }
                    if (parsed.css) {
                        setCss(parsed.css);
                    }
                    // Don't update JS unless provided
                    if (parsed.js) {
                        setJs(parsed.js);
                    }
                } catch (e) {
                    // If JSON parse fails, fall back to single tab update
                    if (activeTab === 'html') {
                        setHtml(cleanedCode);
                    } else if (activeTab === 'css') {
                        setCss(cleanedCode);
                    } else if (activeTab === 'js') {
                        setJs(cleanedCode);
                    }
                }
            } else {
                // Single tab update
                if (activeTab === 'html') {
                    setHtml(cleanedCode);
                } else if (activeTab === 'css') {
                    setCss(cleanedCode);
                } else if (activeTab === 'js') {
                    setJs(cleanedCode);
                }
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
