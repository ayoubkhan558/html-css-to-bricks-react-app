/**
 * Processes a <table> element to dynamically add CSS classes for advanced styling.
 * @param {HTMLElement} tableElement - The HTML <table> element.
 */
export const processTable = (tableElement) => {
  if (!tableElement || tableElement.tagName !== 'TABLE') {
    return;
  }

  // Regular expression to detect numbers or currency strings.
  // Handles integers, decimals, and common currency formats.
  const isNumericOrCurrency = /^-?(\$|€|£|¥)?\s*\d{1,3}(,?\d{3})*(\.\d+)?\s*$/;

  const processSection = (section) => {
    if (!section) return;
    const rows = Array.from(section.children).filter(el => el.tagName === 'TR');
    rows.forEach((row, rowIndex) => {
      // Add row-odd or row-even class
      row.classList.add(rowIndex % 2 === 0 ? 'row-odd' : 'row-even');

      const cells = Array.from(row.children);
      cells.forEach((cell, cellIndex) => {
        // Add column identifier class
        cell.classList.add(`col-${cellIndex}`);

        // Add text alignment class based on content
        const content = cell.textContent.trim();
        if (isNumericOrCurrency.test(content)) {
          cell.classList.add('text-right');
        } else {
          cell.classList.add('text-left');
        }

        // Add role-based class
        if (cell.tagName === 'TH') {
          cell.classList.add('table-header-cell');
        } else if (cell.tagName === 'TD') {
          cell.classList.add('table-data-cell');
        }
      });
    });
  };

  // Process thead, tbody, and tfoot sections
  processSection(tableElement.tHead);
  Array.from(tableElement.tBodies).forEach(processSection);
  processSection(tableElement.tFoot);
};


/**
 * Processes table elements for Bricks conversion
 */
export const processTableElement = (node, element, tag) => {
  // For table cells (td, th)
  if (['td', 'th'].includes(tag)) {
    element.name = 'text-basic';
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
    if (node.hasAttribute('align')) {
      element.settings.style += `; text-align: ${node.getAttribute('align')}`;
    }
    if (node.hasAttribute('valign')) {
      element.settings.style += `; vertical-align: ${node.getAttribute('valign')}`;
    }
    if (tag === 'th' && node.hasAttribute('scope')) {
      element.settings.scope = node.getAttribute('scope');
    }
    if (node.hasAttribute('rowspan')) {
      element.settings.rowspan = node.getAttribute('rowspan');
    }
    if (node.hasAttribute('colspan')) {
      element.settings.colspan = node.getAttribute('colspan');
    }
    
    return element;
  }
  
  // For other table elements (table, thead, tbody, etc)
  const baseStyles = {
    table: 'display: table; border-collapse: collapse; width: 100%;',
    thead: 'display: table-header-group;',
    tbody: 'display: table-row-group;',
    tfoot: 'display: table-footer-group;',
    tr: 'display: table-row;',
    th: 'display: table-cell; padding: 8px; border: 1px solid #ddd; font-weight: bold;',
    td: 'display: table-cell; padding: 8px; border: 1px solid #ddd;'
  };

  element.name = 'div';
  element.settings.tag = 'custom';
  element.settings.customTag = tag;
  element.label = 
    tag === 'table' ? 'Table' :
    tag === 'thead' ? 'Table Header' :
    tag === 'tbody' ? 'Table Body' :
    tag === 'tfoot' ? 'Table Footer' :
    tag === 'tr' ? 'Table Row' :
    tag === 'th' ? 'Table Header Cell' : 'Table Cell';
    
  element.settings.style = baseStyles[tag] || '';

  // Preserve table attributes
  if (tag === 'table') {
    ['border', 'cellpadding', 'cellspacing', 'width'].forEach(attr => {
      if (node.hasAttribute(attr)) {
        element.settings[attr] = node.getAttribute(attr);
      }
    });
  }

  return element;
};