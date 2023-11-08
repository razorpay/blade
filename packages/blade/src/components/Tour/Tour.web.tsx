/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
// import { FloatingPortal } from '@floating-ui/react';
// import type { TourMaskRect, TourProps } from './types';
import { FloatingPortal } from '@floating-ui/react';
import { TourContext } from './TourContext';
// import { TourMask } from './TourMask';
import { TourPopover } from './TourPopover';
import { useDelayedState } from './utils';
import type { TourMaskRect, TourProps } from './types';
import { TourMask } from './TourMask';
import { usePrevious, useTheme } from '~utils';
import { useScrollLock } from '~utils/useScrollLock';

const Tour = ({
  steps,
  activeStep,
  isOpen,
  onFinish,
  onOpenChange,
  onStepChange,
  children,
}: TourProps): React.ReactElement => {
  const { theme } = useTheme();
  const [refIdMap, setRefIdMap] = React.useState(new Map<string, React.RefObject<HTMLElement>>());
  const [size, setSize] = React.useState<TourMaskRect>({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  });
  const transitionDelay = theme.motion.duration.gentle;
  // delayed state is used to let the transition finish before reacting to the state changes
  const delayedActiveStep = useDelayedState(activeStep, transitionDelay);
  const delayedSize = useDelayedState(size, transitionDelay);

  const prevActiveStep = usePrevious(activeStep);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // Keep track of when we are transitioning between steps
  React.useEffect(() => {
    if (prevActiveStep === undefined) return;
    setIsTransitioning(true);
    const timeout = window.setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDelay);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [prevActiveStep, transitionDelay]);

  // main step logic
  const getCurrentStep = React.useCallback(() => {
    return steps[activeStep];
  }, [activeStep, steps]);

  const getCurrentStepRef = React.useCallback(() => {
    return refIdMap.get(steps[activeStep]?.name);
  }, [activeStep, refIdMap, steps]);

  const goToNext = React.useCallback(() => {
    let next = activeStep + 1;
    if (next >= steps.length) {
      next = steps.length - 1;
    }
    onStepChange?.(next);
  }, [activeStep, onStepChange, steps.length]);

  const goToPrevious = React.useCallback(() => {
    let next = activeStep - 1;
    if (next < 0) {
      next = 0;
    }
    onStepChange?.(next);
  }, [activeStep, onStepChange]);

  const stopTour = React.useCallback(() => {
    onFinish?.();
  }, [onFinish]);

  const attachStep = React.useCallback((id: string, ref: React.RefObject<HTMLElement>) => {
    if (!ref) return;
    setRefIdMap((prev) => {
      return new Map(prev).set(id, ref);
    });
  }, []);

  const removeStep = React.useCallback((id: string) => {
    setRefIdMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const scrollLockRef = useScrollLock({
    enabled: true,
    reserveScrollBarGap: true,
  });

  React.useEffect(() => {
    const lockRef = scrollLockRef.current;
    if (isOpen) {
      lockRef.activate();
    } else {
      lockRef.deactivate();
    }
    return () => {
      lockRef.deactivate();
    };
  }, [isOpen, scrollLockRef]);

  const updateMaskSize = React.useCallback(() => {
    const ref = refIdMap.get(steps[activeStep]?.name);
    if (!ref?.current) return;

    const rect = ref.current.getBoundingClientRect();
    setSize({
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    });
  }, [activeStep, refIdMap, steps]);

  // update the size of the mask when the active step changes
  React.useLayoutEffect(() => {
    updateMaskSize();
  }, [activeStep, refIdMap, steps, updateMaskSize]);

  const scrollToTarget = React.useCallback(() => {
    const ref = refIdMap.get(steps[delayedActiveStep]?.name);
    if (!ref?.current) return;

    const element = ref.current;
    window.setTimeout(() => {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }, transitionDelay);
  }, [delayedActiveStep, refIdMap, steps, transitionDelay]);

  // scroll into view when the active step changes
  // What a time to hit a chrome bug: https://bugs.chromium.org/p/chromium/issues/detail?id=1043933
  React.useEffect(() => {
    scrollToTarget();
    // if (!element) return;
    // const offset = 100;
    // const bodyRect = document.body.getBoundingClientRect().top;
    // const targetRect = element.getBoundingClientRect().top;
    // const targetPosition = targetRect - bodyRect;
    // const offsetPosition = targetPosition - offset;
    // console.log(offsetPosition);

    // scrollTo(offsetPosition)
    //   .then(() => {
    //     console.log('DONE');
    //     const rect = element.getBoundingClientRect();
    //     setSize({
    //       x: rect.x,
    //       y: rect.y,
    //       width: rect.width,
    //       height: rect.height,
    //     });
    //   })
    //   .catch((err) => {
    //     console.log('scrollElementTo', err);
    //   });
  }, [scrollToTarget]);

  const contextValue = React.useMemo(() => {
    return { attachStep, removeStep };
  }, [attachStep, removeStep]);

  const currentStepData = React.useMemo(() => getCurrentStep(), [getCurrentStep]);
  const totalSteps = steps.length;

  return (
    <TourContext.Provider value={contextValue}>
      <FloatingPortal>
        {isOpen ? (
          <TourMask
            isTransitioning={isTransitioning}
            padding={theme.spacing[4]}
            size={delayedSize}
          />
        ) : null}
      </FloatingPortal>

      {steps.map((step) => {
        // 1. only show popover if the tour is opened
        // 2. only show the popover if the step is active
        // 3. do not show the popover if we are transitioning between steps
        //    this ensures popover suddenly doesn't jump to the next step,
        //    instead it waits for the transition to finish
        const isPopoverVisible =
          activeStep === delayedActiveStep &&
          isOpen &&
          currentStepData.name === step.name &&
          !isTransitioning;
        return (
          <TourPopover
            key={step.name}
            placement={step.placement}
            isOpen={isPopoverVisible}
            onOpenChange={onOpenChange}
            title={step.title}
            titleLeading={step.titleLeading}
            content={step?.content?.({
              activeStep: delayedActiveStep,
              goToPrevious,
              goToNext,
              totalSteps,
              stopTour,
            })}
            footer={step?.footer?.({
              activeStep: delayedActiveStep,
              goToPrevious,
              goToNext,
              totalSteps,
              stopTour,
            })}
            attachTo={currentStepData.name === step.name ? getCurrentStepRef() : undefined}
          />
        );
      })}

      {children}
    </TourContext.Provider>
  );
};

export { Tour };
