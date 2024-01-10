import type { CSSProperties } from 'styled-components';
import type { Theme } from '../../components/BladeProvider';
import { castWebType, makeMotionTime } from '~utils';

function getFocusRingStyles(theme: Theme): CSSProperties {
  return {
    outline: `4px solid ${theme.colors.surface.border.primary.muted}`,
    outlineOffset: '1px',
    transitionProperty: 'outline-width',
    transitionDuration: castWebType(makeMotionTime(theme.motion.duration['2xquick'])),
    transitionTimingFunction: castWebType(theme.motion.easing.standard.effective),
  };
}

export { getFocusRingStyles };
