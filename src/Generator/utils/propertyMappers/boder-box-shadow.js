import { toHex, parseValue } from '../cssParser';
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
    const parts = val.split(' ');
    if (parts.length >= 3) {
      settings._border = settings._border || {};
      settings._border.width = parseValue(parts[0]);
      settings._border.style = parts[1];
      const hex = toHex(parts[2]);
      if (hex) {
        settings._border.color = { hex };
      }
    }
  },
  'border-width': (val, settings) => {
    settings._border = settings._border || {};
    settings._border.width = parseValue(val);
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
  'border-radius': (val, settings) => {
    settings._border = settings._border || {};
    settings._border.radius = parseValue(val);
  },
  'border-top-width': (val, settings) => {
    settings._border = settings._border || { top: {} };
    settings._border.top.width = parseValue(val);
  },
  'border-right-width': (val, settings) => {
    settings._border = settings._border || { right: {} };
    settings._border.right.width = parseValue(val);
  },
  'border-bottom-width': (val, settings) => {
    settings._border = settings._border || { bottom: {} };
    settings._border.bottom.width = parseValue(val);
  },
  'border-left-width': (val, settings) => {
    settings._border = settings._border || { left: {} };
    settings._border.left.width = parseValue(val);
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