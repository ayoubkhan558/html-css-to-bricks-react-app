export const transitionsMappers = {
  'transition': (val, settings) => {
    const parts = val.split(' ');
    if (parts.length >= 3) {
      settings._transition = settings._transition || {};
      settings._transition.property = parts[0];
      settings._transition.duration = parts[1];
      settings._transition.timingFunction = parts[2];
      settings._transition.delay = parts[3] || '0s';
    }
  },
  'transition-property': (val, settings) => {
    settings._transition = settings._transition || {};
    settings._transition.property = val;
  },
  'transition-duration': (val, settings) => {
    settings._transition = settings._transition || {};
    settings._transition.duration = val;
  },
  'transition-timing-function': (val, settings) => {
    settings._transition = settings._transition || {};
    settings._transition.timingFunction = val;
  },
  'transition-delay': (val, settings) => {
    settings._transition = settings._transition || {};
    settings._transition.delay = val;
  }
};
