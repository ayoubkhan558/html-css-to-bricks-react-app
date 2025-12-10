import { parseValue } from '@lib/css/cssUtils';

export const positionMappers = {
  'position': (val, settings) => {
    settings._position = settings._position || {};
    settings._position = val;
  },
  'top': (val, settings) => {
    settings._position = settings._position || {};
    settings._position.top = parseValue(val);
  },
  'right': (val, settings) => {
    settings._position = settings._position || {};
    settings._position.right = parseValue(val);
  },
  'bottom': (val, settings) => {
    settings._position = settings._position || {};
    settings._position.bottom = parseValue(val);
  },
  'left': (val, settings) => {
    settings._position = settings._position || {};
    settings._position.left = parseValue(val);
  },
  'z-index': (val, settings) => {
    settings._position = settings._position || {};
    settings._position.zIndex = parseInt(val);
  }
};

// Export individual mappers for direct import
export const positionTypeMapper = positionMappers['position'];
export const topMapper = positionMappers['top'];
export const rightMapper = positionMappers['right'];
export const bottomMapper = positionMappers['bottom'];
export const leftMapper = positionMappers['left'];
export const zIndexMapper = positionMappers['z-index'];
