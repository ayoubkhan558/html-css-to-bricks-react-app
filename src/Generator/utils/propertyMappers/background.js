import { toHex } from '../cssParser';

// Helper function to check if a value is a color
const isColor = (value) => {
  if (typeof value !== 'string') return false;
  const lowerCaseValue = value.toLowerCase();
  const colorKeywords = ['transparent', 'currentcolor'];
  if (colorKeywords.includes(lowerCaseValue)) return true;
  if (lowerCaseValue.startsWith('#') || lowerCaseValue.startsWith('rgb') || lowerCaseValue.startsWith('hsl')) return true;
  
  // Basic color name check (can be expanded)
  const namedColors = ['red', 'green', 'blue', 'white', 'black', 'yellow', 'purple', 'orange'];
  return namedColors.includes(lowerCaseValue);
};

// Helper function to parse background shorthand values
export const background = (...values) => {
  const properties = {};
  let position, size;

  values.forEach(value => {
    if (isColor(value)) {
      properties['background-color'] = value;
    } else if (value.includes('url(') || value.includes('gradient(')) {
      properties['background-image'] = value;
    } else if (['repeat', 'repeat-x', 'repeat-y', 'no-repeat', 'space', 'round'].includes(value)) {
      properties['background-repeat'] = value;
    } else if (['scroll', 'fixed', 'local'].includes(value)) {
      properties['background-attachment'] = value;
    } else if (['border-box', 'padding-box', 'content-box'].includes(value)) {
      // This could be origin or clip, we'll assign to both for simplicity
      properties['background-origin'] = value;
      properties['background-clip'] = value;
    } else if (value.includes('/') || ['center', 'top', 'bottom', 'left', 'right'].some(pos => value.includes(pos))) {
      // Handle position and size
      if (value.includes('/')) {
        [position, size] = value.split('/').map(s => s.trim());
        properties['background-position'] = position;
        properties['background-size'] = size;
      } else {
        properties['background-position'] = value;
      }
    }
  });

  // Combine into a single string for the final output
  const styleString = Object.entries(properties)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');

  return { background: styleString };
};

export const backgroundMappers = {
  'background': (val, settings) => {
    const styles = background(val);
    if (styles.background) {
        const declarations = styles.background.split(';');
        declarations.forEach(decl => {
            if (!decl.trim()) return;
            const [prop, value] = decl.split(':').map(s => s.trim());
            if (prop && value) {
                const mapper = backgroundMappers[prop];
                if (mapper) {
                    mapper(value, settings);
                }
            }
        });
    }
  },
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
  'background-origin': (val, settings) => {
    settings._background = settings._background || {};
    settings._background.origin = val;
  },
  'background-clip': (val, settings) => {
    settings._background = settings._background || {};
    settings._background.clip = val;
  }
};

// Export individual mappers for direct import
export const backgroundColorMapper = backgroundMappers['background-color'];
export const backgroundImageMapper = backgroundMappers['background-image'];
export const backgroundRepeatMapper = backgroundMappers['background-repeat'];
export const backgroundSizeMapper = backgroundMappers['background-size'];
export const backgroundPositionMapper = backgroundMappers['background-position'];
export const backgroundAttachmentMapper = backgroundMappers['background-attachment'];
export const backgroundBlendModeMapper = backgroundMappers['background-blend-mode'];
export const backgroundOriginMapper = backgroundMappers['background-origin'];
export const backgroundClipMapper = backgroundMappers['background-clip'];
