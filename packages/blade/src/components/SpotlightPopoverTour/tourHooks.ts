/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';

/**
 * Hook to delay the state change
 *
 * This is used to delay the active step change to allow for transitions to finish
 * This prevents the popover's footer from changing it's JSX while it's transitioning
 */
function useDelayedState<T>(
  initialState: T,
  delay: number,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [delayedState, _setDelayedState] = React.useState(initialState);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      _setDelayedState(initialState);
    }, delay);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [delay, initialState]);

  const setDelayedState = React.useCallback((newState: React.SetStateAction<T>) => {
    _setDelayedState(newState);
    clearTimeout(timeoutRef.current);
  }, []);

  return [delayedState, setDelayedState];
}

/**
 * Keep track of when we are transitioning between steps
 *
 * This is used to prevent the popover from jumping to the next step before animations are finished
 */
const useIsTransitioningBetweenSteps = (activeStep: number, transitionDelay: number) => {
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const isFirstRenderRef = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    setIsTransitioning(true);
    const timeout = setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDelay);

    return () => {
      clearTimeout(timeout);
    };
  }, [activeStep, transitionDelay]);

  return isTransitioning;
};

export { useDelayedState, useIsTransitioningBetweenSteps };
