import { toHex, parseValue } from '../cssParserUtils';

export const effectsMappers = {
  'opacity': (val, settings) => {
    settings._effects = settings._effects || {};
    settings._effects.opacity = parseFloat(val);
  },
  'box-shadow': (val, settings) => {
    const parts = val.split(' ');
    if (parts.length >= 4) {
      settings._effects = settings._effects || {};
      settings._effects.boxShadow = {
        offsetX: parseValue(parts[0]),
        offsetY: parseValue(parts[1]),
        blur: parseValue(parts[2]),
        spread: parts[3] ? parseValue(parts[3]) : undefined,
        color: parts[4] ? { hex: toHex(parts[4]) } : undefined,
        inset: val.includes('inset')
      };
    }
  },
  'filter': (val, settings) => {
    settings._effects = settings._effects || {};
    settings._effects.filter = val;
  },
  'backdrop-filter': (val, settings) => {
    settings._effects = settings._effects || {};
    settings._effects.backdropFilter = val;
  },
  'mix-blend-mode': (val, settings) => {
    settings._effects = settings._effects || {};
    settings._effects.mixBlendMode = val;
  },
  'isolation': (val, settings) => {
    settings._effects = settings._effects || {};
    settings._effects.isolation = val;
  }
};
