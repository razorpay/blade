import React from 'react';
import type { SlideProps } from './types';
import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { msToSeconds } from '~utils/msToSeconds';
import { cssBezierToArray } from '~utils/cssBezierToArray';
import { castWebType, useTheme } from '~utils';

const getFromTransform = (
  direction: SlideProps['direction'],
  fromOffset: SlideProps['fromOffset'],
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

  const defaultOffset: SlideProps['fromOffset'] = isEnterDirectionHorizontal ? '100vw' : '100vh';

  const enterTransform = getFromTransform(enterDirection, fromOffset ?? defaultOffset);
  const exitTransform = getFromTransform(exitDirection, fromOffset ?? defaultOffset);

  const enterDelay = typeof delay === 'object' ? delay.enter : delay;
  const exitDelay = typeof delay === 'object' ? delay.exit : delay;

  const moveVariants: MotionVariantsType = React.useMemo(
    () => ({
      initial: {
        // We keep element in view with opacity 0 initially so that it works with `in-view` trigger as expected
        opacity: 0,
      },
      animate: {
        transform: [enterTransform, 'translateY(0%)'],
        opacity: 1,
        transition: {
          // We have to make sure we don't add delay prop because if we define it, it takes precedence in stagger.
          // Even setting `undefined` would break the stagger
          ...(enterDelay ? { delay: msToSeconds(theme.motion.delay[enterDelay]) } : {}),
          duration: msToSeconds(
            isEnterDirectionHorizontal
              ? theme.motion.duration.xmoderate
              : theme.motion.duration['2xgentle'],
          ),
          ease: cssBezierToArray(
            isEnterDirectionHorizontal
              ? castWebType(theme.motion.easing.entrance)
              : castWebType(theme.motion.easing.emphasized),
          ),
        },
      },
      exit: {
        opacity: 0,
        transform: exitTransform,
        transitionEnd: {
          transform: enterTransform,
        },
        transition: {
          // We have to make sure we don't add delay prop because if we define it, it takes precedence in stagger.
          // Even setting `undefined` would break the stagger
          ...(exitDelay ? { delay: msToSeconds(theme.motion.delay[exitDelay]) } : {}),
          duration: msToSeconds(
            isExitDirectionHorizontal
              ? theme.motion.duration.moderate
              : theme.motion.duration.xgentle,
          ),
          ease: cssBezierToArray(
            isExitDirectionHorizontal
              ? castWebType(theme.motion.easing.exit)
              : castWebType(theme.motion.easing.emphasized),
          ),
        },
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      enterDirection,
      exitDirection,
      isEnterDirectionHorizontal,
      isExitDirectionHorizontal,
      theme.name,
    ],
  );

  return (
    <BaseMotionEntryExit
      motionVariants={moveVariants}
      children={children}
      type={type}
      isVisible={isVisible}
      motionTriggers={motionTriggers}
      shouldUnmountWhenHidden={shouldUnmountWhenHidden}
    />
  );
};

export { Slide };
