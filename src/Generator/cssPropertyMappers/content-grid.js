import { parseValue, splitCSSValue } from '@lib/cssUtils';

export const gridMappers = {
  // Grid container properties
  'grid-gap': (val, settings) => {
    const values = splitCSSValue(val);
    const rowGap = parseValue(values[0]);
    const columnGap = values[1] ? parseValue(values[1]) : rowGap;
    settings._gridGap = columnGap
      ? `${rowGap} ${columnGap}`
      : rowGap;
    settings._skipGapCustom = true;
  },
  'gap': (val, settings) => {
    const values = splitCSSValue(val).map(v => parseValue(v)).filter(Boolean);
    if (values.length === 1) {
      settings._gridGap = `${values[0]} ${values[0]}`;
    } else if (values.length >= 2) {
      settings._gridGap = `${values[0]} ${values[1]}`; // row column
    }
  },
  'row-gap': (val, settings) => {
    const currentGap = settings._gridGap ? splitCSSValue(settings._gridGap) : ['0', '0'];
    settings._gridGap = `${parseValue(val)} ${currentGap[1] || '0'}`;
  },
  'column-gap': (val, settings) => {
    const currentGap = settings._gridGap ? splitCSSValue(settings._gridGap) : ['0', '0'];
    settings._gridGap = `${currentGap[0] || '0'} ${parseValue(val)}`;
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
    settings._gridItemColumnSpan = val;
  },
  'grid-row': (val, settings) => {
    settings._gridItemRowSpan = val;
  },
  'grid-area': (val, settings) => {
    settings._gridArea = val;
  },
  'justify-self': (val, settings) => {
    settings._gridItemJustifySelf = val;
  },
  'align-self': (val, settings) => {
    settings._gridItemAlignSelf = val;
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

// Exporting all mappers in one go using object destructuring
export const {
  'gap': gridGapMapper,
  'grid-template-columns': gridTemplateColumnsMapper,
  'grid-template-rows': gridTemplateRowsMapper,
  'grid-auto-flow': gridAutoFlowMapper,
  'justify-items': justifyItemsGridMapper,
  'align-items': alignItemsGridMapper,
  'justify-content': justifyContentGridMapper,
  'align-content': alignContentGridMapper,
  'order': orderMapper,

  // Grid item properties
  'grid-column': gridColumnMapper,
  'grid-row': gridRowMapper,
  'grid-area': gridAreaMapper,

  // Grid container properties
  'grid-row-gap': gridRowGapMapper,
  'grid-column-gap': gridColumnGapMapper,
  'grid-template-areas': gridTemplateAreasMapper,
  'grid-auto-columns': gridAutoColumnsMapper,
  'grid-auto-rows': gridAutoRowsMapper
} = gridMappers;
