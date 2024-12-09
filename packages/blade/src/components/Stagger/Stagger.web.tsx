import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { StaggerContext } from './StaggerProvider';
import type { StaggerProps } from './types';
import { BaseMotionBox } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { msToSeconds } from '~utils/msToSeconds';
import { useTheme } from '~utils';

/**
 * ## Stagger
 *
 * Stagger is a utility motion preset we expose from blade to help you implement stagger animations.
 *
 * You can use any of the base entry / exit presets like `Fade`, `Move`, `Slide` inside of it and the components will appear one after the other instead of all at once.
 *
 * **Note:** Unlike other motion presets, Stagger is not an enhancer components and renders a Box instead. You can use BoxProps on this component.
 *
 * ### Usage
 *
 * #### Move with Stagger
 *
 * ```jsx
 * <Stagger>
 *  <Move><Chip /></Move>
 *  <Move><Chip /></Move>
 *  <Move><Chip /></Move>
 * </Stagger>
 * ```
 *
 * #### Conditionally make the parent visible or invisible
 *
 * `isVisible` prop in this case should be on Stagger instead of children preset component
 *
 * ```jsx
 * <Stagger isVisible={isVisibleState}>
 *  <Move><Chip /></Move>
 *  <Move><Chip /></Move>
 *  <Move><Chip /></Move>
 * </Stagger>
 * ```
 *
 */
const Stagger = ({
  children,
  isVisible = true,
  type = 'inout',
  shouldUnmountWhenHidden = false,
  delay,
  motionTriggers,
  ...boxProps
}: StaggerProps): React.ReactElement => {
  const { theme } = useTheme();
  // Only need AnimatePresence when we have to unmount the component
  const AnimateWrapper = shouldUnmountWhenHidden ? AnimatePresence : React.Fragment;
  // keep it always mounted when shouldUnmountWhenHidden is false
  const isMounted = shouldUnmountWhenHidden ? isVisible : true;

  const enterDelay = typeof delay === 'object' ? delay.enter : delay;
  const exitDelay = typeof delay === 'object' ? delay.exit : delay;

  const staggerVariants: MotionVariantsType = {
    initial: {},
    animate: {
      transition: {
        ...(enterDelay ? { delayChildren: msToSeconds(theme.motion.delay[enterDelay]) } : {}),
        staggerChildren: msToSeconds(theme.motion.duration['2xquick']),
      },
    },
    exit: {
      transition: {
        ...(exitDelay ? { delayChildren: msToSeconds(theme.motion.delay[exitDelay]) } : {}),
        staggerChildren: msToSeconds(theme.motion.duration['2xquick']),
      },
    },
  };

  return (
    <AnimateWrapper>
      {isMounted ? (
        <BaseMotionBox
          type={type}
          motionVariants={staggerVariants}
          motionTriggers={motionTriggers}
          {...(shouldUnmountWhenHidden
            ? {}
            : { animateVisibility: isVisible ? 'animate' : 'exit' })}
          {...boxProps}
        >
          <StaggerContext.Provider value={{ isInsideStaggerContainer: true, staggerType: type }}>
            {children}
          </StaggerContext.Provider>
        </BaseMotionBox>
      ) : null}
    </AnimateWrapper>
  );
};

export { Stagger };
