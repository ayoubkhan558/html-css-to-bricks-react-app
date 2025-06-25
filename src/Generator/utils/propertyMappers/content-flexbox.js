// Flexbox Property Mappers
export const flexboxMappers = {
  'display': (val, settings) => {
    if (val === 'flex' || val === 'inline-flex') {
      settings._display = val;
    }
  },
  'flex-direction': (val, settings) => {
    settings._flexDirection = val;
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
    settings._flexBasis = val;
  },
  'align-self': (val, settings) => {
    settings._alignSelf = val;
  },
  'order': (val, settings) => {
    settings._order = parseInt(val);
  },
  'gap': (val, settings) => {
    const gapValue = parseValue(val);
    settings._rowGap = gapValue;
    settings._columnGap = gapValue;
  },
  'row-gap': (val, settings) => {
    settings._rowGap = parseValue(val);
  },
  'column-gap': (val, settings) => {
    settings._columnGap = parseValue(val);
  }
};
