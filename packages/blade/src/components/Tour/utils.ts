/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable one-var */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { usePrevious } from '~utils';
import { throwBladeError } from '~utils/logger';
import { useScrollLock } from '~utils/useScrollLock';

/**
 * Hook to delay the state change
 *
 * This is used to delay the active step change to allow for transitions to finish
 * This prevents the popover's footer from changing it's JSX while it's transitioning
 */
function useDelayedState<T>(initialState: T, delay: number): T {
  const [delayedState, setDelayedState] = React.useState(initialState);
  const timeoutRef = React.useRef<number | undefined>(undefined);

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

/**
 * Keep track of when we are transitioning between steps
 *
 * This is used to prevent the popover from jumping to the next step before animations are finished
 */
const useIsTransitioningBetweenSteps = (activeStep: number, transitionDelay: number) => {
  const prevActiveStep = usePrevious(activeStep);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // Keep track of when we are transitioning between steps
  React.useEffect(() => {
    if (prevActiveStep === undefined) return;
    setIsTransitioning(true);
    const timeout = setTimeout(() => {
      setIsTransitioning(false);
    }, transitionDelay);

    return () => {
      clearTimeout(timeout);
    };
  }, [prevActiveStep, transitionDelay]);

  return isTransitioning;
};

// https://stackoverflow.com/questions/46795955/how-to-know-scroll-to-element-is-done-in-javascript
function smoothScroll(element: Element | null, options: ScrollIntoViewOptions) {
  return new Promise((resolve) => {
    if (__DEV__) {
      if (!(element instanceof Element)) {
        throwBladeError({
          moduleName: 'smoothScroll',
          message: 'argument "element" must be an instance of Element',
        });
      }
    }

    let same = 0;
    let lastPos: undefined | null | number = null;
    const scrollOptions = { behavior: 'smooth', ...options } as const;

    element!.scrollIntoView(scrollOptions);
    requestAnimationFrame(check);

    // eslint-disable-next-line consistent-return
    function check() {
      const newPos = element?.getBoundingClientRect().top;
      if (newPos === lastPos) {
        if (same++ > 2) {
          return resolve(null);
        }
      } else {
        same = 0;
        lastPos = newPos;
      }
      requestAnimationFrame(check);
    }
  });
}

function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  { threshold = 0, root = null, rootMargin = '0%' }: IntersectionObserverInit,
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = React.useState<IntersectionObserverEntry>();

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  };

  React.useEffect(() => {
    const node = elementRef?.current; // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef?.current, JSON.stringify(threshold), root, rootMargin]);

  return entry;
}

const useLockBodyScroll = (shouldLock: boolean) => {
  const scrollLockRef = useScrollLock({
    enabled: true,
    reserveScrollBarGap: true,
  });

  React.useEffect(() => {
    const lockRef = scrollLockRef.current;
    if (shouldLock) {
      lockRef.activate();
    } else {
      lockRef.deactivate();
    }
    return () => {
      lockRef.deactivate();
    };
  }, [shouldLock, scrollLockRef]);
};

export {
  useDelayedState,
  useIsTransitioningBetweenSteps,
  smoothScroll,
  useIntersectionObserver,
  useLockBodyScroll,
};
