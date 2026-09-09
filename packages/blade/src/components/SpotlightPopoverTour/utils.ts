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
function useDelayedState<T>(
  initialState: T,
  delay: number,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [delayedState, _setDelayedState] = React.useState(initialState);
  const timeoutRef = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      _setDelayedState(initialState);
    }, delay);

    return () => {
      window.clearTimeout(timeoutRef.current);
    };
  }, [delay, initialState]);

  const setDelayedState = React.useCallback((newState: React.SetStateAction<T>) => {
    _setDelayedState(newState);
    window.clearTimeout(timeoutRef.current);
  }, []);

  return [delayedState, setDelayedState];
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

const readBorderRadius = (el: HTMLElement): number => {
  const { borderTopLeftRadius } = window.getComputedStyle(el);
  const parsed = Number.parseFloat(borderTopLeftRadius);

  if (Number.isNaN(parsed)) return 0;
  // Percentage radii (e.g. `50%` on a circular avatar) resolve against the box itself.
  if (borderTopLeftRadius.includes('%')) {
    const { width, height } = el.getBoundingClientRect();
    return (Math.min(width, height) * parsed) / 100;
  }

  return parsed;
};

// `getComputedStyle` reports unset properties as an empty string in some environments
// (notably jsdom), so treat "unset" the same as "not painted" rather than as a value.
const isPainted = (value: string): boolean =>
  Boolean(value) && value !== 'none' && value !== 'transparent' && value !== 'rgba(0, 0, 0, 0)';

/** Whether an element paints anything of its own, or is a bare layout shell. */
const drawsOwnShape = (el: HTMLElement): boolean => {
  const { borderTopWidth, backgroundColor, backgroundImage } = window.getComputedStyle(el);
  return (
    readBorderRadius(el) > 0 ||
    Number.parseFloat(borderTopWidth) > 0 ||
    isPainted(backgroundColor) ||
    isPainted(backgroundImage)
  );
};

/**
 * Resolves the element a step should actually be measured against.
 *
 * `SpotlightPopoverTourStep` clones its child to attach a ref, so consumers commonly wrap
 * their UI in a layout element just to forward one. Measuring that wrapper is wrong twice
 * over: it has no corner radius to inherit, and a wrapper stretched by its parent's layout
 * (e.g. `alignItems="stretch"` in a flex row) is taller than the component inside it, which
 * makes the spotlight's padding look uneven — 6px on three sides and more at the bottom.
 *
 * So when the step's element paints nothing itself and simply wraps a single child that
 * fills it on at least one axis, we trace that child instead. The fill check keeps us from
 * shrinking onto an inner element that merely happens to be first — a wrapper around
 * narrower content is still measured as the wrapper.
 *
 * Both the spotlight and the popover must resolve through this, or they anchor to different
 * rectangles and the overhang between them shows up as an uneven arrow-to-spotlight gap.
 */
const resolveSpotlightTarget = (element: HTMLElement): HTMLElement => {
  if (drawsOwnShape(element)) return element;

  const { children } = element;
  if (children.length !== 1) return element;

  const child = children[0] as HTMLElement;
  const parentRect = element.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();
  const fillsAnAxis =
    Math.abs(childRect.width - parentRect.width) <= 1 ||
    Math.abs(childRect.height - parentRect.height) <= 1;

  return fillsAnAxis ? child : element;
};

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
  readBorderRadius,
  resolveSpotlightTarget,
};
