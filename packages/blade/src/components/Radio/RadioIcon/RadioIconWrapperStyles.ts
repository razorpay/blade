import type { CSSObject } from 'styled-components';
import { radioIconColors, radioSizes } from '../radioTokens';
import type { RadioIconProps } from './RadioIcon';
import type { Theme } from '~components/BladeProvider';
import {
  castWebType,
  getIn,
  getPlatformType,
  makeBorderSize,
  makeMotionTime,
  makeSize,
  makeSpace,
} from '~utils';

export type RadioRectProps = RadioIconProps;

const getRadioIconWrapperStyles = ({
  theme,
  isChecked,
  isDisabled,
  isNegative,
  size,
}: RadioRectProps & { theme: Theme }): CSSObject => {
  const isReactNative = getPlatformType() === 'react-native';
  let variant: 'default' | 'disabled' | 'negative' = 'default';
  if (isDisabled) variant = 'disabled';
  if (isNegative) variant = 'negative';
  const checked = isChecked ? 'checked' : 'unchecked';
  const background = radioIconColors.variants[variant].background[checked];
  const border = radioIconColors.variants[variant].border[checked];
  const backgroundColor = background === 'transparent' ? background : getIn(theme, background);
  const borderColor = border === 'transparent' ? border : getIn(theme, border);

  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: makeSpace(radioSizes.icon[size].width),
    height: makeSpace(radioSizes.icon[size].height),
    borderWidth: makeBorderSize(theme.border.width.thick),
    borderStyle: 'solid',
    margin: makeSpace(theme.spacing[1]),
    borderRadius: makeSize(theme.border.radius.max),
    backgroundColor,
    borderColor,
    ...(!isReactNative && {
      transitionDuration: castWebType(makeMotionTime(theme.motion.duration.xquick)),
      transitionTimingFunction: castWebType(theme.motion.easing.exit.attentive),
    }),
  };
};

export { getRadioIconWrapperStyles };
