/**
 * Table Processor
 * Processes table elements
 */

import { BaseProcessor } from './BaseProcessor';

export class TableProcessor extends BaseProcessor {
    /**
     * Processes table element
     * @param {Node} node - DOM node
     * @param {Object} context - Processing context
     * @returns {Object} Bricks table element
     */
    process(node, context = {}) {
        const tag = node.tagName.toLowerCase();
        const element = this.createElement(node, context);

        // Handle table cells separately
        if (['td', 'th'].includes(tag)) {
            return this.processCellElement(node, element, tag, context);
        }

        // Handle other table elements
        const labels = {
            table: 'Table',
            thead: 'Table Header',
            tbody: 'Table Body',
            tfoot: 'Table Footer',
            tr: 'Table Row'
        };

        const baseStyles = {
            table: 'display: table; border-collapse: collapse; width: 100%;',
            thead: 'display: table-header-group;',
            tbody: 'display: table-row-group;',
            tfoot: 'display: table-footer-group;',
            tr: 'display: table-row;'
        };

        element.name = 'div';
        element.label = this.getElementLabel(node, labels[tag] || tag, context);
        element.settings.tag = 'custom';
        element.settings.customTag = tag;
        element.settings.style = baseStyles[tag] || '';

        // Preserve table attributes
        if (tag === 'table') {
            ['border', 'cellpadding', 'cellspacing', 'width'].forEach(attr => {
                const value = this.getAttribute(node, attr);
                if (value) {
                    element.settings[attr] = value;
                }
            });
        }

        return element;
    }

    /**
     * Processes table cell element (td, th)
     * @param {Node} node - DOM node
     * @param {Object} element - Base element
     * @param {string} tag - Tag name
     * @param {Object} context - Context
     * @returns {Object} Cell element
     */
    processCellElement(node, element, tag, context) {
        element.name = 'text-basic';
        element.label = this.getElementLabel(
            node,
            tag === 'th' ? 'Header Cell' : 'Table Cell',
            context
        );
        element.settings.tag = 'custom';
        element.settings.customTag = tag;

        // Handle cell content
        const hasRichText = node.innerHTML !== node.textContent.trim();
        element.settings.text = hasRichText ? node.innerHTML : node.textContent.trim();
        if (hasRichText) element.settings.isRichText = true;

        // Apply basic cell styling
        element.settings.style = tag === 'th'
            ? 'display: table-cell; padding: 8px; border: 1px solid #ddd; font-weight: bold;'
            : 'display: table-cell; padding: 8px; border: 1px solid #ddd;';

        // Handle cell attributes
        ['align', 'valign', 'scope', 'rowspan', 'colspan'].forEach(attr => {
            const value = this.getAttribute(node, attr);
            if (value) {
                if (attr === 'align') {
                    element.settings.style += `; text-align: ${value}`;
                } else if (attr === 'valign') {
                    element.settings.style += `; vertical-align: ${value}`;
                } else {
                    element.settings[attr] = value;
                }
            }
        });

        element._skipTextNodes = true;
        return element;
    }

    /**
     * Check if can process this node
     * @param {Node} node - DOM node
     * @returns {boolean} True if table element
     */
    canProcess(node) {
        const tag = node.tagName?.toLowerCase();
        return ['table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td'].includes(tag);
    }
}
