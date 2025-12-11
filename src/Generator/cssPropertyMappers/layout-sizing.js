import { parseValue } from '@lib/cssUtils';

export const sizingMappers = {
  'width': (val, settings) => {
    settings._width = parseValue(val);
  },
  'height': (val, settings) => {
    settings._height = parseValue(val);
  },
  'min-width': (val, settings) => {
    settings._widthMin = parseValue(val);
  },
  'max-width': (val, settings) => {
    settings._widthMax = parseValue(val);
  },
  'min-height': (val, settings) => {
    settings._heightMin = parseValue(val);
  },
  'max-height': (val, settings) => {
    settings._heightMax = parseValue(val);
  },
  'aspect-ratio': (val, settings) => {
    settings._aspectRatio = val;
  }
};

// Export individual mappers for direct import
export const widthMapper = sizingMappers['width'];
export const heightMapper = sizingMappers['height'];
export const minWidthMapper = sizingMappers['min-width'];
export const maxWidthMapper = sizingMappers['max-width'];
export const minHeightMapper = sizingMappers['min-height'];
export const maxHeightMapper = sizingMappers['max-height'];
export const aspectRatioMapper = sizingMappers['aspect-ratio'];
