import React from 'react';
import { FaTimes, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import TemplateSelector from '../AITemplates/TemplateSelector';
import aiModels from '@config/aiModels.json';
import './AIPromptModal.scss';

const AIPromptModal = ({
    isOpen,
    onClose,
    aiGeneration,
    aiTemplates,
    activeTab
}) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleSend = () => {
        aiGeneration.handleQuickGenerate();
        // Optionally close modal after sending
        // onClose();
    };

    return (
        <div
            className="ai-prompt-modal-overlay"
            onClick={handleOverlayClick}
            onKeyDown={handleKeyDown}
        >
            <div className="ai-prompt-modal">
                {/* Header */}
                <div className="ai-prompt-modal__header">
                    <div className="ai-prompt-modal__header-left">
                        <h3 className="ai-prompt-modal__title">AI Assistant</h3>
                        {/* Model Selector */}
                        <select
                            value={aiGeneration.selectedQuickModel}
                            onChange={(e) => aiGeneration.setSelectedQuickModel(e.target.value)}
                            className="ai-prompt-modal__model-select"
                            disabled={aiGeneration.isQuickGenerating}
                        >
                            {aiGeneration.currentProvider && aiModels[aiGeneration.currentProvider]?.map(model => (
                                <option key={model.value} value={model.value}>
                                    {model.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="ai-prompt-modal__controls">


                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="ai-prompt-modal__close"
                            aria-label="Close modal"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="ai-prompt-modal__body">
                    {/* Template Selector */}
                    <div className="ai-prompt-modal__templates">
                        <TemplateSelector
                            templates={aiTemplates.templates}
                            onToggle={(templateId) => aiTemplates.toggleTemplate(templateId, aiGeneration.setQuickPrompt)}
                        />
                    </div>

                    {/* Prompt Textarea */}
                    <div className="ai-prompt-modal__input-section">
                        <textarea
                            rows={8}
                            value={aiGeneration.quickPrompt}
                            onChange={(e) => aiGeneration.setQuickPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.ctrlKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder={aiGeneration.hasApiKey
                                ? `Ask AI to create/modify ${activeTab.toUpperCase()} code...\n\nExamples:\n- "Refactor this code to use BEM naming"\n- "Add hover effects to buttons"\n- "Convert colors to CSS variables"\n\nPress Ctrl+Enter to send`
                                : "Set API key in settings first..."
                            }
                            className="ai-prompt-modal__textarea"
                            disabled={aiGeneration.isQuickGenerating || !aiGeneration.hasApiKey}
                        />

                        {aiGeneration.quickError && (
                            <div className="ai-prompt-modal__error">
                                {aiGeneration.quickError}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="ai-prompt-modal__footer">
                    <button
                        onClick={onClose}
                        className="button secondary ai-prompt-modal__button ai-prompt-modal__button--secondary"
                        disabled={aiGeneration.isQuickGenerating}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSend}
                        className="button primary ai-prompt-modal__button ai-prompt-modal__button--primary"
                        disabled={
                            (!aiGeneration.quickPrompt.trim() && aiTemplates.getEnabledTemplates().length === 0) ||
                            aiGeneration.isQuickGenerating ||
                            !aiGeneration.hasApiKey
                        }
                    >
                        {aiGeneration.isQuickGenerating ? (
                            <>
                                <FaSpinner className="spinning" /> Generating...
                            </>
                        ) : (
                            <>
                                <FaPaperPlane /> Send to AI
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIPromptModal;
