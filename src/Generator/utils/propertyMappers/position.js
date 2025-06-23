import { parseValue } from '../cssParserUtils';

export const positionMappers = {
  'position': (val, settings) => {
    settings._position = settings._position || {};
    settings._position.type = val;
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
