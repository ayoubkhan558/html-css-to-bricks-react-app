// Parse box-shadow CSS property
export function parseBoxShadow(boxShadow) {
  if (!boxShadow || boxShadow === 'none') return null;
  
  // Enhanced regex to precisely match box-shadow components and color
  const boxShadowRegex = /(-?\d+(?:\.\d+)?(?:px|rem|em|%)?)\s+(-?\d+(?:\.\d+)?(?:px|rem|em|%)?)(?:\s+(-?\d+(?:\.\d+)?(?:px|rem|em|%)?))?(?:\s+(-?\d+(?:\.\d+)?(?:px|rem|em|%)?))?(?:\s+(#\w+|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%]+\)))?/;
  
  const match = boxShadow.match(boxShadowRegex);
  if (!match) return null;
  
  // Extract color - prioritize capturing the exact color format
  let color = match[5] ? match[5].trim() : 'rgba(0,0,0,0.2)';
  
  // Clean up color string (remove extra spaces in rgba/hsla)
  if (color.startsWith('rgba') || color.startsWith('hsla')) {
    color = color.replace(/\s*,\s*/g, ',').replace(/\s+/g, ' ');
  }
  
  return {
    offsetX: match[1].replace(/[^\d.-]/g, ''),
    offsetY: match[2].replace(/[^\d.-]/g, ''),
    blur: match[3] ? match[3].replace(/[^\d.-]/g, '') : '0',
    spread: match[4] ? match[4].replace(/[^\d.-]/g, '') : '0',
    color: color
  };
}
