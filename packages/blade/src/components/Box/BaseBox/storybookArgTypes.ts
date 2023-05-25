import { makeBoxProps } from '../Box';
import { makeStyledProps } from '../styledProps';
import type { BaseBoxProps, BoxProps, StyledPropsBlade } from './types';
import { validBoxAsValues } from './types/propsTypes';

type StorybookArgTypes<T> = {
  [P in keyof T]: {
    table?: { category?: 'StyledProps' | null; disable?: boolean };
    control?: { type: string; options?: readonly string[] };
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
  '- responsive object with combinatation of all previous values `{ "base": "spacing.3", "l": ["spacing.10", "20px"]}`',
  '[MDN Docs for ShortHand Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#margin_and_padding_properties)',
].join('\n\n');

const spacingTypeDescription = [
  'Can be',
  '- an absolute value like `"10px"`',
  '- token `"spacing.5"`',
  '- responsive object with combinatation of all previous values `{ "base": "spacing.3", "l": "20px"}`',
].join('\n\n');

const styledPropsSupportMessage =
  '&nbsp;&nbsp;<span title="Also supported as styled-prop in other components">💅🏼</span>';

const defaultStyledPropsObject = makeStyledProps({});

const getStyledPropsArgTypes = ({
  category = 'StyledProps',
  descriptionLength,
}: {
  category?: 'StyledProps' | null;
  descriptionLength?: 'long';
} = {}): StorybookArgTypes<StyledPropsBlade> => {
  const commonStyledPropsProperties: {
    table: { category?: 'StyledProps' | null };
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
            description: `**CSS property \`${cssPropertyName}\`** ${
              descriptionLength === 'long' ? styledPropsSupportMessage : ''
            }\n\n<a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/${cssPropertyName}">MDN Docs for ${cssPropertyName}</a><br/><br/>`,
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
      description: `**Margin Shorthand**${
        descriptionLength === 'long' ? styledPropsSupportMessage : ''
      }\n\n${descriptionLength === 'long' ? spacingTypeShorthandDescription : ''}`,
    },
    marginX: {
      ...commonStyledPropsProperties,
      description: `**Horizontal Margin**${
        descriptionLength === 'long' ? styledPropsSupportMessage : ''
      }\n\n${descriptionLength === 'long' ? spacingTypeDescription : ''}`,
    },
    marginY: {
      ...commonStyledPropsProperties,
      description: `**Vertical Margin**${
        descriptionLength === 'long' ? styledPropsSupportMessage : ''
      }\n\n${descriptionLength === 'long' ? spacingTypeDescription : ''}`,
    },
    marginTop: {
      ...commonStyledPropsProperties,
      description: `**CSS Property \`margin-top\`**${
        descriptionLength === 'long' ? styledPropsSupportMessage : ''
      }\n\n Supports same values as marginX, and marginY`,
    },
    marginRight: {
      ...commonStyledPropsProperties,
      description: `**CSS Property \`margin-right\`**${
        descriptionLength === 'long' ? styledPropsSupportMessage : ''
      }\n\n Supports same values as marginX, and marginY`,
    },
    marginBottom: {
      ...commonStyledPropsProperties,
      description: `**CSS Property \`margin-bottom\`**${
        descriptionLength === 'long' ? styledPropsSupportMessage : ''
      }\n\n Supports same values as marginX, and marginY`,
    },
    marginLeft: {
      ...commonStyledPropsProperties,
      description: `**CSS Property \`margin-left\`**${
        descriptionLength === 'long' ? styledPropsSupportMessage : ''
      }\n\n Supports same values as marginX, and marginY`,
    },
    ...restStyledPropsArgTypes,
  };
};

const getBoxArgTypes = (): StorybookArgTypes<BoxProps> => {
  const restBoxArgTypes = Object.fromEntries(
    Object.entries(makeBoxProps({}))
      .filter(
        ([key]) =>
          !Object.keys(getStyledPropsArgTypes()).includes(key) &&
          !key.includes('padding') &&
          !key.includes('backgroundColor') &&
          !key.startsWith('on'),
      )
      .map(([key, _value]) => {
        const cssPropertyName = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

        return [
          key,
          {
            ...commonProperties,
            description: `**CSS property \`${cssPropertyName}\`**\n\n\n\n<a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/CSS/${cssPropertyName}">MDN Docs for ${cssPropertyName}</a><br/><br/>`,
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
    backgroundColor: {
      ...commonProperties,
      description:
        '**CSS property `background-color`**.\n\nYou can use our surface.background.* tokens as value here',
    },
    padding: {
      ...commonProperties,
      description: `**Padding Shorthand**\n\n${spacingTypeShorthandDescription}`,
    },
    paddingX: {
      ...commonProperties,
      description: `**Horizontal Padding**\n\n${spacingTypeDescription}`,
    },
    paddingY: {
      ...commonProperties,
      description: `**Vertical Padding**\n\n${spacingTypeDescription}`,
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
    ...getStyledPropsArgTypes({ descriptionLength: 'long', category: null }),
    ...restBoxArgTypes,
    children: {
      table: {
        disable: true,
      },
    },
    __brand__: {
      table: {
        disable: true,
      },
    },
    as: {
      control: {
        type: 'select',
        options: validBoxAsValues,
      },
    },
  };
};

const getBaseBoxArgTypes = (): StorybookArgTypes<
  BaseBoxProps & { forwardedAs: string; ref: unknown; theme: unknown; as: string }
> => {
  return {
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
    children: {
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
