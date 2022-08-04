/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type { ReactElement } from 'react';
import styled from 'styled-components';
import { BaseText } from '../BaseText';
import type { BaseTextProps } from '../BaseText';
import type { Theme } from '~components/BladeProvider';
import { getPlatformType } from '~utils';
import type { ColorContrast, ColorContrastTypes, TextTypes } from '~tokens/theme/theme';

type TextCommonProps = {
  type?: TextTypes;
  contrast?: ColorContrastTypes;
  truncateAfterLines?: number;
  children: React.ReactNode;
};

export type TextVariant = 'body' | 'caption';

type TextBodyVariant = TextCommonProps & {
  variant?: Extract<TextVariant, 'body'>;
  weight?: keyof Theme['typography']['fonts']['weight'];
  size?: 'small' | 'medium';
};

type TextCaptionVariant = TextCommonProps & {
  variant?: Extract<TextVariant, 'caption'>;
  weight?: keyof Pick<Theme['typography']['fonts']['weight'], 'regular'>;
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

const getTextProps = <T extends { variant: TextVariant }>({
  variant,
  type,
  weight,
  size,
  contrast,
}: Pick<TextProps<T>, 'type' | 'variant' | 'weight' | 'size' | 'contrast'>): Omit<
  BaseTextProps,
  'children'
> &
  TextForwardedAs => {
  const isPlatformWeb = getPlatformType() === 'browser' || getPlatformType() === 'node';
  const colorContrast: keyof ColorContrast = contrast ? `${contrast!}Contrast` : 'lowContrast';
  const props: Omit<BaseTextProps, 'children'> & TextForwardedAs = {
    color: `surface.text.${type ?? 'normal'}.${colorContrast}`,
    fontSize: 100,
    fontWeight: weight ?? 'regular',
    fontStyle: 'normal',
    lineHeight: 'l',
    fontFamily: 'text',
    forwardedAs: isPlatformWeb ? 'p' : undefined,
  };

  if (variant === 'body') {
    if (size === 'small') {
      props.fontSize = 75;
      props.lineHeight = 's';
    }
  } else if (variant === 'caption') {
    if (weight === 'bold') {
      throw new Error(`[Blade: Text]: weight cannot be 'bold' when variant is 'caption'`);
    }
    if (size === 'small') {
      throw new Error(`[Blade: Text]: size cannot be 'small' when variant is 'caption'`);
    }
    props.fontSize = 50;
    props.lineHeight = 's';
    props.fontStyle = 'italic';
  }

  return props;
};

const StyledText = styled(BaseText)(({ truncateAfterLines }) => {
  if (truncateAfterLines) {
    if (getPlatformType() === 'react-native') {
      return {
        numberOfLines: truncateAfterLines,
      };
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

const Text = <T extends { variant: TextVariant }>({
  variant = 'body',
  weight = 'regular',
  size = 'medium',
  type = 'normal',
  contrast = 'low',
  truncateAfterLines,
  children,
}: TextProps<T>): ReactElement => {
  const props: Omit<BaseTextProps, 'children'> & TextForwardedAs = {
    truncateAfterLines,
    ...getTextProps({ variant, type, weight, size, contrast }),
  };
  return <StyledText {...props}>{children}</StyledText>;
};

export { Text, getTextProps };
