import { toHex } from '../cssParserUtils';

export const backgroundMappers = {
  'background-color': (val, settings) => {
    const hex = toHex(val);
    if (hex) {
      settings._background = settings._background || {};
      settings._background.color = { hex };
    }
  },
  'background-image': (val, settings) => {
    if (val.includes('url')) {
      settings._background = settings._background || {};
      settings._background.image = {
        url: val.match(/url\(['"]?(.*?)['"]?\)/)[1]
      };
    }
  },
  'background-repeat': (val, settings) => {
    settings._background = settings._background || {};
    settings._background.repeat = val;
  },
  'background-size': (val, settings) => {
    settings._background = settings._background || {};
    settings._background.size = val;
  },
  'background-position': (val, settings) => {
    settings._background = settings._background || {};
    settings._background.position = val;
  },
  'background-attachment': (val, settings) => {
    settings._background = settings._background || {};
    settings._background.attachment = val;
  },
  'background-blend-mode': (val, settings) => {
    settings._background = settings._background || {};
    settings._background.blendMode = val;
  }
};
