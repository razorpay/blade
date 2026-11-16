/**
 * The glow of a RazorSense 2.0 component spills past its box (its canvas is bigger than what it wraps). Chrome and Safari leave
 * a layout-contained box's spill out of scrolling (`contain: layout`), so it never adds scrollbars; Firefox counts it. There, the
 * spilling box is cut to what its scroll container already holds: the glow shows wherever the page already is, and stops at its
 * edges instead of growing it.
 */

type Rect = { left: number; top: number; width: number; height: number };

let spillScrolls: boolean | null = null;

/** whether this browser lets a layout-contained box's spill grow its scroll container (checked once, on a hidden probe) */
const doesSpillScroll = (): boolean => {
  if (spillScrolls !== null) return spillScrolls;
  if (typeof document === 'undefined' || !document.body) return false;
  const scroller = document.createElement('div');
  scroller.style.cssText =
    'position:absolute;left:-9999px;top:0;width:40px;height:40px;overflow:auto;visibility:hidden;pointer-events:none;';
  scroller.innerHTML =
    '<div style="position:relative;contain:layout;width:10px;height:10px"><div style="position:absolute;width:200px;height:200px"></div></div>';
  document.body.appendChild(scroller);
  spillScrolls = scroller.scrollWidth > 40 || scroller.scrollHeight > 40;
  scroller.remove();
  return spillScrolls;
};

/** the nearest ancestor that scrolls or clips (or the page) */
const scrollerOf = (el: HTMLElement): HTMLElement => {
  for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
    const style = getComputedStyle(p);
    if (/(auto|scroll|hidden|clip)/.test(`${style.overflowX} ${style.overflowY}`)) return p;
  }
  return (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
};

/**
 * Lays `box` (absolutely placed in its offset parent) at `want`, in CSS px from that parent's top-left. Where its spill would
 * grow the scroll container (Firefox), it's cut to what that container already holds. Returns how far its top-left moved in
 * (0, 0 when nothing was cut), for whatever is drawn in it to move back by.
 */
const placeSpill = (box: HTMLElement, want: Rect): [number, number] => {
  const set = (r: Rect): void => {
    box.style.left = `${r.left}px`;
    box.style.top = `${r.top}px`;
    box.style.width = `${Math.max(0, r.width)}px`;
    box.style.height = `${Math.max(0, r.height)}px`;
  };
  const parent = box.offsetParent as HTMLElement | null;
  if (!doesSpillScroll() || !parent) {
    set(want);
    return [0, 0];
  }
  const scroller = scrollerOf(box);
  const isPage = scroller === document.scrollingElement || scroller === document.documentElement;
  // what the scroller holds without this box (hidden while it's measured)
  const display = box.style.display;
  box.style.display = 'none';
  const extent = [scroller.scrollWidth, scroller.scrollHeight];
  const s = isPage ? null : scroller.getBoundingClientRect();
  box.style.display = display;
  // its content's top-left, on screen
  const x0 = isPage ? -window.scrollX : s!.left + scroller.clientLeft - scroller.scrollLeft;
  const y0 = isPage ? -window.scrollY : s!.top + scroller.clientTop - scroller.scrollTop;
  const p = parent.getBoundingClientRect();
  const left = Math.max(p.left + want.left, x0);
  const top = Math.max(p.top + want.top, y0);
  const right = Math.min(p.left + want.left + want.width, x0 + extent[0]);
  const bottom = Math.min(p.top + want.top + want.height, y0 + extent[1]);
  const cut: [number, number] = [left - (p.left + want.left), top - (p.top + want.top)];
  set({
    left: want.left + cut[0],
    top: want.top + cut[1],
    width: right - left,
    height: bottom - top,
  });
  return cut;
};

/**
 * Calls `place` again whenever what it depends on may have moved: the component's box or its scroll container resizing, the
 * window resizing, or the container's content changing. Only where the spill scrolls (Firefox); elsewhere it's placed once, by
 * its own CSS. Returns a function that stops it.
 */
const watchSpill = (box: HTMLElement, place: () => void): (() => void) => {
  if (!doesSpillScroll() || typeof ResizeObserver === 'undefined') return () => undefined;
  let frame = 0;
  const again = (): void => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      place();
    });
  };
  const scroller = scrollerOf(box);
  const resize = new ResizeObserver(again);
  if (box.offsetParent) resize.observe(box.offsetParent);
  resize.observe(scroller);
  const content = typeof MutationObserver === 'undefined' ? null : new MutationObserver(again);
  content?.observe(scroller, { childList: true, subtree: true });
  window.addEventListener('resize', again);
  again();
  return () => {
    cancelAnimationFrame(frame);
    resize.disconnect();
    content?.disconnect();
    window.removeEventListener('resize', again);
  };
};

export { doesSpillScroll, placeSpill, watchSpill };
export type { Rect };
