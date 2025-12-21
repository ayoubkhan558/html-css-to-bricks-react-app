import { useState, useEffect, useCallback } from 'react';
import defaultTemplates from '@config/aiTemplates.json';

/**
 * Hook for managing AI prompt templates
 * Handles default templates + custom user templates
 */
export const useAITemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [customTemplates, setCustomTemplates] = useState([]);
    const [enabledTemplateIds, setEnabledTemplateIds] = useState([]);

    // Load templates on mount
    useEffect(() => {
        loadTemplates();
    }, []);

    /**
   * Load templates from default JSON + localStorage
   */
    const loadTemplates = useCallback(() => {
        // Load custom templates from localStorage
        const storedCustom = localStorage.getItem('ai_custom_templates');
        const custom = storedCustom ? JSON.parse(storedCustom) : [];
        setCustomTemplates(custom);

        // Load enabled template IDs
        const storedEnabled = localStorage.getItem('ai_enabled_templates');
        const enabled = storedEnabled ? JSON.parse(storedEnabled) : [];
        setEnabledTemplateIds(enabled);

        // Combine default + custom templates with proper enabled state
        const allTemplates = [...defaultTemplates, ...custom].map(template => ({
            ...template,
            enabled: enabled.includes(template.id) // Explicitly set enabled based on stored IDs
        }));

        setTemplates(allTemplates);
    }, []);

    /**
     * Toggle template enabled state and update prompt text
     */
    const toggleTemplate = useCallback((templateId, setPromptCallback) => {
        // Find the template first
        const template = templates.find(t => t.id === templateId);
        if (!template) return;

        const newEnabledState = !template.enabled;

        // Update template state
        setTemplates(currentTemplates => {
            const updatedTemplates = currentTemplates.map(t =>
                t.id === templateId ? { ...t, enabled: newEnabledState } : t
            );

            // Save enabled state
            const enabledIds = updatedTemplates.filter(t => t.enabled).map(t => t.id);
            localStorage.setItem('ai_enabled_templates', JSON.stringify(enabledIds));
            setEnabledTemplateIds(enabledIds);

            return updatedTemplates;
        });

        // Update prompt text AFTER state update (outside of setState)
        if (setPromptCallback) {
            if (newEnabledState) {
                // Template is being enabled - add its prompt
                setPromptCallback(currentPrompt => {
                    const trimmedPrompt = currentPrompt.trim();
                    return trimmedPrompt
                        ? `${trimmedPrompt}\n\n${template.prompt}`
                        : template.prompt;
                });
            } else {
                // Template is being disabled - remove its prompt
                setPromptCallback(currentPrompt => {
                    return currentPrompt.replace(template.prompt, '').trim();
                });
            }
        }
    }, [templates]);

    /**
     * Create new custom template
     */
    const createTemplate = useCallback((template) => {
        const newTemplate = {
            ...template,
            id: `custom-${Date.now()}`,
            type: 'custom',
            editable: true,
            enabled: false
        };

        const updatedCustom = [...customTemplates, newTemplate];
        setCustomTemplates(updatedCustom);
        localStorage.setItem('ai_custom_templates', JSON.stringify(updatedCustom));

        setTemplates(prev => [...prev, newTemplate]);

        return newTemplate.id;
    }, [customTemplates]);

    /**
     * Update existing custom template
     */
    const updateTemplate = useCallback((templateId, updates) => {
        const updatedCustom = customTemplates.map(t =>
            t.id === templateId ? { ...t, ...updates } : t
        );

        setCustomTemplates(updatedCustom);
        localStorage.setItem('ai_custom_templates', JSON.stringify(updatedCustom));

        setTemplates(prev =>
            prev.map(t => (t.id === templateId ? { ...t, ...updates } : t))
        );
    }, [customTemplates]);

    /**
     * Delete custom template
     */
    const deleteTemplate = useCallback((templateId) => {
        const updatedCustom = customTemplates.filter(t => t.id !== templateId);
        setCustomTemplates(updatedCustom);
        localStorage.setItem('ai_custom_templates', JSON.stringify(updatedCustom));

        // Remove from enabled list if present
        const updatedEnabled = enabledTemplateIds.filter(id => id !== templateId);
        setEnabledTemplateIds(updatedEnabled);
        localStorage.setItem('ai_enabled_templates', JSON.stringify(updatedEnabled));

        setTemplates(prev => prev.filter(t => t.id !== templateId));
    }, [customTemplates, enabledTemplateIds]);

    /**
     * Get enabled templates
     */
    const getEnabledTemplates = useCallback(() => {
        return templates.filter(t => t.enabled);
    }, [templates]);

    /**
     * Get combined prompt from enabled templates
     */
    const getCombinedPrompt = useCallback(() => {
        const enabled = templates.filter(t => t.enabled);
        if (enabled.length === 0) return '';

        return enabled.map(t => t.prompt).join('\n\n');
    }, [templates]);

    /**
     * Get templates by category
     */
    const getTemplatesByCategory = useCallback((category) => {
        return templates.filter(t => t.category === category);
    }, [templates]);

    /**
     * Reset to defaults (clear custom templates and enabled state)
     */
    const resetToDefaults = useCallback(() => {
        localStorage.removeItem('ai_custom_templates');
        localStorage.removeItem('ai_enabled_templates');
        loadTemplates();
    }, [loadTemplates]);

    /**
     * Get quick action templates for specific tab
     * Filters by enabled, quickAction, and appliesTo array
     */
    const getQuickActionTemplates = useCallback((activeTab) => {
        return templates.filter(t =>
            t.enabled &&
            t.quickAction &&
            t.appliesTo &&
            t.appliesTo.includes(activeTab)
        );
    }, [templates]);

    return {
        templates,
        customTemplates,
        enabledTemplateIds,
        toggleTemplate,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        getEnabledTemplates,
        getCombinedPrompt,
        getTemplatesByCategory,
        getQuickActionTemplates,
        resetToDefaults,
        reload: loadTemplates
    };
};
