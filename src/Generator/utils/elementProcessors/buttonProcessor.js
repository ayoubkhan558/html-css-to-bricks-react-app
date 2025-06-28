/**
 * Processes button elements for Bricks conversion
 */
export const processButtonElement = (node, element) => {
  element.name = 'button';
  element.label = 'Button';
  
  // Set default button styles
  element.settings = {
    style: "primary",
    tag: "button",
    size: "md",
    text: node.textContent.trim() || 'Button'
  };
  
  // Handle button attributes
  if (node.hasAttribute('disabled')) {
    element.settings.disabled = true;
  }
  
  return element;
};
