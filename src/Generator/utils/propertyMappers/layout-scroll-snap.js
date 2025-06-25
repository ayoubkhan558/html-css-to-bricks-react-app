// Scroll Snap Property Mappers
export const scrollSnapMappers = {
  'scroll-snap-type': (val, settings) => {
    settings._scrollSnapType = val;
  },
  'scroll-snap-align': (val, settings) => {
    settings._scrollSnapAlign = val;
  },
  'scroll-snap-stop': (val, settings) => {
    settings._scrollSnapStop = val;
  }
};