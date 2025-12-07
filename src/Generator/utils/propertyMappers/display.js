// display.js - Unified display property mapper

export const displayMappers = {
  'display': (val, settings) => {
    // Store all display values directly
    settings._display = val;

    // Special handling for grid/flex if needed
    if (val === 'grid' || val === 'inline-grid') {
      settings._isGrid = true;
    } else if (val === 'flex' || val === 'inline-flex') {
      settings._isFlex = true;
    }
  }
};

// Export for direct import
export const displayMapper = displayMappers['display'];