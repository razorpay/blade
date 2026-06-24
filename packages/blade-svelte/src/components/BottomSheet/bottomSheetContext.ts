import { getContext, setContext } from 'svelte';

/**
 * Reactive context shared between `BottomSheet` (provider) and its sub-
 * components (`BottomSheetHeader`, `BottomSheetBody`, `BottomSheetFooter`).
 *
 * Mirrors React's `BottomSheetContext`. Values surfaced here are the running
 * state of the sheet (`isOpen`, `isHeaderFloating`), measured heights,
 * setters used by sub-components to report their measured size, and the
 * `close` callback fired from the close button / backdrop / swipe-down.
 */
export type BottomSheetContextValue = {
  /** Marker — `true` whenever this context is provided. */
  isInBottomSheet: true;
  /** Live open state (`true` once the surface has begun fading in). */
  isOpen: boolean;
  /** Closes the sheet (when `isDismissible`). */
  close: () => void;
  /**
   * Whether the empty header should float above the body — happens when the
   * header has no content and the body has zero padding (e.g. video banner).
   */
  isHeaderFloating: boolean;
  /** Mirrors `BottomSheetProps.isDismissible`. */
  isDismissible: boolean;
  /** Setter for the body's measured content height. */
  setContentHeight: (height: number) => void;
  /** Setter for the header's measured height. */
  setHeaderHeight: (height: number) => void;
  /** Setter for the footer's measured height. */
  setFooterHeight: (height: number) => void;
  /** Reports whether the body has zero padding (drives header float logic). */
  setHasBodyPadding: (hasPadding: boolean) => void;
  /** Reports whether the header is empty (drives close-button rendering). */
  setIsHeaderEmpty: (isEmpty: boolean) => void;
  /** Reports the body's scroll element so the parent can wire scroll-lock. */
  setScrollElement: (element: HTMLElement | null) => void;
  /**
   * Default focus target — the close button on first paint. Sub-components
   * (e.g. `BottomSheetHeader`) register the close button via this setter so
   * the parent's `initialFocusElement` fallback can focus it on open.
   */
  setDefaultFocusElement: (element: HTMLElement | null) => void;
};

const BOTTOM_SHEET_CONTEXT_KEY = Symbol('bottom-sheet-context');

export function setBottomSheetContext(getter: () => BottomSheetContextValue): void {
  setContext(BOTTOM_SHEET_CONTEXT_KEY, getter);
}

export function getBottomSheetContext(): BottomSheetContextValue | undefined {
  const getter = getContext<(() => BottomSheetContextValue) | undefined>(BOTTOM_SHEET_CONTEXT_KEY);
  return getter?.();
}
