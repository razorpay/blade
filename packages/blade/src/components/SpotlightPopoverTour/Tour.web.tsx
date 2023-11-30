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
import type { SpotlightPopoverTourMaskRect, SpotlightPopoverTourProps } from './types';
import { SpotlightPopoverTourMask } from './TourMask';
import { transitionDelay } from './tourTokens';
import { useTheme } from '~components/BladeProvider';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

const SpotlightPopoverTour = ({
  steps,
  activeStep,
  isOpen,
  onFinish,
  onOpenChange,
  onStepChange,
  children,
}: SpotlightPopoverTourProps): React.ReactElement => {
  const { theme } = useTheme();
  const [refIdMap, setRefIdMap] = useState(new Map<string, React.RefObject<HTMLElement>>());
  const [size, setSize] = useState<SpotlightPopoverTourMaskRect>({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  });

  // delayed state is used to let the transition finish before reacting to the state changes
  const [delayedActiveStep] = useDelayedState(activeStep, transitionDelay);
  const [delayedSize, setDelayedSize] = useDelayedState(size, transitionDelay);
  // keep track of when we are transitioning between steps
  const isTransitioning = useIsTransitioningBetweenSteps(activeStep, transitionDelay);
  const [isScrolling, setIsScrolling] = useState(false);

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

  const updateMaskSize = useCallback(
    (shouldSkipDelay = false) => {
      const ref = refIdMap.get(steps[activeStep]?.name);
      if (!ref?.current) return;

      const rect = ref.current.getBoundingClientRect();
      setSize({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      });
      if (shouldSkipDelay) {
        setDelayedSize({
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        });
      }
    },
    [activeStep, refIdMap, setDelayedSize, steps],
  );

  const scrollToStep = useCallback(() => {
    const ref = refIdMap.get(steps[delayedActiveStep]?.name);
    if (!ref?.current) return;

    // If the element is already in view, don't scroll
    if (intersection?.isIntersecting) return;

    setIsScrolling(true);
    smoothScroll(ref.current, {
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
      .then(() => {
        // wait for the scroll to finish before updating the mask size
        // We also don't want to delay the size update since its already delayed by the scroll
        updateMaskSize(true);
      })
      .finally(() => {
        setIsScrolling(false);
      });
  }, [delayedActiveStep, refIdMap, steps, updateMaskSize, intersection?.isIntersecting]);

  // Update the size of the mask when the active step changes
  useIsomorphicLayoutEffect(() => {
    updateMaskSize();
  }, [activeStep, updateMaskSize]);

  // Scroll into view when the active step changes
  useIsomorphicLayoutEffect(() => {
    // We need to wait for the transition to finish before scrolling
    // Otherwise the browser sometimes interrupts the scroll
    const scrollDelay = 100;
    setTimeout(() => {
      if (!isOpen) return;
      if (isTransitioning) return;
      scrollToStep();
    }, scrollDelay);
  }, [isOpen, scrollToStep, isTransitioning]);

  // reset the mask size when the tour is closed
  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      // on initial mount, we don't want to delay the size update
      updateMaskSize(true);
      onOpenChange?.({ isOpen });
    }
    if (!isOpen) {
      setSize({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useLockBodyScroll(isOpen);

  const contextValue = useMemo(() => {
    return { attachStep, removeStep };
  }, [attachStep, removeStep]);

  return (
    <TourContext.Provider value={contextValue}>
      <FloatingPortal>
        {isOpen ? (
          <SpotlightPopoverTourMask
            isTransitioning={isTransitioning || isScrolling}
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

export { SpotlightPopoverTour };
