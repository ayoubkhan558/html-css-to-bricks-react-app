// Main export for all property mappers
import { typographyMappers } from './typography';
import { backgroundMappers } from './background';
import { borderMappers } from './border';
import { spacingMappers } from './spacing';
import { sizingMappers } from './sizing';
import { positionMappers } from './position';
import { flexboxMappers } from './flexbox';
import { effectsMappers } from './effects';
import { transformsMappers } from './transforms';
import { transitionsMappers } from './transitions';
import { scrollMappers } from './scroll';

export const CSS_PROP_MAPPERS = {
  ...typographyMappers,
  ...backgroundMappers,
  ...borderMappers,
  ...spacingMappers,
  ...sizingMappers,
  ...positionMappers,
  ...flexboxMappers,
  ...effectsMappers,
  ...transformsMappers,
  ...transitionsMappers,
  ...scrollMappers
};
