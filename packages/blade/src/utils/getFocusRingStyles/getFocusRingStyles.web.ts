/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Theme } from '../../components/BladeProvider';
import { castWebType, makeMotionTime } from '~utils';

type GetFocusRingProps = {
  theme: Theme;
  negativeOffset?: boolean;
};

/**
 * @param props.theme Blade Theme Object
 * @param props.negativeOffset if set the outline offset will be set to -4px, this is useful
 * in table component where the outline will get cutoff by the table border
 */
function getFocusRingStyles({ theme, negativeOffset = false }: GetFocusRingProps) {
  return {
    outline: `4px solid ${theme.colors.surface.border.primary.muted}`,
    outlineOffset: negativeOffset ? '-4px' : '1px',
    transitionProperty: 'outline-width',
    transitionDuration: castWebType(makeMotionTime(theme.motion.duration['2xquick'])),
    transitionTimingFunction: castWebType(theme.motion.easing.standard.effective),
  } as const;
}

export { getFocusRingStyles };
