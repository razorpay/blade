import type { ReactElement } from 'react';
import styled from 'styled-components';
import type { TextTypes } from '../../../tokens/theme/theme';
import getPlatformType from '../../../utils/getPlatformType';
import type { Theme } from '../../BladeProvider';
import BaseText from '../BaseText';
import type { BaseTextProps } from '../BaseText/BaseText';

type TextCommonProps = {
  type: TextTypes;
  truncateAfterLines?: number;
  children?: React.ReactNode;
};

type TextBodyVariant = TextCommonProps & {
  variant: 'body';
  weight: keyof Theme['typography']['fonts']['weight'];
};

type TextCaptionVariant = TextCommonProps & {
  variant: 'caption';
  weight: keyof Pick<Theme['typography']['fonts']['weight'], 'regular'>;
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

const getProps = <T extends { variant: 'body' | 'caption' }>({
  variant,
  type,
  weight,
}: Pick<TextProps<T>, 'type' | 'variant' | 'weight'>): BaseTextProps & TextForwardedAs => {
  const props: BaseTextProps & TextForwardedAs = {
    color: `surface.text.${type}.lowContrast`,
    fontSize: 25,
    fontWeight: weight,
    fontStyle: 'normal',
    lineHeight: 's',
    fontFamily: 'text',
    forwardedAs: getPlatformType() !== 'react-native' ? 'p' : undefined,
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

const Text = <T extends { variant: 'body' | 'caption' }>({
  variant,
  weight,
  type,
  truncateAfterLines,
  children,
}: TextProps<T>): ReactElement => {
  const props: BaseTextProps & TextForwardedAs = {
    truncateAfterLines,
    ...getProps({ variant, type, weight }),
  };
  return <StyledText {...props}>{children}</StyledText>;
};

export default Text;
