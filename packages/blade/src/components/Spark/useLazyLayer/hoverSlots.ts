import { whyCantAnimate } from '../RazorSenseEngine';
import { canHover, isKeyboardFocused, whenHoverOrKeyboardFocus } from './hoverDevice';

/**
 * Which Spark button hovers (Button's aiHover) may hold their canvases now. A browser keeps only so many WebGL
 * contexts on a page (Chrome 16) and drops the oldest past that, so a hover's canvases are made only while the pointer is on or
 * near its button, and let go once it has moved away and the hover has faded out: a page of them holds a few at most, whatever
 * its size (the PR review: 24 buttons made 24 contexts at load, and 8 lost their hover for good).
 *
 * Held: the button the pointer is on, at once; the one it's heading for (within APPROACH px, off any button, closing in fast
 * enough to get there within ARRIVE_MS), so its first frame is ready when it arrives (a pointer moving straight onto a button
 * never stops next to it: held only on entry, its first frame came 44-127 ms after, the PR review); one it has stopped next to
 * (within NEAR px, for DWELL ms); and any already held while the pointer stays within FAR px of it (back and forth between
 * neighbours makes nothing new). A pointer passing near buttons, or resting on one, doesn't make its neighbours'
 * canvases: every canvas made and let go is GPU work, and Safari counts it against its limit till it's cleaned up. At most
 * MAX_HELD are held at once, those the pointer is closest to (a hover still running or fading first). Touch has no hover: only a
 * mouse or a pen counts. A button focused from the keyboard plays its hover as a hovered one does, so it's held as the one the
 * pointer is on, wherever the pointer is, once it has kept focus FOCUS_DWELL ms (Tab held down a long table passes a row every
 * ~30 ms: it made and freed a canvas per row; the PR review).
 */
const NEAR = 48;
const FAR = 96;
const DWELL = 120;
const APPROACH = 96;
const ARRIVE_MS = 250;
/** the slowest closing speed that counts as heading for a button (px/ms): drifting past doesn't */
const MIN_CLOSING = 0.08;
const MAX_HELD = 3;
/** how long a button keeps keyboard focus before it's held (ms) */
const FOCUS_DWELL = 60;

type Slot = {
  element: HTMLElement;
  /** its hover is running or fading out: it isn't let go meanwhile */
  isBusy: () => boolean;
  /** told when it may make its canvases (true) and when it must let them go (false) */
  onHold: (isHeld: boolean) => void;
  isHeld: boolean;
  /** held, but its button not told yet: told in a task of its own (handOver) */
  isHandingOver: boolean;
  /** focused from the keyboard: held as the button the pointer is on, once it has kept focus FOCUS_DWELL ms */
  isFocused: boolean;
  /** since when (0: it isn't focused) */
  focusedSince: number;
  distance: number;
  /** since when the pointer has been within NEAR of it, off every button (0: it isn't) */
  nearSince: number;
  /** its distance at the last check, for how fast the pointer is closing in (Infinity: not known) */
  lastDistance: number;
};

type HoverSlot = {
  /**
   * its state changed (its hover faded out, the pointer came onto it): looked at again on the next frame. `at`, the pointer's
   * position (clientX, clientY) when it's known from the button's own event: the pointer can come onto a button without moving
   * (the page scrolled under it), and a hover is held from where the pointer is
   */
  update: (at?: [number, number]) => void;
  /** focused from the keyboard (true) or not any more (false): held meanwhile, as the button the pointer is on */
  focus: (isFocused: boolean) => void;
  /** let go, for good (its button is going, off screen, or its hover is off) */
  remove: () => void;
};

const slots = new Set<Slot>();
let pointer: [number, number] | null = null;
let frame = 0;
/** the slots held but not told yet, told one a task (handOver) */
const handing: Slot[] = [];
let handTimer = 0;
let dwellTimer = 0;
let focusTimer = 0;
let lastCheckAt = 0;

