import type { StyledProps } from './getStyledProps';
import { getStyledProps } from './getStyledProps';

type StyledPropsArgTypes = {
  [P in keyof StyledProps]: {
    table: { category: 'StyledProps' };
    control: { type: 'object' };
    description: string;
  };
};

const commonProperties: {
  table: { category: 'StyledProps' };
  control: { type: 'object' };
} = {
  table: { category: 'StyledProps' },
  control: { type: 'object' },
};

const styledProps = getStyledProps({});

const isSpacingProp = (key: string): boolean => {
  if (
    key.includes('margin') ||
    key.includes('padding') ||
    key === 'top' ||
    key === 'bottom' ||
    key === 'right' ||
    key === 'left' ||
    key.endsWith('gap')
  ) {
    return true;
  }

  return false;
};

const allStyledPropsDefaultArgTypes = Object.fromEntries(
  Object.entries(styledProps).map(([key, _value]) => {
    const cssPropertyName = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

    return [
      key,
      {
        ...commonProperties,
        description: `CSS property \`${cssPropertyName}\`\n\n`,
        table: {
          ...commonProperties.table,
          type: {
            summary: isSpacingProp(key) ? undefined : `MakeValueResponsive<CSSObject['${key}']>`,
          },
        },
      },
    ];
  }),
);

export const styledPropsStorybookArgTypes: StyledPropsArgTypes = {
  ...allStyledPropsDefaultArgTypes,
  margin: {
    ...commonProperties,
    description: 'margin shorthand',
  },
  marginX: {
    ...commonProperties,
    description: 'Sets horizontal margins',
  },
  marginY: {
    ...commonProperties,
    description: 'Sets vertical margins',
  },
};
