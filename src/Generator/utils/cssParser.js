// CSS parsing utilities
import { spacingMappers } from './propertyMappers/layout-spacing';
import { sizingMappers } from './propertyMappers/layout-sizing';
import { positionMappers } from './propertyMappers/layout-position';
import { layoutMiscMappers } from './propertyMappers/layout-misc';
import { typographyMappers } from './propertyMappers/typography';
import { backgroundMappers } from './propertyMappers/background';
import { borderBoxShadowMappers } from './propertyMappers/boder-box-shadow';
import { parseBoxShadow } from './propertyMappers/mapperUtils';

// Convert basic color names to hex; pass through hex values
export function toHex(val) {
  if (!val) return null;
  
  // Preserve rgb/rgba colors as-is
  if (val.startsWith('rgb')) {
    return val;
  }
  
  // Handle hex colors
  if (val.startsWith('#')) {
    return val.length === 4 || val.length === 7 ? val : null;
  }
  
  // Handle named colors
  const namedColors = {
    'red': '#ff0000',
    'green': '#008000',
    'blue': '#0000ff',
    'black': '#000000',
    'white': '#ffffff',
    'gray': '#808080',
    'grey': '#808080'
  };
  
  return namedColors[val.toLowerCase()] || null;
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
export const parseValue = (value) => {
  if (typeof value !== 'string') return value;

  // Handle CSS variables
  if (value.startsWith('var(')) return value;

  // Handle calc() and other CSS functions
  if (value.includes('(')) return value;

  // Handle numbers with units
  const numMatch = value.match(/^(-?\d*\.?\d+)([a-z%]*)$/);
  if (numMatch) {
    const num = numMatch[1];
    const unit = numMatch[2];

    // For px values, we just want the number
    if (unit === 'px') return num;

    // For other units (%, em, rem, deg, etc.), keep the unit
    return value;
  }

  return value;
};

// CSS properties Bricks has native controls for and how to map them
export const CSS_PROP_MAPPERS = {
  // Layout - Spacing - Margin - Padding
  'margin': spacingMappers['margin'],
  'margin-top': spacingMappers['margin-top'],
  'margin-right': spacingMappers['margin-right'],
  'margin-bottom': spacingMappers['margin-bottom'],
  'margin-left': spacingMappers['margin-left'],
  'padding': spacingMappers['padding'],
  'padding-top': spacingMappers['padding-top'],
  'padding-right': spacingMappers['padding-right'],
  'padding-bottom': spacingMappers['padding-bottom'],
  'padding-left': spacingMappers['padding-left'],

  'gap': (val, settings) => {
    settings._gap = parseValue(val);
  },
  'row-gap': (val, settings) => {
    settings._rowGap = parseValue(val);
  },
  'column-gap': (val, settings) => {
    settings._columnGap = parseValue(val);
  },
  // Layout - Sizing
  'width': sizingMappers['width'],
  'height': sizingMappers['height'],
  'min-width': sizingMappers['min-width'],
  'max-width': sizingMappers['max-width'],
  'min-height': sizingMappers['min-height'],
  'max-height': sizingMappers['max-height'],
  'aspect-ratio': sizingMappers['aspect-ratio'],

  // Layout - Position
  'position': positionMappers['position'],
  'top': positionMappers['top'],
  'right': positionMappers['right'],
  'bottom': positionMappers['bottom'],
  'left': positionMappers['left'],
  'z-index': positionMappers['z-index'],

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
  // Layout - Misc
  'pointer-events': layoutMiscMappers['pointer-events'],
  'mix-blend-mode': layoutMiscMappers['mix-blend-mode'],
  'isolation': layoutMiscMappers['isolation'],
  'cursor': layoutMiscMappers['cursor'],
  'opacity': layoutMiscMappers['opacity'],
  'overflow': layoutMiscMappers['overflow'],
  'overflow-x': layoutMiscMappers['overflow-x'],
  'overflow-y': layoutMiscMappers['overflow-y'],
  'visibility': layoutMiscMappers['visibility'],

  // Typography
  'color': typographyMappers['color'],
  'font-size': typographyMappers['font-size'],
  'font-weight': typographyMappers['font-weight'],
  'font-style': typographyMappers['font-style'],
  'font-family': typographyMappers['font-family'],
  'line-height': typographyMappers['line-height'],
  'letter-spacing': typographyMappers['letter-spacing'],
  'text-align': typographyMappers['text-align'],
  'text-transform': typographyMappers['text-transform'],
  'text-decoration': typographyMappers['text-decoration'],
  'white-space': typographyMappers['white-space'],
  'text-wrap': typographyMappers['text-wrap'],
  'text-shadow': typographyMappers['text-shadow'],

  // Background
  'background-color': backgroundMappers['background-color'],
  'background-image': backgroundMappers['background-image'],
  'background-repeat': backgroundMappers['background-repeat'],
  'background-size': backgroundMappers['background-size'],
  'background-position': backgroundMappers['background-position'],
  'background-attachment': backgroundMappers['background-attachment'],
  'background-blend-mode': backgroundMappers['background-blend-mode'],

  // Border
  'box-shadow': borderBoxShadowMappers['box-shadow'],
  'border': borderBoxShadowMappers['border'],
  'border-width': borderBoxShadowMappers['border-width'],
  'border-style': borderBoxShadowMappers['border-style'],
  'border-color': borderBoxShadowMappers['border-color'],
  'border-radius': borderBoxShadowMappers['border-radius'],
  'border-top-width': borderBoxShadowMappers['border-top-width'],
  'border-right-width': borderBoxShadowMappers['border-right-width'],
  'border-bottom-width': borderBoxShadowMappers['border-bottom-width'],
  'border-left-width': borderBoxShadowMappers['border-left-width'],

  // Transform
  'transform': (val, settings) => {
    settings._transform = val;
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

  // Remove CSS comments
  const commentlessCss = cssText.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove any newlines and extra spaces
  const cleanCss = commentlessCss.replace(/\s+/g, ' ').replace(/\s*([:;{}])\s*/g, '$1').trim();
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
        const boxShadow = parseBoxShadow(value);
        settings._boxShadow = boxShadow;
        // Also set in _effects for consistency with other effects
        settings._effects = settings._effects || {};
        settings._effects.boxShadow = boxShadow;
        return;
      }
      if (!customRules[prop]) customRules[prop] = {};
      customRules[prop][value] = true;
    }
  });

  const nativeProperties = [
    'padding', 'margin', 'background', 'color', 'font-size', 'border',
    'width', 'height', 'display', 'position', 'top', 'right', 'bottom', 'left', 'box-shadow'
  ];

  Object.keys(customRules).forEach(property => {
    if (nativeProperties.includes(property)) {
      delete customRules[property];
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
      'cursor', 'padding', 'margin', 'box-shadow'
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
  // Remove CSS comments first
  const cleanedCss = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
  // Match CSS rules, handling nested rules and media queries
  const regex = /([^{]+)\s*{([^}]*)}/g;
  let match;

  while ((match = regex.exec(cleanedCss))) {
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
