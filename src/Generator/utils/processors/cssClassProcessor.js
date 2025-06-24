import { getUniqueId } from '../utils';
import { parseCssDeclarations } from '../cssParser';

export const processCssClasses = (node, cssRulesMap, globalClasses) => {
  if (!node.classList || node.classList.length === 0) {
    return { cssGlobalClasses: [] };
  }

  const classNames = Array.from(node.classList);
  const cssGlobalClasses = [];
  const elementSettings = {};

  classNames.forEach(cls => {
    if (!globalClasses.some(c => c.name === cls)) {
      const classId = getUniqueId();
      const targetClass = {
        id: classId,
        name: cls,
        settings: {}
      };

      // Process base styles
      if (cssRulesMap[cls]) {
        const baseStyles = parseCssDeclarations(cssRulesMap[cls], cls);
        Object.assign(targetClass.settings, baseStyles);
      }

      // Process pseudo-classes
      ['hover', 'active', 'focus', 'visited'].forEach(pseudo => {
        const pseudoKey = `${cls}:${pseudo}`;
        if (cssRulesMap[pseudoKey]) {
          const pseudoStyles = parseCssDeclarations(cssRulesMap[pseudoKey], cls);
          targetClass.settings[pseudo] = {};
          Object.entries(pseudoStyles).forEach(([prop, value]) => {
            targetClass.settings[pseudo][prop] = value;
            targetClass.settings[`${prop}:${pseudo}`] = value;
          });
        }
      });

      // Process responsive styles
      ['tablet', 'tablet_portrait', 'mobile', 'mobile_landscape', 'mobile_portrait'].forEach(breakpoint => {
        const breakpointKey = `${cls}:${breakpoint}`;
        if (cssRulesMap[breakpointKey]) {
          const breakpointStyles = parseCssDeclarations(cssRulesMap[breakpointKey], cls);
          targetClass.settings[`_${breakpoint.replace('_', '-')}`] = breakpointStyles;
        }
      });

      globalClasses.push(targetClass);
      cssGlobalClasses.push(classId);
    } else {
      const existingClass = globalClasses.find(c => c.name === cls);
      if (existingClass) {
        cssGlobalClasses.push(existingClass.id);
      }
    }
  });

  if (cssGlobalClasses.length > 0) {
    elementSettings._cssGlobalClasses = cssGlobalClasses;
  }

  return { elementSettings, cssGlobalClasses };
};
