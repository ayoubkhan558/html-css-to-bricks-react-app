export function processStructureLayoutElement(node, element, tag) {
  // Default tags in Div, Block, Section, Container element of Bricks
  const defaultTags = ['div', 'section', 'article', 'nav', 'aside'];
  // Tags that represent major layout/section wrappers
  const layoutTags = ['article', 'aside', 'main', 'nav', 'figure', 'section', 'footer', 'header'];

  // Handle full-width block elements (only on div tags)
  if (tag === 'div' && (node.classList?.contains('container-fluid') || 
                       node.classList?.contains('full-width') ||
                       node.classList?.contains('fullwidth'))) {
    element.name = 'block';
    element.label = 'Block';
    element.settings.tag = 'div';
    return true;
  }

  // Handle container elements (only on div tags)
  if (tag === 'div' && (node.classList?.contains('container') || node.classList?.contains('boxed'))) {
    element.name = 'container';
    element.label = 'Container';
    element.settings.tag = 'div';
    return true;
  }

  // Handle regular div elements
  if (tag === 'div') {
    element.name = 'div';
    element.label = 'Div';
    element.settings.tag = 'div';
    return true;
  }

  if (layoutTags.includes(tag) || node.classList.contains('section')) {
    element.name = 'section';
    element.label =
      tag === 'article' ? 'Article' :
        tag === 'aside' ? 'Aside' :
          tag === 'main' ? 'Main' :
            tag === 'nav' ? 'Nav' :
              tag === 'figure' ? 'Figure' :
                tag === 'section' ? 'Section' :
                  tag === 'footer' ? 'Footer' : 'Header';

    // Use custom tag if not in defaultTags
    element.settings.tag = defaultTags.includes(tag) ? tag : 'custom';
    if (element.settings.tag === 'custom') {
      element.settings.customTag = tag;
    }
    return true;
  }

  // Not a layout tag
  return false;
}
