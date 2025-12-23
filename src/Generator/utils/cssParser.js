// cssParser.js
// CSS parsing utilities
import { displayMappers } from '@generator/cssPropertyMappers/display';
import { gridMappers } from '@generator/cssPropertyMappers/content-grid';
import { flexboxMappers } from '@generator/cssPropertyMappers/content-flexbox';
import { spacingMappers } from '@generator/cssPropertyMappers/layout-spacing';
import { sizingMappers } from '@generator/cssPropertyMappers/layout-sizing';
import { positionMappers } from '@generator/cssPropertyMappers/layout-position';
import { layoutMiscMappers } from '@generator/cssPropertyMappers/layout-misc';
import { typographyMappers } from '@generator/cssPropertyMappers/typography';
import { backgroundMappers } from '@generator/cssPropertyMappers/background';
import { borderBoxShadowMappers } from '@generator/cssPropertyMappers/boder-box-shadow';
import { parseBoxShadow } from '@generator/cssPropertyMappers/mapperUtils';
import { filterMappers, effectsMappers, transitionsMappers } from '@generator/cssPropertyMappers/filters-transitions';
import { scrollSnapMappers } from '@generator/cssPropertyMappers/layout-scroll-snap';
import { transformsMappers } from '@generator/cssPropertyMappers/transforms';
import { logger } from '@lib/logger';
import * as csstree from 'css-tree';



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

    // Grid item properties (always available since any element can be a grid item)
    'grid-column': gridMappers['grid-column'],
    'grid-row': gridMappers['grid-row'],
    'grid-area': gridMappers['grid-area'],
    'justify-self': gridMappers['justify-self'],
    'align-self': gridMappers['align-self'],
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
          logger.error(`CSS property processing failed`, {
            file: 'cssParser.js',
            step: 'processStyles - mapper execution',
            feature: `CSS: ${prop} = "${resolvedValue}"`
          }, e);
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
          logger.error(`CSS property processing failed`, {
            file: 'cssParser.js',
            step: 'processInlineStyles - mapper execution',
            feature: `CSS: ${prop} = "${resolvedValue}"`
          }, e);
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
    'opacity', 'overflow', 'transform', 'transition', 'filter', 'backdrop-filter',
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
      const pseudoClassMatch = selector.match(/:(hover|focus|active|visited|disabled)$/);
      if (pseudoClassMatch) {
        const pseudoClass = pseudoClassMatch[1];
        // Extract base selector (without pseudo-class)
        const baseSelector = selector.substring(0, selector.lastIndexOf(':'));

        // Check if base selector matches the element
        try {
          matches = element.matches(baseSelector);
          if (matches) {
            // Process hover/focus/active properties using Bricks pseudo-state format
            // Convert properties to Bricks format with pseudo-class suffix
            let hasUnmappedProperties = false;
            const unmappedProps = {};

            Object.entries(properties).forEach(([prop, val]) => {
              // Map CSS properties to Bricks properties with pseudo-class suffix
              if (prop === 'background' || prop === 'background-color') {
                const propName = `_background:${pseudoClass}`;
                if (!combinedProperties[propName]) {
                  combinedProperties[propName] = { color: { raw: val } };
                } else {
                  combinedProperties[propName].color = { raw: val };
                }
              } else if (prop === 'color') {
                const propName = `_typography:${pseudoClass}`;
                if (!combinedProperties[propName]) {
                  combinedProperties[propName] = { color: { raw: val } };
                } else {
                  combinedProperties[propName].color = { raw: val };
                }
              } else if (prop === 'border-color') {
                const propName = `_border:${pseudoClass}`;
                if (!combinedProperties[propName]) {
                  combinedProperties[propName] = { color: { raw: val } };
                } else {
                  combinedProperties[propName].color = { raw: val };
                }
              } else {
                // Collect unmapped properties
                hasUnmappedProperties = true;
                unmappedProps[prop] = val;
              }
            });

            // If there are unmapped properties, add them to custom CSS as a group
            if (hasUnmappedProperties) {
              unmatchedSelectors.push({ selector, properties: unmappedProps });
            }
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
            // If all else fails, add to custom CSS
            unmatchedSelectors.push({ selector, properties });
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

        // logger.log(`Element matched by: ${selector}`);
        // logger.log('Properties:', parsedProperties);
      }
    } catch (error) {
      logger.warn(`Error processing selector: ${selector}`, error);
    }
  });

  return { properties: combinedProperties, pseudoSelectors: unmatchedSelectors };
}

