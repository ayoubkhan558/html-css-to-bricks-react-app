// Main export for all property mappers
import { spacingMappers } from './layout-spacing';
import { sizingMappers } from './layout-sizing';
import { positionMappers } from './layout-position';
import { effectsMappers } from './effects';
import { typographyMappers } from './typography';
import { backgroundMappers } from './background';
import { borderBoxShadowMappers } from './boder-box-shadow';
import { flexboxMappers } from './flexbox';
import { transformsMappers } from './transforms';
import { scrollMappers } from './scroll';

export const CSS_PROP_MAPPERS = {
  ...spacingMappers,
  ...sizingMappers,
  ...positionMappers,
  ...effectsMappers,
  ...typographyMappers,
  ...backgroundMappers,
  ...borderBoxShadowMappers,
  ...flexboxMappers,
  ...transformsMappers,
  ...scrollMappers
};
