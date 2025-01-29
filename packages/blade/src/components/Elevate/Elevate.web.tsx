import React from 'react';
import type { ElevateProps } from './types';
import { BaseMotionEnhancerBox } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { msToSeconds } from '~utils/msToSeconds';
import { cssBezierToArray } from '~utils/cssBezierToArray';
import { castWebType, useTheme } from '~utils';

/**
 * ## Elevate
 *
 * Elevate is one of the highlight presets that we expose from blade to help you elevate (add shadow) components based on interactions
 *
 * ### Usage
 *
 * #### Elevate up on hover
 *
 * ```jsx
 * <Elevate motionTriggers={['hover']}>
 *  <Card />
 * </Elevate>
 * ```
 *
 * #### Conditionally elevateF
 *
 * ```jsx
 * <Elevate isHighlighted={isHighlightedState}>
 *   <MyComponent />
 * </Elevate>
 * ```
 */
const Elevate = ({
  children,
  isHighlighted,
  type = 'inout',
  motionTriggers,
}: ElevateProps): React.ReactElement => {
  const isControlledHighlighted = typeof isHighlighted === 'boolean';
  const defaultMotionTriggers = isControlledHighlighted ? ['mount' as const] : ['hover' as const];
  const { theme } = useTheme();

  const elevateVariants: MotionVariantsType = {
    initial: {
      boxShadow: 'none',
    },
    animate: {
      boxShadow:
        isHighlighted || !isControlledHighlighted
          ? castWebType(theme.elevation.lowRaised)
          : undefined,
      transition: {
        duration: msToSeconds(theme.motion.duration.moderate),
        ease: cssBezierToArray(castWebType(theme.motion.easing.standard)),
      },
    },
    exit: {
      boxShadow: 'none',
    },
  };

  return (
    <BaseMotionEnhancerBox
      motionVariants={elevateVariants}
      type={type}
      children={children}
      motionTriggers={motionTriggers ?? defaultMotionTriggers}
    />
  );
};

export { Elevate };
