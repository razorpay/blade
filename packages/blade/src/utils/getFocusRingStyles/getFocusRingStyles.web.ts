/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { GetFocusRingArgs } from './types';
import { focusRingColorTokens } from './focusRingTokens';
import { castWebType, makeMotionTime } from '~utils';
import getIn from '~utils/lodashButBetter/get';

/**
 * @param props.theme Blade Theme Object
 * @param props.negativeOffset if set the outline offset will be set to -4px, this is useful
 * in table component where the outline will get cutoff by the table border
 * @param props.variant `neutral` swaps the primary blue ring for the neutral one, for
 * components that are themselves neutral
 */
function getFocusRingStyles({
  theme,
  negativeOffset = false,
  isImportant = false,
  variant = 'primary',
}: GetFocusRingArgs) {
  const important = `${isImportant ? ' !important' : ''}`;
  return {
    outline: `4px solid ${getIn(theme.colors, focusRingColorTokens[variant])}${important}`,
    outlineOffset: `${negativeOffset ? '-4px' : '1px'}${important}`,
    transitionProperty: 'outline-width',
    transitionDuration: castWebType(makeMotionTime(theme.motion.duration['2xquick'])),
    transitionTimingFunction: castWebType(theme.motion.easing.standard),
    zIndex: 2, // Prevent focus ring clipping by adjacent inputs in InputGroup
  } as const;
}

export { getFocusRingStyles };
