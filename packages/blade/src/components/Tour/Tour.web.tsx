/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useCallback, useMemo } from 'react';
import { FloatingPortal } from '@floating-ui/react';
import { TourContext } from './TourContext';
import { TourPopover } from './TourPopover';
import {
  smoothScroll,
  useDelayedState,
  useIntersectionObserver,
  useIsTransitioningBetweenSteps,
  useLockBodyScroll,
} from './utils';
import type { TourMaskRect, TourProps } from './types';
import { TourMask } from './TourMask';
import { transitionDelay } from './tourTokens';
import { useTheme } from '~utils';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

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
  const [refIdMap, setRefIdMap] = useState(new Map<string, React.RefObject<HTMLElement>>());
  const [size, setSize] = useState<TourMaskRect>({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  });

  // delayed state is used to let the transition finish before reacting to the state changes
  const delayedActiveStep = useDelayedState(activeStep, transitionDelay);
  const delayedSize = useDelayedState(size, transitionDelay);
  // keep track of when we are transitioning between steps
  const isTransitioning = useIsTransitioningBetweenSteps(activeStep, transitionDelay);

  const currentStepRef = refIdMap.get(steps[activeStep]?.name);
  const intersection = useIntersectionObserver(currentStepRef!, {
    threshold: 0.5,
  });

  // main step logic
  const totalSteps = steps.length;
  const currentStepData = useMemo(() => {
    return steps[activeStep];
  }, [activeStep, steps]);

  const goToStep = useCallback(
    (step: number) => {
      if (step < 0 || step >= steps.length) return;
      onStepChange?.(step);
    },
    [onStepChange, steps.length],
  );

  const goToNext = useCallback(() => {
    let nextState = activeStep + 1;
    if (nextState >= steps.length) {
      nextState = steps.length - 1;
    }
    onStepChange?.(nextState);
  }, [activeStep, onStepChange, steps.length]);

  const goToPrevious = useCallback(() => {
    let nextState = activeStep - 1;
    if (nextState < 0) {
      nextState = 0;
    }
    onStepChange?.(nextState);
  }, [activeStep, onStepChange]);

  const stopTour = useCallback(() => {
    onFinish?.();
  }, [onFinish]);

  const attachStep = useCallback((id: string, ref: React.RefObject<HTMLElement>) => {
    if (!ref) return;
    setRefIdMap((prev) => {
      return new Map(prev).set(id, ref);
    });
  }, []);

  const removeStep = useCallback((id: string) => {
    setRefIdMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const updateMaskSize = useCallback(() => {
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

  const scrollToStep = useCallback(() => {
    const ref = refIdMap.get(steps[delayedActiveStep]?.name);
    if (!ref?.current) return;

    // If the element is already in view, don't scroll
    if (intersection?.isIntersecting) return;

    smoothScroll(ref.current, {
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
      .then(() => {
        updateMaskSize();
      })
      .finally(() => {
        // do nothing
      });
  }, [delayedActiveStep, refIdMap, steps, updateMaskSize, intersection?.isIntersecting]);

  // Update the size of the mask when the active step changes
  useIsomorphicLayoutEffect(() => {
    updateMaskSize();
  }, [isOpen, activeStep, refIdMap, steps, updateMaskSize]);

  // Scroll into view when the active step changes
  useIsomorphicLayoutEffect(() => {
    setTimeout(() => {
      if (!isOpen) return;
      if (isTransitioning) return;
      scrollToStep();
    }, transitionDelay);
  }, [isOpen, scrollToStep, isTransitioning]);

  useLockBodyScroll(isOpen);

  // reset the mask size when the tour is closed
  React.useEffect(() => {
    if (!isOpen) {
      setSize({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    }
  }, [isOpen]);

  const contextValue = useMemo(() => {
    return { attachStep, removeStep };
  }, [attachStep, removeStep]);

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
        const isStepActive = currentStepData.name === step.name;
        const attachTo = isStepActive ? currentStepRef : undefined;
        // 1. only show popover if the tour is opened
        // 2. only show the popover if the step is active
        // 3. do not show the popover if we are transitioning between steps
        //    this ensures popover suddenly doesn't jump to the next step,
        //    instead it waits for the transition to finish
        const isPopoverVisible = isOpen && isStepActive && !isTransitioning;

        return (
          <TourPopover
            key={step.name}
            isTransitioning={delayedActiveStep !== activeStep}
            placement={step.placement}
            isOpen={isPopoverVisible}
            onOpenChange={onOpenChange}
            title={step.title}
            titleLeading={step.titleLeading}
            content={step?.content?.({
              activeStep: delayedActiveStep,
              goToPrevious,
              goToNext,
              goToStep,
              totalSteps,
              stopTour,
            })}
            footer={step?.footer?.({
              activeStep: delayedActiveStep,
              goToPrevious,
              goToNext,
              goToStep,
              totalSteps,
              stopTour,
            })}
            attachTo={attachTo}
          />
        );
      })}

      {children}
    </TourContext.Provider>
  );
};

export { Tour };
