// CSS Filter Property Mappers
import { parseValue } from '@lib/cssUtils';

// Helper to extract numeric value from filter string (e.g. '5px' -> '5')
const parseFilterNumber = (val) => {
  if (typeof val !== 'string') return val;
  const num = parseValue(val);
  return isNaN(num) ? val : num.toString();
};

// Individual filter property mappers - removed standalone opacity
export const filterMappers = {
  'blur': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    settings._cssFilters.blur = parseFilterNumber(val);
  },
  'brightness': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    settings._cssFilters.brightness = parseFilterNumber(val);
  },
  'contrast': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    settings._cssFilters.contrast = parseFilterNumber(val);
  },
  'grayscale': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    settings._cssFilters.grayscale = parseFilterNumber(val);
  },
  'hue-rotate': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    settings._cssFilters['hue-rotate'] = parseFilterNumber(val);
  },
  'invert': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    settings._cssFilters.invert = parseFilterNumber(val);
  },
  'saturate': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    settings._cssFilters.saturate = parseFilterNumber(val);
  },
  'sepia': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    settings._cssFilters.sepia = parseFilterNumber(val);
  },
  // 'drop-shadow': (val, settings) => {
  //   settings._cssFilters = settings._cssFilters || {};
  //   // Store drop-shadow value as-is since it has complex syntax
  //   settings._cssFilters['drop-shadow'] = val;
  // }
};

// Combined filter property mapper
export const effectsMappers = {
  'filter': (val, settings) => {
    // Check if drop-shadow is present in the filter string
    if (val.includes('drop-shadow')) {
      // Move all filter values to custom CSS when drop-shadow is provided
      if (!settings._cssCustom) settings._cssCustom = '';
      const selector = settings._cssClass || '%element%';
      // Escape dots in selectors to prevent malformed CSS
      const escapedSelector = selector.replace(/\./g, '\\.');
      settings._cssCustom += `\n${escapedSelector.startsWith('%') ? '' : '.'}${escapedSelector} { filter: ${val}; }`;
      return;
    }

    settings._cssFilters = settings._cssFilters || {};

    // Extract individual filters from combined string
    // Updated regex to handle drop-shadow with its complex value
    const filters = val.match(/(blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow)\(([^)]+)\)/g) || [];

    filters.forEach(filter => {
      const match = filter.match(/([\w-]+)\(([^)]+)\)/);
      if (match) {
        const [_, fn, value] = match;
        const mapper = filterMappers[fn];
        if (mapper) mapper(value, settings);
      }
    });
  }
};

// Transition property mapper
export const transitionsMappers = {
  'transition': (val, settings) => {
    // Store the original transition string as-is
    settings._cssTransition = val;

    // Prevent these from being added to _cssCustom
    settings._skipTransitionCustom = true;
  },
  'transition-property': (val, settings) => {
    settings._cssTransition = settings._cssTransition || '';
    const parts = settings._cssTransition.split(' ');
    settings._cssTransition = `${val} ${parts[1] || '0s'} ${parts[2] || 'ease'} ${parts[3] || '0s'}`;

    // Prevent these from being added to _cssCustom
    settings._skipTransitionCustom = true;
  },
  'transition-duration': (val, settings) => {
    settings._cssTransition = settings._cssTransition || '';
    const parts = settings._cssTransition.split(' ');
    settings._cssTransition = `${parts[0] || 'all'} ${val} ${parts[2] || 'ease'} ${parts[3] || '0s'}`;

    // Prevent these from being added to _cssCustom
    settings._skipTransitionCustom = true;
  },
  'transition-timing-function': (val, settings) => {
    settings._cssTransition = settings._cssTransition || '';
    const parts = settings._cssTransition.split(' ');
    settings._cssTransition = `${parts[0] || 'all'} ${parts[1] || '0s'} ${val} ${parts[3] || '0s'}`;

    // Prevent these from being added to _cssCustom
    settings._skipTransitionCustom = true;
  },
  'transition-delay': (val, settings) => {
    settings._cssTransition = settings._cssTransition || '';
    const parts = settings._cssTransition.split(' ');
    settings._cssTransition = `${parts[0] || 'all'} ${parts[1] || '0s'} ${parts[2] || 'ease'} ${val}`;

    // Prevent these from being added to _cssCustom
    settings._skipTransitionCustom = true;
  }
};
