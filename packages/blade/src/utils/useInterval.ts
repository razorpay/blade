/* eslint-disable consistent-return */
import React from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

function useInterval(
  callback: () => void,
  { delay, enable }: { delay: number; enable?: boolean },
): void {
  const intervalRef = React.useRef<number | null>(null);
  const savedCallback = React.useRef(callback);

  // keep the callback updated
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const tick = (): void => savedCallback.current();

    if (enable) {
      intervalRef.current = window.setInterval(tick, delay);
      return () => window.clearInterval(intervalRef.current!);
    }
  }, [delay, enable]);
}

export { useInterval };
