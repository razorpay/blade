/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type { ReactElement } from 'react';
import React from 'react';
import { BaseText } from '../BaseText';
import type { BaseTextProps, BaseTextSizes } from '../BaseText/types';
import { useValidateAsProp } from '../utils';
import type { Theme } from '~components/BladeProvider';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { ColorContrast, ColorContrastTypes, TextTypes } from '~tokens/theme/theme';
import type { TestID } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';

const validAsValues = ['p', 'span', 'div', 'abbr', 'figcaption', 'cite', 'q'] as const;
type TextCommonProps = {
  as?: typeof validAsValues[number];
  type?: TextTypes;
  contrast?: ColorContrastTypes;
  truncateAfterLines?: number;
  children: React.ReactNode;
  weight?: keyof Theme['typography']['fonts']['weight'];
  /**
   * Overrides the color of the Text component.
   *
   * **Note** This takes priority over `type` and `contrast` prop to decide color of text
   */
  color?: BaseTextProps['color'];
  textAlign?: BaseTextProps['textAlign'];
  textDecorationLine?: BaseTextProps['textDecorationLine'];
} & TestID &
  StyledPropsBlade;

export type TextVariant = 'body' | 'caption';

type TextBodyVariant = TextCommonProps & {
  variant?: Extract<TextVariant, 'body'>;
  size?: Extract<BaseTextSizes, 'xsmall' | 'small' | 'medium' | 'large'>;
};

type TextCaptionVariant = TextCommonProps & {
  variant?: Extract<TextVariant, 'caption'>;
  size?: Extract<BaseTextSizes, 'medium'>;
};

/**
 * Conditionally changing props based on variant.
 * Overloads or union gives wrong intellisense.
 */
export type TextProps<T> = T extends {
  variant: infer Variant;
}
  ? Variant extends 'caption'
    ? TextCaptionVariant
    : Variant extends 'body'
    ? TextBodyVariant
    : T
  : T;

type GetTextPropsReturn = Omit<BaseTextProps, 'children'>;
type GetTextProps<T extends { variant: TextVariant }> = Pick<
  TextProps<T>,
  | 'type'
  | 'variant'
  | 'weight'
  | 'size'
  | 'contrast'
  | 'color'
  | 'testID'
  | 'textAlign'
  | 'textDecorationLine'
>;
const getTextProps = <T extends { variant: TextVariant }>({
  variant,
  type,
  weight,
  size,
  color,
  contrast,
  testID,
  textAlign,
  textDecorationLine,
}: GetTextProps<T>): GetTextPropsReturn => {
  const colorContrast: keyof ColorContrast = contrast ? `${contrast!}Contrast` : 'lowContrast';
  const props: GetTextPropsReturn = {
    color: color ?? `surface.text.${type ?? 'normal'}.${colorContrast}`,
    fontSize: 100,
    fontWeight: weight ?? 'regular',
    fontStyle: 'normal',
    lineHeight: 100,
    fontFamily: 'text',
    componentName: 'text',
    testID,
    textAlign,
    textDecorationLine,
  };

  if (variant === 'body') {
    if (size === 'xsmall') {
      props.fontSize = 25;
      props.lineHeight = 50;
    }
    if (size === 'small') {
      props.fontSize = 75;
      props.lineHeight = 50;
    }
    if (size === 'medium') {
      props.fontSize = 100;
      props.lineHeight = 100;
    }
    if (size === 'large') {
      props.fontSize = 200;
      props.lineHeight = 300;
    }
  }
  if (variant === 'caption') {
    if (size === 'medium') {
      props.fontSize = 50;
      props.lineHeight = 50;
    } else if (__DEV__) {
      throwBladeError({
        moduleName: 'Text',
        message: `size cannot be '${size}' when variant is 'caption'`,
      });
    }
    props.fontStyle = 'italic';
  }

  return props;
};

const _Text = <T extends { variant: TextVariant }>({
  as = 'p',
  variant = 'body',
  weight = 'regular',
  size = 'medium',
  type = 'normal',
  contrast = 'low',
  truncateAfterLines,
  children,
  color,
  testID,
  textAlign,
  textDecorationLine,
  ...styledProps
}: TextProps<T>): ReactElement => {
  const props: Omit<BaseTextProps, 'children'> = {
    as,
    truncateAfterLines,
    ...getTextProps({
      variant,
      type,
      weight,
      color,
      size,
      contrast,
      testID,
      textAlign,
      textDecorationLine,
    }),
  };

  useValidateAsProp({ componentName: 'Text', as, validAsValues });

  return (
    <BaseText {...props} {...getStyledProps(styledProps)}>
      {children}
    </BaseText>
  );
};

const Text = assignWithoutSideEffects(_Text, {
  displayName: 'Text',
  componentId: 'Text',
});

export { Text, getTextProps };
