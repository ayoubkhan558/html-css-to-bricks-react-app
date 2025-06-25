import { toHex, parseValue } from '../cssParserUtils';

// Parse box-shadow CSS property
export function parseBoxShadow(boxShadow) {
  if (!boxShadow || boxShadow === 'none') {
    return null;
  }

  // Handle multiple shadows (comma-separated)
  const shadows = boxShadow.split(',').map(s => s.trim());

  return shadows.map(shadow => {
    // Parse inset, offsets, blur, spread, and color
    const parts = shadow.split(/\s+/);
    const result = {
      inset: false,
      offsetX: '0px',
      offsetY: '0px',
      blur: '0px',
      spread: '0px',
      color: 'rgba(0,0,0,0.5)'
    };

    // Check for inset
    if (parts.includes('inset')) {
      result.inset = true;
      parts.splice(parts.indexOf('inset'), 1);
    }

    // Parse color (last value if it's a color, otherwise default)
    const lastPart = parts[parts.length - 1];
    if (lastPart && (lastPart.startsWith('#') || lastPart.startsWith('rgb') || lastPart.startsWith('hsl'))) {
      result.color = lastPart;
      parts.pop();
    }

    // Parse numeric values
    const numbers = parts.map(part => {
      const num = parseValue(part);
      return isNaN(num) ? '0px' : `${num}px`;
    });

    // Assign values based on count
    if (numbers.length >= 1) result.offsetX = numbers[0];
    if (numbers.length >= 2) result.offsetY = numbers[1];
    if (numbers.length >= 3) result.blur = numbers[2];
    if (numbers.length >= 4) result.spread = numbers[3];

    return result;
  });
}

export const borderBoxShadowMappers = {
  'box-shadow': (val, settings) => {
    settings._effects = settings._effects || {};
    settings._effects.boxShadow = parseBoxShadow(val);
  },
  'border': (val, settings) => {
    const parts = val.split(' ');
    if (parts.length >= 3) {
      settings._border = settings._border || {};
      settings._border.width = parseValue(parts[0]);
      settings._border.style = parts[1];
      const hex = toHex(parts[2]);
      if (hex) {
        settings._border.color = { hex };
      }
    }
  },
  'border-width': (val, settings) => {
    settings._border = settings._border || {};
    settings._border.width = parseValue(val);
  },
  'border-style': (val, settings) => {
    settings._border = settings._border || {};
    settings._border.style = val;
  },
  'border-color': (val, settings) => {
    const hex = toHex(val);
    if (hex) {
      settings._border = settings._border || {};
      settings._border.color = { hex };
    }
  },
  'border-radius': (val, settings) => {
    settings._border = settings._border || {};
    settings._border.radius = parseValue(val);
  },
  'border-top': (val, settings) => {
    const parts = val.split(' ');
    if (parts.length >= 3) {
      settings._border = settings._border || { top: {} };
      settings._border.top = {
        width: parseValue(parts[0]),
        style: parts[1],
        color: { hex: toHex(parts[2]) }
      };
    }
  },
  'border-right': (val, settings) => {
    const parts = val.split(' ');
    if (parts.length >= 3) {
      settings._border = settings._border || { right: {} };
      settings._border.right = {
        width: parseValue(parts[0]),
        style: parts[1],
        color: { hex: toHex(parts[2]) }
      };
    }
  },
  'border-bottom': (val, settings) => {
    const parts = val.split(' ');
    if (parts.length >= 3) {
      settings._border = settings._border || { bottom: {} };
      settings._border.bottom = {
        width: parseValue(parts[0]),
        style: parts[1],
        color: { hex: toHex(parts[2]) }
      };
    }
  },
  'border-left': (val, settings) => {
    const parts = val.split(' ');
    if (parts.length >= 3) {
      settings._border = settings._border || { left: {} };
      settings._border.left = {
        width: parseValue(parts[0]),
        style: parts[1],
        color: { hex: toHex(parts[2]) }
      };
    }
  }
};
