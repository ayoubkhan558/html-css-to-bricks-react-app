// Flexbox Property Mappers
import { parseValue, splitCSSValue } from '@lib/css/cssUtils';

// Flexbox Property Mappers
export const flexboxMappers = {
  'flex-direction': (val, settings) => {
    settings._direction = val;
  },
  'flex-wrap': (val, settings) => {
    settings._flexWrap = val;
  },
  'justify-content': (val, settings) => {
    settings._justifyContent = val;
  },
  'align-items': (val, settings) => {
    settings._alignItems = val;
  },
  'align-content': (val, settings) => {
    settings._alignContent = val;
  },
  'flex-grow': (val, settings) => {
    settings._flexGrow = parseFloat(val);
  },
  'flex-shrink': (val, settings) => {
    settings._flexShrink = parseFloat(val);
  },
  'flex-basis': (val, settings) => {
    settings._flexBasis = parseValue(val);
  },
  'align-self': (val, settings) => {
    settings._alignSelf = val;
  },
  'order': (val, settings) => {
    settings._order = parseInt(val);
  },
  'gap': (val, settings) => {
    const values = splitCSSValue(val).map(v => parseValue(v)).filter(Boolean);
    if (values.length === 1) {
      settings._columnGap = values[0];
      settings._rowGap = values[0];
    } else if (values.length >= 2) {
      settings._rowGap = values[0];    // First value is row gap
      settings._columnGap = values[1]; // Second value is column gap
    }
  },
  'row-gap': (val, settings) => {
    settings._rowGap = parseValue(val);
  },
  'column-gap': (val, settings) => {
    settings._columnGap = parseValue(val);
  }
};