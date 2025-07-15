// cssParser.js
// CSS parsing utilities
import { displayMappers } from './propertyMappers/display';
import { gridMappers } from './propertyMappers/content-grid';
import { flexboxMappers } from './propertyMappers/content-flexbox';
import { spacingMappers } from './propertyMappers/layout-spacing';
import { sizingMappers } from './propertyMappers/layout-sizing';
import { positionMappers } from './propertyMappers/layout-position';
import { layoutMiscMappers } from './propertyMappers/layout-misc';
import { typographyMappers } from './propertyMappers/typography';
import { backgroundMappers } from './propertyMappers/background';
import { borderBoxShadowMappers } from './propertyMappers/boder-box-shadow';
import { parseBoxShadow } from './propertyMappers/mapperUtils';
import { filterMappers, effectsMappers, transitionsMappers } from './propertyMappers/filters-transitions';
import { scrollSnapMappers } from './propertyMappers/layout-scroll-snap';

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
    'black': '#000000',
    'white': '#ffffff',
    'gray': '#808080',
    'lightgray': '#d3d3d3',
    'darkgray': '#a9a9a9',
    'red': '#ff0000',
    'darkred': '#8b0000',
    'blue': '#0000ff',
    'navy': '#000080',
    'skyblue': '#87ceeb',
    'dodgerblue': '#1e90ff',
    'royalblue': '#4169e1',
    'green': '#008000',
    'lime': '#00ff00',
    'limegreen': '#32cd32',
    'seagreen': '#2e8b57',
    'teal': '#008080',
    'aqua': '#00ffff',
    'cyan': '#00ffff',
    'yellow': '#ffff00',
    'orange': '#ffa500',
    'orangered': '#ff4500',
    'gold': '#ffd700',
    'pink': '#ffc0cb',
    'hotpink': '#ff69b4',
    'purple': '#800080',
    'violet': '#ee82ee',
    'magenta': '#ff00ff',
    'silver': '#c0c0c0',
    'whitesmoke': '#f5f5f5',
    'lightblue': '#add8e6',
    'lightgreen': '#90ee90',
    'lightpink': '#ffb6c1'
  };


  return namedColors[val.toLowerCase()] || null;
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
export const getCssPropMappers = (settings) => {
  const mappers = {
    'display': displayMappers['display'],
    // Layout Mappers
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
    // Layout- Scroll Snap
    'scroll-snap-type': scrollSnapMappers['scroll-snap-type'],
    'scroll-snap-align': scrollSnapMappers['scroll-snap-align'],
    'scroll-snap-stop': scrollSnapMappers['scroll-snap-stop'],
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
    // End Layout Mappers

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
    'background-origin': backgroundMappers['background-origin'],
    'background-clip': backgroundMappers['background-clip'],
    '-webkit-background-clip': backgroundMappers['-webkit-background-clip'],
    'background': backgroundMappers['background'],

    // Border
    'box-shadow': borderBoxShadowMappers['box-shadow'],
    'border': borderBoxShadowMappers['border'],
    'border-width': borderBoxShadowMappers['border-width'],
    'border-style': borderBoxShadowMappers['border-style'],
    'border-color': borderBoxShadowMappers['border-color'],
    'border-top-width': borderBoxShadowMappers['border-top-width'],
    'border-right-width': borderBoxShadowMappers['border-right-width'],
    'border-bottom-width': borderBoxShadowMappers['border-bottom-width'],
    'border-left-width': borderBoxShadowMappers['border-left-width'],
    'border-radius': borderBoxShadowMappers['border-radius'],
    // Does not supported in bricks 
    // 'border-top-left-radius': borderBoxShadowMappers['border-top-left-radius'],
    // 'border-top-right-radius': borderBoxShadowMappers['border-top-right-radius'],
    // 'border-bottom-right-radius': borderBoxShadowMappers['border-bottom-right-radius'],
    // 'border-bottom-left-radius': borderBoxShadowMappers['border-bottom-left-radius'],

    // Transform
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
    },

    // CSS Filters - Transition
    'filter': effectsMappers['filter'],
    'backdrop-filter': effectsMappers['backdrop-filter'],
    'blur': filterMappers['blur'],
    'brightness': filterMappers['brightness'],
    'contrast': filterMappers['contrast'],
    'hue-rotate': filterMappers['hue-rotate'],
    'invert': filterMappers['invert'],
    'opacity': filterMappers['opacity'],
    'saturate': filterMappers['saturate'],
    'sepia': filterMappers['sepia'],
    // Transition
    'transition': transitionsMappers['transition'],
    'transition-property': transitionsMappers['transition-property'],
    'transition-duration': transitionsMappers['transition-duration'],
    'transition-timing-function': transitionsMappers['transition-timing-function'],
    'transition-delay': transitionsMappers['transition-delay'],

    // CSS Classes & ID
    'css-classes': (val, settings) => {
      settings._cssClasses = val;
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
        const mapper = getCssPropMappers(settings)[prop] || getCssPropMappers(settings)[normalizedProp];

        if (mapper) {
          const pseudoSettings = {};
          mapper(val, pseudoSettings);
          Object.assign(settings._pseudo[pseudoClass], pseudoSettings);
        }
      }
    },
  };

  if (settings._display === 'grid') {
    Object.assign(mappers, {
      'grid-gap': gridMappers['grid-gap'],
      'grid-row-gap': gridMappers['grid-row-gap'],
      'grid-column-gap': gridMappers['grid-column-gap'],
      'grid-template-columns': gridMappers['grid-template-columns'],
      'grid-template-rows': gridMappers['grid-template-rows'],
      'grid-template-areas': gridMappers['grid-template-areas'],
      'grid-auto-columns': gridMappers['grid-auto-columns'],
      'grid-auto-rows': gridMappers['grid-auto-rows'],
      'grid-auto-flow': gridMappers['grid-auto-flow'],
      'grid-column': gridMappers['grid-column'],
      'grid-row': gridMappers['grid-row'],
      'grid-area': gridMappers['grid-area'],
      'justify-items': gridMappers['justify-items'],
      'gap': (value, settings) => {
        const values = value.split(' ').map(v => v.replace('px', '').trim()).filter(Boolean);
        if (values.length === 1) {
          settings._gridGap = `${values[0]} ${values[0]}`;
        } else if (values.length >= 2) {
          settings._gridGap = `${values[0]} ${values[1]}`;
        }
      }
    });
  } else {
    Object.assign(mappers, {
      'flex-direction': flexboxMappers['flex-direction'],
      'flex-wrap': flexboxMappers['flex-wrap'],
      'justify-content': flexboxMappers['justify-content'],
      'align-items': flexboxMappers['align-items'],
      'align-content': flexboxMappers['align-content'],
      'flex-grow': flexboxMappers['flex-grow'],
      'flex-shrink': flexboxMappers['flex-shrink'],
      'flex-basis': flexboxMappers['flex-basis'],
      'align-self': flexboxMappers['align-self'],
      'order': flexboxMappers['order'],
      'gap': (value, settings) => {
        const [columnGap, rowGap = columnGap] = value.split(' ').map(v => v.replace('px', ''));
        settings._columnGap = columnGap;
        settings._rowGap = rowGap;
      },
      'row-gap': flexboxMappers['row-gap'],
      'column-gap': flexboxMappers['column-gap']
    });
  }

  return mappers;
};

