import { parseValue } from '../cssParserUtils';

export const spacingMappers = {
  'margin': (val, settings) => {
    const parts = val.split(' ');
    settings._spacing = settings._spacing || {};
    settings._spacing.margin = {
      top: parseValue(parts[0]),
      right: parseValue(parts[1] || parts[0]),
      bottom: parseValue(parts[2] || parts[0]),
      left: parseValue(parts[3] || parts[1] || parts[0])
    };
  },
  'margin-top': (val, settings) => {
    settings._spacing = settings._spacing || {};
    settings._spacing.margin = settings._spacing.margin || {};
    settings._spacing.margin.top = parseValue(val);
  },
  'margin-right': (val, settings) => {
    settings._spacing = settings._spacing || {};
    settings._spacing.margin = settings._spacing.margin || {};
    settings._spacing.margin.right = parseValue(val);
  },
  'margin-bottom': (val, settings) => {
    settings._spacing = settings._spacing || {};
    settings._spacing.margin = settings._spacing.margin || {};
    settings._spacing.margin.bottom = parseValue(val);
  },
  'margin-left': (val, settings) => {
    settings._spacing = settings._spacing || {};
    settings._spacing.margin = settings._spacing.margin || {};
    settings._spacing.margin.left = parseValue(val);
  },
  'padding': (val, settings) => {
    const parts = val.split(' ');
    settings._spacing = settings._spacing || {};
    settings._spacing.padding = {
      top: parseValue(parts[0]),
      right: parseValue(parts[1] || parts[0]),
      bottom: parseValue(parts[2] || parts[0]),
      left: parseValue(parts[3] || parts[1] || parts[0])
    };
  },
  'padding-top': (val, settings) => {
    settings._spacing = settings._spacing || {};
    settings._spacing.padding = settings._spacing.padding || {};
    settings._spacing.padding.top = parseValue(val);
  },
  'padding-right': (val, settings) => {
    settings._spacing = settings._spacing || {};
    settings._spacing.padding = settings._spacing.padding || {};
    settings._spacing.padding.right = parseValue(val);
  },
  'padding-bottom': (val, settings) => {
    settings._spacing = settings._spacing || {};
    settings._spacing.padding = settings._spacing.padding || {};
    settings._spacing.padding.bottom = parseValue(val);
  },
  'padding-left': (val, settings) => {
    settings._spacing = settings._spacing || {};
    settings._spacing.padding = settings._spacing.padding || {};
    settings._spacing.padding.left = parseValue(val);
  }
};
