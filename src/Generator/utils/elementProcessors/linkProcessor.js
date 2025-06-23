import { getUniqueId } from '../utils';

const processLink = (node, elementId) => {
  return {
    id: elementId,
    name: 'text-link',
    parent: '0',
    children: [],
    settings: {
      text: node.textContent.trim(),
      link: {
        type: 'external',
        url: node.getAttribute('href') || '',
        noFollow: node.getAttribute('rel')?.includes('nofollow') || false,
        openInNewWindow: node.getAttribute('target') === '_blank',
        noReferrer: node.getAttribute('rel')?.includes('noreferrer') || false
      }
    },
    label: 'Link'
  };
};

export { processLink };
