import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import { castWebType, makeBorderSize, makeMotionTime } from '~utils';

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
  transitionProperty: 'box-shadow',
  transitionDuration: castWebType(makeMotionTime(theme.motion.duration.quick)),
  transitionEasing: castWebType(theme.motion.easing.standard),
  willChange: 'box-shadow',
});

export { getBaseInputBorderStyles };
