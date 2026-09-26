import { untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { createVirtualWindow, type VirtualRange } from './window';

export interface VirtualOptions {
  /** One key per row, in order. Measured heights are remembered by key. */
  keys: () => readonly string[];
  /** Rows kept mounted beyond each edge of the viewport; read once. */
  overscan: () => number;
  /** A row that must be mounted; -1 for none. */
  reveal: () => number;
  /** The row the window opens scrolled to; read once at mount. -1 for the top. */
  startAt: () => number;
}

export interface Virtual {
  readonly range: VirtualRange;
  /** Re-reads the scroll position: on the viewport's `scroll`. */
  update(): void;
  /** Measures the mounted rows: on the window's `resize`. */
  measure(): void;
  /** On the scroll viewport. */
  readonly viewport: Attachment<HTMLElement>;
  /** On the element whose direct children are the rows. */
  readonly content: Attachment<HTMLElement>;
}

/**
 * The DOM half of a virtual list: scrolling, measuring and correcting.
 * What to mount and how tall the rest is predicted to be is the pure
 * `createVirtualWindow` model. Call during component initialisation.
 */
export function createVirtual(options: VirtualOptions): Virtual {
  const model = createVirtualWindow({ overscan: options.overscan() });

  let viewport = $state<HTMLElement>();
  let content = $state<HTMLElement>();
  let range = $state.raw<VirtualRange>({
    start: 0,
    end: 0,
    padTop: 0,
    padBottom: 0,
    total: 0,
  });

  function update() {
    const next = model.range(
      viewport?.scrollTop ?? 0,
      viewport?.clientHeight ?? 0
    );
    const current = untrack(() => range);
    if (
      next.start !== current.start ||
      next.end !== current.end ||
      next.padTop !== current.padTop ||
      next.padBottom !== current.padBottom
    ) {
      range = next;
    }
  }

  function measure() {
    if (!content) {
      return;
    }
    const keys = options.keys();
    const { start } = untrack(() => range);
    const sizes = Array.from(content.children, (row, i) => {
      return [
        keys[start + i] ?? '',
        (row as HTMLElement).getBoundingClientRect().height,
      ] as const;
    });
    const correction = model.measure(sizes);
    // Rows above turned out taller or shorter than predicted: keep what the
    // user is looking at in place. Browser scroll anchoring is off (Safari
    // has none), so this is the only correction.
    if (correction && viewport) {
      viewport.scrollTop += correction;
    }
    update();
  }

  $effect.pre(() => {
    model.setKeys(options.keys());
    update();
  });

  $effect(() => {
    const { start, end } = untrack(() => range);
    const reveal = options.reveal();
    if (reveal >= 0 && (reveal < start || reveal >= end) && viewport) {
      viewport.scrollTop = model.offset(reveal);
      update();
    }
  });

  // Once, when the viewport exists: scroll to where the opening row is
  // predicted to be. The slice mounted there is then measured, and the
  // correction keeps that row in place as the prediction settles.
  const opensAt = options.startAt();
  let opened = false;
  $effect(() => {
    if (opened || opensAt < 0 || !viewport) {
      return;
    }
    opened = true;
    viewport.scrollTop = model.offset(opensAt);
    update();
  });

  // After every render of a new slice: measure it, and watch it for late
  // changes (wrapping text, images). A notification measures on the next
  // frame, never inside the observer's callback: measuring can change the
  // slice and the padding, and a layout change while the browser is still
  // delivering notifications is the "ResizeObserver loop" error. Native has
  // no ResizeObserver; there the pass after each render, scroll and resize
  // has to do.
  $effect(() => {
    void range;
    void options.keys();
    measure();
    if (typeof ResizeObserver === 'undefined' || !content) {
      return undefined;
    }
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    });
    Array.from(content.children).forEach((row) => observer.observe(row));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  });

  return {
    get range() {
      return range;
    },
    update,
    measure,
    viewport(node) {
      viewport = node;
      return () => {
        viewport = undefined;
      };
    },
    content(node) {
      content = node;
      return () => {
        content = undefined;
      };
    },
  };
}
