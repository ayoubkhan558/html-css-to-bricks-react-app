import React from 'react';
import './TemplateSelector.scss';

/**
 * Template Selector Component
 * Displays checkboxes for AI prompt templates
 */
const TemplateSelector = ({ templates, onToggle }) => {
    const renderCheckbox = (template) => (
        <label
            key={template.id}
            className={`template-checkbox ${template.enabled ? 'template-checkbox--enabled' : ''}`}
            title={template.description}
        >
            <input
                type="checkbox"
                checked={template.enabled || false}
                onChange={() => onToggle(template.id)}
            />
            <span className="template-checkbox__label">{template.name}</span>
        </label>
    );

    // Grouped view - now flat without categories
    return (
        <div className="template-selector">
            <div className="template-selector__grid">
                {templates.map(renderCheckbox)}
            </div>
        </div>
    );
};

export default TemplateSelector;
