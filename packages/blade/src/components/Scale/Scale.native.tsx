import React from 'react';
import type { ScaleProps } from './types';
import { BaseMotionEnhancerBox } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { msToSeconds } from '~utils/msToSeconds';
import { useTheme } from '~utils';

/**
 * Bezier control points of the `standard` easing token (`cubic-bezier(0.3, 0, 0.2, 1)`).
 *
 * On native `theme.motion.easing.standard` is an `EasingFactoryFn` object (not a CSS string), so
 * `cssBezierToArray` would crash at runtime. The native interpreter expects a 4-number bezier
 * array, so we supply the token's numeric control points directly (matches the web-resolved value).
 */
const STANDARD_EASING = [0.3, 0, 0.2, 1] as const;

/**
 * ## Scale
 *
 * Scale is one of the highlight presets that we expose from blade to help you scale up or scale down components based on interactions
 *
 * ### Usage
 *
 * #### Scale up on hover
 *
 * ```jsx
 * <Scale motionTriggers={['hover']}>
 *  <Card />
 * </Scale>
 * ```
 *
 * #### Scale down on tap
 *
 * ```jsx
 * <Scale variant="scale-down" motionTriggers={['tap']}>
 *   <Card />
 * </Scale>
 * ```
 *
 * #### Conditionally scale
 *
 * ```jsx
 * <Scale isHighlighted={isHighlightedState}>
 *   <MyComponent />
 * </Scale>
 * ```
 */
const Scale = ({
  children,
  isHighlighted,
  type = 'inout',
  variant = 'scale-up',
  motionTriggers,
}: ScaleProps): React.ReactElement => {
  const isControlledHighlighted = typeof isHighlighted === 'boolean';
  const defaultMotionTriggers = isControlledHighlighted ? ['mount' as const] : ['hover' as const];
  const { theme } = useTheme();

  const targetScale = variant === 'scale-up' ? 1.05 : 0.98;

  const scaleVariants: MotionVariantsType = {
    initial: {
      scale: 1,
    },
    animate: {
      // Keep the target scale always defined. On native the interpreter re-animates only when the
      // resolved `targetName` changes (not when variant content changes), so the "not highlighted"
      // state is expressed via `animateVisibility: 'initial'` rather than an undefined scale.
      scale: targetScale,
      transition: {
        duration: msToSeconds(theme.motion.duration.moderate),
        ease: [...STANDARD_EASING],
      },
    },
    exit: {
      scale: 1,
    },
  };

  return (
    <BaseMotionEnhancerBox
      motionVariants={scaleVariants}
      type={type}
      motionTriggers={motionTriggers ?? defaultMotionTriggers}
      // Native fix: drive the target for the controlled path so toggling `isHighlighted`
      // flips `targetName` between 'animate'/'initial' and actually re-runs the animation.
      {...(isControlledHighlighted
        ? { animateVisibility: isHighlighted ? ('animate' as const) : ('initial' as const) }
        : {})}
    >
      {children}
    </BaseMotionEnhancerBox>
  );
};

export { Scale };
