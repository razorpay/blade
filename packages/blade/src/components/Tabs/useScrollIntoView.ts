//
// Modified from: https://mantine.dev/hooks/use-scroll-into-view/
//
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';

type ScrollIntoViewAnimation = {
  /** target element alignment relatively to parent based on current axis */
  alignment?: 'start' | 'end' | 'center';
  parent?: HTMLElement;
  target?: HTMLElement;
};

type ScrollIntoViewParams = {
  /** callback fired after scroll */
  onScrollFinish?: () => void;
  /** duration of scroll in milliseconds */
  duration?: number;
  /** axis of scroll */
  axis?: 'x' | 'y';
  /** custom mathematical easing function */
  easing?: (t: number) => number;
  /** additional distance between nearest edge and element */
  offset?: number;
  /** indicator if animation may be interrupted by user scrolling */
  cancelable?: boolean;
  /** prevents content jumping in scrolling lists with multiple targets */
  isList?: boolean;
};

const useWindowEvent = <K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
) => {
  React.useEffect(() => {
    window.addEventListener(type, listener, options);
    return () => window.removeEventListener(type, listener, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, listener]);
};

const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const getScrollStart = ({ axis, parent }: any) => {
  if (!parent && typeof document === 'undefined') {
    return 0;
  }

  const method = axis === 'y' ? 'scrollTop' : 'scrollLeft';

  if (parent) {
    return parent[method];
  }

  const { body, documentElement } = document;

  // while one of it has a value the second is equal 0
  return body[method] + documentElement[method];
};

const setScrollParam = ({ axis, parent, distance }: any) => {
  if (!parent && typeof document === 'undefined') {
    return;
  }

  const method = axis === 'y' ? 'scrollTop' : 'scrollLeft';

  if (parent) {
    parent[method] = distance;
  } else {
    const { body, documentElement } = document;
    body[method] = distance;
    documentElement[method] = distance;
  }
};

const getRelativePosition = ({ axis, target, parent, alignment, offset, isList }: any): number => {
  if (!target || (!parent && typeof document === 'undefined')) {
    return 0;
  }
  const isCustomParent = !!parent;
  const parentElement = parent || document.body;
  const parentPosition = parentElement.getBoundingClientRect();
  const targetPosition = target.getBoundingClientRect();

  const getDiff = (property: 'top' | 'left'): number =>
    targetPosition[property] - parentPosition[property];

  if (axis === 'y') {
    const diff = getDiff('top');

    if (diff === 0) return 0;

    if (alignment === 'start') {
      const distance = diff - offset;
      const shouldScroll = distance <= targetPosition.height * (isList ? 0 : 1) || !isList;

      return shouldScroll ? distance : 0;
    }

    const parentHeight = isCustomParent ? parentPosition.height : window.innerHeight;

    if (alignment === 'end') {
      const distance = diff + offset - parentHeight + targetPosition.height;
      const shouldScroll = distance >= -targetPosition.height * (isList ? 0 : 1) || !isList;

      return shouldScroll ? distance : 0;
    }

    if (alignment === 'center') {
      return diff - parentHeight / 2 + targetPosition.height / 2;
    }

    return 0;
  }

  if (axis === 'x') {
    const diff = getDiff('left');

    if (diff === 0) return 0;

    if (alignment === 'start') {
      const distance = diff - offset;
      const shouldScroll = distance <= targetPosition.width || !isList;

      return shouldScroll ? distance : 0;
    }

    const parentWidth = isCustomParent ? parentPosition.width : window.innerWidth;

    if (alignment === 'end') {
      const distance = diff + offset - parentWidth + targetPosition.width;
      const shouldScroll = distance >= -targetPosition.width || !isList;

      return shouldScroll ? distance : 0;
    }

    if (alignment === 'center') {
      return diff - parentWidth / 2 + targetPosition.width / 2;
    }

    return 0;
  }

  return 0;
};

function useScrollIntoView({
  duration = 400,
  axis = 'y',
  onScrollFinish,
  easing = easeInOutQuad,
  offset = 0,
  cancelable = true,
  isList = false,
}: ScrollIntoViewParams = {}) {
  const frameID = React.useRef(0);
  const startTime = React.useRef(0);
  const shouldStop = React.useRef(false);

  const cancel = (): void => {
    if (frameID.current) {
      cancelAnimationFrame(frameID.current);
    }
  };

  const scrollIntoView = React.useCallback(
    ({ alignment = 'start', parent, target }: ScrollIntoViewAnimation = {}) => {
      shouldStop.current = false;

      if (frameID.current) {
        cancel();
      }

      const start = getScrollStart({ parent, axis }) ?? 0;

      const change =
        getRelativePosition({
          parent,
          target,
          axis,
          alignment,
          offset,
          isList,
        }) - (parent ? 0 : start);

      function animateScroll() {
        if (startTime.current === 0) {
          startTime.current = performance.now();
        }

        const now = performance.now();
        const elapsed = now - startTime.current;

        // easing timing progress
        const t = duration === 0 ? 1 : elapsed / duration;

        const distance = start + change * easing(t);

        setScrollParam({
          parent,
          axis,
          distance,
        });

        if (!shouldStop.current && t < 1) {
          frameID.current = requestAnimationFrame(animateScroll);
        } else {
          onScrollFinish?.();
          startTime.current = 0;
          frameID.current = 0;
          cancel();
        }
      }
      animateScroll();
    },
    [axis, duration, easing, isList, offset, onScrollFinish],
  );

  const handleStop = () => {
    if (cancelable) {
      shouldStop.current = true;
    }
  };

  /**
   * detection of one of these events stops scroll animation
   * wheel - mouse wheel / touch pad
   * touchmove - any touchable device
   */
  useWindowEvent('wheel', handleStop, {
    passive: true,
  });

  useWindowEvent('touchmove', handleStop, {
    passive: true,
  });

  // cleanup requestAnimationFrame
  React.useEffect(() => cancel, []);

  return {
    scrollIntoView,
    cancel,
  };
}

export { useScrollIntoView };
export type { ScrollIntoViewAnimation };