/**
 * Enhanced CSS matching that returns properties grouped by class name
 * Uses native browser APIs (element.matches) for reliable selector matching
 * @param {Element} element - DOM element
 * @param {Object} cssMap - CSS map
 * @param {Array} classList - Array of class names on the element
 * @returns {Object} { propertiesByClass, commonProperties, pseudoSelectors }
 */
export function matchCSSSelectorsPerClass(element, cssMap, classList) {
  const propertiesByClass = {}; // Properties grouped by class name
  const commonProperties = {}; // Properties from non-class selectors (tag, id, etc.)
  const unmatchedSelectors = []; // Complex selectors, pseudo-classes, etc.

  // Helper to parse CSS properties string into object
  const parseProperties = (propertiesString) => {
    const properties = {};
    const declarations = propertiesString.split(';').filter(decl => decl.trim());

    declarations.forEach(decl => {
      const colonIndex = decl.indexOf(':');
      if (colonIndex > 0) {
        const property = decl.substring(0, colonIndex).trim();
        const value = decl.substring(colonIndex + 1).trim();
        if (property && value) {
          properties[property] = value;
        }
      }
    });

    return properties;
  };

  // Helper to safely check if element matches a selector
  const elementMatches = (selector) => {
    try {
      return element.matches(selector);
    } catch (e) {
      return false;
    }
  };

  // Helper to extract the primary class from a selector
  const extractPrimaryClass = (selector) => {
    const classMatches = selector.match(/\.([a-zA-Z0-9_-]+)/g);
    if (classMatches) {
      // Return the first class that exists on the element
      for (const cls of classMatches) {
        const className = cls.substring(1);
        if (classList.includes(className)) {
          return className;
        }
      }
    }
    return null;
  };

  // Helper to check if selector is a pseudo-class/pseudo-element
  const isPseudoSelector = (selector) => {
    return selector.includes(':');
  };

  // Helper to check if selector is "simple" (just .class, #id, or tag)
  const isSimpleSelector = (selector) => {
    // Simple: .class, #id, tag (no spaces, combinators, attributes, or pseudo)
    return /^(\.[a-zA-Z0-9_-]+|#[a-zA-Z0-9_-]+|[a-zA-Z0-9]+)$/.test(selector);
  };

  // Helper to check if selector is a compound class selector (.class1.class2)
  const isCompoundClassSelector = (selector) => {
    return /^(\.[a-zA-Z0-9_-]+){2,}$/.test(selector);
  };

  // Process all selectors in the cssMap
  Object.entries(cssMap).forEach(([selector, properties]) => {
    try {
      // Skip :root selector
      if (selector === ':root') {
        return;
      }

      const parsedProperties = parseProperties(properties);

      // 1. Handle simple class selectors (.card)
      if (isSimpleSelector(selector) && selector.startsWith('.')) {
        const className = selector.substring(1);
        if (classList.includes(className)) {
          if (!propertiesByClass[className]) {
            propertiesByClass[className] = {};
          }
          Object.assign(propertiesByClass[className], parsedProperties);
        }
        return;
      }

      // 2. Handle compound class selectors (.class1.class2)
      if (isCompoundClassSelector(selector)) {
        if (elementMatches(selector)) {
          const targetClass = extractPrimaryClass(selector);
          if (targetClass) {
            if (!propertiesByClass[targetClass]) {
              propertiesByClass[targetClass] = {};
            }
            Object.assign(propertiesByClass[targetClass], parsedProperties);
          }
        }
        return;
      }

      // 3. Handle pseudo-selectors (::before, :hover, etc.)
      if (isPseudoSelector(selector)) {
        // Extract base selector (before the pseudo part)
        const pseudoMatch = selector.match(/^(.+?)(:{1,2}[a-zA-Z-]+(?:\([^)]*\))?)$/);
        if (pseudoMatch) {
          const baseSelector = pseudoMatch[1];
          if (elementMatches(baseSelector)) {
            unmatchedSelectors.push({ selector, properties });
          }
        }
        return;
      }

      // 4. Handle simple tag/id selectors
      if (isSimpleSelector(selector)) {
        if (elementMatches(selector)) {
          Object.assign(commonProperties, parsedProperties);
        }
        return;
      }

      // 5. Handle all other complex selectors using native element.matches()
      // This handles: child (>), descendant ( ), sibling (+, ~), attribute ([])
      if (elementMatches(selector)) {
        // Add to unmatchedSelectors for custom CSS processing
        unmatchedSelectors.push({ selector, properties });
      }

    } catch (error) {
      // Log and skip invalid selectors
      logger.warn(`Error processing selector: ${selector}`, error);
    }
  });

  return {
    propertiesByClass,
    commonProperties,
    pseudoSelectors: unmatchedSelectors
  };
}

