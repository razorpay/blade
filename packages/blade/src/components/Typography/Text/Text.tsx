/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type { ReactElement } from 'react';
import styled from 'styled-components';
import { BaseText } from '../BaseText';
import type { BaseTextProps } from '../BaseText/types';
import type { Theme } from '~components/BladeProvider';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { ColorContrast, ColorContrastTypes, TextTypes } from '~tokens/theme/theme';
import type { TestID } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getPlatformType } from '~utils';

type TextCommonProps = {
  type?: TextTypes;
  contrast?: ColorContrastTypes;
  truncateAfterLines?: number;
  children: React.ReactNode;
  weight?: keyof Theme['typography']['fonts']['weight'];
  /**
   * **For Internal use only**:  Sets the color of the Text component
   */
  color?: BaseTextProps['color'];
  textAlign?: BaseTextProps['textAlign'];
} & TestID &
  StyledPropsBlade;

export type TextVariant = 'body' | 'caption';

type TextBodyVariant = TextCommonProps & {
  variant?: Extract<TextVariant, 'body'>;
  size?: 'xsmall' | 'small' | 'medium' | 'large';
};

type TextCaptionVariant = TextCommonProps & {
  variant?: Extract<TextVariant, 'caption'>;
  size?: 'medium';
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

type TextForwardedAs = {
  forwardedAs?: BaseTextProps['as'];
};

type GetTextPropsReturn = Omit<BaseTextProps, 'children'> & TextForwardedAs;
type GetTextProps<T extends { variant: TextVariant }> = Pick<
  TextProps<T>,
  'type' | 'variant' | 'weight' | 'size' | 'contrast' | 'testID' | 'textAlign'
>;
const getTextProps = <T extends { variant: TextVariant }>({
  variant,
  type,
  weight,
  size,
  contrast,
  testID,
  textAlign,
}: GetTextProps<T>): GetTextPropsReturn => {
  const isPlatformWeb = getPlatformType() === 'browser' || getPlatformType() === 'node';
  const colorContrast: keyof ColorContrast = contrast ? `${contrast!}Contrast` : 'lowContrast';
  const props: GetTextPropsReturn = {
    color: `surface.text.${type ?? 'normal'}.${colorContrast}`,
    fontSize: 100,
    fontWeight: weight ?? 'regular',
    fontStyle: 'normal',
    lineHeight: 100,
    fontFamily: 'text',
    forwardedAs: isPlatformWeb ? 'p' : undefined,
    componentName: 'text',
    testID,
    textAlign,
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
    } else {
      throw new Error(`[Blade: Text]: size cannot be '${size}' when variant is 'caption'`);
    }
    props.fontStyle = 'italic';
  }

  return props;
};

const StyledText = styled(BaseText)(({ truncateAfterLines }) => {
  if (truncateAfterLines) {
    if (getPlatformType() === 'react-native') {
      return null;
    }
    return {
      overflow: 'hidden',
      display: '-webkit-box',
      'line-clamp': `${truncateAfterLines}`,
      '-webkit-line-clamp': `${truncateAfterLines}`,
      '-webkit-box-orient': 'vertical',
    };
  }
  return {};
});

const _Text = <T extends { variant: TextVariant }>({
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
  ...styledProps
}: TextProps<T>): ReactElement => {
  const props: Omit<BaseTextProps, 'children'> & TextForwardedAs = {
    truncateAfterLines,
    ...getTextProps({
      variant,
      type,
      weight,
      size,
      contrast,
      testID,
      textAlign,
    }),
    ...(color ? { color } : {}),
  };
  return (
    <StyledText {...props} {...getStyledProps(styledProps)}>
      {children}
    </StyledText>
  );
};

const Text = assignWithoutSideEffects(_Text, {
  displayName: 'Text',
  componentId: 'Text',
});

export { Text, getTextProps };
