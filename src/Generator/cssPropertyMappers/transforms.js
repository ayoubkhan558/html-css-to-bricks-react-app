import { parseValue } from '@lib/cssUtils';

export const transformsMappers = {
  'transform': (val, settings) => {
    settings._transform = settings._transform || {};

    // Extract transform functions
    const transforms = val.match(/(\w+)\(([^)]*)\)/g) || [];

    transforms.forEach(t => {
      const [func, args] = t.split('(');
      const cleanArgs = args.replace(')', '').trim();

      switch (func) {
        case 'translate':
        case 'translateX':
        case 'translateY':
        case 'translateZ':
        case 'translate3d':
          // Don't create empty translate object - set translateX/Y/Z directly
          if (func === 'translate') {
            // FIX: Handle comma-separated values properly
            const argsArray = cleanArgs.split(/[,\s]+/).filter(arg => arg.trim() !== '');
            const [x = '0', y = '0'] = argsArray;
            settings._transform.translateX = parseValue(x);
            settings._transform.translateY = parseValue(y);
          } else if (func === 'translateX') {
            settings._transform.translateX = parseValue(cleanArgs);
          } else if (func === 'translateY') {
            settings._transform.translateY = parseValue(cleanArgs);
          } else if (func === 'translateZ') {
            settings._transform.translateZ = parseValue(cleanArgs);
          } else if (func === 'translate3d') {
            // FIX: Handle comma-separated values properly
            const argsArray = cleanArgs.split(/[,\s]+/).filter(arg => arg.trim() !== '');
            const [x = '0', y = '0', z = '0'] = argsArray;
            settings._transform.translateX = parseValue(x);
            settings._transform.translateY = parseValue(y);
            settings._transform.translateZ = parseValue(z);
          }
          break;

        case 'scale':
        case 'scaleX':
        case 'scaleY':
        case 'scaleZ':
        case 'scale3d':
          settings._transform.scale = settings._transform.scale || {};
          if (func === 'scale') {
            // FIX: Handle comma-separated values properly
            const argsArray = cleanArgs.split(/[,\s]+/).filter(arg => arg.trim() !== '');
            const [x = '1', y = x] = argsArray;
            settings._transform.scale.x = parseFloat(x);
            settings._transform.scale.y = parseFloat(y);
          } else if (func === 'scaleX') {
            settings._transform.scale.x = parseFloat(cleanArgs);
          } else if (func === 'scaleY') {
            settings._transform.scale.y = parseFloat(cleanArgs);
          } else if (func === 'scaleZ') {
            settings._transform.scale.z = parseFloat(cleanArgs);
          } else if (func === 'scale3d') {
            // FIX: Handle comma-separated values properly
            const argsArray = cleanArgs.split(/[,\s]+/).filter(arg => arg.trim() !== '');
            const [x = '1', y = '1', z = '1'] = argsArray;
            settings._transform.scale.x = parseFloat(x);
            settings._transform.scale.y = parseFloat(y);
            settings._transform.scale.z = parseFloat(z);
          }
          break;

        case 'rotate':
        case 'rotateX':
        case 'rotateY':
        case 'rotateZ':
        case 'rotate3d':
          settings._transform.rotate = settings._transform.rotate || {};
          if (func === 'rotate') {
            settings._transform.rotate.z = cleanArgs;
          } else if (func === 'rotateX') {
            settings._transform.rotate.x = cleanArgs;
          } else if (func === 'rotateY') {
            settings._transform.rotate.y = cleanArgs;
          } else if (func === 'rotateZ') {
            settings._transform.rotate.z = cleanArgs;
          } else if (func === 'rotate3d') {
            // FIX: Handle comma-separated values properly
            const argsArray = cleanArgs.split(/[,\s]+/).filter(arg => arg.trim() !== '');
            const [x = '0', y = '0', z = '0', angle = '0'] = argsArray;
            settings._transform.rotate.x = x;
            settings._transform.rotate.y = y;
            settings._transform.rotate.z = z;
            settings._transform.rotate.angle = angle;
          }
          break;

        case 'skew':
        case 'skewX':
        case 'skewY':
          settings._transform.skew = settings._transform.skew || {};
          if (func === 'skew') {
            // FIX: Handle comma-separated values properly
            const argsArray = cleanArgs.split(/[,\s]+/).filter(arg => arg.trim() !== '');
            const [x = '0deg', y = '0deg'] = argsArray;
            settings._transform.skew.x = x;
            settings._transform.skew.y = y;
          } else if (func === 'skewX') {
            settings._transform.skew.x = cleanArgs;
          } else if (func === 'skewY') {
            settings._transform.skew.y = cleanArgs;
          }
          break;

        case 'perspective':
          settings._transform.perspective = parseValue(cleanArgs);
          break;

        case 'matrix':
        case 'matrix3d':
          settings._transform.matrix = t;
          break;
      }
    });
  },
  'transform-origin': (val, settings) => {
    settings._transform = settings._transform || {};
    settings._transform.origin = val;
  },
  'transform-style': (val, settings) => {
    settings._transform = settings._transform || {};
    settings._transform.style = val;
  },
  'perspective-origin': (val, settings) => {
    settings._transform = settings._transform || {};
    settings._transform.perspectiveOrigin = val;
  },
  'backface-visibility': (val, settings) => {
    settings._transform = settings._transform || {};
    settings._transform.backfaceVisibility = val;
  }
};
