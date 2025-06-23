// CSS parsing utilities

// Convert basic color names to hex; pass through hex values
export function toHex(raw) {
  if (!raw) return null;
  const basic = { 
    red: '#ff0000', 
    green: '#008000', 
    blue: '#0000ff', 
    black: '#000000', 
    white: '#ffffff', 
    gray: '#808080', 
    grey: '#808080' 
  };
  const trimmed = raw.trim().toLowerCase();
  if (trimmed.startsWith('#')) return trimmed;
  if (trimmed.startsWith('rgb') || trimmed.startsWith('hsl')) return null; // Skip complex colors for now
  return basic[trimmed] || null;
}

// Helper to convert rgb/rgba to hex
function rgbToHex(color) {
  if (!color) return '#000000';
  if (color.startsWith('#')) return color;
  
  // Handle rgb/rgba colors
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
    const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
    const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return '#000000';
}

// Parse numeric values, removing 'px' unit but keeping other units
const parseValue = (value) => {
  if (typeof value !== 'string') return value;
  
  // Handle CSS variables
  if (value.startsWith('var(')) return value;
  
  // Handle calc() and other CSS functions
  if (value.includes('(')) return value;
  
  // Handle numbers with units
  const numMatch = value.match(/^(-?\d*\.?\d+)([a-z%]*)$/);
  if (numMatch) {
    const [, num, unit] = numMatch;
    // For unitless values, return as number
    if (unit === '') return parseFloat(num);
    // For px values, return as number
    if (unit === 'px') return parseFloat(num);
    // For other units (%, em, rem, deg, etc.), keep the unit
    return value;
  }
  
  return value;
};

