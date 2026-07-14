/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useCallback, useMemo } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { TourContext } from './TourContext';
import type { TourElement } from './TourContext';
import { TourPopover } from './TourPopover';
import { useDelayedState, useIsTransitioningBetweenSteps } from './tourHooks';
import {
  findScrollableAncestor,
  hasRoomForPopoverPlacement,
  isRectVisibleInWindow,
  measureStepRect,
  scrollStepIntoView,
  useTourScrollLock,
  type ScrollableInstance,
} from './tourNativeUtils';
import type { SpotlightPopoverTourMaskRect, SpotlightPopoverTourProps } from './types';
import { SpotlightPopoverTourMask } from './TourMask';
import { transitionDelay } from './tourTokens';
import { useTheme } from '~components/BladeProvider';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

/**
 * Native tour orchestration mirrors Tour.web.tsx timing:
 *
 * 1. Step change → isTransitioning + !isStepSettled hides popover/mask cutout
 * 2. After transitionDelay + 100ms → scroll toward the target (and ensure popover room)
 * 3. While scrolling → isScrolling keeps overlay in transition
 * 4. After scroll settles → updateMaskSize(true) once → clear gates → cutout + popover
 *    appear already at final geometry (no pre-scroll delayedSize, no stale async overwrite)
 *
 * Web: isPopoverVisible ignores isScrolling (Floating UI autoUpdate follows the element),
 * but native Modal positioning + enter animation must wait until the target is settled or
 * the popover visually rides along with the page scroll.
 */
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
  const [refIdMap, setRefIdMap] = useState(new Map<string, React.RefObject<TourElement>>());
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
  /**
   * Gate popover enter until the active step has been measured (+ scrolled if needed).
   * Cleared false on step/open change; set true only after settleStep finishes.
   */
  const [isStepSettled, setIsStepSettled] = useState(false);

  const scrollParentRef = React.useRef<ScrollableInstance | null>(null);
  // Bump when a scroll parent is registered so scroll-lock re-runs after late registration
  const [scrollParentEpoch, setScrollParentEpoch] = useState(0);
  /**
   * Invalidates in-flight measureInWindow results so a pre-scroll measure cannot overwrite
   * the post-settle cutout (visible “adjust into center” on scrolled steps).
   */
  const measureGenerationRef = React.useRef(0);

  const currentStepRef = refIdMap.get(steps[activeStep]?.name);
  const popoverGap = theme.spacing[4] + 12; // spacing + ARROW_HEIGHT

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

  const attachStep = useCallback((id: string, ref: React.RefObject<TourElement>) => {
    if (!ref) return;
    setRefIdMap((prev) => {
      return new Map(prev).set(id, ref);
    });

    // Opportunistically resolve scroll parent from the registered step host
    if (ref.current && !scrollParentRef.current) {
      const found = findScrollableAncestor(ref.current);
      if (found) {
        scrollParentRef.current = found;
      }
    }
  }, []);

  const removeStep = useCallback((id: string) => {
    setRefIdMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const registerScrollParent = useCallback((scrollable: unknown) => {
    if (!scrollable) return;
    const next = scrollable as ScrollableInstance;
    const isNewInstance = scrollParentRef.current !== next;
    scrollParentRef.current = next;
    if (isNewInstance) {
      setScrollParentEpoch((epoch) => epoch + 1);
    }
  }, []);

  const updateMaskSize = useCallback(
    async (shouldSkipDelay = false) => {
      const generation = measureGenerationRef.current;
      const ref = refIdMap.get(steps[activeStep]?.name);
      if (!ref?.current) return;

      const rect = await measureStepRect(ref);
      // Step/open changed while measuring — ignore stale pre-scroll geometry
      if (generation !== measureGenerationRef.current) return;
      if (!rect) return;

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

      if (!scrollParentRef.current) {
        const found = findScrollableAncestor(ref.current);
        if (found) {
          scrollParentRef.current = found;
        }
      }
    },
    [activeStep, refIdMap, setDelayedSize, steps],
  );

  const onStepLayout = useCallback(
    (id: string) => {
      // Only remask after settle, and skip delay so layout tweaks don't tween the cutout
      if (steps[activeStep]?.name === id && isStepSettled) {
        void updateMaskSize(true);
      }
    },
    [activeStep, isStepSettled, steps, updateMaskSize],
  );

  /**
   * Web sequence after isTransitioning clears:
   * scroll (if needed) → wait until settled → updateMaskSize(true).
   * Native extends this by keeping the popover closed until settle completes.
   *
   * Uses `activeStep` (not delayedActiveStep) so we don't race the delayed-state
   * timer that fires in the same tick as isTransitioning=false.
   */
  const settleActiveStep = useCallback(async () => {
    const settleGeneration = measureGenerationRef.current;
    const isStale = () => settleGeneration !== measureGenerationRef.current;

    const step = steps[activeStep];
    const ref = refIdMap.get(step?.name);
    if (!ref?.current) {
      if (!isStale()) setIsStepSettled(true);
      return;
    }

    const rect = await measureStepRect(ref);
    if (isStale()) return;

    if (!rect) {
      // Layout not ready — still unlock so a later onLayout / retry can remask
      void updateMaskSize(true);
      if (!isStale()) setIsStepSettled(true);
      return;
    }

    const needsScroll =
      !isRectVisibleInWindow(rect, 0.5) ||
      !hasRoomForPopoverPlacement(rect, step?.placement, popoverGap);

    const resolvedParent =
      scrollParentRef.current ?? findScrollableAncestor(ref.current) ?? null;
    if (resolvedParent) {
      scrollParentRef.current = resolvedParent;
    }

    if (needsScroll && scrollParentRef.current) {
      setIsScrolling(true);
      try {
        const resolvedScrollParent = await scrollStepIntoView(ref, scrollParentRef.current, {
          placement: step?.placement,
          gap: popoverGap,
          ensurePlacementRoom: true,
        });
        if (isStale()) return;
        if (resolvedScrollParent) {
          scrollParentRef.current = resolvedScrollParent;
        }
        // Skip delayed size — scroll already delayed the mask update (matches web)
        await updateMaskSize(true);
      } finally {
        if (!isStale()) {
          setIsScrolling(false);
        }
      }
    } else {
      await updateMaskSize(true);
    }

    if (!isStale()) {
      setIsStepSettled(true);
    }
  }, [activeStep, popoverGap, refIdMap, steps, updateMaskSize]);

  // Invalidate settle gate when the active step or open state changes.
  // Do NOT measure into delayedSize here — a pre-scroll rect would land after transitionDelay
  // and then “adjust” into the post-scroll center. settleActiveStep is the sole reveal measure.
  useIsomorphicLayoutEffect(() => {
    measureGenerationRef.current += 1;
    if (!isOpen) {
      setIsStepSettled(false);
      setIsScrolling(false);
      return;
    }
    setIsStepSettled(false);
  }, [activeStep, isOpen]);

  // After step transition finishes, scroll then reveal (web: scrollDelay after !isTransitioning)
  useIsomorphicLayoutEffect(() => {
    if (!isOpen) return;
    if (isTransitioning) return;

    const scrollDelay = 100;
    const timer = setTimeout(() => {
      void settleActiveStep();
    }, scrollDelay);
    return () => clearTimeout(timer);
  }, [isOpen, isTransitioning, settleActiveStep]);

  // reset the mask size when the tour is closed; retry measure after open for late layout
  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      onOpenChange?.({ isOpen });
      return undefined;
    }

    setSize({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
    setIsScrolling(false);
    setIsStepSettled(false);
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useTourScrollLock(isOpen, scrollParentRef, scrollParentEpoch);

  const contextValue = useMemo(() => {
    return {
      attachStep,
      removeStep,
      registerScrollParent,
      onStepLayout,
    };
  }, [attachStep, removeStep, registerScrollParent, onStepLayout]);

  // Web hides only during isTransitioning; native also waits for scroll settle so the
  // enter animation does not run while the page is still moving.
  const isPopoverSettling = isTransitioning || isScrolling || !isStepSettled;

  return (
    <TourContext.Provider value={contextValue}>
      {children}
      {/*
        Use RN Modal (not @gorhom/portal) so the overlay always paints above Storybook's
        navigator BottomSheet and other portal siblings. Portal z-index alone was insufficient
        in RN Storybook — mask/popover never appeared despite isOpen=true.
      */}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={stopTour}
      >
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <SpotlightPopoverTourMask
            isTransitioning={isPopoverSettling}
            padding={theme.spacing[4]}
            size={delayedSize}
          />

          {steps.map((step) => {
            const isStepActive = currentStepData.name === step.name;
            const attachTo = isStepActive ? currentStepRef : undefined;
            // Match web predicates + settlement gate (scroll-then-animate)
            const isPopoverVisible = isOpen && isStepActive && !isPopoverSettling;

            return (
              <TourPopover
                key={step.name}
                isTransitioning={delayedActiveStep !== activeStep || isScrolling}
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
                attachTo={attachTo as never}
              />
            );
          })}
        </View>
      </Modal>
    </TourContext.Provider>
  );
};

export { SpotlightPopoverTour };
