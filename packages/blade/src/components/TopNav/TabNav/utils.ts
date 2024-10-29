/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable consistent-return */
import type React from 'react';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

/**
 * Hook to observe resize events on a given element
 */
const useResize = (
  ref: React.RefObject<HTMLDivElement>,
  callback?: (entry: ResizeObserverEntry) => void,
) => {
  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const element = ref.current;

    if (!('ResizeObserver' in window)) return;

    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        callback?.(entry);
      });
    });
    observer.observe(element);

    // destroy the observer
    return (): void => {
      if (!('ResizeObserver' in window)) return;
      observer?.disconnect();
    };
  }, [callback]);
};

// Overlapping color of surface.background.gray.subtle + interactive.background.gray.default
// TODO(future): design will tokenize or check if this is needed or not
const MIXED_BG_COLOR = '#e1e7ef';

export { useResize, MIXED_BG_COLOR };