// CSS properties Bricks has native controls for and how to map them
export const CSS_PROP_MAPPERS = {
  // Typography
  color: (val, settings) => {
    const hex = toHex(val);
    if (hex) {
      settings._typography = settings._typography || {};
      settings._typography.color = { hex };
    }
  },
  'font-size': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['font-size'] = parseValue(val);
  },
  'font-weight': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['font-weight'] = val;
  },
  'font-style': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['font-style'] = val;
  },
  'font-family': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['font-family'] = val.replace(/['"]/g, '');
  },
  'line-height': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['line-height'] = parseValue(val);
  },
  'letter-spacing': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['letter-spacing'] = parseValue(val);
  },
  'text-align': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['text-align'] = val;
  },
  'text-transform': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['text-transform'] = val;
  },
  'text-decoration': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['text-decoration'] = val;
  },
  'white-space': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['white-space'] = val;
  },
  'text-wrap': (val, settings) => {
    settings._typography = settings._typography || {};
    settings._typography['text-wrap'] = val;
  },
  
  // Background
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
  },
  
  // Border
  border: (val, settings) => {
    const [width, style, color] = val.split(' ').filter(Boolean);
    if (width) {
      settings._border = settings._border || {};
      settings._border.width = {
        top: parseValue(width),
        right: parseValue(width),
        bottom: parseValue(width),
        left: parseValue(width)
      };
    }
    if (style) {
      settings._border = settings._border || {};
      settings._border.style = style;
    }
    if (color) {
      const hex = toHex(color);
      if (hex) {
        settings._border = settings._border || {};
        settings._border.color = { hex };
      }
    }
  },
  'border-radius': (val, settings) => {
    const values = val.split(' ').map(v => parseValue(v));
    settings._border = settings._border || {};
    settings._border.radius = {
      top: values[0],
      right: values[1] || values[0],
      bottom: values[2] || values[0],
      left: values[3] || (values[1] || values[0])
    };
  },
  'border-width': (val, settings) => {
    const values = val.split(' ').map(v => parseValue(v));
    settings._border = settings._border || {};
    settings._border.width = {
      top: values[0],
      right: values[1] || values[0],
      bottom: values[2] || values[0],
      left: values[3] || (values[1] || values[0])
    };
  },
  'border-style': (val, settings) => {
    settings._border = settings._border || {};
    settings._border.style = val;
  },
  'border-color': (val, settings) => {
    const hex = toHex(val);
    if (hex) {
      settings._border = settings._border || {};
      settings._border.color = { hex };
    }
  },
  
  // Spacing
  margin: (val, settings) => {
    const values = val.split(' ').map(v => parseValue(v));
    settings._margin = {
      top: values[0],
      right: values[1] || values[0],
      bottom: values[2] || values[0],
      left: values[3] || (values[1] || values[0])
    };
  },
  padding: (val, settings) => {
    const values = val.split(' ').map(v => parseValue(v));
    settings._padding = {
      top: values[0],
      right: values[1] || values[0],
      bottom: values[2] || values[0],
      left: values[3] || (values[1] || values[0])
    };
  },
  
  // Sizing
  width: (val, settings) => {
    settings._width = parseValue(val);
  },
  'min-width': (val, settings) => {
    settings._widthMin = parseValue(val);
  },
  'max-width': (val, settings) => {
    settings._widthMax = parseValue(val);
  },
  height: (val, settings) => {
    settings._height = parseValue(val);
  },
  'min-height': (val, settings) => {
    settings._heightMin = parseValue(val);
  },
  'max-height': (val, settings) => {
    settings._heightMax = parseValue(val);
  },
  
  // Position
  position: (val, settings) => {
    settings._position = val;
  },
  top: (val, settings) => {
    settings._top = parseValue(val);
  },
  right: (val, settings) => {
    settings._right = parseValue(val);
  },
  bottom: (val, settings) => {
    settings._bottom = parseValue(val);
  },
  left: (val, settings) => {
    settings._left = parseValue(val);
  },
  'z-index': (val, settings) => {
    settings._zIndex = parseValue(val);
  },
  
  // Flexbox
  display: (val, settings) => {
    settings._display = val;
  },
  'flex-direction': (val, settings) => {
    settings._flexDirection = val;
  },
  'justify-content': (val, settings) => {
    settings._justifyContent = val;
  },
  'align-items': (val, settings) => {
    settings._alignItems = val;
  },
  'flex-wrap': (val, settings) => {
    settings._flexWrap = val;
  },
  'flex-grow': (val, settings) => {
    settings._flexGrow = parseValue(val);
  },
  'flex-shrink': (val, settings) => {
    settings._flexShrink = parseValue(val);
  },
  'flex-basis': (val, settings) => {
    settings._flexBasis = parseValue(val);
  },
  'align-self': (val, settings) => {
    settings._alignSelf = val;
  },
  'order': (val, settings) => {
    settings._order = parseValue(val);
  },
  'gap': (val, settings) => {
    settings._gap = parseValue(val);
  },
  
  // Effects
  'opacity': (val, settings) => {
    settings._opacity = parseValue(val);
  },
  'visibility': (val, settings) => {
    settings._visibility = val;
  },
  'overflow': (val, settings) => {
    settings._overflow = val;
  },
  'cursor': (val, settings) => {
    settings._cursor = val;
  },
  'pointer-events': (val, settings) => {
    settings._pointerEvents = val;
  },
  'mix-blend-mode': (val, settings) => {
    settings._mixBlendMode = val;
  },
  'isolation': (val, settings) => {
    settings._isolation = val;
  },
  
  // Transforms
  'transform': (val, settings) => {
    settings._transform = settings._transform || {};
    // Parse transform properties like translateX, rotate, scale, etc.
    const transforms = val.match(/(\w+)\(([^)]+)\)/g) || [];
    transforms.forEach(transform => {
      const match = transform.match(/(\w+)\(([^)]+)\)/);
      if (match) {
        const [_, fn, value] = match;
        
        // Process each value in the transform function
        const processedValues = value.split(',').map(v => {
          const trimmed = v.trim();
          // For translate functions, remove 'px' but keep other units
          if (fn.startsWith('translate')) {
            return trimmed.endsWith('px') ? trimmed.slice(0, -2) : trimmed;
          }
          // For rotate and skew functions, keep the unit (usually 'deg')
          if (fn.startsWith('rotate') || fn.startsWith('skew')) {
            return trimmed;
          }
          // For scale functions, ensure it's a number without units
          if (fn.startsWith('scale')) {
            return parseFloat(trimmed);
          }
          return trimmed;
        });
        
        // Join multiple values with space (e.g., for translate3d)
        const processedValue = processedValues.join(' ');
        
        settings._transform[fn] = processedValue;
      }
    });
  },
  
  // Box Shadow
  'box-shadow': (val, settings) => {
    // Don't set box shadow in global classes, it should be in the element settings
    if (!settings._isGlobalClass) {
      const boxShadow = parseBoxShadow(val);
      settings._boxShadow = boxShadow;
    }
  },
  
  // Text Shadow
  'text-shadow': (val, settings) => {
    const parts = val.split(' ');
    if (parts.length >= 3) {
      settings._typography = settings._typography || {};
      settings._typography.textShadow = settings._typography.textShadow || { values: {} };
      settings._typography.textShadow.values = {
        offsetX: parseValue(parts[0]),
        offsetY: parseValue(parts[1]),
        blur: parseValue(parts[2]),
        color: toHex(parts[3]) ? { hex: toHex(parts[3]) } : undefined
      };
    }
  },
  
  // Transition
  'transition': (val, settings) => {
    settings._cssTransition = val;
  },
  
  // Scroll
  'scroll-snap-type': (val, settings) => {
    settings._scrollSnapType = val;
  },
  'scroll-snap-align': (val, settings) => {
    settings._scrollSnapAlign = val;
  },
  'scroll-snap-stop': (val, settings) => {
    settings._scrollSnapStop = val;
  },
  
  // CSS Classes
  'css-classes': (val, settings) => {
    settings._cssClasses = val;
  },
  
  // CSS Filters
  'filter': (val, settings) => {
    settings._cssFilters = settings._cssFilters || {};
    const filters = val.split(') ');
    filters.forEach(filter => {
      const [name, value] = filter.split('(');
      if (name && value) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          settings._cssFilters[name] = numValue;
        }
      }
    });
  },
  
  // Special mapper for pseudo-classes
  '_pseudo': (value, settings, pseudoClass) => {
    if (!settings._pseudo) settings._pseudo = {};
    if (!settings._pseudo[pseudoClass]) settings._pseudo[pseudoClass] = {};
    
    // Handle nested properties for pseudo-classes
    if (value.startsWith('_')) {
      // Handle Bricks-specific properties like _background, _typography
      const [prop, val] = value.split(':').map(s => s.trim());
      settings._pseudo[pseudoClass][prop] = JSON.parse(val);
    } else {
      // Handle regular CSS properties
      const [prop, val] = value.split(':').map(s => s.trim());
      const normalizedProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const mapper = CSS_PROP_MAPPERS[prop] || CSS_PROP_MAPPERS[normalizedProp];
      
      if (mapper) {
        const pseudoSettings = {};
        mapper(val, pseudoSettings);
        Object.assign(settings._pseudo[pseudoClass], pseudoSettings);
      }
    }
  },
  
  // Background mapper
  '_background': (value, settings) => {
    settings._background = settings._background || {};
    
    // Handle pseudo-class states (hover, active, etc.)
    if (typeof value === 'object') {
      Object.assign(settings._background, value);
    } 
    // Handle regular color values
    else {
      settings._background.color = parseColor(value);
    }
  },
  
  // Border mapper
  '_border': (value, settings) => {
    settings._border = settings._border || {};
    
    // Handle pseudo-class states
    if (typeof value === 'object') {
      Object.assign(settings._border, value);
    }
    // Handle regular border values
    else if (typeof value === 'string') {
      // Parse border shorthand
    }
  },
  
  // Transform mapper
  '_transform': (value, settings) => {
    settings._transform = settings._transform || {};
    
    // Handle pseudo-class states
    if (typeof value === 'object') {
      Object.assign(settings._transform, value);
    }
    // Handle regular transform values
    else if (value.includes('scale')) {
      const scaleValue = value.match(/scale\(([^)]+)\)/)[1];
      settings._transform.scaleX = `scaleX(${scaleValue})`;
      settings._transform.scaleY = `scaleY(${scaleValue})`;
    }
  }
};

