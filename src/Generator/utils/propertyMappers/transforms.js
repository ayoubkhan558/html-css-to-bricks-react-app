import { parseValue } from '../cssParser';

export const transformsMappers = {
  'transform': (val, settings) => {
    settings._transform = settings._transform || {};
    
    // Extract transform functions
    const transforms = val.match(/(\w+)\(([^)]*)\)/g) || [];
    
    transforms.forEach(t => {
      const [func, args] = t.split('(');
      const cleanArgs = args.replace(')', '').trim();
      
      switch(func) {
        case 'translate':
        case 'translateX':
        case 'translateY':
        case 'translateZ':
        case 'translate3d':
          settings._transform.translate = settings._transform.translate || {};
          if (func === 'translate') {
            const [x, y] = cleanArgs.split(' ');
            settings._transform.translate.x = parseValue(x);
            settings._transform.translate.y = parseValue(y || '0');
          } else if (func === 'translateX') {
            settings._transform.translate.x = parseValue(cleanArgs);
          } else if (func === 'translateY') {
            settings._transform.translate.y = parseValue(cleanArgs);
          } else if (func === 'translateZ') {
            settings._transform.translate.z = parseValue(cleanArgs);
          } else if (func === 'translate3d') {
            const [x, y, z] = cleanArgs.split(' ');
            settings._transform.translate.x = parseValue(x);
            settings._transform.translate.y = parseValue(y);
            settings._transform.translate.z = parseValue(z);
          }
          break;
          
        case 'scale':
        case 'scaleX':
        case 'scaleY':
        case 'scaleZ':
        case 'scale3d':
          settings._transform.scale = settings._transform.scale || {};
          if (func === 'scale') {
            const [x, y] = cleanArgs.split(' ');
            settings._transform.scale.x = parseFloat(x);
            settings._transform.scale.y = parseFloat(y || x);
          } else if (func === 'scaleX') {
            settings._transform.scale.x = parseFloat(cleanArgs);
          } else if (func === 'scaleY') {
            settings._transform.scale.y = parseFloat(cleanArgs);
          } else if (func === 'scaleZ') {
            settings._transform.scale.z = parseFloat(cleanArgs);
          } else if (func === 'scale3d') {
            const [x, y, z] = cleanArgs.split(' ');
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
            const [x, y, z, angle] = cleanArgs.split(' ');
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
            const [x, y] = cleanArgs.split(' ');
            settings._transform.skew.x = x;
            settings._transform.skew.y = y || '0deg';
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
