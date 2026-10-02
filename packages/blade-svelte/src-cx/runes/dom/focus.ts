import type { Attachment } from 'svelte/attachments';

/**
 * Moves focus to the node whenever `active()` becomes true — the keyboard
 * arrived here (a roving tab stop), which also scrolls it into view.
 */
export function focusWhen(
  active: () => boolean,
  options: FocusOptions = {}
): Attachment<HTMLElement> {
  return (node) => {
    if (active()) {
      node.focus(options);
    }
  };
}

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/** The elements Tab can reach inside `container`, in DOM order. */
export function focusableWithin(container: HTMLElement): HTMLElement[] {
  // A roving group (radios, options) keeps one tab stop and marks the rest
  // `tabindex="-1"`: those take focus, but Tab does not reach them.
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) =>
      element.getAttribute('tabindex') !== '-1' && !element.closest('[inert]')
  );
}

/**
 * Where Tab must land to stay inside `container`, or null when the platform
 * default already does. Wraps at both ends; a container with nothing
 * focusable keeps focus on itself.
 */
export function trappedTabTarget(
  container: HTMLElement,
  active: Element | null,
  backwards: boolean
): HTMLElement | null {
  const focusable = focusableWithin(container);
  if (!focusable.length) {
    return container;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (!active || !container.contains(active) || active === container) {
    return backwards ? last : first;
  }
  if (backwards && active === first) {
    return last;
  }
  if (!backwards && active === last) {
    return first;
  }
  return null;
}

/**
 * Remembers what has focus now; the returned function hands focus back to
 * it when an overlay closes — unless focus already went somewhere on
 * purpose, outside `container`.
 */
export function captureFocusReturn(
  container: () => HTMLElement | undefined,
  options: FocusOptions = {}
): () => void {
  const returnTo = document.activeElement;
  return () => {
    const active = document.activeElement;
    const node = container();
    if (
      returnTo instanceof HTMLElement &&
      (!active || active === document.body || node?.contains(active))
    ) {
      returnTo.focus(options);
    }
  };
}
