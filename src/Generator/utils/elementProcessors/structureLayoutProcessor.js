export function processStructureLayoutElement(node, element, tag) {
  // Layout elements
  const layoutTags = ['article', 'aside', 'main', 'nav', 'figure', 'section', 'footer', 'header'];
  
  if (layoutTags.includes(tag) || node.classList.contains('section')) {
    element.name = tag === 'div' ? 'div' : 'section';
    element.label = 
      tag === 'article' ? 'Article' :
      tag === 'aside' ? 'Aside' :
      tag === 'main' ? 'Main' :
      tag === 'nav' ? 'Nav' :
      tag === 'figure' ? 'Figure' :
      tag === 'section' ? 'Section' :
      tag === 'footer' ? 'Footer' : 'Header';
    
    element.settings.tag = 'custom';
    element.settings.customTag = tag;
    return true;
  }

  // Generic divs
  if (tag === 'div') {
    element.name = 'div';
    element.label = 'Div';
    element.settings.tag = 'custom';
    element.settings.customTag = tag;
    return true;
  }

  return false;
}
