type LayoutWatch = {
  /** the component's root: its size and everything in it (content, styles) */
  root: Element;
  /** elements inside it whose size matters too, read again on every change (parts come and go) */
  getParts?: () => (Element | null)[];
  /** changes under these don't count (what the component draws itself) */
  ignore?: (node: Node) => boolean;
  /** called (once a frame at most) when what's drawn may need to move */
  onChange: () => void;
};

/**
 * Calls `onChange` whenever the layout under a RazorSense drawing may have moved without it knowing: `root` or one of its parts
 * resizing, a scroll anywhere, the window resizing, or `root`'s content or styles changing. For what's placed once and
 * otherwise sits still (stills, a reduced-motion frame), instead of measuring every frame. Returns the function that stops it.
 */
const watchLayout = ({ root, getParts, ignore, onChange }: LayoutWatch): (() => void) => {
  let rafId = 0;
  let resize: ResizeObserver | null = null;
  const watched = new Set<Element>();
  const watch = (element: Element | null): void => {
    if (!element || watched.has(element)) return;
    watched.add(element);
    resize?.observe(element);
  };
  const run = (): void => {
    rafId = 0;
    getParts?.().forEach(watch);
    onChange();
  };
  const again = (): void => {
    if (!rafId) rafId = requestAnimationFrame(run);
  };
  resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(again);
  watch(root);
  getParts?.().forEach(watch);
  const content =
    typeof MutationObserver === 'undefined'
      ? null
      : new MutationObserver((records) => {
          if (records.some((record) => !ignore?.(record.target))) again();
        });
  content?.observe(root, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['style', 'class'],
  });
  document.addEventListener('scroll', again, { capture: true, passive: true });
  window.addEventListener('resize', again);
  return () => {
    cancelAnimationFrame(rafId);
    resize?.disconnect();
    content?.disconnect();
    document.removeEventListener('scroll', again, { capture: true });
    window.removeEventListener('resize', again);
  };
};

export { watchLayout };
export type { LayoutWatch };
