/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

function useInterval(
  callback: () => void,
  { delay, enable }: { delay: number; enable?: boolean },
): void {
  const savedCallback = React.useRef(callback);

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return;
    }

    if (!enable) {
      return () => clearInterval(id);
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay, enable]);
}

export { useInterval };
