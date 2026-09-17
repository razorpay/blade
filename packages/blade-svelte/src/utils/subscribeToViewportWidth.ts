/**
 * Subscribe to viewport width changes with rAF-coalesced resize handling.
 * Returns an unsubscribe function for use in `onMount` cleanup.
 */
export const subscribeToViewportWidth = (onWidthChange: (width: number) => void): (() => void) => {
  onWidthChange(window.innerWidth);

  let resizeRaf = 0;
  const onResize = (): void => {
    if (resizeRaf) {
      return;
    }
    resizeRaf = requestAnimationFrame(() => {
      onWidthChange(window.innerWidth);
      resizeRaf = 0;
    });
  };

  window.addEventListener('resize', onResize);

  return () => {
    if (resizeRaf) {
      cancelAnimationFrame(resizeRaf);
    }
    window.removeEventListener('resize', onResize);
  };
};
