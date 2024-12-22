/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type { ReactElement } from 'react';
import React from 'react';
import { BaseText } from '../BaseText';
import type { BaseTextProps, BaseTextSizes } from '../BaseText/types';
import { useValidateAsProp } from '../utils';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { BladeElementRef, TestID } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';

const validAsValues = ['p', 'span', 'div', 'abbr', 'figcaption', 'cite', 'q', 'label'] as const;
type TextCommonProps = {
  as?: typeof validAsValues[number];
  truncateAfterLines?: number;
  children: React.ReactNode;
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;
  /**
   * Overrides the color of the Text component.
   *
   * **Note** This takes priority over `type` and `contrast` prop to decide color of text
   */
  color?: BaseTextProps['color'];
  textAlign?: BaseTextProps['textAlign'];
  textDecorationLine?: BaseTextProps['textDecorationLine'];
  wordBreak?: BaseTextProps['wordBreak'];
} & TestID &
  StyledPropsBlade;

export type TextVariant = 'body' | 'caption';

type TextBodyVariant = TextCommonProps & {
  variant?: Extract<TextVariant, 'body'>;
  size?: Extract<BaseTextSizes, 'xsmall' | 'small' | 'medium' | 'large'>;
};

type TextCaptionVariant = TextCommonProps & {
  variant?: Extract<TextVariant, 'caption'>;
  size?: Extract<BaseTextSizes, 'small' | 'medium'>;
};

export type TextProps<T> = T extends { variant: infer Variant }
  ? Variant extends 'caption'
    ? TextCaptionVariant
    : Variant extends 'body'
    ? TextBodyVariant
    : T
  : T;

type GetTextPropsReturn = Omit<BaseTextProps, 'children'>;
type GetTextProps<T extends { variant: TextVariant }> = Pick<
  TextProps<T>,
  'variant' | 'weight' | 'size' | 'color' | 'testID' | 'textAlign' | 'textDecorationLine'
>;

const getTextProps = <T extends { variant: TextVariant }>({
  variant,
  weight,
  size,
  color = 'surface.text.gray.normal',
  testID,
  textAlign,
  textDecorationLine,
}: GetTextProps<T>): GetTextPropsReturn => {
  const props: GetTextPropsReturn = {
    color,
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

  if (variant === 'caption') {
    // variant of caption can only have size of small
    if (size && size !== 'small' && size !== 'medium') {
      if (__DEV__) {
        throwBladeError({
          moduleName: 'Text',
          message: `size cannot be '${size}' when variant is 'caption'`,
        });
      }
      // Set size as small in case of invalid size
      size = 'small';
    }
  } else if (variant !== 'caption' && !size) {
    size = 'medium';
  }

  if (variant === 'body') {
    if (size === 'xsmall') {
      props.fontSize = 25;
      props.lineHeight = 25;
    }
    if (size === 'small') {
      props.fontSize = 75;
      props.lineHeight = 75;
    }
    if (size === 'medium') {
      props.fontSize = 100;
      props.lineHeight = 100;
    }
    if (size === 'large') {
      props.fontSize = 200;
      props.lineHeight = 200;
    }
  }
  if (variant === 'caption') {
    if (size === 'small') {
      props.fontSize = 50;
      props.lineHeight = 50;
      props.fontWeight = 'regular';
    }
    if (size === 'medium') {
      props.fontSize = 100;
      props.lineHeight = 50;
      props.fontWeight = 'regular';
    }
    props.fontStyle = 'italic';
  }

  return props;
};

const _Text = <T extends { variant: TextVariant }>(
  {
    as = 'p',
    variant = 'body',
    weight = 'regular',
    size,
    truncateAfterLines,
    children,
    color,
    testID,
    textAlign,
    textDecorationLine,
    wordBreak,
    ...styledProps
  }: TextProps<T>,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  const props: Omit<BaseTextProps, 'children'> = {
    as,
    truncateAfterLines,
    wordBreak,
    ...getTextProps({
      variant,
      weight,
      color,
      size,
      testID,
      textAlign,
      textDecorationLine,
    }),
  };

  useValidateAsProp({ componentName: 'Text', as, validAsValues });

  return (
    <BaseText ref={ref} {...props} {...getStyledProps(styledProps)}>
      {children}
    </BaseText>
  );
};

const Text = assignWithoutSideEffects(React.forwardRef(_Text), {
  displayName: 'Text',
  componentId: 'Text',
});

export { Text, getTextProps };
