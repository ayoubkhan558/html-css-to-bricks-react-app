import { parseValue } from '../cssParser';

export const spacingMappers = {
  'margin': (val, settings) => {
    const values = val.split(' ').map(v => parseValue(v));
    settings._margin = {
      top: values[0],
      right: values[1] || values[0],
      bottom: values[2] || values[0],
      left: values[3] || (values[1] || values[0])
    };
  },
  'margin-top': (val, settings) => {
    settings._margin = settings._margin || {};
    settings._margin.top = parseValue(val);
  },
  'margin-right': (val, settings) => {
    settings._margin = settings._margin || {};
    settings._margin.right = parseValue(val);
  },
  'margin-bottom': (val, settings) => {
    settings._margin = settings._margin || {};
    settings._margin.bottom = parseValue(val);
  },
  'margin-left': (val, settings) => {
    settings._margin = settings._margin || {};
    settings._margin.left = parseValue(val);
  },
  'padding': (val, settings) => {
    const values = val.split(' ').map(v => parseValue(v));
    settings._padding = {
      top: values[0],
      right: values[1] || values[0],
      bottom: values[2] || values[0],
      left: values[3] || (values[1] || values[0])
    };
  },
  'padding-top': (val, settings) => {
    settings._padding = settings._padding || {};
    settings._padding.top = parseValue(val);
  },
  'padding-right': (val, settings) => {
    settings._padding = settings._padding || {};
    settings._padding.right = parseValue(val);
  },
  'padding-bottom': (val, settings) => {
    settings._padding = settings._padding || {};
    settings._padding.bottom = parseValue(val);
  },
  'padding-left': (val, settings) => {
    settings._padding = settings._padding || {};
    settings._padding.left = parseValue(val);
  }
};

// Export individual mappers for direct import
export const marginMapper = spacingMappers['margin'];
export const paddingMapper = spacingMappers['padding'];
export const marginTopMapper = spacingMappers['margin-top'];
export const marginRightMapper = spacingMappers['margin-right'];
export const marginBottomMapper = spacingMappers['margin-bottom'];
export const marginLeftMapper = spacingMappers['margin-left'];
export const paddingTopMapper = spacingMappers['padding-top'];
export const paddingRightMapper = spacingMappers['padding-right'];
export const paddingBottomMapper = spacingMappers['padding-bottom'];
export const paddingLeftMapper = spacingMappers['padding-left'];
