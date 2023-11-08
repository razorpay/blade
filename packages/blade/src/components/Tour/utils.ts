/* eslint-disable one-var */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
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

// https://stackoverflow.com/questions/51927295/check-for-scrollto-to-finish
const scrollTo = (position: number): Promise<void> => {
  const container = window;
  position = Math.round(position);

  if (container.scrollY === position) {
    return Promise.resolve();
  }

  let resolveFn: () => void;
  let timeoutId: NodeJS.Timeout;
  let scrollListener: () => void;

  const promise = new Promise<void>((resolve) => {
    resolveFn = resolve;
  });

  const finished = () => {
    container.removeEventListener('scroll', scrollListener);
    resolveFn();
  };

  scrollListener = () => {
    clearTimeout(timeoutId);

    // scroll is finished when either the position has been reached, or 100ms have elapsed since the last scroll event
    if (container.scrollY === position) {
      finished();
    } else {
      timeoutId = setTimeout(finished, 400);
    }
  };

  container.addEventListener('scroll', scrollListener);

  container.scrollTo({
    top: position,
    behavior: 'smooth',
  });

  return promise;
};

export { useDelayedState, scrollTo };
