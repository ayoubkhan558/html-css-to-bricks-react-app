export function processStructureLayoutElement(node, element, tag) {
  // Tags that represent major layout/section wrappers
  const layoutTags = ['article', 'aside', 'main', 'nav', 'figure', 'section', 'footer', 'header'];

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

    element.settings.tag = 'custom';
    element.settings.customTag = tag;
    return true;
  }

  // Not a layout tag
  return false;
}