const distanceTo = (element: HTMLElement, [x, y]: [number, number]): number => {
  const r = element.getBoundingClientRect();
  return Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));
};

/** its button told it may make its canvases: the next held one, a task each (a frame can be drawn between two) */
const handOver = (): void => {
  handTimer = 0;
  const slot = handing.shift();
  if (slot?.isHandingOver) {
    slot.isHandingOver = false;
    slot.onHold(true);
  }
  if (handing.length) handTimer = window.setTimeout(handOver, 0);
};

/** let go: told at once (one not told it was held yet is just taken off the list) */
const letGo = (slot: Slot): void => {
  slot.isHeld = false;
  if (slot.isHandingOver) {
    slot.isHandingOver = false;
    handing.splice(handing.indexOf(slot), 1);
    return;
  }
  slot.onHold(false);
};

const check = (): void => {
  frame = 0;
  window.clearTimeout(dwellTimer);
  dwellTimer = 0;
  window.clearTimeout(focusTimer);
  focusTimer = 0;
  const at = pointer;
  const now = performance.now();
  // focused from the keyboard for long enough (a focus passing through, Tab held down, holds nothing)
  const isFocusHeld = (slot: Slot): boolean =>
    slot.isFocused && now - slot.focusedSince >= FOCUS_DWELL;
  const focusWait = Math.min(
    Infinity,
    ...[...slots]
      .filter((slot) => slot.isFocused && !isFocusHeld(slot))
      .map((slot) => FOCUS_DWELL - (now - slot.focusedSince)),
  );
  // (looked at again once a focus has lasted)
  if (Number.isFinite(focusWait))
    focusTimer = window.setTimeout(() => {
      if (!frame) frame = requestAnimationFrame(check);
    }, focusWait + 1);
  // (a long gap since the last check: the closing speed isn't known)
  const sinceLast = lastCheckAt && now - lastCheckAt < 200 ? now - lastCheckAt : 0;
  lastCheckAt = now;
  let isOnOne = false;
  slots.forEach((slot) => {
    slot.distance = at ? distanceTo(slot.element, at) : Infinity;
    if (slot.distance === 0) isOnOne = true;
  });
  const wanted: Slot[] = [];
  slots.forEach((slot) => {
    // (near, and off every button: on one, its neighbours wait)
    slot.nearSince = !isOnOne && slot.distance <= NEAR ? slot.nearSince || now : 0;
    if (
      slot.isBusy() ||
      isFocusHeld(slot) ||
      slot.distance === 0 ||
      (slot.isHeld && slot.distance <= FAR)
    ) {
      wanted.push(slot);
    }
  });
  // the one it's heading for: the soonest to be reached of those it's closing in on
  const heading = isOnOne
    ? null
    : [...slots]
        // (all of them: when the one it's heading for is already held, no other is)
        .filter((slot) => slot.distance > 0 && slot.distance <= APPROACH)
        .map((slot) => ({
          slot,
          // (a slot new since the last check, or a pointer that had no place: no distance to close from yet)
          closing:
            sinceLast && Number.isFinite(slot.lastDistance)
              ? (slot.lastDistance - slot.distance) / sinceLast
              : 0,
        }))
        .filter(
          ({ closing, slot }) => closing >= MIN_CLOSING && slot.distance / closing <= ARRIVE_MS,
        )
        .sort((a, b) => a.slot.distance / a.closing - b.slot.distance / b.closing)[0]?.slot;
  if (heading && !wanted.includes(heading)) wanted.push(heading);
  slots.forEach((slot) => {
    slot.lastDistance = slot.distance;
  });
  // the one the pointer has stopped next to, once it has stayed there a moment
  const next = [...slots]
    .filter((slot) => slot.nearSince && !wanted.includes(slot))
    .sort((a, b) => a.distance - b.distance)[0];
  if (next) {
    const waited = now - next.nearSince;
    if (waited >= DWELL) wanted.push(next);
    else {
      // (looked at again once it has: the pointer may not move meanwhile)
      dwellTimer = window.setTimeout(() => {
        if (!frame) frame = requestAnimationFrame(check);
      }, DWELL - waited + 1);
    }
  }
  // past MAX_HELD: the one the pointer is on (or focused from the keyboard) first (a quick pass over three left them fading, and
  // the fourth, hovered, got none; the PR review), then those still running or fading, then the nearest
  const isOn = (slot: Slot): number => Number(slot.distance === 0 || isFocusHeld(slot));
  const held = new Set(
    wanted
      .sort(
        (a, b) =>
          isOn(b) - isOn(a) || Number(b.isBusy()) - Number(a.isBusy()) || a.distance - b.distance,
      )
      .slice(0, MAX_HELD),
  );
  // let go first, here, then hold: a context freed before the next is made. A hold is told in a task of its own, not in this frame's
  // callback: making a stage is the costly part of a hover's start (100-160 ms frames on a Windows laptop's Direct3D, the device
  // test), and the frame that saw the pointer move is drawn first
  slots.forEach((slot) => {
    if (slot.isHeld && !held.has(slot)) letGo(slot);
  });
  held.forEach((slot) => {
    if (!slot.isHeld) {
      slot.isHeld = true;
      slot.isHandingOver = true;
      handing.push(slot);
    }
  });
  if (handing.length && !handTimer) handTimer = window.setTimeout(handOver, 0);
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
  const slot: Slot = {
    element,
    isBusy,
    onHold,
    isHeld: false,
    isHandingOver: false,
    isFocused: false,
    focusedSince: 0,
    distance: Infinity,
    nearSince: 0,
    lastDistance: Infinity,
  };
  if (!slots.size) listen(true);
  slots.add(slot);
  schedule();
  return {
    update: (at) => {
      if (at) pointer = at;
      schedule();
    },
    focus: (isFocused) => {
      if (isFocused === slot.isFocused) return;
      slot.isFocused = isFocused;
      slot.focusedSince = isFocused ? performance.now() : 0;
      schedule();
    },
    remove: () => {
      if (!slots.delete(slot)) return;
      if (slot.isHeld) letGo(slot);
      if (!slots.size) {
        listen(false);
        cancelAnimationFrame(frame);
        frame = 0;
        window.clearTimeout(dwellTimer);
        dwellTimer = 0;
        window.clearTimeout(focusTimer);
        focusTimer = 0;
        window.clearTimeout(handTimer);
        handTimer = 0;
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

type KeyboardFocus = {
  /** focused from the keyboard now */
  isFocused: () => boolean;
  /** stops following it */
  stop: () => void;
};

/**
 * Keyboard focus on a button with a Spark hover: it plays the hover as hovering does. `onChange(true)` as the button is focused
 * from the keyboard (`:focus-visible`: a click's focus isn't, that hover is the pointer's), `onChange(false)` as that focus goes;
 * its slot is held meanwhile. A button already focused from the keyboard (before its hover's code was in) is told at once.
 */
const followKeyboardFocus = (
  button: HTMLElement,
  slot: HoverSlot,
  onChange: (isFocused: boolean) => void,
): KeyboardFocus => {
  let isFocused = false;
  const set = (next: boolean): void => {
    isFocused = next;
    slot.focus(next);
    onChange(next);
  };
  const onFocus = (): void => {
    if (isKeyboardFocused(button)) set(true);
  };
  const onBlur = (): void => {
    if (isFocused) set(false);
  };
  button.addEventListener('focus', onFocus);
  button.addEventListener('blur', onBlur);
  if (document.activeElement === button) onFocus();
  return {
    isFocused: () => isFocused,
    stop: () => {
      button.removeEventListener('focus', onFocus);
      button.removeEventListener('blur', onBlur);
    },
  };
};

export { holdNearPointer, canPlayHover, canHover, whenHoverOrKeyboardFocus, followKeyboardFocus };
export type { HoverSlot, KeyboardFocus };
