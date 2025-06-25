export const scrollMappers = {
  'scroll-behavior': (val, settings) => {
    settings._scroll = settings._scroll || {};
    settings._scroll.behavior = val;
  },
  'scroll-snap-type': (val, settings) => {
    settings._scroll = settings._scroll || {};
    settings._scroll.snapType = val;
  },
  'scroll-snap-align': (val, settings) => {
    settings._scroll = settings._scroll || {};
    settings._scroll.snapAlign = val;
  },
  'scroll-snap-stop': (val, settings) => {
    settings._scroll = settings._scroll || {};
    settings._scroll.snapStop = val;
  },
  'scroll-margin': (val, settings) => {
    settings._scroll = settings._scroll || {};
    settings._scroll.margin = val;
  },
  'scroll-padding': (val, settings) => {
    settings._scroll = settings._scroll || {};
    settings._scroll.padding = val;
  },
  'overflow': (val, settings) => {
    settings._scroll = settings._scroll || {};
    settings._scroll.overflow = val;
  },
  'overflow-x': (val, settings) => {
    settings._scroll = settings._scroll || {};
    settings._scroll.overflowX = val;
  },
  'overflow-y': (val, settings) => {
    settings._scroll = settings._scroll || {};
    settings._scroll.overflowY = val;
  }
};
