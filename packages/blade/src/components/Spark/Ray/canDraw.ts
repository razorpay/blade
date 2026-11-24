// he's drawn on a canvas: where there's no real one (a server render, jsdom in unit tests) his box renders and nothing animates.
// Found out once per page (the PR review: not a canvas made for each Ray); every Ray asks
let isDrawable: boolean | null = null;
const canDraw = (): boolean => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  if (isDrawable === null) {
    try {
      isDrawable =
        !/jsdom/i.test(window.navigator.userAgent) &&
        Boolean(document.createElement('canvas').getContext('2d'));
    } catch {
      isDrawable = false;
    }
  }
  return isDrawable;
};

export { canDraw };
