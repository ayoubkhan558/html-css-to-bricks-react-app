import React from 'react';
import './QuickActionTags.scss';

/**
 * Quick Action Tags Component
 * Displays clickable tags for quick AI template actions
 * Only shows when code exists and template is enabled with quickAction: true
 */
const QuickActionTags = ({ templates, activeTab, hasCode, onActionClick, isGenerating }) => {
    // Filter templates for quick actions that apply to current tab
    const quickActionTemplates = templates.filter(template =>
        template.enabled &&
        template.quickAction &&
        template.appliesTo &&
        template.appliesTo.includes(activeTab)
    );

    // Don't render if no code or no quick action templates
    if (!hasCode || quickActionTemplates.length === 0) {
        return null;
    }

    return (
        <div className="quick-action-tags">
            <span className="quick-action-tags__label">Quick Actions:</span>
            <div className="quick-action-tags__list">
                {quickActionTemplates.map(template => (
                    <button
                        key={template.id}
                        className="quick-action-tag"
                        onClick={() => onActionClick(template.id)}
                        disabled={isGenerating}
                        title={template.description}
                    >
                        {template.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickActionTags;
