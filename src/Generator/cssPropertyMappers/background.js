import { toHex } from '@lib/cssUtils';
import { logger } from '@lib/logger';
import { generateId } from '@lib/bricks';

// Helper function to check if a value is a color
const isColor = (value) => {
  if (typeof value !== 'string') return false;
  const lowerCaseValue = value.toLowerCase();
  const colorKeywords = ['transparent', 'currentcolor'];
  if (colorKeywords.includes(lowerCaseValue)) return true;

  // Enhanced hex color detection - supports 3, 4, 6, and 8 digit hex colors
  if (lowerCaseValue.startsWith('#')) {
    const hexPart = lowerCaseValue.slice(1);
    return /^[0-9a-f]{3,8}$/i.test(hexPart);
  }

  if (lowerCaseValue.startsWith('rgb') || lowerCaseValue.startsWith('hsl')) return true;

  // Basic color name check (can be expanded)
  const namedColors = ['red', 'green', 'blue', 'white', 'black', 'yellow', 'purple', 'orange'];
  return namedColors.includes(lowerCaseValue);
};

const splitBySpacePreservingCalc = (input) => {
  const result = [];
  let buffer = '';
  let depth = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === '(') depth++;
    if (char === ')') depth--;
    if (char === ' ' && depth === 0) {
      if (buffer.trim()) {
        result.push(buffer.trim());
        buffer = '';
      }
    } else {
      buffer += char;
    }
  }

  if (buffer.trim()) result.push(buffer.trim());
  return result;
};

const parseColorStop = (stop) => {
  const parts = splitBySpacePreservingCalc(stop.trim());
  const colorPart = parts.find(isColor);

  if (!colorPart) return null;

  const hex = toHex(colorPart);
  if (!hex) return null;

  const colorObj = {
    id: generateId(),
    color: { hex }
  };

  const colorIndex = parts.indexOf(colorPart);

  // Get position parts before the color
  const beforeColorParts = parts.slice(0, colorIndex);
  // Get position parts after the color
  const afterColorParts = parts.slice(colorIndex + 1);

  // Combine all position parts and filter out non-numeric values
  const allPositionParts = [...beforeColorParts, ...afterColorParts];
  const positionParts = allPositionParts.filter(part => {
    const numericValue = part.replace('%', '');
    return !isNaN(parseFloat(numericValue)) && isFinite(numericValue);
  });

  if (positionParts.length >= 1) {
    // For multiple positions, use the last one as the main stop position
    // This handles cases like "color 0 97%" where we want 97% as the stop
    const lastPosition = positionParts[positionParts.length - 1];
    colorObj.stop = lastPosition.includes('%') ? lastPosition.replace('%', '') : lastPosition;
  }

  // Handle additional color properties for transparent colors
  if (colorPart.includes('rgba') || colorPart.includes('hsla') ||
    (colorPart.startsWith('#') && (colorPart.length === 5 || colorPart.length === 9)) ||
    colorPart === 'transparent') {

    // For 4-digit hex colors like #fff0, convert to rgba
    if (colorPart.startsWith('#') && colorPart.length === 5) {
      const r = parseInt(colorPart[1] + colorPart[1], 16);
      const g = parseInt(colorPart[2] + colorPart[2], 16);
      const b = parseInt(colorPart[3] + colorPart[3], 16);
      const a = parseInt(colorPart[4] + colorPart[4], 16) / 255;
      colorObj.color.rgb = `rgba(${r}, ${g}, ${b}, ${a})`;
      colorObj.color.hsl = `hsla(0, 0%, ${Math.round((r + g + b) / 3 / 255 * 100)}%, ${a})`;
    } else if (colorPart.includes('rgba')) {
      colorObj.color.rgb = colorPart;
    } else if (colorPart.includes('hsla')) {
      colorObj.color.hsl = colorPart;
    } else if (colorPart === 'transparent') {
      colorObj.color.rgb = 'rgba(255, 255, 255, 0)';
      colorObj.color.hsl = 'hsla(0, 0%, 100%, 0)';
    }
  }

  return colorObj;
};

const parseGradient = (gradientString) => {
  logger.log(gradientString);
  const typeMatch = gradientString.match(/(linear|radial|conic)-gradient/);
  if (!typeMatch) return null;

  const gradientType = typeMatch[1];
  const contentMatch = gradientString.match(/\((.*)\)/);
  if (!contentMatch) return null;

  let content = contentMatch[1];
  const result = {
    gradientType,
    colors: [],
  };

  // Handle angle or direction
  const firstCommaIndex = content.indexOf(',');
  if (firstCommaIndex !== -1) {
    let firstPart = content.substring(0, firstCommaIndex).trim();

    if (gradientType === 'linear' && (firstPart.includes('deg') || firstPart.startsWith('to '))) {
      if (firstPart.includes('deg')) {
        result.angle = firstPart.replace('deg', '').trim();
      } else {
        const directionMap = {
          'to top': '0',
          'to top right': '45',
          'to right': '90',
          'to bottom right': '135',
          'to bottom': '180',
          'to bottom left': '225',
          'to left': '270',
          'to top left': '315',
        };
        result.angle = directionMap[firstPart] || '180';
      }
      content = content.substring(firstCommaIndex + 1).trim();
    }
  }

  // Split color stops carefully
  const colorStopsRaw = [];
  let buffer = '';
  let depth = 0;
  for (let char of content) {
    if (char === '(') depth++;
    if (char === ')') depth--;
    if (char === ',' && depth === 0) {
      colorStopsRaw.push(buffer.trim());
      buffer = '';
    } else {
      buffer += char;
    }
  }
  if (buffer) colorStopsRaw.push(buffer.trim());

  result.colors = colorStopsRaw.map(parseColorStop).filter(Boolean);

  if (result.colors.length > 0) {
    return result;
  }
  return null;
};