// Parse CSS declarations into Bricks settings
export function parseCssDeclarations(combinedProperties, className = '', variables = {}) {
  const settings = {};
  const customRules = {};

  const resolveCssVariables = (value) => {
    if (typeof value !== 'string' || !value.includes('var(')) {
      return value;
    }
    return value.replace(/var\((--[\w-]+)\)/g, (match, varName) => {
      return variables[varName] || match;
    });
  };

  // Handle combined properties object
  if (typeof combinedProperties === 'object') {
    Object.entries(combinedProperties).forEach(([prop, value]) => {
      const resolvedValue = resolveCssVariables(value);
      const normalizedProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const CSS_PROP_MAPPERS = getCssPropMappers(settings);
      const mapper = CSS_PROP_MAPPERS[prop] || CSS_PROP_MAPPERS[normalizedProp];

      if (mapper) {
        try {
          mapper(resolvedValue, settings);
        } catch (e) {
          console.error(`Error processing ${prop}: ${resolvedValue}`, e);
          if (!customRules[prop]) customRules[prop] = {};
          customRules[prop][resolvedValue] = true;
        }
      } else {
        if (!customRules[prop]) customRules[prop] = {};
        customRules[prop][resolvedValue] = true;
      }
    });
  } else {
    // Handle CSS string
    const commentlessCss = combinedProperties.replace(/\/\*[\s\S]*?\*\//g, '');
    const cleanCss = commentlessCss.replace(/\s+/g, ' ').replace(/\s*([:;{}])\s*/g, '$1').trim();
    const declarations = cleanCss.split(';').filter(Boolean);

    declarations.forEach(decl => {
      if (!decl.trim()) return;

      const colonIndex = decl.indexOf(':');
      if (colonIndex === -1) return;

      const prop = decl.slice(0, colonIndex).trim();
      const value = decl.slice(colonIndex + 1).trim();

      if (!prop || !value) return;

      const resolvedValue = resolveCssVariables(value);
      const normalizedProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const CSS_PROP_MAPPERS = getCssPropMappers(settings);
      const mapper = CSS_PROP_MAPPERS[prop] || CSS_PROP_MAPPERS[normalizedProp];

      if (mapper) {
        try {
          mapper(resolvedValue, settings);
        } catch (e) {
          console.error(`Error processing ${prop}: ${resolvedValue}`, e);
          if (!customRules[prop]) customRules[prop] = {};
          customRules[prop][resolvedValue] = true;
        }
      } else {
        if (!customRules[prop]) customRules[prop] = {};
        customRules[prop][resolvedValue] = true;
      }
    });
  }

  // Handle custom rules
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
    if (!settings._skipTransitionCustom) {
      const selector = fallbackClassName === ':root' ? ':root' : `.${fallbackClassName}`;
      settings._cssCustom = `${selector} {\n  ${cssRules};\n}`;
    }
    settings._skipTransitionCustom = false;
  }

  return settings;
}

