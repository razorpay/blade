import type { ReactElement } from 'react';
import styled from 'styled-components';
import type { TextTypes } from '../../../tokens/theme/theme';
import getPlatform from '../../../utils/getPlatform';
import type { Theme } from '../../BladeProvider';
import BaseText from '../BaseText';
import type { BaseTextProps, SurfaceColors } from '../BaseText/BaseText';

type TextCommonProps = {
  type: TextTypes;
  truncateAfterLines: number;
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

export type TextProps = TextBodyVariant | TextCaptionVariant;

type TextBaseTextProps = {
  color: SurfaceColors;
  fontSize: keyof Theme['typography']['fonts']['size'];
  fontWeight: keyof Theme['typography']['fonts']['weight'];
  fontFamily: keyof Theme['typography']['fonts']['family'];
  fontStyle: BaseTextProps['fontStyle'];
  lineHeight: keyof Theme['typography']['lineHeights'];
  forwardedAs?: BaseTextProps['as'];
};

const getProps = ({
  variant,
  type,
  weight,
}: Pick<TextProps, 'type' | 'variant' | 'weight'>): TextBaseTextProps => {
  const props: TextBaseTextProps = {
    color: `surface.text.${type}.lowContrast`,
    fontSize: 25,
    fontWeight: weight,
    fontStyle: 'normal',
    lineHeight: 's',
    fontFamily: 'text',
    forwardedAs: getPlatform() !== 'react-native' ? 'p' : undefined,
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
    if (getPlatform() === 'react-native') {
      return {
        numberOfLines: truncateAfterLines,
        ellipsizeMode: 'tail',
      };
    }
    return {
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-line-clamp': `${truncateAfterLines}`,
      '-webkit-box-orient': 'vertical',
    };
  }
  return {};
});

const Text = ({ variant, weight, type, truncateAfterLines, children }: TextProps): ReactElement => {
  const props = { truncateAfterLines, ...getProps({ variant, type, weight }) };
  return <StyledText {...props}>{children}</StyledText>;
};

export default Text;
