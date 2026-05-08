/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Modal } from 'react-native';
import { TourContext } from './TourContext';
import { TourPopover } from './TourPopover';
import type { SpotlightPopoverTourMaskRect, SpotlightPopoverTourProps } from './types';
import { SpotlightPopoverTourMask } from './TourMask';
import { transitionDelay } from './tourTokens';
import { useTheme } from '~components/BladeProvider';

const useDelayedState = <T,>(
  value: T,
  delay: number,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [delayedValue, setDelayedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return [delayedValue, setDelayedValue];
};

const useIsTransitioningBetweenSteps = (activeStep: number, delay: number): boolean => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevStep = React.useRef(activeStep);

  useEffect(() => {
    if (prevStep.current !== activeStep) {
      setIsTransitioning(true);
      prevStep.current = activeStep;
      const timer = setTimeout(() => setIsTransitioning(false), delay);
      return () => clearTimeout(timer);
    }
  }, [activeStep, delay]);

  return isTransitioning;
};

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
  const [refIdMap, setRefIdMap] = useState(new Map<string, React.RefObject<any>>());
  const [size, setSize] = useState<SpotlightPopoverTourMaskRect>({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  });

  const [delayedActiveStep] = useDelayedState(activeStep, transitionDelay);
  const [delayedSize, setDelayedSize] = useDelayedState(size, transitionDelay);
  const isTransitioning = useIsTransitioningBetweenSteps(activeStep, transitionDelay);

  const currentStepRef = refIdMap.get(steps[activeStep]?.name);

  const totalSteps = steps.length;
  const currentStepData = useMemo(() => steps[activeStep], [activeStep, steps]);

  const goToStep = useCallback(
    (step: number) => {
      if (step < 0 || step >= steps.length) return;
      onStepChange?.(step);
    },
    [onStepChange, steps.length],
  );

  const goToNext = useCallback(() => {
    let nextState = activeStep + 1;
    if (nextState >= steps.length) nextState = steps.length - 1;
    onStepChange?.(nextState);
  }, [activeStep, onStepChange, steps.length]);

  const goToPrevious = useCallback(() => {
    let nextState = activeStep - 1;
    if (nextState < 0) nextState = 0;
    onStepChange?.(nextState);
  }, [activeStep, onStepChange]);

  const stopTour = useCallback(() => {
    onFinish?.();
  }, [onFinish]);

  const attachStep = useCallback((id: string, ref: React.RefObject<any>) => {
    if (!ref) return;
    setRefIdMap((prev) => new Map(prev).set(id, ref));
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

      // measureInWindow gives absolute screen coordinates
      ref.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        const rect = { x, y, width, height };
        setSize(rect);
        if (shouldSkipDelay) {
          setDelayedSize(rect);
        }
      });
    },
    [activeStep, refIdMap, setDelayedSize, steps],
  );

  // Update mask when active step changes
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the view has been laid out
      const timer = setTimeout(() => updateMaskSize(), 100);
      return () => clearTimeout(timer);
    }
  }, [activeStep, isOpen, updateMaskSize, refIdMap]);

  // Reset mask when tour closes
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => updateMaskSize(true), 100);
      onOpenChange?.({ isOpen });
    } else {
      setSize({ x: 0, y: 0, width: 0, height: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const contextValue = useMemo(() => ({ attachStep, removeStep }), [attachStep, removeStep]);

  return (
    <TourContext.Provider value={contextValue}>
      {isOpen ? (
        <Modal visible transparent animationType="fade" statusBarTranslucent>
          <SpotlightPopoverTourMask
            isTransitioning={isTransitioning}
            padding={theme.spacing[4]}
            size={delayedSize}
          />

          {steps.map((step) => {
            const isStepActive = currentStepData?.name === step.name;
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
                targetRect={isStepActive ? delayedSize : undefined}
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
                attachTo={isStepActive ? currentStepRef : undefined}
              />
            );
          })}
        </Modal>
      ) : null}

      {children}
    </TourContext.Provider>
  );
};

export { SpotlightPopoverTour };
