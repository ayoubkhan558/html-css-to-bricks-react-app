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
    'aliceblue': '#f0f8ff',
    'antiquewhite': '#faebd7',
    'aqua': '#00ffff',
    'aquamarine': '#7fffd4',
    'azure': '#f0ffff',
    'beige': '#f5f5dc',
    'bisque': '#ffe4c4',
    'black': '#000000',
    'blanchedalmond': '#ffebcd',
    'blue': '#0000ff',
    'blueviolet': '#8a2be2',
    'brown': '#a52a2a',
    'burlywood': '#deb887',
    'cadetblue': '#5f9ea0',
    'chartreuse': '#7fff00',
    'chocolate': '#d2691e',
    'coral': '#ff7f50',
    'cornflowerblue': '#6495ed',
    'cornsilk': '#fff8dc',
    'crimson': '#dc143c',
    'cyan': '#00ffff',
    'darkblue': '#00008b',
    'darkcyan': '#008b8b',
    'darkgoldenrod': '#b8860b',
    'darkgray': '#a9a9a9',
    'darkgreen': '#006400',
    'darkgrey': '#a9a9a9',
    'darkkhaki': '#bdb76b',
    'darkmagenta': '#8b008b',
    'darkolivegreen': '#556b2f',
    'darkorange': '#ff8c00',
    'darkorchid': '#9932cc',
    'darkred': '#8b0000',
    'darksalmon': '#e9967a',
    'darkseagreen': '#8fbc8f',
    'darkslateblue': '#483d8b',
    'darkslategray': '#2f4f4f',
    'darkslategrey': '#2f4f4f',
    'darkturquoise': '#00ced1',
    'darkviolet': '#9400d3',
    'deeppink': '#ff1493',
    'deepskyblue': '#00bfff',
    'dimgray': '#696969',
    'dimgrey': '#696969',
    'dodgerblue': '#1e90ff',
    'firebrick': '#b22222',
    'floralwhite': '#fffaf0',
    'forestgreen': '#228b22',
    'fuchsia': '#ff00ff',
    'gainsboro': '#dcdcdc',
    'ghostwhite': '#f8f8ff',
    'gold': '#ffd700',
    'goldenrod': '#daa520',
    'gray': '#808080',
    'green': '#008000',
    'greenyellow': '#adff2f',
    'grey': '#808080',
    'honeydew': '#f0fff0',
    'hotpink': '#ff69b4',
    'indianred': '#cd5c5c',
    'indigo': '#4b0082',
    'ivory': '#fffff0',
    'khaki': '#f0e68c',
    'lavender': '#e6e6fa',
    'lavenderblush': '#fff0f5',
    'lawngreen': '#7cfc00',
    'lemonchiffon': '#fffacd',
    'lightblue': '#add8e6',
    'lightcoral': '#f08080',
    'lightcyan': '#e0ffff',
    'lightgoldenrodyellow': '#fafad2',
    'lightgray': '#d3d3d3',
    'lightgreen': '#90ee90',
    'lightgrey': '#d3d3d3',
    'lightpink': '#ffb6c1',
    'lightsalmon': '#ffa07a',
    'lightseagreen': '#20b2aa',
    'lightskyblue': '#87cefa',
    'lightslategray': '#778899',
    'lightslategrey': '#778899',
    'lightsteelblue': '#b0c4de',
    'lightyellow': '#ffffe0',
    'lime': '#00ff00',
    'limegreen': '#32cd32',
    'linen': '#faf0e6',
    'magenta': '#ff00ff',
    'maroon': '#800000',
    'mediumaquamarine': '#66cdaa',
    'mediumblue': '#0000cd',
    'mediumorchid': '#ba55d3',
    'mediumpurple': '#9370db',
    'mediumseagreen': '#3cb371',
    'mediumslateblue': '#7b68ee',
    'mediumspringgreen': '#00fa9a',
    'mediumturquoise': '#48d1cc',
    'mediumvioletred': '#c71585',
    'midnightblue': '#191970',
    'mintcream': '#f5fffa',
    'mistyrose': '#ffe4e1',
    'moccasin': '#ffe4b5',
    'navajowhite': '#ffdead',
    'navy': '#000080',
    'oldlace': '#fdf5e6',
    'olive': '#808000',
    'olivedrab': '#6b8e23',
    'orange': '#ffa500',
    'orangered': '#ff4500',
    'orchid': '#da70d6',
    'palegoldenrod': '#eee8aa',
    'palegreen': '#98fb98',
    'paleturquoise': '#afeeee',
    'palevioletred': '#db7093',
    'papayawhip': '#ffefd5',
    'peachpuff': '#ffdab9',
    'peru': '#cd853f',
    'pink': '#ffc0cb',
    'plum': '#dda0dd',
    'powderblue': '#b0e0e6',
    'purple': '#800080',
    'rebeccapurple': '#663399',
    'red': '#ff0000',
    'rosybrown': '#bc8f8f',
    'royalblue': '#4169e1',
    'saddlebrown': '#8b4513',
    'salmon': '#fa8072',
    'sandybrown': '#f4a460',
    'seagreen': '#2e8b57',
    'seashell': '#fff5ee',
    'sienna': '#a0522d',
    'silver': '#c0c0c0',
    'skyblue': '#87ceeb',
    'slateblue': '#6a5acd',
    'slategray': '#708090',
    'slategrey': '#708090',
    'snow': '#fffafa',
    'springgreen': '#00ff7f',
    'steelblue': '#4682b4',
    'tan': '#d2b48c',
    'teal': '#008080',
    'thistle': '#d8bfd8',
    'tomato': '#ff6347',
    'turquoise': '#40e0d0',
    'violet': '#ee82ee',
    'wheat': '#f5deb3',
    'white': '#ffffff',
    'whitesmoke': '#f5f5f5',
    'yellow': '#ffff00',
    'yellowgreen': '#9acd32'
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
export const CSS_PROP_MAPPERS = {
  'display': displayMappers['display'],
  // Content Tab - Grid
  'grid-gap': gridMappers['grid-gap'],
  'gap': gridMappers['gap'],
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
  'align-items': gridMappers['align-items'],
  'justify-content': gridMappers['justify-content'],
  'align-content': gridMappers['align-content'],
  'order': gridMappers['order'],
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
      const mapper = CSS_PROP_MAPPERS[prop] || CSS_PROP_MAPPERS[normalizedProp];

      if (mapper) {
        const pseudoSettings = {};
        mapper(val, pseudoSettings);
        Object.assign(settings._pseudo[pseudoClass], pseudoSettings);
      }
    }
  },
};

// Parse CSS declarations into Bricks settings
export function parseCssDeclarations(combinedProperties, className = '') {
  console.log("parseCssDeclarations ", combinedProperties);
  const settings = {};
  const customRules = {};

  // Handle combined properties object
  if (typeof combinedProperties === 'object') {
    Object.entries(combinedProperties).forEach(([prop, value]) => {
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
        if (!customRules[prop]) customRules[prop] = {};
        customRules[prop][value] = true;
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
        if (!customRules[prop]) customRules[prop] = {};
        customRules[prop][value] = true;
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
      settings._cssCustom = `.${fallbackClassName} {\n  ${cssRules};\n}`;
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
  console.log("buildCssMap ", cssText);
  const map = {};
  
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
      }
    });
  });
  
  return map;
}