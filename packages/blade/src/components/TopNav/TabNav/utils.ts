/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable consistent-return */
import React from 'react';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

/**
 * Hook to observe resize events on a given element
 */
const useResize = (
  ref: React.RefObject<HTMLDivElement>,
  callback?: (entry: ResizeObserverEntry, observer: React.RefObject<ResizeObserver>) => void,
) => {
  const observer = React.useRef<ResizeObserver | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const element = ref.current;

    if (!('ResizeObserver' in window)) return;

    observer.current = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        callback?.(entry, observer);
      });
    });
    observer.current.observe(element);

    // destroy the observer
    return (): void => {
      if (!('ResizeObserver' in window)) return;
      observer.current?.disconnect();
    };
  }, [callback]);
};

// Overlapping color of surface.background.gray.subtle + interactive.background.gray.default
// TODO(future): design will tokenize or check if this is needed or not
const MIXED_BG_COLOR = '#e1e7ef';

export { useResize, MIXED_BG_COLOR };
