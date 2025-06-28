/**
 * Processes link elements (a) for Bricks conversion
 */
export const processLinkElement = (node, element) => {
  element.name = 'text-link';
  element.label = 'Link';
  
  // Handle href attribute and link settings
  if (node.hasAttribute('href')) {
    element.settings.link = {
      type: 'external',
      url: node.getAttribute('href') || '',
      noFollow: node.getAttribute('rel')?.includes('nofollow') || false,
      openInNewWindow: node.getAttribute('target') === '_blank',
      noReferrer: node.getAttribute('rel')?.includes('noreferrer') || false
    };
  }
  
  // Handle text content
  const textContent = node.textContent.trim();
  if (textContent) {
    element.settings.text = textContent;
    element.settings.tag = 'a';
  }
  
  return element;
};
