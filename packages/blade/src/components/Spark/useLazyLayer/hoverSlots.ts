import { whyCantAnimate } from '../RazorSenseEngine';

/**
 * Which Spark button hovers (Button's aiHover) may hold their canvases now. A browser keeps only so many WebGL
 * contexts on a page (Chrome 16) and drops the oldest past that, so a hover's canvases are made only while the pointer is on or
 * near its button, and let go once it has moved away and the hover has faded out: a page of them holds a few at most, whatever
 * its size (the PR review: 24 buttons made 24 contexts at load, and 8 lost their hover for good).
 *
 * Near: within NEAR px of the button (its canvases made a moment before the pointer gets there, so the first frame isn't
 * late), kept till it's FAR px away. At most MAX_HELD are held at once, those the pointer is closest to (a hover still running
 * or fading first). Touch has no hover: only a mouse or a pen counts.
 */
const NEAR = 48;
const FAR = 96;
const MAX_HELD = 3;

type Slot = {
  element: HTMLElement;
  /** its hover is running or fading out: it isn't let go meanwhile */
  isBusy: () => boolean;
  /** told when it may make its canvases (true) and when it must let them go (false) */
  onHold: (isHeld: boolean) => void;
  isNear: boolean;
  isHeld: boolean;
  distance: number;
};

type HoverSlot = {
  /**
   * its state changed (its hover faded out, the pointer came onto it): looked at again on the next frame. `at`, the pointer's
   * position (clientX, clientY) when it's known from the button's own event: the pointer can come onto a button without moving
   * (the page scrolled under it), and a hover is held from where the pointer is
   */
  update: (at?: [number, number]) => void;
  /** let go, for good (its button is going, off screen, or its hover is off) */
  remove: () => void;
};

const slots = new Set<Slot>();
let pointer: [number, number] | null = null;
let frame = 0;

const distanceTo = (element: HTMLElement, [x, y]: [number, number]): number => {
  const r = element.getBoundingClientRect();
  return Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));
};

const check = (): void => {
  frame = 0;
  const at = pointer;
  const wanted: Slot[] = [];
  slots.forEach((slot) => {
    slot.distance = at ? distanceTo(slot.element, at) : Infinity;
    slot.isNear = slot.distance <= (slot.isNear ? FAR : NEAR);
    if (slot.isNear || slot.isBusy()) wanted.push(slot);
  });
  const held = new Set(
    wanted
      .sort((a, b) => Number(b.isBusy()) - Number(a.isBusy()) || a.distance - b.distance)
      .slice(0, MAX_HELD),
  );
  // let go first, then hold: a context freed before the next is made
  slots.forEach((slot) => {
    if (slot.isHeld && !held.has(slot)) {
      slot.isHeld = false;
      slot.onHold(false);
    }
  });
  held.forEach((slot) => {
    if (!slot.isHeld) {
      slot.isHeld = true;
      slot.onHold(true);
    }
  });
};

const schedule = (): void => {
  if (!frame) frame = requestAnimationFrame(check);
};

const onPointerMove = (event: PointerEvent): void => {
  if (event.pointerType === 'touch') return;
  pointer = [event.clientX, event.clientY];
  schedule();
};

const onPointerLeave = (): void => {
  pointer = null;
  schedule();
};

const listen = (isOn: boolean): void => {
  const method = isOn ? 'addEventListener' : 'removeEventListener';
  window[method]('pointermove', onPointerMove as EventListener, { passive: true });
  // a scroll (any scroller) or a resize moves the buttons under a still pointer
  window[method]('scroll', schedule, { capture: true, passive: true });
  window[method]('resize', schedule, { passive: true });
  document.documentElement[method]('pointerleave', onPointerLeave);
};

/**
 * A button's hover joins the page's slots: `onHold(true)` when it may make its canvases, `onHold(false)` when it must let them go
 * (never while `isBusy`, unless more hovers are running than may be held).
 */
const holdNearPointer = (
  element: HTMLElement,
  { isBusy, onHold }: Pick<Slot, 'isBusy' | 'onHold'>,
): HoverSlot => {
  const slot: Slot = { element, isBusy, onHold, isNear: false, isHeld: false, distance: Infinity };
  if (!slots.size) listen(true);
  slots.add(slot);
  schedule();
  return {
    update: (at) => {
      if (at) pointer = at;
      schedule();
    },
    remove: () => {
      if (!slots.delete(slot)) return;
      if (slot.isHeld) {
        slot.isHeld = false;
        slot.onHold(false);
      }
      if (!slots.size) {
        listen(false);
        cancelAnimationFrame(frame);
        frame = 0;
        pointer = null;
      }
    },
  };
};

/**
 * Whether a Spark hover can play here at all: not with reduced motion, without a GPU drawing WebGL2, or once an animation on this
 * page was too slow. Where it can't, nothing of it is loaded or made: the button keeps its own hover.
 */
const canPlayHover = (): boolean =>
  !(
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) && !whyCantAnimate();

export { holdNearPointer, canPlayHover };
export type { HoverSlot };
