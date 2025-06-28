/**
 * Processes table elements for Bricks conversion
 */
export const processTableElement = (node, element, tag) => {
  // For table cells (td/th), use text-basic directly
  if (['td', 'th'].includes(tag)) {
    element.name = 'text-basic';
    element.settings.tag = 'custom';
    element.settings.customTag = tag;
    
    // Check for rich text content (contains HTML formatting tags)
    const hasRichText = node.innerHTML !== node.textContent.trim();
    
    if (hasRichText) {
      element.settings.text = node.innerHTML;
      element.settings.isRichText = true;
    } else {
      element.settings.text = node.textContent.trim();
    }
    
    // Apply table cell styling
    element.settings.style = tag === 'th' 
      ? 'display: table-cell; padding: 8px; border: 1px solid #ddd; font-weight: bold;' 
      : 'display: table-cell; padding: 8px; border: 1px solid #ddd;';
    
    // Preserve alignment and scope
    if (node.hasAttribute('align')) {
      element.settings.style += `; text-align: ${node.getAttribute('align')}`;
    }
    if (node.hasAttribute('valign')) {
      element.settings.style += `; vertical-align: ${node.getAttribute('valign')}`;
    }
    if (tag === 'th' && node.hasAttribute('scope')) {
      element.settings.scope = node.getAttribute('scope');
    }
    
    return element;
  }
  
  // For other table elements (table, thead, tbody, etc)
  element.name = 'div';
  element.settings.tag = 'custom';
  element.settings.customTag = tag;

  // Base styles for each table component
  const baseStyles = {
    table: 'display: table; width: 100%; border-collapse: collapse;',
    thead: 'display: table-header-group; background-color: #f8f9fa;',
    tbody: 'display: table-row-group;',
    tfoot: 'display: table-footer-group; background-color: #f8f9fa;',
    tr: 'display: table-row;',
    th: 'display: table-cell; padding: 8px; border: 1px solid #ddd; font-weight: bold; text-align: left;',
    td: 'display: table-cell; padding: 8px; border: 1px solid #ddd;'
  };

  // Set labels and base styles
  element.label = 
    tag === 'table' ? 'Table' :
    tag === 'thead' ? 'Table Header' :
    tag === 'tbody' ? 'Table Body' :
    tag === 'tfoot' ? 'Table Footer' :
    tag === 'tr' ? 'Table Row' :
    tag === 'th' ? 'Table Header Cell' : 'Table Cell';
    
  element.settings.style = baseStyles[tag];

  // Preserve important table attributes
  if (tag === 'table') {
    const attrs = ['border', 'cellpadding', 'cellspacing'];
    attrs.forEach(attr => {
      if (node.hasAttribute(attr)) {
        element.settings[attr] = node.getAttribute(attr);
      }
    });
  }

  // Preserve rowspan/colspan
  if (node.hasAttribute('rowspan')) {
    element.settings.rowspan = node.getAttribute('rowspan');
  }
  if (node.hasAttribute('colspan')) {
    element.settings.colspan = node.getAttribute('colspan');
  }

  return element;
};
