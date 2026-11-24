/**
 * What a device can do for the Spark button hovers, read before any of their code loads (useLazyLayer is in the page's own
 * bundle, so this imports nothing of the engine): whether something here can hover, and keyboard focus.
 */
/** focused from the keyboard (`:focus-visible`): a click's or a tap's focus isn't */
const isKeyboardFocused = (button: HTMLElement): boolean => {
  try {
    return button.matches(':focus-visible');
  } catch {
    return false;
  }
};

const hoverQuery = (): MediaQueryList | null =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(any-hover: hover)')
    : null;

/**
 * Whether anything on this device can hover (a mouse, a trackpad, a pen). A phone, or a tablet on touch alone, can't: no Spark
 * hover can play there, so nothing of it is probed (WebGL2) or downloaded (its engine and comps, Ray and his film) until the button
 * is focused from a keyboard (a tablet's; the PR review: every AI button on a phone downloaded it all for nothing). Not known (no
 * matchMedia): it can.
 */
const canHover = (): boolean => hoverQuery()?.matches ?? true;

/**
 * `onReady()` once a Spark hover can start on a device that couldn't hover: it gains a pointer that can (a mouse plugged into a
 * tablet), or `button` is focused from a keyboard (now or later; a tap's focus isn't). With `button` null, a keyboard focus
 * anywhere on the page will do (useLazyLayer: before a layer is loaded there's no button to watch). Returns a stop.
 */
const whenHoverOrKeyboardFocus = (
  button: HTMLElement | null,
  onReady: () => void,
): (() => void) => {
  const query = hoverQuery();
  // (a button's own focus, or any focus on the page: focusin bubbles)
  const target: EventTarget = button ?? document;
  const type = button ? 'focus' : 'focusin';
  let isWaiting = true;
  const check = (): void => {
    const focused = document.activeElement;
    const isReady =
      Boolean(query?.matches) ||
      (focused instanceof HTMLElement &&
        (!button || focused === button) &&
        isKeyboardFocused(focused));
    if (!isWaiting || !isReady) return;
    isWaiting = false;
    query?.removeEventListener?.('change', check);
    target.removeEventListener(type, check);
    onReady();
  };
  // (older Safari's MediaQueryList has no addEventListener: there, only the keyboard starts it)
  query?.addEventListener?.('change', check);
  target.addEventListener(type, check);
  check();
  return () => {
    isWaiting = false;
    query?.removeEventListener?.('change', check);
    target.removeEventListener(type, check);
  };
};

export { isKeyboardFocused, canHover, whenHoverOrKeyboardFocus };
