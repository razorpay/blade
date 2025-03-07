/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { GetFocusRingArgs } from './types';
import { castWebType, makeMotionTime } from '~utils';

/**
 * @param props.theme Blade Theme Object
 * @param props.negativeOffset if set the outline offset will be set to -4px, this is useful
 * in table component where the outline will get cutoff by the table border
 */
function getFocusRingStyles({
  theme,
  negativeOffset = false,
  isImportant = false,
}: GetFocusRingArgs) {
  const important = `${isImportant ? ' !important' : ''}`;
  return {
    outline: `4px solid ${theme.colors.surface.border.primary.muted}${important}`,
    outlineOffset: `${negativeOffset ? '-4px' : '1px'}${important}`,
    transitionProperty: 'outline-width',
    transitionDuration: castWebType(makeMotionTime(theme.motion.duration['2xquick'])),
    transitionTimingFunction: castWebType(theme.motion.easing.standard),
  } as const;
}

export { getFocusRingStyles };
