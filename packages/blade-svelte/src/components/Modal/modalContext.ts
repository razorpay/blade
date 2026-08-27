import { getContext, setContext } from 'svelte';

/**
 * Reactive context shared between `Modal` (provider) and its sub-components
 * (`ModalHeader`, `ModalBody`, `ModalFooter`, `ModalBackdrop`).
 *
 * Mirrors React's `ModalContext`. Uses the getter pattern so the live state
 * object is read on each access and updates propagate automatically.
 */
export type ModalContextValue = {
  /** Marker — `true` whenever this context is provided. */
  isInsideModal: true;
  /** Live visibility state (`true` once the surface has begun fading in). */
  isOpen: boolean;
  /** Closes the modal (when `isDismissible`). */
  close: () => void;
  /** Mirrors `ModalProps.isDismissible`. */
  isDismissible: boolean;
  /**
   * Default focus target — the close button on first paint. Sub-components
   * (`ModalHeader`) register the close button via this setter so the parent's
   * `initialFocusRef` fallback can focus it on open.
   */
  setDefaultFocusElement: (element: HTMLElement | null) => void;
};

const MODAL_CONTEXT_KEY = Symbol('modal-context');

export function setModalContext(getter: () => ModalContextValue): void {
  setContext(MODAL_CONTEXT_KEY, getter);
}

export function getModalContext(): ModalContextValue | undefined {
  const getter = getContext<(() => ModalContextValue) | undefined>(MODAL_CONTEXT_KEY);
  return getter?.();
}
