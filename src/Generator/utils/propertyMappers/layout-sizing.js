import { parseValue } from '../cssParserUtils';

export const sizingMappers = {
  'width': (val, settings) => {
    settings._sizing = settings._sizing || {};
    settings._sizing.width = parseValue(val);
  },
  'height': (val, settings) => {
    settings._sizing = settings._sizing || {};
    settings._sizing.height = parseValue(val);
  },
  'min-width': (val, settings) => {
    settings._sizing = settings._sizing || {};
    settings._sizing.minWidth = parseValue(val);
  },
  'min-height': (val, settings) => {
    settings._sizing = settings._sizing || {};
    settings._sizing.minHeight = parseValue(val);
  },
  'max-width': (val, settings) => {
    settings._sizing = settings._sizing || {};
    settings._sizing.maxWidth = parseValue(val);
  },
  'max-height': (val, settings) => {
    settings._sizing = settings._sizing || {};
    settings._sizing.maxHeight = parseValue(val);
  },
  'aspect-ratio': (val, settings) => {
    settings._sizing = settings._sizing || {};
    settings._sizing.aspectRatio = val;
  }
};
