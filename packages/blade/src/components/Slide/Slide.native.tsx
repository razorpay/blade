import React from 'react';
import type { SlideProps } from './types';
import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { msToSeconds } from '~utils/msToSeconds';
import { useTheme } from '~utils';

/**
 * NATIVE easing control points, mirroring the theme easing tokens.
 *
 * On native, `theme.motion.easing.*` resolves to an `EasingFactoryFn` (a reanimated easing
 * function), not a `cubic-bezier(...)` string. `cssBezierToArray` (used on web) calls
 * `.indexOf('(')` on it and crashes, so we supply the bezier control points directly. The native
 * interpreter's `getTiming` builds `Easing.bezier(...)` from a 4-number array (else falls back to
 * `Easing.ease`).
 */
const ENTRANCE_EASING: [number, number, number, number] = [0, 0, 0.2, 1]; // theme.motion.easing.entrance
const EXIT_EASING: [number, number, number, number] = [0.17, 0, 1, 1]; // theme.motion.easing.exit
const EMPHASIZED_EASING: [number, number, number, number] = [0.5, 0, 0, 1]; // theme.motion.easing.emphasized

const getFromTransform = (
  direction: 'top' | 'right' | 'bottom' | 'left',
  fromOffset: NonNullable<SlideProps['fromOffset']>,
): `translate${string}` => {
  if (direction === 'top') {
    return `translateY(-${fromOffset})`;
  }

  if (direction === 'left') {
    return `translateX(-${fromOffset})`;
  }

  if (direction === 'right') {
    return `translateX(${fromOffset})`;
  }

  return `translateY(${fromOffset})`;
};

/**
 * ## Slide
 *
 * Slide is one of the motion presets that we expose from blade to help you make components slide in from outside of viewport
 *
 * If you're looking for subtle movement on enter in the viewport itself, checkout `Move` preset instead.
 *
 * ### Usage
 *
 * #### Slide in on mount
 *
 * ```jsx
 * <Slide direction="bottom">
 *   <Card />
 * </Slide>
 * ```
 *
 * #### Conditionally slide based on state
 *
 * ```jsx
 * <Slide isVisible={isVisibleState}>
 *   <Card />
 * </Slide>
 * ```
 *
 * ### Native limitations
 *
 * - Only the default `100vw` / `100vh` offsets slide on native (resolved via `Dimensions`).
 *   A `%`-based `fromOffset` cannot be measured against the element size and degrades to no movement.
 * - `in-view` triggers degrade to `mount` (no scroll-driven in-view detection on native).
 */
const Slide = ({
  children,
  type = 'inout',
  direction = 'bottom',
  isVisible,
  motionTriggers,
  shouldUnmountWhenHidden,
  fromOffset,
  delay,
}: SlideProps): React.ReactElement => {
  const { theme } = useTheme();

  const enterDirection = typeof direction === 'object' ? direction.enter : direction;
  const exitDirection = typeof direction === 'object' ? direction.exit : direction;
  const isEnterDirectionHorizontal = ['left', 'right'].includes(enterDirection);
  const isExitDirectionHorizontal = ['left', 'right'].includes(exitDirection);

  // vw/vh resolve via Dimensions in the native interpreter; `%` offsets degrade to no movement.
  const defaultOffset: NonNullable<SlideProps['fromOffset']> = isEnterDirectionHorizontal
    ? '100vw'
    : '100vh';

  const enterTransform = getFromTransform(enterDirection, fromOffset ?? defaultOffset);
  const exitTransform = getFromTransform(exitDirection, fromOffset ?? defaultOffset);
  // NATIVE: single-string zero target (not a keyframe array). The interpreter reads only the last
  // keyframe entry, so an array would collapse to `0` and lose the enter slide.
  const zeroTarget = isEnterDirectionHorizontal ? 'translateX(0%)' : 'translateY(0%)';

  const enterDelay = typeof delay === 'object' ? delay.enter : delay;
  const exitDelay = typeof delay === 'object' ? delay.exit : delay;

  const slideVariants: MotionVariantsType = React.useMemo(
    () => ({
      // NATIVE: the off-screen offset lives in `initial.transform` (Move-style) so the interpreter
      // interpolates from the offset → zero target on enter. Web keeps `initial` transform-less for
      // its `in-view` trigger, but native `in-view` degrades to mount so we're free to offset here.
      initial: {
        opacity: 0,
        transform: enterTransform,
      },
      animate: {
        opacity: 1,
        transform: zeroTarget,
        transition: {
          // We have to make sure we don't add delay prop because if we define it, it takes precedence in stagger.
          // Even setting `undefined` would break the stagger
          ...(enterDelay ? { delay: msToSeconds(theme.motion.delay[enterDelay]) } : {}),
          duration: msToSeconds(
            isEnterDirectionHorizontal
              ? theme.motion.duration.xmoderate
              : theme.motion.duration['2xgentle'],
          ),
          ease: isEnterDirectionHorizontal ? ENTRANCE_EASING : EMPHASIZED_EASING,
        },
      },
      exit: {
        opacity: 0,
        transform: exitTransform,
        // NATIVE: `transitionEnd` is a no-op in the interpreter; reset relies on the initial offset
        // / remount instead.
        transition: {
          ...(exitDelay ? { delay: msToSeconds(theme.motion.delay[exitDelay]) } : {}),
          duration: msToSeconds(
            isExitDirectionHorizontal
              ? theme.motion.duration.moderate
              : theme.motion.duration.xgentle,
          ),
          ease: isExitDirectionHorizontal ? EXIT_EASING : EMPHASIZED_EASING,
        },
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      enterTransform,
      exitTransform,
      zeroTarget,
      isEnterDirectionHorizontal,
      isExitDirectionHorizontal,
      enterDelay,
      exitDelay,
      theme.name,
    ],
  );

  // Pass `children` as a real JSX child (not the `children={...}` prop shorthand) so the native
  // `BaseMotionEntryExit` can read `children.props.ref`.
  return (
    <BaseMotionEntryExit
      motionVariants={slideVariants}
      type={type}
      isVisible={isVisible}
      motionTriggers={motionTriggers}
      shouldUnmountWhenHidden={shouldUnmountWhenHidden}
    >
      {children}
    </BaseMotionEntryExit>
  );
};

export { Slide };
