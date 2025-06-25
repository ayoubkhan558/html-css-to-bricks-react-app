export const flexboxMappers = {
  'display': (val, settings) => {
    if (val === 'flex' || val === 'inline-flex') {
      settings._flexbox = settings._flexbox || {};
      settings._flexbox.display = val;
    }
  },
  'flex-direction': (val, settings) => {
    settings._flexbox = settings._flexbox || {};
    settings._flexbox.direction = val;
  },
  'flex-wrap': (val, settings) => {
    settings._flexbox = settings._flexbox || {};
    settings._flexbox.wrap = val;
  },
  'justify-content': (val, settings) => {
    settings._flexbox = settings._flexbox || {};
    settings._flexbox.justifyContent = val;
  },
  'align-items': (val, settings) => {
    settings._flexbox = settings._flexbox || {};
    settings._flexbox.alignItems = val;
  },
  'align-content': (val, settings) => {
    settings._flexbox = settings._flexbox || {};
    settings._flexbox.alignContent = val;
  },
  'flex-grow': (val, settings) => {
    settings._flexbox = settings._flexbox || {};
    settings._flexbox.grow = parseFloat(val);
  },
  'flex-shrink': (val, settings) => {
    settings._flexbox = settings._flexbox || {};
    settings._flexbox.shrink = parseFloat(val);
  },
  'flex-basis': (val, settings) => {
    settings._flexbox = settings._flexbox || {};
    settings._flexbox.basis = val;
  },
  'order': (val, settings) => {
    settings._flexbox = settings._flexbox || {};
    settings._flexbox.order = parseInt(val);
  },
  'gap': (val, settings) => {
    settings._flexbox = settings._flexbox || {};
    settings._flexbox.gap = val;
  },
  'row-gap': (val, settings) => {
    settings._flexbox = settings._flexbox || {};
    settings._flexbox.rowGap = val;
  },
  'column-gap': (val, settings) => {
    settings._flexbox = settings._flexbox || {};
    settings._flexbox.columnGap = val;
  }
};
