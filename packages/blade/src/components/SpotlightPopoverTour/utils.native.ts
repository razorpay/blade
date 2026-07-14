/**
 * Native platform entry for `./utils` (moduleSuffixes: .native).
 *
 * Provides measure/visibility/scroll helpers and re-exports shared tour hooks.
 * Web-only DOM helpers are stubbed so that Tour.web.tsx (pulled into native
 * typecheck via ssr tests) still resolves named exports under native suffixes.
 */
import type React from 'react';

export { useDelayedState, useIsTransitioningBetweenSteps } from './tourHooks';
export {
  measureStepRect,
  isRectVisibleInWindow,
  hasRoomForPopoverPlacement,
  findScrollableAncestor,
  scrollStepIntoView,
  useTourScrollLock,
  waitUntilPositionStable,
} from './tourNativeUtils';
export type { Rect, ScrollableInstance } from './tourNativeUtils';

/** @internal web-only — stubbed for native typecheck of shared imports */
function smoothScroll(
  _element: Element | null,
  _options: ScrollIntoViewOptions,
): Promise<null> {
  return Promise.resolve(null);
}

/** @internal web-only — stubbed for native typecheck of shared imports */
function useIntersectionObserver(
  _elementRef: React.RefObject<Element>,
  _options: IntersectionObserverInit,
): IntersectionObserverEntry | undefined {
  return undefined;
}

/** @internal web-only — stubbed for native typecheck of shared imports */
const useLockBodyScroll = (_shouldLock: boolean): void => {
  // no-op — native uses useTourScrollLock
};

export { smoothScroll, useIntersectionObserver, useLockBodyScroll };
