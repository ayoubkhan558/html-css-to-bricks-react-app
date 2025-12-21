// display.js - Unified display property mapper

export const displayMappers = {
  'display': (val, settings) => {
    // Only set _display for grid and flex (Bricks uses these for layout controls)
    // Other display values like inline-block, block, etc. should be in custom CSS
    if (val === 'grid' || val === 'inline-grid') {
      settings._display = val;
      settings._isGrid = true;
    } else if (val === 'flex' || val === 'inline-flex') {
      settings._display = val;
      settings._isFlex = true;
    }
    // For other display values (inline-block, block, inline, etc.), 
    // they will be handled by custom CSS automatically
  }
};

// Export for direct import
export const displayMapper = displayMappers['display'];