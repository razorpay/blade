/* eslint-disable consistent-return */
import React from 'react';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

/**
 * Check if an element has scroll overflow
 */
const useHasOverflow = (
  ref: React.RefObject<HTMLDivElement>,
  callback?: (hasOverflow: boolean) => void,
): boolean => {
  const observer = React.useRef<ResizeObserver | null>(null);
  const [hasOverflow, setHasOverflow] = React.useState<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const element = ref.current;

    const trigger = (): void => {
      const hasOverflow = element.scrollWidth > element.clientWidth;
      setHasOverflow(hasOverflow);

      if (callback) callback(hasOverflow);
    };

    trigger();
    if ('ResizeObserver' in window) {
      observer.current = new ResizeObserver(trigger);
      observer.current.observe(element);
    }

    // destroy the observer
    return (): void => {
      if ('ResizeObserver' in window) {
        observer.current?.disconnect();
      }
    };
  }, [callback, ref]);

  return hasOverflow;
};

const approximatelyEqual = (v1: number, v2: number, tolerance = 1): boolean => {
  return Math.abs(v1 - v2) < tolerance;
};

export { useHasOverflow, approximatelyEqual };
