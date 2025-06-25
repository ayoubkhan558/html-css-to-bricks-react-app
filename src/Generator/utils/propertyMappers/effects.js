import { toHex, parseValue } from '../cssParser';

// Helper to parse filter values (removes units and converts to string)
const parseFilterValue = (value) => {
  if (typeof value !== 'string') return value;
  const numMatch = value.match(/^(-?\d*\.?\d+)/);
  return numMatch ? numMatch[1] : value;
};

// Individual filter mappers
export const filterMappers = {
  'blur': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    settings._cssFilters.blur = parseFilterValue(val);
  },
  'brightness': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    settings._cssFilters.brightness = parseFilterValue(val);
  },
  'contrast': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    settings._cssFilters.contrast = parseFilterValue(val);
  },
  'hue-rotate': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    settings._cssFilters.hueRotate = parseFilterValue(val);
  },
  'invert': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    settings._cssFilters.invert = parseFilterValue(val);
  },
  'opacity': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    settings._cssFilters.opacity = parseFilterValue(val);
  },
  'saturate': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    settings._cssFilters.saturate = parseFilterValue(val);
  },
  'sepia': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    settings._cssFilters.sepia = parseFilterValue(val);
  }
};

export const effectsMappers = {
  'filter': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    
    // Handle combined filter property (e.g. 'blur(5px) brightness(1.2)')
    const filters = val.match(/\b(blur|brightness|contrast|hue-rotate|invert|opacity|saturate|sepia)\(([^)]+)\)/g) || [];
    
    filters.forEach(filter => {
      const match = filter.match(/(\w+)\(([^)]+)\)/);
      if (match) {
        const [_, fn, value] = match;
        const mapper = filterMappers[fn];
        if (mapper) mapper(value, settings);
      }
    });
    
    // Also store the original filter string
    settings._effects = settings._effects || {};
    settings._effects.filter = val;
  },
  'backdrop-filter': (val, settings) => {
    settings._effects = settings._effects || {};
    settings._effects.backdropFilter = val;
  }
};