// Enhanced CSS matching function
export function matchCSSSelectors(element, cssMap) {
  const combinedProperties = {};
  const doc = element.ownerDocument;

  // Helper to parse CSS properties string into object
  const parseProperties = (propertiesString) => {
    const properties = {};
    const declarations = propertiesString.split(';').filter(decl => decl.trim());

    declarations.forEach(decl => {
      const [property, value] = decl.split(':').map(part => part.trim());
      if (property && value) {
        properties[property] = value;
      }
    });

    return properties;
  };

  // Check each CSS selector against the element
  Object.entries(cssMap).forEach(([selector, properties]) => {
    try {
      let matches = false;

      // Try to match the selector
      try {
        matches = element.matches(selector);
      } catch (e) {
        // If selector is invalid for matches(), try alternative methods
        const selectorType = getSelectorType(selector);

        if (selectorType === 'tag' && element.tagName.toLowerCase() === selector.toLowerCase()) {
          matches = true;
        } else if (selectorType === 'class' && element.classList.contains(selector.substring(1))) {
          matches = true;
        } else if (selectorType === 'id' && element.id === selector.substring(1)) {
          matches = true;
        } else if (selectorType === 'complex') {
          // For complex selectors, try querySelectorAll on document
          try {
            const matchingElements = doc.querySelectorAll(selector);
            matches = Array.from(matchingElements).includes(element);
          } catch (err) {
            // If still fails, skip this selector
            matches = false;
          }
        }
      }

      if (matches) {
        const parsedProperties = parseProperties(properties);
        Object.assign(combinedProperties, parsedProperties);

        console.log(`Element matched by: ${selector}`);
        console.log('Properties:', parsedProperties);
      }
    } catch (error) {
      console.warn(`Error processing selector: ${selector}`, error);
    }
  });

  return combinedProperties;
}

// Helper to determine selector type
const getSelectorType = (selector) => {
  if (selector.startsWith('#')) return 'id';
  if (selector.startsWith('.')) return 'class';
  if (selector.includes('>') || selector.includes('+') || selector.includes('~') ||
    selector.includes(' ') || selector.includes('[')) return 'complex';
  return 'tag';
};


/**
 * Enhanced buildCssMap function to handle complex selectors
 * @param {string} cssText - The CSS content
 * @returns {Object} Map of selectors to their CSS declarations
 */
export function buildCssMap(cssText) {
  const map = {};
  const variables = {};
  let rootStyles = '';

  // Remove comments and normalize whitespace
  const cleanCSS = cssText
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Split into rules
  const rules = [];
  let current = '';
  let inBrackets = 0;

  for (let i = 0; i < cleanCSS.length; i++) {
    const char = cleanCSS[i];
    if (char === '{') {
      inBrackets++;
    } else if (char === '}') {
      inBrackets--;
      if (inBrackets === 0) {
        rules.push(current.trim() + '}');
        current = '';
        continue;
      }
    }
    current += char;
  }

  // Process each rule
  rules.forEach(rule => {
    const [selectorPart, ...rest] = rule.split('{');
    if (!selectorPart || !rest.length) return;

    const properties = rest.join('{').replace(/}$/, '').trim();
    if (!properties) return;

    // Split multiple selectors and process each one
    selectorPart.split(',').forEach(selector => {
      const trimmed = selector.trim();
      if (trimmed) {
        map[trimmed] = properties;

        if (trimmed === ':root') {
          rootStyles = properties;
          properties.split(';').forEach(prop => {
            const [key, value] = prop.split(':').map(s => s.trim());
            if (key && key.startsWith('--')) {
              variables[key] = value;
            }
          });
        }
      }
    });
  });

  return { cssMap: map, variables, rootStyles };
}