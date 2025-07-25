// grid.js 
import { parseValue } from '../cssParser';

export const gridMappers = {
  // Grid container properties
  'grid-gap': (val, settings) => {
    const [rowGap, columnGap] = val.split(/\s+/);
    settings._gridGap = columnGap
      ? `${parseValue(rowGap)} ${parseValue(columnGap)}`
      : parseValue(rowGap);
    settings._skipGapCustom = true;
  },
  'gap': (val, settings) => {
    const values = val.split(' ').map(v => v.replace('px', '').trim()).filter(Boolean);
    if (values.length === 1) {
      settings._gridGap = `${values[0]} ${values[0]}`;
    } else if (values.length >= 2) {
      settings._gridGap = `${values[0]} ${values[1]}`; // row column
    }
  },
  'row-gap': (val, settings) => {
    const currentGap = (settings._gridGap || '0 0').split(' ');
    settings._gridGap = `${val.replace('px', '')} ${currentGap[1] || '0'}`;
  },
  'column-gap': (val, settings) => {
    const currentGap = (settings._gridGap || '0 0').split(' ');
    settings._gridGap = `${currentGap[0] || '0'} ${val.replace('px', '')}`;
  },
  'grid-row-gap': (val, settings) => {
    settings._gridRowGap = parseValue(val);
    if (settings._gridColumnGap) {
      settings._gridGap = `${settings._gridRowGap} ${settings._gridColumnGap}`;
    } else {
      settings._gridGap = settings._gridRowGap;
    }
    settings._skipGapCustom = true;
  },
  'grid-column-gap': (val, settings) => {
    settings._gridColumnGap = parseValue(val);
    if (settings._gridRowGap) {
      settings._gridGap = `${settings._gridRowGap} ${settings._gridColumnGap}`;
    } else {
      settings._gridGap = settings._gridColumnGap;
    }
    settings._skipGapCustom = true;
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
    settings._justifyItems = val;
  },
  'align-items': (val, settings) => {
    settings._alignItems = val;
    settings._alignItemsGrid = val;
  },
  'justify-content': (val, settings) => {
    settings._justifyContent = val;
    settings._justifyContentGrid = val;
  },
  'align-content': (val, settings) => {
    settings._alignContent = val;
    settings._alignContentGrid = val;
  },

  'order': (val, settings) => {
    settings._order = parseValue(val);
  }
};

// Export individual mappers for direct import
export const gridGapMapper = gridMappers['gap'];
export const gridTemplateColumnsMapper = gridMappers['grid-template-columns'];
export const gridTemplateRowsMapper = gridMappers['grid-template-rows'];
export const gridAutoFlowMapper = gridMappers['grid-auto-flow'];
export const justifyItemsGridMapper = gridMappers['justify-items'];
export const alignItemsGridMapper = gridMappers['align-items'];
export const justifyContentGridMapper = gridMappers['justify-content'];
export const alignContentGridMapper = gridMappers['align-content'];
export const orderMapper = gridMappers['order'];