// Helper to determine selector type
const getSelectorType = (selector) => {
  // Check for complex selectors FIRST (before class/id check)
  // Complex selectors include: child (>), sibling (+, ~), descendant (space), attribute ([])
  if (selector.includes('>') || selector.includes('+') || selector.includes('~') ||
    selector.includes(' ') || selector.includes('[')) return 'complex';
  if (selector.startsWith('#')) return 'id';
  if (selector.startsWith('.')) return 'class';
  return 'tag';
};


/**
 * Enhanced buildCssMap function using css-tree for proper CSS parsing
 * @param {string} cssText - The CSS content
 * @returns {Object} Map of selectors to their CSS declarations
 */
export function buildCssMap(cssText) {
  const map = {};
  const variables = {};
  let rootStyles = [];
  const keyframes = [];
  const mediaQueries = [];

  try {
    // Parse CSS using css-tree AST parser
    const ast = csstree.parse(cssText, {
      parseCustomProperty: true,
      parseAtrulePrelude: true,
      parseRulePrelude: true,
      parseValue: true
    });

    // Extract @keyframes and @media rules first
    csstree.walk(ast, {
      visit: 'Atrule',
      enter(node) {
        if (node.name === 'keyframes' || node.name === '-webkit-keyframes') {
          const animationName = node.prelude ? csstree.generate(node.prelude) : '';
          const fullRule = csstree.generate(node);
          keyframes.push({
            name: animationName.trim(),
            rule: fullRule
          });
        }
        // Store media queries as full CSS blocks
        else if (node.name === 'media') {
          const fullMediaRule = csstree.generate(node);
          mediaQueries.push(fullMediaRule);
        }
      }
    });

    // Process only top-level rules (not inside @media)
    // Walk through ast.children directly to avoid nested rules
    if (ast.children) {
      ast.children.forEach(child => {
        // Only process Rule nodes at top level (skip Atrule like @media, @keyframes)
        if (child.type === 'Rule') {
          // Generate selector string
          const selector = csstree.generate(child.prelude);

          // Generate declarations string
          const declarations = [];
          if (child.block && child.block.children) {
            child.block.children.forEach(decl => {
              if (decl.type === 'Declaration') {
                const property = decl.property;
                const value = csstree.generate(decl.value);
                declarations.push(`${property}: ${value}`);

                // Extract CSS variables from :root
                if (selector === ':root' && property.startsWith('--')) {
                  variables[property] = value;
                }
              }
            });
          }

          const propertiesString = declarations.join('; ');

          // Handle multiple selectors separated by comma
          selector.split(',').forEach(sel => {
            const trimmedSelector = sel.trim();
            if (trimmedSelector) {
              map[trimmedSelector] = propertiesString;

              if (trimmedSelector === ':root') {
                rootStyles.push(propertiesString);
              }
            }
          });
        }
      });
    }

  } catch (error) {
    // Log error and return empty result - css-tree handles most cases reliably
    logger.error('CSS parsing failed', error);
    return { cssMap: {}, variables: {}, rootStyles: '', keyframes: [], mediaQueries: [] };
  }

  // Join all root styles with semicolons to maintain valid CSS
  const combinedRootStyles = rootStyles.length > 0 ? `:root {\n  ${rootStyles.join(';\n  ')};\n}` : '';

  return { cssMap: map, variables, rootStyles: combinedRootStyles, keyframes, mediaQueries };
}
