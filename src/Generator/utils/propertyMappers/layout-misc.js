import { parseValue } from '../cssParser';

export const layoutMiscMappers = {
  // Pointer Events
  'pointer-events': (val, settings) => {
    settings._pointerEvents = val;
  },
  
  // Mix Blend Mode
  'mix-blend-mode': (val, settings) => {
    settings._mixBlendMode = val;
  },
  
  // Isolation
  'isolation': (val, settings) => {
    settings._isolation = val;
  },
  
  // Cursor
  'cursor': (val, settings) => {
    settings._cursor = val;
  },
  
  // Opacity
  'opacity': (val, settings) => {
    // Ensure opacity is between 0 and 1
    const opacity = parseFloat(val);
    if (!isNaN(opacity)) {
      settings._opacity = Math.min(1, Math.max(0, opacity)).toString();
    }
  },
  
  // Overflow
  'overflow': (val, settings) => {
    settings._overflow = val;
  },
  'overflow-x': (val, settings) => {
    settings._overflowX = val;
  },
  'overflow-y': (val, settings) => {
    settings._overflowY = val;
  },
  
  // Visibility
  'visibility': (val, settings) => {
    settings._visibility = val;
  }
};

// Export individual mappers for direct import
export const pointerEventsMapper = layoutMiscMappers['pointer-events'];
export const mixBlendModeMapper = layoutMiscMappers['mix-blend-mode'];
export const isolationMapper = layoutMiscMappers['isolation'];
export const cursorMapper = layoutMiscMappers['cursor'];
export const opacityMapper = layoutMiscMappers['opacity'];
export const overflowMapper = layoutMiscMappers['overflow'];
export const visibilityMapper = layoutMiscMappers['visibility'];