// List of supported CSS properties that have direct mappings in Bricks
const supportedProperties = [
  'padding', 'margin', 'background', 'color', 'font-size', 'border',
  'width', 'height', 'display', 'position', 'top', 'right', 'bottom', 'left', 'box-shadow'
];

// Parse CSS declarations into Bricks settings
export function parseCssDeclarations(cssText, className = '') {
  const settings = {};
  const customRules = {};
  
  // Remove any newlines and extra spaces
  const cleanCss = cssText.replace(/\s+/g, ' ').replace(/\s*([:;{}])\s*/g, '$1').trim();
  const declarations = cleanCss.split(';').filter(Boolean);
  
  declarations.forEach(decl => {
    if (!decl.trim()) return;
    
    const colonIndex = decl.indexOf(':');
    if (colonIndex === -1) return;
    
    const prop = decl.slice(0, colonIndex).trim();
    const value = decl.slice(colonIndex + 1).trim();
    
    if (!prop || !value) return;
    
    // Check for pseudo-class in property name (shouldn't happen in raw CSS, but just in case)
    const pseudoMatch = prop.match(/(.*):(hover|active|focus|visited)$/);
    if (pseudoMatch) {
      const baseProp = pseudoMatch[1];
      const pseudoClass = pseudoMatch[2];
      
      if (baseProp === 'transform') {
        if (!settings['_transform:' + pseudoClass]) settings['_transform:' + pseudoClass] = {};
        const scaleValue = value.match(/scale\(([^)]+)\)/)?.[1];
        if (scaleValue) {
          settings['_transform:' + pseudoClass].scaleX = `scale(${scaleValue})`;
          settings['_transform:' + pseudoClass].scaleY = `scale(${scaleValue})`;
        }
        return;
      }
      
      const bricksProp = baseProp.startsWith('_') ? baseProp : `_${baseProp.replace(/-([a-z])/g, (_, l) => l.toUpperCase())}`;
      const mapper = CSS_PROP_MAPPERS[bricksProp] || CSS_PROP_MAPPERS[baseProp];
      
      if (mapper) {
        const pseudoSettings = {};
        mapper(value, pseudoSettings);
        settings[`${bricksProp}:${pseudoClass}`] = pseudoSettings[bricksProp] || pseudoSettings;
      }
      return;
    }
    
    // Handle Bricks' pseudo-class format (property:pseudo)
    const bricksPseudoMatch = prop.match(/^(_[a-zA-Z]+):(hover|active|focus|visited)$/);
    if (bricksPseudoMatch) {
      const baseProp = bricksPseudoMatch[1];
      const pseudoClass = bricksPseudoMatch[2];
      
      if (CSS_PROP_MAPPERS[baseProp]) {
        const pseudoSettings = {};
        CSS_PROP_MAPPERS[baseProp](value, pseudoSettings);
        settings[`${baseProp}:${pseudoClass}`] = pseudoSettings[baseProp];
      }
      return;
    }
    
    // Handle regular properties
    const normalizedProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const mapper = CSS_PROP_MAPPERS[prop] || CSS_PROP_MAPPERS[normalizedProp];
    
    if (mapper) {
      try {
        mapper(value, settings);
      } catch (e) {
        console.error(`Error processing ${prop}: ${value}`, e);
        if (!customRules[prop]) customRules[prop] = {};
        customRules[prop][value] = true;
      }
    } else {
      // Handle box-shadow specially
      if (prop.toLowerCase() === 'box-shadow') {
        settings._boxShadow = parseBoxShadow(value);
      } else {
        if (!customRules[prop]) customRules[prop] = {};
        customRules[prop][value] = true;
      }
    }
  });
  
  if (Object.keys(customRules).length > 0) {
    const fallbackClassName = className || '%root%';
    const cssRules = Object.keys(customRules).map(prop => {
      const values = Object.keys(customRules[prop]).join(', ');
      return `${prop}: ${values}`;
    }).join('; ');
    settings._cssCustom = `${fallbackClassName} {\n  ${cssRules};\n}`;
  }
  
  return settings;
}

