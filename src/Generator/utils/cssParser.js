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
import { transformsMappers } from './propertyMappers/transforms';
import { logger } from '@lib/utils/logger';



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
    'border-top-color': borderBoxShadowMappers['border-top-color'],
    'border-right-color': borderBoxShadowMappers['border-right-color'],
    'border-bottom-color': borderBoxShadowMappers['border-bottom-color'],
    'border-left-color': borderBoxShadowMappers['border-left-color'],
    // Does not supported in bricks 
    // 'border-top-left-radius': borderBoxShadowMappers['border-top-left-radius'],
    // 'border-top-right-radius': borderBoxShadowMappers['border-top-right-radius'],
    // 'border-bottom-right-radius': borderBoxShadowMappers['border-bottom-right-radius'],
    // 'border-bottom-left-radius': borderBoxShadowMappers['border-bottom-left-radius'],

    // Transform
    'transform': transformsMappers['transform'],
    'transform-origin': transformsMappers['transform-origin'],
    'transform-style': transformsMappers['transform-style'],
    'perspective': transformsMappers['perspective'],
    'perspective-origin': transformsMappers['perspective-origin'],
    'backface-visibility': transformsMappers['backface-visibility'],

    // CSS Filters - Transition
    'filter': effectsMappers['filter'],
    'backdrop-filter': effectsMappers['backdrop-filter'],
    'blur': filterMappers['blur'],
    'brightness': filterMappers['brightness'],
    'contrast': filterMappers['contrast'],
    'hue-rotate': filterMappers['hue-rotate'],
    'invert': filterMappers['invert'],
    // Note: 'opacity' is handled by layoutMiscMappers, not filterMappers
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
      'gap': gridMappers['gap'] // Use the mapper from gridMappers instead of inline
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
      'gap': flexboxMappers['gap'], // Use the mapper from flexboxMappers instead of inline
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

    // Recursively resolve CSS variables (handle nested var() calls)
    let resolved = value;
    let maxIterations = 10; // Prevent infinite loops
    let iteration = 0;

    while (resolved.includes('var(') && iteration < maxIterations) {
      const previousResolved = resolved;
      resolved = resolved.replace(/var\((--[\w-]+)\)/g, (match, varName) => {
        return variables[varName] || match;
      });

      // If nothing changed, break to avoid infinite loop
      if (previousResolved === resolved) {
        break;
      }
      iteration++;
    }

    return resolved;
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
          logger.error(`Error processing ${prop}: ${resolvedValue}`, e);
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
          logger.error(`Error processing ${prop}: ${resolvedValue}`, e);
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
    'width', 'height', 'display', 'position', 'top', 'right', 'bottom', 'left', 'box-shadow',
    'opacity', 'overflow', 'transform', 'transition', 'filter', 'backdrop-filter'
  ];

  Object.keys(customRules).forEach(property => {
    if (nativeProperties.includes(property)) {
      delete customRules[property];
    }
  });

  if (Object.keys(customRules).length > 0) {
    const fallbackClassName = className || '%root%';
    const cssRules = Object.keys(customRules).map(prop => {
      const values = Object.keys(customRules[prop]);
      // Handle border property with rgba values properly
      if (prop === 'border' && values.some(v => v.startsWith('rgba('))) {
        // Use the first rgba value directly
        const rgbaValue = values.find(v => v.startsWith('rgba('));
        return `${prop}: ${rgbaValue}`;
      }
      const joinedValues = values.join(', ');
      return `${prop}: ${joinedValues}`;
    }).join(';\n  ');

    if (!settings._skipTransitionCustom) {
      const selector = fallbackClassName === ':root' ? ':root' : `.${fallbackClassName.replace(/\./g, '\\.')}`;
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
  const unmatchedSelectors = []; // Store selectors that need to be added as custom CSS

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
      let isPseudoElement = false;

      // Check if selector contains pseudo-elements (::before, ::after, etc.)
      if (selector.includes('::')) {
        isPseudoElement = true;
        // Extract base selector (without pseudo-element)
        const baseSelector = selector.split('::')[0].trim();

        // Check if base selector matches the element
        try {
          matches = element.matches(baseSelector);
          if (matches) {
            // Store this selector for custom CSS
            unmatchedSelectors.push({ selector, properties });
          }
        } catch (e) {
          // Fallback for complex base selectors
          try {
            const matchingElements = doc.querySelectorAll(baseSelector);
            matches = Array.from(matchingElements).includes(element);
            if (matches) {
              unmatchedSelectors.push({ selector, properties });
            }
          } catch (err) {
            // Skip this selector
          }
        }
        return; // Skip further processing for pseudo-elements
      }

      // Check if selector contains pseudo-classes (:hover, :focus, etc.)
      const pseudoClassMatch = selector.match(/:(\w+)$/);
      if (pseudoClassMatch) {
        // Extract base selector (without pseudo-class)
        const baseSelector = selector.substring(0, selector.lastIndexOf(':'));

        // Check if base selector matches the element
        try {
          matches = element.matches(baseSelector);
          if (matches) {
            // Store this selector for custom CSS
            unmatchedSelectors.push({ selector, properties });
          }
        } catch (e) {
          // Fallback for complex base selectors
          try {
            const matchingElements = doc.querySelectorAll(baseSelector);
            matches = Array.from(matchingElements).includes(element);
            if (matches) {
              unmatchedSelectors.push({ selector, properties });
            }
          } catch (err) {
            // Skip this selector
          }
        }
        return; // Skip further processing for pseudo-classes
      }

      // Try to match the selector
      try {
        matches = element.matches(selector);

        // If selector is a descendant/complex selector, treat it as custom CSS
        // to preserve the relationship (e.g., ".hero-content p" should not apply to <p> directly)
        const selectorType = getSelectorType(selector);
        if (matches && selectorType === 'complex') {
          // This is a complex selector that matches - add to custom CSS instead
          unmatchedSelectors.push({ selector, properties });
          return; // Don't add to combinedProperties
        }
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
          // For complex selectors, add to custom CSS instead of trying to apply directly
          try {
            const matchingElements = doc.querySelectorAll(selector);
            const doesMatch = Array.from(matchingElements).includes(element);
            if (doesMatch) {
              unmatchedSelectors.push({ selector, properties });
            }
          } catch (err) {
            // If still fails, skip this selector
          }
          return; // Don't add to combinedProperties
        }
      }

      if (matches) {
        const parsedProperties = parseProperties(properties);
        Object.assign(combinedProperties, parsedProperties);

        // console.log(`Element matched by: ${selector}`);
        // console.log('Properties:', parsedProperties);
      }
    } catch (error) {
      logger.warn(`Error processing selector: ${selector}`, error);
    }
  });

  return { properties: combinedProperties, pseudoSelectors: unmatchedSelectors };
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
  let rootStyles = [];
  const keyframes = []; // Store @keyframes rules
  const mediaQueries = []; // Store @media rules for future use

  // Remove comments and normalize whitespace
  const cleanCSS = cssText
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Extract @keyframes rules before processing other rules
  const keyframeRegex = /@keyframes\s+([\w-]+)\s*\{/g;
  let keyframeMatch;
  let cssWithoutKeyframes = cleanCSS;
  const extractedKeyframes = [];

  while ((keyframeMatch = keyframeRegex.exec(cleanCSS)) !== null) {
    const startIndex = keyframeMatch.index;
    const animationName = keyframeMatch[1];

    // Find the matching closing brace for this @keyframes block
    let braceCount = 0;
    let endIndex = startIndex + keyframeMatch[0].length;
    let foundStart = false;

    for (let i = startIndex; i < cleanCSS.length; i++) {
      if (cleanCSS[i] === '{') {
        braceCount++;
        foundStart = true;
      } else if (cleanCSS[i] === '}') {
        braceCount--;
        if (foundStart && braceCount === 0) {
          endIndex = i + 1;
          break;
        }
      }
    }

    const fullRule = cleanCSS.substring(startIndex, endIndex);
    extractedKeyframes.push({
      name: animationName,
      rule: fullRule
    });
  }

  // Remove all extracted keyframes from CSS
  extractedKeyframes.forEach(kf => {
    cssWithoutKeyframes = cssWithoutKeyframes.replace(kf.rule, '');
  });

  // Store in keyframes array
  keyframes.push(...extractedKeyframes);

  // Split into rules
  const rules = [];
  let current = '';
  let inBrackets = 0;

  for (let i = 0; i < cssWithoutKeyframes.length; i++) {
    const char = cssWithoutKeyframes[i];
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
          // Add to root styles array
          rootStyles.push(properties);

          // Process variables from all root blocks
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

  // Join all root styles with semicolons to maintain valid CSS
  const combinedRootStyles = rootStyles.length > 0 ? `:root {\n  ${rootStyles.join(';\n  ')};\n}` : '';
  return { cssMap: map, variables, rootStyles: combinedRootStyles, keyframes };
}
