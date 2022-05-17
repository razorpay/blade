import type { ReactElement } from 'react';
import styled from 'styled-components';
import type { TextTypes } from '../../../tokens/theme/theme';
import getPlatformType from '../../../utils/getPlatformType';
import type { Theme } from '../../BladeProvider';
import BaseText from '../BaseText';
import type { BaseTextProps } from '../BaseText/BaseText';

type TextCommonProps = {
  type?: TextTypes;
  truncateAfterLines?: number;
  children: React.ReactNode;
};

type TextVariant = 'body' | 'caption';

type TextBodyVariant = TextCommonProps & {
  variant?: Extract<TextVariant, 'body'>;
  weight?: keyof Theme['typography']['fonts']['weight'];
};

type TextCaptionVariant = TextCommonProps & {
  variant?: Extract<TextVariant, 'caption'>;
  weight?: keyof Pick<Theme['typography']['fonts']['weight'], 'regular'>;
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

const getProps = <T extends { variant: TextVariant }>({
  variant,
  type,
  weight,
}: Pick<TextProps<T>, 'type' | 'variant' | 'weight'>): Omit<BaseTextProps, 'children'> &
  TextForwardedAs => {
  const isPlatformWeb = getPlatformType() === 'browser' || getPlatformType() === 'node';
  const props: Omit<BaseTextProps, 'children'> & TextForwardedAs = {
    color: `surface.text.${type ?? 'normal'}.lowContrast`,
    fontSize: 100,
    fontWeight: weight ?? 'regular',
    fontStyle: 'normal',
    lineHeight: 'l',
    fontFamily: 'text',
    forwardedAs: isPlatformWeb ? 'p' : undefined,
  };

  if (variant === 'body') {
    props.fontSize = 100;
    props.fontStyle = 'normal';
    props.lineHeight = 'l';
  } else if (variant === 'caption') {
    if (weight === 'bold') {
      throw new Error(`[Blade: Text]: weight cannot be 'bold' when variant is 'caption'`);
    }
    props.fontSize = 25;
    props.fontStyle = 'italic';
    props.lineHeight = 's';
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
  type = 'normal',
  truncateAfterLines,
  children,
}: TextProps<T>): ReactElement => {
  const props: Omit<BaseTextProps, 'children'> & TextForwardedAs = {
    truncateAfterLines,
    ...getProps({ variant, type, weight }),
  };
  return <StyledText {...props}>{children}</StyledText>;
};

export default Text;
