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
  transitionProperty: 'box-shadow, background-color',
  transitionDuration: castWebType(makeMotionTime(theme.motion.duration.xgentle)),
  transitionEasing: castWebType(theme.motion.easing.standard.revealing),
});

export { getBaseInputBorderStyles };
