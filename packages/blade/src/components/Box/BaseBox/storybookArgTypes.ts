import { getOnlyBoxProps } from '../Box';
import type { BaseBoxProps, BoxProps, StyledProps } from './types';
import { getStyledProps } from '~utils';

type StorybookArgTypes<T> = {
  [P in keyof T]: {
    table?: { category?: 'StyledProps'; disable?: boolean };
    control?: { type: string };
    description?: string;
  };
};

const commonProperties = {
  control: {
    type: 'object',
  },
};

const spacingTypeShorthandDescription = [
  'Can be',
  '- an absolute value like `"10px"`',
  '- token `"spacing.5"`',
  '- an array shorthand `["spacing.2", "10px", "spacing.5", "spacing.9"]` (Similar to CSS shorthands)',
  '- responsive object with combinatation of all previous values `{ base: "spacing.3", l: ["spacing.10", "20px"]}`',
].join('\n\n');

const spacingTypeDescription = [
  'Can be',
  '- an absolute value like `"10px"`',
  '- token `"spacing.5"`',
  '- responsive object with combinatation of all previous values `{ base: "spacing.3", l: "20px"}`',
].join('\n\n');

const defaultStyledPropsObject = getStyledProps({});

const getStyledPropsArgTypes = ({
  category,
  descriptionLength,
}: {
  category?: 'StyledProps';
  descriptionLength?: 'long';
} = {}): StorybookArgTypes<StyledProps> => {
  const commonStyledPropsProperties: {
    table: { category?: 'StyledProps' };
    control: { type: string };
  } = {
    ...commonProperties,
    table: {
      category,
    },
  };

  const restStyledPropsArgTypes = Object.fromEntries(
    Object.entries(defaultStyledPropsObject)
      .filter(([key]) => !key.includes('margin'))
      .map(([key, _value]) => {
        const cssPropertyName = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
        return [
          key,
          {
            ...commonProperties,
            description: `**CSS property \`${cssPropertyName}\`**\n\n<a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/${cssPropertyName}">MDN Docs for ${cssPropertyName}</a><br/><br/>`,
            table: {
              category,
              type: {
                summary: `MakeValueResponsive<CSSObject['${key}']>`,
              },
            },
          },
        ];
      }),
  );

  return {
    margin: {
      ...commonStyledPropsProperties,
      description: `**Margin Shorthand**\n\n${
        descriptionLength === 'long' ? spacingTypeShorthandDescription : ''
      }`,
    },
    marginX: {
      ...commonStyledPropsProperties,
      description: `**Horizontal Margin**\n\n${
        descriptionLength === 'long' ? spacingTypeDescription : ''
      }`,
    },
    marginY: {
      ...commonStyledPropsProperties,
      description: `**Vertical Margin**\n\n${
        descriptionLength === 'long' ? spacingTypeDescription : ''
      }`,
    },
    marginTop: {
      ...commonStyledPropsProperties,
      description: '**CSS Property `margin-top`**\n\n Supports same values as marginX, and marginY',
    },
    marginRight: {
      ...commonStyledPropsProperties,
      description:
        '**CSS Property `margin-right`**\n\n Supports same values as marginX, and marginY',
    },
    marginBottom: {
      ...commonStyledPropsProperties,
      description:
        '**CSS Property `margin-bottom`**\n\n Supports same values as marginX, and marginY',
    },
    marginLeft: {
      ...commonStyledPropsProperties,
      description:
        '**CSS Property `margin-left`**\n\n Supports same values as marginX, and marginY',
    },
    ...restStyledPropsArgTypes,
  };
};

const getBoxArgTypes = (): StorybookArgTypes<BoxProps> => {
  const restBoxArgTypes = Object.fromEntries(
    Object.entries(getOnlyBoxProps({}))
      .filter(([key]) => !key.includes('margin') && !key.includes('padding'))
      .map(([key, _value]) => {
        const cssPropertyName = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

        return [
          key,
          {
            ...commonProperties,
            description: `**CSS property \`${cssPropertyName}\`**\n\n`,
            table: {
              type: {
                summary: `MakeValueResponsive<CSSObject['${key}']>`,
              },
            },
          },
        ];
      }),
  );

  return {
    padding: {
      ...commonProperties,
      description: `**Padding Shorthand**\n\n${spacingTypeShorthandDescription}`,
    },
    paddingX: {
      ...commonProperties,
      description: `**Horizontal Margin**\n\n${spacingTypeDescription}`,
    },
    paddingY: {
      ...commonProperties,
      description: `**Vertical Margin**\n\n${spacingTypeDescription}`,
    },
    paddingTop: {
      ...commonProperties,
      description:
        '**CSS Property `padding-top`**\n\n Supports same values as paddingX, and paddingY',
    },
    paddingRight: {
      ...commonProperties,
      description:
        '**CSS Property `padding-right`**\n\n Supports same values as paddingX, and paddingY',
    },
    paddingBottom: {
      ...commonProperties,
      description:
        '**CSS Property `padding-bottom`**\n\n Supports same values as paddingX, and paddingY',
    },
    paddingLeft: {
      ...commonProperties,
      description:
        '**CSS Property `padding-left`**\n\n Supports same values as paddingX, and paddingY',
    },
    ...getStyledPropsArgTypes({ descriptionLength: 'long' }),
    ...restBoxArgTypes,
  };
};

const getBaseBoxArgTypes = (): StorybookArgTypes<
  BaseBoxProps & { forwardedAs: string; ref: unknown; theme: unknown; as: string }
> => {
  return {
    backgroundColor: {
      ...commonProperties,
      description:
        '**CSS property `background-color`**.\n\nYou can use absolute colors, or our action background tokens',
    },
    ...getBoxArgTypes(),
    borderRadius: {
      ...commonProperties,
      description: '**`borderRadius` token of blade**.',
    },
    lineHeight: {
      ...commonProperties,
      description: '**CSS property `line-height`**',
    },
    forwardedAs: {
      table: {
        disable: true,
      },
    },
    theme: {
      table: {
        disable: true,
      },
    },
    ref: {
      table: {
        disable: true,
      },
    },
    as: {
      control: {
        type: 'text',
      },
    },
  };
};

export { getBaseBoxArgTypes, getBoxArgTypes, getStyledPropsArgTypes };
