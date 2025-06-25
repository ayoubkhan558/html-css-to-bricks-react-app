import { toHex, parseValue } from '../cssParserUtils';

export const borderBoxShadowMappers = {
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
