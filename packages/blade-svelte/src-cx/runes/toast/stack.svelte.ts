import { onDestroy, untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { getLayers } from '../layer/layers';
import { isToastStackExpanded, layoutToastStack } from './stack-layout';
import type { ToastPlacement, ToastStackGeometry } from './stack-layout';
import type { ShowToastOptions, ToastEntry, Toasts, ToastsModel } from './toasts.svelte';

export interface ToastStackOptions<S extends object> {
  toasts: Toasts<S>;
  /** The stack's defaults, read once at mount. */
  capacity: () => number;
  duration: () => number;
  geometry: () => ToastStackGeometry;
  minShown: () => number;
}

/** The CSS variables a toast's wrapper reads; px, unitless. */
export interface ToastVars {
  '--toast-offset': number;
  '--toast-scale': number;
  '--toast-height': number | 'auto';
}

export interface ToastStack<S extends object> {
  readonly model: ToastsModel<ShowToastOptions<S>>;
  /** Oldest first; tracked by whatever reads it. */
  readonly entries: readonly ToastEntry<ShowToastOptions<S>>[];
  /** Laid out in full, or collapsed behind the front toast. */
  readonly isExpanded: boolean;
  /** The hover region's height, px: the front toast's, or the expanded stack's. */
  readonly hoverHeight: number;
  /** Where a toast sits; the newest is in front. */
  varsOf(id: number): ToastVars;
  /** Whether a toast is drawn: those deep behind a collapsed stack are not. */
  isShown(id: number): boolean;
  /** On the root: renders it into the LayerHost once there is a toast. */
  readonly root: Attachment<HTMLElement>;
  /** On a toast's wrapper: measures it once, at its first paint. */
  measure(id: number): Attachment<HTMLElement>;
  /** Reading a toast must not race its timer: hover or focus holds them all. */
  pause(): void;
  resume(): void;
  /** A mouse over the stack: expands it and holds the timers. */
  handlePointerEnter(event: PointerEvent): void;
  handlePointerLeave(event: PointerEvent): void;
  /** A tap (touch, pen) on the stack: toggles both. */
  handleClick(event: MouseEvent): void;
}

/**
 * Attaches the rendering stack to its queue for as long as it is mounted,
 * and lays its toasts out Blade's way: the newest in front at the edge, the
 * rest peeking behind it until the stack is held. Call during component
 * initialisation.
 */
export function createToastStack<S extends object>(options: ToastStackOptions<S>): ToastStack<S> {
  const layers = getLayers();
  const model = options.toasts.attach({
    capacity: options.capacity(),
    duration: options.duration(),
  });
  onDestroy(() => options.toasts.detach());

  // Measured once each, at first paint: a cropped toast reads a cropped
  // height, which must never overwrite its own.
  let heights = $state.raw<Record<number, number>>({});
  let isHeld = $state(false);

  // Front first: the model keeps the newest last.
  const order = $derived([...model.entries].reverse().map((entry) => entry.id));
  const isExpanded = $derived(
    isToastStackExpanded(order.length, isHeld, options.minShown()),
  );
  const placements = $derived.by(() => {
    const placed = layoutToastStack(
      order.map((id) => heights[id]),
      isExpanded,
      options.geometry(),
    );
    const byId: Record<number, ToastPlacement> = {};
    order.forEach((id, index) => {
      byId[id] = placed[index];
    });
    return byId;
  });
  const hoverHeight = $derived.by(() => {
    const gutter = options.geometry().gutter;
    const total = order.reduce((sum, id) => sum + (heights[id] ?? 0) + gutter, 0);
    return isExpanded ? total : heights[order[0]] ?? 0;
  });

  function hold(next: boolean): void {
    isHeld = next;
    if (next) {
      model.pause();
    } else {
      model.resume();
    }
  }

  return {
    model,
    get entries() {
      return model.entries;
    },
    get isExpanded() {
      return isExpanded;
    },
    get hoverHeight() {
      return hoverHeight;
    },
    // Stacking needs no variable: the toasts render oldest first, so the
    // newest paints over the ones behind it.
    varsOf(id) {
      const placed = placements[id];
      return {
        '--toast-offset': placed?.offset ?? 0,
        '--toast-scale': placed?.scale ?? 1,
        '--toast-height': placed?.height ?? 'auto',
      };
    },
    isShown: (id) => (placements[id]?.opacity ?? 1) === 1,
    // Into the LayerHost, so toasts stay inside its frame and over open
    // modals. Looked up when a toast shows: the host may mount after this.
    root(node) {
      const host = layers.host();
      if (model.entries.length && host && node.parentElement !== host) {
        host.appendChild(node);
      }
    },
    // Untracked: the attachment writes what it reads, and must run once.
    measure: (id) => (node) => {
      const measured = untrack(() => heights[id]);
      if (measured === undefined) {
        const height = node.offsetHeight;
        if (height) {
          heights = { ...untrack(() => heights), [id]: height };
        }
      }
      return () => {
        heights = Object.fromEntries(
          Object.entries(untrack(() => heights)).filter(([key]) => key !== String(id)),
        );
      };
    },
    pause: () => model.pause(),
    resume: () => model.resume(),
    // A mouse holds the stack while over it; a tap toggles it. By the
    // pointer, not the viewport: no breakpoint decides it.
    handlePointerEnter(event) {
      if (event.pointerType === 'mouse') {
        hold(true);
      }
    },
    handlePointerLeave(event) {
      if (event.pointerType === 'mouse') {
        hold(false);
      }
    },
    handleClick(event) {
      if ((event as PointerEvent).pointerType !== 'mouse') {
        hold(!isHeld);
      }
    },
  };
}
