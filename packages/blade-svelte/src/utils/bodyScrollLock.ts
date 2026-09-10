/**
 * Ref-counted body scroll lock for overlays (Modal, BottomSheet).
 *
 * Replaces `body-scroll-lock-upgrade`. That library locks iOS by moving the
 * page into `body { position: fixed; top: -scrollY }` and restoring it with
 * `window.scrollTo()` on unlock. Both halves of that trick lose the reading
 * position: the offset is only correct when the window is the scroller, and
 * the `html { height: 100% }` it sets alongside collapses `height: 100%`
 * layout chains, clamping an inner scroll container to 0. Either way iOS jumps
 * to the top of the page as the overlay opens, while Android and desktop —
 * which take the library's `overflow: hidden` branch — behave correctly.
 *
 * Here iOS gets the same `overflow: hidden` bookkeeping as every other
 * platform, and background scrolling is blocked by intercepting `touchmove`
 * at the document instead. Nothing mutates page geometry, so scroll position
 * survives the lock.
 */

export type BodyScrollLockOptions = {
  /**
   * Pad the body by the width of the removed scrollbar so the page doesn't
   * shift horizontally on platforms with non-overlay scrollbars.
   */
  reserveScrollBarGap?: boolean;
  /** Opt an element out of touch interception (e.g. a nested scroller). */
  allowTouchMove?: (element: Element) => boolean;
};

type Lock = {
  target: HTMLElement;
  options: BodyScrollLockOptions;
};

const isIosDevice = (): boolean => {
  if (typeof window === 'undefined' || !window.navigator) return false;
  const { platform, maxTouchPoints, userAgent } = window.navigator;
  return (
    /iP(ad|hone|od)/.test(platform ?? '') ||
    /iP(ad|hone|od)/.test(userAgent ?? '') ||
    /* iPadOS reports itself as a Mac with a touchscreen. */
    (platform === 'MacIntel' && maxTouchPoints > 1)
  );
};

let locks: Lock[] = [];
/* Nested consumers can lock the same target more than once (a BottomSheet
 * effect re-running, a Modal inside a Modal); only the last unlock releases. */
const lockCounts = new Map<HTMLElement, number>();
let previousBodyOverflow: string | undefined;
let previousBodyPaddingRight: string | undefined;
let touchListenersAdded = false;
let initialClientY = -1;

const isTouchMoveAllowed = (element: Element | null): boolean => {
  if (!element) return false;
  return locks.some((lock) => lock.options.allowTouchMove?.(element));
};

const findLockedTarget = (element: Element | null): HTMLElement | null => {
  if (!element) return null;
  return locks.find((lock) => lock.target.contains(element))?.target ?? null;
};

/**
 * Nearest scrollable element between the touch target and the locked target
 * (inclusive). Consumers lock whichever node they own — BottomSheet locks its
 * body scroller, Modal locks the whole surface — so the element that actually
 * scrolls can sit anywhere in between.
 */
const findScroller = (element: Element | null, lockedTarget: HTMLElement): HTMLElement => {
  let node: Element | null = element;
  while (node) {
    if (node instanceof HTMLElement && node.scrollHeight > node.clientHeight) {
      const { overflowY } = window.getComputedStyle(node);
      if (overflowY === 'auto' || overflowY === 'scroll') return node;
    }
    if (node === lockedTarget) break;
    node = node.parentElement;
  }
  return lockedTarget;
};

const handleTouchStart = (event: TouchEvent): void => {
  if (event.touches.length !== 1) return;
  initialClientY = event.touches[0].clientY;
};

const handleTouchMove = (event: TouchEvent): void => {
  /* Leave pinch-zoom alone. */
  if (event.touches.length > 1) return;

  const target = event.target as Element | null;
  if (isTouchMoveAllowed(target)) return;

  const lockedTarget = findLockedTarget(target);
  if (!lockedTarget) {
    if (event.cancelable) event.preventDefault();
    return;
  }

  /* Inside a locked overlay: allow the scroll, but block it at the edges so
   * the gesture doesn't chain to the page behind. A non-scrollable overlay
   * falls back to the locked target, whose edges always match — every move is
   * blocked, which is what we want when there is nothing to scroll. */
  const scroller = findScroller(target, lockedTarget);
  const deltaY = event.touches[0].clientY - initialClientY;
  const isAtTop = scroller.scrollTop <= 0;
  const isAtBottom = scroller.scrollHeight - scroller.scrollTop <= scroller.clientHeight;
  if (((isAtTop && deltaY > 0) || (isAtBottom && deltaY < 0)) && event.cancelable) {
    event.preventDefault();
  }
};

const addTouchListeners = (): void => {
  if (touchListenersAdded || !isIosDevice()) return;
  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  touchListenersAdded = true;
};

const removeTouchListeners = (): void => {
  if (!touchListenersAdded) return;
  document.removeEventListener('touchstart', handleTouchStart);
  document.removeEventListener('touchmove', handleTouchMove);
  touchListenersAdded = false;
  initialClientY = -1;
};

const applyBodyStyles = (options: BodyScrollLockOptions): void => {
  const body = document.body;

  if (previousBodyPaddingRight === undefined && options.reserveScrollBarGap) {
    const scrollBarGap = window.innerWidth - document.documentElement.getBoundingClientRect().width;
    if (scrollBarGap > 0) {
      const computedPaddingRight =
        parseInt(window.getComputedStyle(body).getPropertyValue('padding-right'), 10) || 0;
      previousBodyPaddingRight = body.style.paddingRight;
      body.style.paddingRight = `${computedPaddingRight + scrollBarGap}px`;
    }
  }

  if (previousBodyOverflow === undefined) {
    previousBodyOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
  }
};

const restoreBodyStyles = (): void => {
  if (previousBodyPaddingRight !== undefined) {
    document.body.style.paddingRight = previousBodyPaddingRight;
    previousBodyPaddingRight = undefined;
  }
  if (previousBodyOverflow !== undefined) {
    document.body.style.overflow = previousBodyOverflow;
    previousBodyOverflow = undefined;
  }
};

/**
 * Lock page scrolling. `target` stays scrollable — pass the overlay's scroll
 * container.
 */
export function lockBodyScroll(
  target: HTMLElement | null,
  options: BodyScrollLockOptions = {},
): void {
  if (typeof document === 'undefined' || !target) return;

  lockCounts.set(target, (lockCounts.get(target) ?? 0) + 1);
  if (locks.some((lock) => lock.target === target)) return;

  locks = [...locks, { target, options }];
  applyBodyStyles(options);
  addTouchListeners();
}

/** Release one lock held on `target`. */
export function unlockBodyScroll(target: HTMLElement | null): void {
  if (typeof document === 'undefined' || !target) return;

  const nextCount = (lockCounts.get(target) ?? 0) - 1;
  if (nextCount > 0) {
    lockCounts.set(target, nextCount);
    return;
  }

  lockCounts.delete(target);
  locks = locks.filter((lock) => lock.target !== target);
  if (locks.length > 0) return;

  removeTouchListeners();
  restoreBodyStyles();
}

/** Release every lock — guards against leaks when overlays unmount abruptly. */
export function clearBodyScrollLocks(): void {
  if (typeof document === 'undefined') return;
  locks = [];
  lockCounts.clear();
  removeTouchListeners();
  restoreBodyStyles();
}
