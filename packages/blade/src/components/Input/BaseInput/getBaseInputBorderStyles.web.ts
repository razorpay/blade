import type { CSSObject } from 'styled-components';
import { baseInputBorderBackgroundMotion } from './baseInputConfig';
import type { Theme } from '~components/BladeProvider';
import { castWebType, makeBorderSize, makeMotionTime } from '~utils';
import getIn from '~utils/lodashButBetter/get';

const getBaseInputBorderStyles = ({
  theme,
  borderWidth,
  borderColor,
}: {
  theme: Theme;
  borderWidth: number;
  borderColor: string;
}): CSSObject => ({
  borderWidth: makeBorderSize(theme.border.width.none),
  boxShadow: `${borderColor} 0px 0px 0px ${makeBorderSize(borderWidth)}`,
  transitionProperty: 'box-shadow, background-color',
  transitionDuration: castWebType(
    makeMotionTime(getIn(theme.motion.duration, baseInputBorderBackgroundMotion.duration)),
  ),
  transitionEasing: castWebType(getIn(theme.motion.easing, baseInputBorderBackgroundMotion.easing)),
});

export { getBaseInputBorderStyles };
