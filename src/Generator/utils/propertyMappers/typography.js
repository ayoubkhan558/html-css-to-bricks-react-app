import { toHex, parseValue } from '../cssParserUtils';

export const typographyMappers = {
  color: (val, settings) => {
    const hex = toHex(val);
    if (hex) {
      settings._typography = settings._typography || {};
      settings._typography.color = { hex };
    }
  },
  'font-size': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['font-size'] = parseValue(val);
  },
  'font-weight': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['font-weight'] = val;
  },
  'font-style': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['font-style'] = val;
  },
  'font-family': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['font-family'] = val.replace(/['"]/g, '');
  },
  'line-height': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['line-height'] = parseValue(val);
  },
  'letter-spacing': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['letter-spacing'] = parseValue(val);
  },
  'text-align': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['text-align'] = val;
  },
  'text-transform': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['text-transform'] = val;
  },
  'text-decoration': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['text-decoration'] = val;
  },
  'white-space': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['white-space'] = val;
  },
  'text-wrap': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['text-wrap'] = val;
  },
  'text-shadow': (val, settings) => {
    const parts = val.split(' ');
    if (parts.length >= 3) {
      settings._typography = settings._typography || {};
      settings._typography.textShadow = settings._typography.textShadow || { values: {} };
      settings._typography.textShadow.values = {
        offsetX: parseValue(parts[0]),
        offsetY: parseValue(parts[1]),
        blur: parseValue(parts[2]),
        color: toHex(parts[3]) ? { hex: toHex(parts[3]) } : undefined
      };
    }
  }
};