// Helper function to parse background shorthand values
export const background = (...args) => {
  let values;

  // Handle both single string argument and multiple arguments
  if (args.length === 1 && typeof args[0] === 'string') {
    // Split the single string into tokens, being careful with function calls
    const input = args[0];
    values = [];
    let current = '';
    let depth = 0;
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
        current += char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = '';
        current += char;
      } else if (char === '(' && !inQuotes) {
        depth++;
        current += char;
      } else if (char === ')' && !inQuotes) {
        depth--;
        current += char;
      } else if (char === ' ' && depth === 0 && !inQuotes) {
        if (current.trim()) {
          values.push(current.trim());
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      values.push(current.trim());
    }
  } else {
    values = args;
  }

  const properties = {};
  let position, size;

  values.forEach(value => {
    if (isColor(value)) {
      properties['background-color'] = value;
    } else if (value.includes('url(') || value.includes('-gradient(')) {
      properties['background-image'] = value;
    } else if (['repeat', 'repeat-x', 'repeat-y', 'no-repeat', 'space', 'round'].includes(value)) {
      properties['background-repeat'] = value;
    } else if (['scroll', 'fixed', 'local'].includes(value)) {
      properties['background-attachment'] = value;
    } else if (['border-box', 'padding-box', 'content-box'].includes(value)) {
      // This could be origin or clip, we'll assign to both for simplicity
      properties['background-origin'] = value;
      if (value === 'text') {
        properties['-webkit-background-clip'] = 'text';
        properties['background-clip'] = 'text';
      } else {
        properties['background-clip'] = value;
      }
    } else if (value.includes('/') || ['center', 'top', 'bottom', 'left', 'right'].some(pos => value.includes(pos))) {
      // Handle position and size
      if (value.includes('/')) {
        [position, size] = value.split('/').map(s => s.trim());
        properties['background-position'] = position;
        properties['background-size'] = size;
      } else {
        properties['background-position'] = value;
      }
    }
  });

  return properties;
};

export const backgroundMappers = {
  'background': (val, settings) => {
    // Parse the shorthand directly
    const parsedProperties = background(val);

    // Apply each parsed property using its specific mapper
    Object.entries(parsedProperties).forEach(([property, value]) => {
      const mapper = backgroundMappers[property];
      if (mapper && property !== 'background') { // Prevent infinite recursion
        mapper(value, settings);
      }
    });
  },
  'background-color': (val, settings) => {
    const hex = toHex(val);
    if (hex) {
      settings._background = settings._background || {};
      settings._background.color = { hex };
    }
  },
  'background-image': (val, settings) => {
    settings._background = settings._background || {};
    if (val.includes('url(')) {
      const urlMatch = val.match(/url\(['"]?(.*?)['"]?\)/);
      if (urlMatch) {
        settings._background.image = {
          url: urlMatch[1],
        };
      }
    } else if (val.includes('-gradient(')) {
      const parsedGradient = parseGradient(val);
      if (parsedGradient) {
        settings._gradient = parsedGradient;
        if (settings._background) {
          delete settings._background.image;
          if (Object.keys(settings._background).length === 0) {
            delete settings._background;
          }
        }
      }
    }
  },
  'background-repeat': (val, settings) => {
    settings._background = settings._background || {};
    settings._background.repeat = val;
  },
  'background-size': (val, settings) => {
    settings._background = settings._background || {};
    settings._background.size = val;
  },
  'background-position': (val, settings) => {
    settings._background = settings._background || {};
    settings._background.position = val;
  },
  'background-attachment': (val, settings) => {
    settings._background = settings._background || {};
    settings._background.attachment = val;
  },
  'background-blend-mode': (val, settings) => {
    settings._background = settings._background || {};
    settings._background.blendMode = val;
  },
  'background-origin': (val, settings) => {
    settings._background = settings._background || {};
    settings._background.origin = val;
  },
  'background-clip': (val, settings) => {
    if (val === 'text') {
      if (settings._gradient) {
        settings._gradient.applyTo = 'text';
      }
    } else {
      settings._background = settings._background || {};
      settings._background.clip = val;
    }
  },
  '-webkit-background-clip': (val, settings) => {
    if (val === 'text') {
      if (settings._gradient) {
        settings._gradient.applyTo = 'text';
      }
    }
  }
};

// Export individual mappers for direct import
export const backgroundColorMapper = backgroundMappers['background-color'];
export const backgroundImageMapper = backgroundMappers['background-image'];
export const backgroundRepeatMapper = backgroundMappers['background-repeat'];
export const backgroundSizeMapper = backgroundMappers['background-size'];
export const backgroundPositionMapper = backgroundMappers['background-position'];
export const backgroundAttachmentMapper = backgroundMappers['background-attachment'];
export const backgroundBlendModeMapper = backgroundMappers['background-blend-mode'];
export const backgroundOriginMapper = backgroundMappers['background-origin'];
export const backgroundClipMapper = backgroundMappers['background-clip'];
export const webkitBackgroundClipMapper = backgroundMappers['-webkit-background-clip'];