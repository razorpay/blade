import type { CSSObject } from 'styled-components';
import { baseInputBorderBackgroundMotion } from './baseInputTokens';
import type { Theme } from '~components/BladeProvider';
import { castWebType, makeBorderSize, makeMotionTime } from '~utils';
import getIn from '~utils/lodashButBetter/get';

const getBaseInputBorderStyles = ({
  theme,
  borderWidth,
  borderColor,
  isFocused,
}: {
  theme: Theme;
  borderWidth: number;
  borderColor: string;
  isFocused?: boolean;
}): CSSObject => ({
  borderWidth: makeBorderSize(theme.border.width.none),
  boxShadow: `${borderColor} 0px 0px 0px ${makeBorderSize(borderWidth)}`,
  transitionProperty: 'box-shadow, background-color',
  transitionDuration: castWebType(
    makeMotionTime(
      getIn(
        theme.motion.duration,
        baseInputBorderBackgroundMotion[isFocused ? 'enter' : 'exit'].duration,
      ),
    ),
  ),
  transitionEasing: castWebType(
    getIn(
      theme.motion.easing,
      baseInputBorderBackgroundMotion[isFocused ? 'enter' : 'exit'].easing,
    ),
  ),
});

export { getBaseInputBorderStyles };
