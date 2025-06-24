import { processLink } from '../links';

/**
 * Process inline text elements (span, strong, em, mark, time, etc.)
 * @param {Element} node - The inline element to process
 * @param {string} elementId - The ID for the new element
 * @returns {Object} The processed inline element
 */
const processInlineElement = (node, elementId) => {
  const tag = node.tagName.toLowerCase();
  const text = node.textContent.trim();
  
  // Special case: anchor tags are handled by the link processor
  if (tag === 'a') {
    return processLink(node, elementId, 'text-link');
  }

  const baseElement = {
    id: elementId,
    name: 'text-basic',
    parent: '0',
    children: [],
    settings: {
      text,
      tag
    },
    label: tag.charAt(0).toUpperCase() + tag.slice(1) // Capitalize first letter for label
  };

  // Special handling for specific inline elements
  switch (tag) {
    case 'mark':
      baseElement.settings.style = {
        backgroundColor: '#ffeb3b',
        padding: '0.2em',
        borderRadius: '2px'
      };
      baseElement.label = 'Highlighted Text';
      break;

    case 'time':
      const datetime = node.getAttribute('datetime');
      if (datetime) {
        baseElement.settings.datetime = datetime;
        // Format the date for display if needed
        try {
          const date = new Date(datetime);
          if (!isNaN(date)) {
            baseElement.settings.text = date.toLocaleDateString();
          }
        } catch (e) {
          // If date parsing fails, just use the text content
        }
      }
      baseElement.label = 'Date/Time';
      break;

    case 'strong':
    case 'b':
      baseElement.settings.style = { fontWeight: 'bold' };
      break;

    case 'em':
    case 'i':
      baseElement.settings.style = { fontStyle: 'italic' };
      break;

    case 'small':
      baseElement.settings.style = { fontSize: '0.8em' };
      break;
  }

  return baseElement;
};

export default processInlineElement;
