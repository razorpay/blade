import React from 'react';

/**
 * Hook to delay the state change
 */
function useDelayedState<T>(initialState: T, delay: number): T {
  const [delayedState, setDelayedState] = React.useState(initialState);
  const timeoutRef = React.useRef<number | undefined>(undefined);

  // Delay the active step change to allow for transitions to finish
  // This prevents the popover's footer from changing it's JSX while it's transitioning
  React.useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      setDelayedState(initialState);
    }, delay);

    return () => {
      window.clearTimeout(timeoutRef.current);
    };
  }, [delay, initialState]);

  return delayedState;
}

export { useDelayedState };
