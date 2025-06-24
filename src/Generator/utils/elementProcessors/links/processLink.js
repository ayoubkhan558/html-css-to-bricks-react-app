/**
 * Process link elements (<a> tags)
 * @param {Element} node - The anchor element to process
 * @param {string} elementId - The ID for the new element
 * @param {string} [elementName='text-link'] - The name of the element type
 * @returns {Object} The processed link element
 */
const processLink = (node, elementId, elementName = 'text-link') => {
  const href = node.getAttribute('href') || '#';
  const rel = node.getAttribute('rel') || '';
  const isExternal = !href.startsWith('#');
  
  return {
    id: elementId,
    name: elementName,
    parent: '0',
    children: [],
    settings: {
      text: node.textContent.trim(),
      tag: 'a',
      link: {
        type: isExternal ? 'external' : 'internal',
        url: href,
        noFollow: rel.includes('nofollow'),
        openInNewWindow: node.getAttribute('target') === '_blank',
        noReferrer: rel.includes('noreferrer')
      }
    },
    label: 'Link'
  };
};

export default processLink;
