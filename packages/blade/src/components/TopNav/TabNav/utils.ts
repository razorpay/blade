/* eslint-disable consistent-return */
import React from 'react';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

const useIsOverflow = (
  ref: React.RefObject<HTMLDivElement>,
  callback?: (isOverflow: boolean) => void,
): boolean => {
  const observer = React.useRef<ResizeObserver | null>(null);
  const [isOverflow, setIsOverflow] = React.useState<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const element = ref.current;

    const trigger = (): void => {
      const hasOverflow = element.scrollWidth > element.clientWidth;
      setIsOverflow(hasOverflow);

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

  return isOverflow;
};

const approximatelyEqual = (v1: number, v2: number, tolerance = 1): boolean => {
  return Math.abs(v1 - v2) < tolerance;
};

export { useIsOverflow, approximatelyEqual };
