// grid.js 
import { parseValue } from '../cssParser';

export const gridMappers = {
  // Grid container properties
  'display': (val, settings) => {
    if (val === 'grid' || val === 'inline-grid') {
      settings._display = val;
    }
  },
  
  'grid-gap': (val, settings) => {
    settings._gridGap = parseValue(val);
  },
  'gap': (val, settings) => {
    settings._gridGap = parseValue(val);
  },
  'grid-row-gap': (val, settings) => {
    settings._gridRowGap = parseValue(val);
  },
  'grid-column-gap': (val, settings) => {
    settings._gridColumnGap = parseValue(val);
  },
  
  'grid-template-columns': (val, settings) => {
    settings._gridTemplateColumns = val;
  },
  'grid-template-rows': (val, settings) => {
    settings._gridTemplateRows = val;
  },
  'grid-template-areas': (val, settings) => {
    settings._gridTemplateAreas = val;
  },
  
  'grid-auto-columns': (val, settings) => {
    settings._gridAutoColumns = val;
  },
  'grid-auto-rows': (val, settings) => {
    settings._gridAutoRows = val;
  },
  'grid-auto-flow': (val, settings) => {
    settings._gridAutoFlow = val;
  },
  
  // Grid item properties
  'grid-column': (val, settings) => {
    settings._gridColumn = val;
  },
  'grid-row': (val, settings) => {
    settings._gridRow = val;
  },
  'grid-area': (val, settings) => {
    settings._gridArea = val;
  },
  
  // Grid alignment
  'justify-items': (val, settings) => {
    settings._justifyItemsGrid = val;
  },
  'align-items': (val, settings) => {
    settings._alignItemsGrid = val;
  },
  'justify-content': (val, settings) => {
    settings._justifyContentGrid = val;
  },
  'align-content': (val, settings) => {
    settings._alignContentGrid = val;
  },
  
  'order': (val, settings) => {
    settings._order = parseValue(val);
  }
};

// Export individual mappers for direct import
export const displayGridMapper = gridMappers['display'];
export const gridGapMapper = gridMappers['grid-gap'];
export const gridTemplateColumnsMapper = gridMappers['grid-template-columns'];
export const gridTemplateRowsMapper = gridMappers['grid-template-rows'];
export const gridAutoFlowMapper = gridMappers['grid-auto-flow'];
export const justifyItemsGridMapper = gridMappers['justify-items'];
export const alignItemsGridMapper = gridMappers['align-items'];
export const justifyContentGridMapper = gridMappers['justify-content'];
export const orderMapper = gridMappers['order'];