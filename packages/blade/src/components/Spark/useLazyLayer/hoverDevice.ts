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
 * What a keyboard focus must land on to open the page-wide gate (useLazyLayer): something a keyboard user acts on. A text field
 * isn't: a tap on one is `:focus-visible` too (Chrome, Safari), and tapping a search box on a phone loaded every AI button's layer
 * (the second review)
 */
const ACTIONABLE = 'button, a[href], [role="button"]';

/**
 * `onReady()` once a Spark hover can start on a device that couldn't hover: it gains a pointer that can (a mouse plugged into a
 * tablet), a mouse or a pen moves on the page (a desktop that says it can't hover), or `button` is focused from a keyboard (now or
 * later; a tap's focus isn't). With `button` null, a keyboard focus on any button or link on the page will do (useLazyLayer:
 * before a layer is loaded there's no button to watch). Returns a stop.
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
  let hasPointerHover = false;
  const stop = (): void => {
    isWaiting = false;
    query?.removeEventListener?.('change', check);
    target.removeEventListener(type, check);
    window.removeEventListener('pointermove', onPointer);
  };
  function check(): void {
    const focused = document.activeElement;
    const isReady =
      hasPointerHover ||
      Boolean(query?.matches) ||
      (focused instanceof HTMLElement &&
        (button ? focused === button : focused.matches(ACTIONABLE)) &&
        isKeyboardFocused(focused));
    if (!isWaiting || !isReady) return;
    stop();
    onReady();
  }
  function onPointer(event: PointerEvent): void {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    hasPointerHover = true;
    check();
  }
  // (older Safari's MediaQueryList has no addEventListener: there, only the keyboard or a pointer starts it)
  query?.addEventListener?.('change', check);
  target.addEventListener(type, check);
  window.addEventListener('pointermove', onPointer, { passive: true });
  check();
  return stop;
};

export { isKeyboardFocused, canHover, whenHoverOrKeyboardFocus };