/**
 * Converts CSS text to Bricks JSON structure
 * @param {string} html - The HTML content
 * @param {string} css - The CSS content
 * @returns {Object} Bricks JSON structure
 */
export function convertToBricks(html, css) {
  // Parse the HTML to get button text
  const buttonTextMatch = html.match(/>([^<]+)</);
  const buttonText = buttonTextMatch ? buttonTextMatch[1].trim() : '';
  
  // Extract class name from HTML
  const classMatch = html.match(/class=["']([^"']+)["']/);
  const className = classMatch ? classMatch[1] : 'custom-button';
  
  // Parse CSS
  const cssMap = buildCssMap(css);
  const cssClass = Object.keys(cssMap)[0];
  const cssBody = cssMap[cssClass] || '';
  
  // Parse CSS declarations
  const settings = parseCssDeclarations(cssBody, className);
  
  // Clean up _cssCustom array by removing any properties that are already mapped
  if (settings._cssCustom && Array.isArray(settings._cssCustom)) {
    const mappedProps = [
      'color', 'font-size', 'background-color', 'border', 'border-radius', 
      'cursor', 'padding', 'margin'
    ];
    
    // Convert mapped props to a regex pattern
    const mappedPropsPattern = new RegExp(`^(${mappedProps.join('|')}):`);
    
    // Filter out any properties that match our mapped props
    settings._cssCustom = settings._cssCustom.filter(prop => {
      return !mappedPropsPattern.test(prop);
    });
    
    // Format _cssCustom as a proper CSS rule
    if (settings._cssCustom && Array.isArray(settings._cssCustom) && settings._cssCustom.length > 0) {
      // Filter out any empty strings and remove duplicates
      const validProps = settings._cssCustom.filter(prop => prop && prop.trim() !== '');
      if (validProps.length > 0) {
        const uniqueProps = [...new Set(validProps)];
        const cssRules = uniqueProps.join('; ');
        // Create a single line CSS rule with escaped newlines
        settings._cssCustom = `.${className} { ${cssRules}; }`;
      } else {
        settings._cssCustom = '';
      }
    } else {
      settings._cssCustom = '';
    }
  }
  
  // Generate a random ID for the global class
  const classId = Math.random().toString(36).substring(2, 8);
  
  return {
    content: [{
      id: Math.random().toString(36).substring(2, 8),
      name: 'button',
      parent: 'root',
      children: [],
      settings: {
        text: buttonText,
        style: 'primary',
        _cssGlobalClasses: [classId]
      }
    }],
    source: 'bricksCopiedElements',
    sourceUrl: 'http://localhost/bricks',
    version: '2.0-beta',
    globalClasses: [{
      id: classId,
      name: className,
      settings: {
        ...settings,
        _exists: false,
        _isGlobalClass: true
      }
    }],
    globalElements: []
  };
}

