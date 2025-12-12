import React from 'react';
import './TemplateSelector.scss';

/**
 * Template Selector Component
 * Displays checkboxes for AI prompt templates
 */
const TemplateSelector = ({ templates, onToggle, compact = false }) => {
    // Group templates by category
    const categories = {
        naming: templates.filter(t => t.category === 'naming'),
        quality: templates.filter(t => t.category === 'quality'),
        refactoring: templates.filter(t => t.category === 'refactoring'),
        structure: templates.filter(t => t.category === 'structure'),
    };

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

    if (compact) {
        // Compact view - all in a grid
        return (
            <div className="template-selector template-selector--compact">
                {templates.map(renderCheckbox)}
            </div>
        );
    }

    // Grouped view
    return (
        <div className="template-selector">
            {Object.entries(categories).map(([category, categoryTemplates]) => {
                if (categoryTemplates.length === 0) return null;

                return (
                    <div key={category} className="template-selector__category">
                        <h4 className="template-selector__category-title">
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h4>
                        <div className="template-selector__grid">
                            {categoryTemplates.map(renderCheckbox)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TemplateSelector;
