import { toHex, parseValue } from '@libs/css/cssUtils';
import { parseBoxShadow } from './mapperUtils';

export const borderBoxShadowMappers = {
  'box-shadow': (val, settings) => {
    if (!val || val === 'none') return;

    const boxShadow = parseBoxShadow(val);
    if (!boxShadow) return;

    // Determine color format (hex, rgb, rgba)
    const colorKey = boxShadow.color.startsWith('#') ? 'hex' :
      boxShadow.color.startsWith('rgb') ? 'rgb' : 'hex';

    settings._boxShadow = {
      values: {
        offsetX: boxShadow.offsetX,
        offsetY: boxShadow.offsetY,
        blur: boxShadow.blur,
        spread: boxShadow.spread
      },
      color: {
        [colorKey]: boxShadow.color
      }
    };
  },
  'border': (val, settings) => {
    if (val === 'none' || val === '0') {
      settings._border = settings._border || {};
      settings._border.width = { top: '0', right: '0', bottom: '0', left: '0' };
      return;
    }

    // FIX: Better parsing that handles rgba() properly
    const parts = [];
    let current = '';
    let inParens = 0;

    for (let i = 0; i < val.length; i++) {
      const char = val[i];
      if (char === '(') inParens++;
      if (char === ')') inParens--;

      if (char === ' ' && inParens === 0) {
        if (current.trim()) {
          parts.push(current.trim());
          current = '';
        }
      } else {
        current += char;
      }
    }
    if (current.trim()) parts.push(current.trim());

    if (parts.length >= 1) {
      settings._border = settings._border || {};

      // Handle width (can be in format like '2px', 'thin', 'medium', 'thick')
      let width = parts[0];

      if (['thin', 'medium', 'thick'].includes(width)) {
        const widthMap = { thin: '1px', medium: '3px', thick: '5px' };
        settings._border.width = {
          top: widthMap[width] || '3px',
          right: widthMap[width] || '3px',
          bottom: widthMap[width] || '3px',
          left: widthMap[width] || '3px'
        };
      } else {
        const widthValue = parseValue(width);
        settings._border.width = {
          top: widthValue,
          right: widthValue,
          bottom: widthValue,
          left: widthValue
        };
      }

      // Handle style and color
      const validStyles = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset', 'none', 'hidden'];
      let styleFound = false;
      let colorPart = null;

      // Look for style in parts
      for (let i = 1; i < parts.length; i++) {
        if (validStyles.includes(parts[i])) {
          settings._border.style = parts[i];
          styleFound = true;
        } else if (parts[i].startsWith('#') || parts[i].startsWith('rgb') || /^[a-zA-Z]+$/.test(parts[i])) {
          colorPart = parts[i];
        }
      }

      // Default to solid if no style found
      if (!styleFound) {
        settings._border.style = 'solid';
      }

      // Handle color
      if (colorPart) {
        if (colorPart.startsWith('rgba(') || colorPart.startsWith('rgb(')) {
          settings._border.color = { rgb: colorPart };
        } else {
          const hex = toHex(colorPart);
          if (hex) {
            settings._border.color = { hex };
          }
        }
      }
    }
  },
  'border-width': (val, settings) => {
    settings._border = settings._border || {};
    const values = val.split(/\s+/).map(v => parseValue(v)).filter(v => v !== undefined && v !== null);

    // Handle different number of values (1-4 values)
    if (values.length === 1) {
      settings._border.width = {
        top: values[0],
        right: values[0],
        bottom: values[0],
        left: values[0]
      };
    } else if (values.length === 2) {
      settings._border.width = {
        top: values[0],
        right: values[1],
        bottom: values[0],
        left: values[1]
      };
    } else if (values.length === 3) {
      settings._border.width = {
        top: values[0],
        right: values[1],
        bottom: values[2],
        left: values[1]
      };
    } else if (values.length >= 4) {
      settings._border.width = {
        top: values[0],
        right: values[1],
        bottom: values[2],
        left: values[3]
      };
    }
  },
  'border-style': (val, settings) => {
    settings._border = settings._border || {};
    settings._border.style = val;
  },
  'border-color': (val, settings) => {
    settings._border = settings._border || {};
    // Handle rgba colors properly
    if (val.startsWith('rgba(')) {
      settings._border.color = { rgb: val };
    } else {
      const hex = toHex(val);
      if (hex) {
        settings._border.color = { hex };
      } else if (val.startsWith('rgb(')) {
        // Handle rgb colors
        settings._border.color = { rgb: val };
      }
    }
  },
  'border-radius': (val, settings) => {
    settings._border = settings._border || {};

    // Handle elliptical corners (e.g., '10px 20px / 5px 15px')
    if (val.includes('/')) {
      const [horizontal, vertical] = val.split('/').map(part => part.trim());
      const hValues = horizontal.split(/\s+/).map(v => parseValue(v)).filter(v => v !== undefined && v !== null);
      const vValues = vertical.split(/\s+/).map(v => parseValue(v)).filter(v => v !== undefined && v !== null);

      // Handle horizontal values (top-left, top-right, bottom-right, bottom-left)
      const hRadius = {
        topLeft: hValues[0],
        topRight: hValues[1] !== undefined ? hValues[1] : hValues[0],
        bottomRight: hValues[2] !== undefined ? hValues[2] : hValues[0],
        bottomLeft: hValues[3] !== undefined ? hValues[3] : (hValues[1] !== undefined ? hValues[1] : hValues[0])
      };

      // Handle vertical values (top-left, top-right, bottom-right, bottom-left)
      const vRadius = {
        topLeft: vValues[0],
        topRight: vValues[1] !== undefined ? vValues[1] : vValues[0],
        bottomRight: vValues[2] !== undefined ? vValues[2] : vValues[0],
        bottomLeft: vValues[3] !== undefined ? vValues[3] : (vValues[1] !== undefined ? vValues[1] : vValues[0])
      };

      settings._border.radius = {
        top: `${hRadius.topLeft} / ${vRadius.topLeft}`,
        right: `${hRadius.topRight} / ${vRadius.topRight}`,
        bottom: `${hRadius.bottomRight} / ${vRadius.bottomRight}`,
        left: `${hRadius.bottomLeft} / ${vRadius.bottomLeft}`
      };
    } else {
      // Standard border-radius without elliptical corners
      const values = val.split(/\s+/).map(v => parseValue(v)).filter(v => v !== undefined && v !== null);

      // Handle different number of values (1-4 values)
      if (values.length === 1) {
        // All sides same value
        settings._border.radius = {
          top: values[0],
          right: values[0],
          bottom: values[0],
          left: values[0]
        };
      } else if (values.length === 2) {
        // vertical | horizontal
        settings._border.radius = {
          top: values[0],
          right: values[1],
          bottom: values[0],
          left: values[1]
        };
      } else if (values.length === 3) {
        // top | horizontal | bottom
        settings._border.radius = {
          top: values[0],
          right: values[1],
          bottom: values[2],
          left: values[1]
        };
      } else if (values.length >= 4) {
        // top | right | bottom | left
        settings._border.radius = {
          top: values[0],
          right: values[1],
          bottom: values[2],
          left: values[3]
        };
      }
    }
  },
  // Individual corner properties
  'border-top-left-radius': (val, settings) => {
    settings._border = settings._border || { radius: {} };
    if (!settings._border.radius) settings._border.radius = {};
    settings._border.radius.topLeft = val;
  },
  'border-top-right-radius': (val, settings) => {
    settings._border = settings._border || { radius: {} };
    if (!settings._border.radius) settings._border.radius = {};
    settings._border.radius.topRight = val;
  },
  'border-bottom-right-radius': (val, settings) => {
    settings._border = settings._border || { radius: {} };
    if (!settings._border.radius) settings._border.radius = {};
    settings._border.radius.bottomRight = val;
  },
  'border-bottom-left-radius': (val, settings) => {
    settings._border = settings._border || { radius: {} };
    if (!settings._border.radius) settings._border.radius = {};
    settings._border.radius.bottomLeft = val;
  },
  'border-top-width': (val, settings) => {
    settings._border = settings._border || { width: {} };
    if (!settings._border.width) settings._border.width = { top: '0', right: '0', bottom: '0', left: '0' };
    settings._border.width.top = parseValue(val);
  },
  'border-right-width': (val, settings) => {
    settings._border = settings._border || { width: {} };
    if (!settings._border.width) settings._border.width = { top: '0', right: '0', bottom: '0', left: '0' };
    settings._border.width.right = parseValue(val);
  },
  'border-bottom-width': (val, settings) => {
    settings._border = settings._border || { width: {} };
    if (!settings._border.width) settings._border.width = { top: '0', right: '0', bottom: '0', left: '0' };
    settings._border.width.bottom = parseValue(val);
  },
  'border-left-width': (val, settings) => {
    settings._border = settings._border || { width: {} };
    if (!settings._border.width) settings._border.width = { top: '0', right: '0', bottom: '0', left: '0' };
    settings._border.width.left = parseValue(val);
  },
  'border-top-color': (val, settings) => {
    settings._border = settings._border || {};
    // Handle rgba colors properly
    if (val.startsWith('rgba(')) {
      if (!settings._cssCustom) settings._cssCustom = '';
      const selector = settings._cssClass || '%element%';
      // Escape dots in class names to prevent malformed selectors
      const escapedSelector = selector.replace(/\./g, '\\.');
      settings._cssCustom += `\n${escapedSelector.startsWith('%') ? '' : '.'}${escapedSelector} { border-top-color: ${val}; }`;
    } else {
      const hex = toHex(val);
      if (hex) {
        if (!settings._cssCustom) settings._cssCustom = '';
        const selector = settings._cssClass || '%element%';
        // Escape dots in class names to prevent malformed selectors
        const escapedSelector = selector.replace(/\./g, '\\.');
        settings._cssCustom += `\n${escapedSelector.startsWith('%') ? '' : '.'}${escapedSelector} { border-top-color: ${hex}; }`;
      } else if (val.startsWith('rgb(')) {
        // Handle rgb colors
        if (!settings._cssCustom) settings._cssCustom = '';
        const selector = settings._cssClass || '%element%';
        // Escape dots in class names to prevent malformed selectors
        const escapedSelector = selector.replace(/\./g, '\\.');
        settings._cssCustom += `\n${escapedSelector.startsWith('%') ? '' : '.'}${escapedSelector} { border-top-color: ${val}; }`;
      }
    }
  },
  'border-right-color': (val, settings) => {
    settings._border = settings._border || {};
    // Handle rgba colors properly
    if (val.startsWith('rgba(')) {
      if (!settings._cssCustom) settings._cssCustom = '';
      const selector = settings._cssClass || '%element%';
      // Escape dots in class names to prevent malformed selectors
      const escapedSelector = selector.replace(/\./g, '\\.');
      settings._cssCustom += `\n${escapedSelector.startsWith('%') ? '' : '.'}${escapedSelector} { border-right-color: ${val}; }`;
    } else {
      const hex = toHex(val);
      if (hex) {
        if (!settings._cssCustom) settings._cssCustom = '';
        const selector = settings._cssClass || '%element%';
        // Escape dots in class names to prevent malformed selectors
        const escapedSelector = selector.replace(/\./g, '\\.');
        settings._cssCustom += `\n${escapedSelector.startsWith('%') ? '' : '.'}${escapedSelector} { border-right-color: ${hex}; }`;
      } else if (val.startsWith('rgb(')) {
        // Handle rgb colors
        if (!settings._cssCustom) settings._cssCustom = '';
        const selector = settings._cssClass || '%element%';
        // Escape dots in class names to prevent malformed selectors
        const escapedSelector = selector.replace(/\./g, '\\.');
        settings._cssCustom += `\n${escapedSelector.startsWith('%') ? '' : '.'}${escapedSelector} { border-right-color: ${val}; }`;
      }
    }
  },
  'border-bottom-color': (val, settings) => {
    settings._border = settings._border || {};
    // Handle rgba colors properly
    if (val.startsWith('rgba(')) {
      if (!settings._cssCustom) settings._cssCustom = '';
      const selector = settings._cssClass || '%element%';
      // Escape dots in class names to prevent malformed selectors
      const escapedSelector = selector.replace(/\./g, '\\.');
      settings._cssCustom += `\n${escapedSelector.startsWith('%') ? '' : '.'}${escapedSelector} { border-bottom-color: ${val}; }`;
    } else {
      const hex = toHex(val);
      if (hex) {
        if (!settings._cssCustom) settings._cssCustom = '';
        const selector = settings._cssClass || '%element%';
        // Escape dots in class names to prevent malformed selectors
        const escapedSelector = selector.replace(/\./g, '\\.');
        settings._cssCustom += `\n${escapedSelector.startsWith('%') ? '' : '.'}${escapedSelector} { border-bottom-color: ${hex}; }`;
      } else if (val.startsWith('rgb(')) {
        // Handle rgb colors
        if (!settings._cssCustom) settings._cssCustom = '';
        const selector = settings._cssClass || '%element%';
        // Escape dots in class names to prevent malformed selectors
        const escapedSelector = selector.replace(/\./g, '\\.');
        settings._cssCustom += `\n${escapedSelector.startsWith('%') ? '' : '.'}${escapedSelector} { border-bottom-color: ${val}; }`;
      }
    }
  },
  'border-left-color': (val, settings) => {
    settings._border = settings._border || {};
    // Handle rgba colors properly
    if (val.startsWith('rgba(')) {
      if (!settings._cssCustom) settings._cssCustom = '';
      const selector = settings._cssClass || '%element%';
      // Escape dots in class names to prevent malformed selectors
      const escapedSelector = selector.replace(/\./g, '\\.');
      settings._cssCustom += `\n${escapedSelector.startsWith('%') ? '' : '.'}${escapedSelector} { border-left-color: ${val}; }`;
    } else {
      const hex = toHex(val);
      if (hex) {
        if (!settings._cssCustom) settings._cssCustom = '';
        const selector = settings._cssClass || '%element%';
        // Escape dots in class names to prevent malformed selectors
        const escapedSelector = selector.replace(/\./g, '\\.');
        settings._cssCustom += `\n${escapedSelector.startsWith('%') ? '' : '.'}${escapedSelector} { border-left-color: ${hex}; }`;
      } else if (val.startsWith('rgb(')) {
        // Handle rgb colors
        if (!settings._cssCustom) settings._cssCustom = '';
        const selector = settings._cssClass || '%element%';
        // Escape dots in class names to prevent malformed selectors
        const escapedSelector = selector.replace(/\./g, '\\.');
        settings._cssCustom += `\n${escapedSelector.startsWith('%') ? '' : '.'}${escapedSelector} { border-left-color: ${val}; }`;
      }
    }
  }
};

// Export individual mappers for direct import
export const boxShadowMapper = borderBoxShadowMappers['box-shadow'];
export const borderMapper = borderBoxShadowMappers['border'];
export const borderWidthMapper = borderBoxShadowMappers['border-width'];
export const borderStyleMapper = borderBoxShadowMappers['border-style'];
export const borderColorMapper = borderBoxShadowMappers['border-color'];
export const borderRadiusMapper = borderBoxShadowMappers['border-radius'];
export const borderTopWidthMapper = borderBoxShadowMappers['border-top-width'];
export const borderRightWidthMapper = borderBoxShadowMappers['border-right-width'];
export const borderBottomWidthMapper = borderBoxShadowMappers['border-bottom-width'];
export const borderLeftWidthMapper = borderBoxShadowMappers['border-left-width'];
export const borderTopColorMapper = borderBoxShadowMappers['border-top-color'];
export const borderRightColorMapper = borderBoxShadowMappers['border-right-color'];
export const borderBottomColorMapper = borderBoxShadowMappers['border-bottom-color'];
export const borderLeftColorMapper = borderBoxShadowMappers['border-left-color'];