export function buildCssMap(cssText) {
  const map = {};
  // Match CSS rules, handling nested rules and media queries
  const regex = /([^{]+)\s*{([^}]*)}/g;
  let match;
  
  while ((match = regex.exec(cssText))) {
    const selector = match[1].trim();
    const body = match[2].trim();
    
    // Extract class names (e.g., `.btn`, `.foo-bar:hover`, `header .hero__wrapper`) and simple tag selectors
    const selectors = selector.split(',');
    selectors.forEach(sel => {
      const trimmedSel = sel.trim();
      if (!trimmedSel) return;

      // Capture all class names within this selector (may include pseudo-classes / combinators)
      const classRegex = /\.([A-Za-z0-9_-]+)(?::([a-z]+))?/g;
      let classMatch;
      while ((classMatch = classRegex.exec(trimmedSel)) !== null) {
        const className = classMatch[1];
        const pseudoClass = classMatch[2];
        
        if (pseudoClass) {
          // Store pseudo-class variant separately
          const pseudoKey = `${className}:${pseudoClass}`;
          if (!map[pseudoKey]) {
            map[pseudoKey] = body;
          }
        } else {
          // Store base class
          if (!map[className]) {
            map[className] = body;
          }
        }
      }
      // If selector is a lone class (e.g., `.foo`) handle above logic; otherwise handled by regex
      if (trimmedSel.startsWith('.')) {
        const parts = trimmedSel.replace(/^[.\s]+/, '').split(':');
        const loneClass = parts[0];
        if (!map[loneClass]) {
          map[loneClass] = body;
        }
        // If there's a pseudo-class, store it separately
        if (parts.length > 1) {
          const pseudoKey = `${loneClass}:${parts[1]}`;
          if (!map[pseudoKey]) {
            map[pseudoKey] = body;
          }
        }
      }

      // Capture simple tag selectors that have no combinators/pseudo
      const tagCandidate = trimmedSel.replace(/:[^\s]*/, '').trim();
      if (/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(tagCandidate)) {
        map[tagCandidate.toLowerCase()] = body;
      }
    });
  }
  
  return map;
}
