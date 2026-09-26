import { onDestroy, untrack } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { getLayers } from '../layer/layers';
import {
  isToastStackExpanded,
  layoutToastStack,
  type ToastPlacement,
  type ToastStackGeometry,
} from './stack-layout';
import type {
  ShowToastOptions,
  ToastEntry,
  Toasts,
  ToastsModel,
} from './toasts.svelte';

export interface ToastStackOptions<S extends object> {
  toasts: Toasts<S>;
  /** The stack's defaults, read once at mount. */
  capacity: () => number;
  duration: () => number;
  geometry: () => ToastStackGeometry;
  minShown: () => { phone: number; desktop: number };
  /** Where a tap, not a hover, holds the stack. */
  phoneMedia: () => string;
}

/** The CSS variables a toast's wrapper reads; px, unitless. */
export interface ToastVars {
  '--toast-offset': number;
  '--toast-scale': number;
  '--toast-opacity': number;
  '--toast-z': number;
  '--toast-height': number | 'auto';
}

export interface ToastStack<S extends object> {
  readonly model: ToastsModel<ShowToastOptions<S>>;
  /** Oldest first; tracked by whatever reads it. */
  readonly entries: readonly ToastEntry<ShowToastOptions<S>>[];
  /** Laid out in full, or collapsed behind the front toast. */
  readonly isExpanded: boolean;
  /** The hover region's `--hover-bottom` and `--hover-height`, px. */
  readonly hoverVars: { '--hover-bottom': number; '--hover-height': number };
  /** Where a toast sits; the newest is in front. */
  varsOf(id: number): ToastVars;
  /** On the root: renders it into the LayerHost once there is a toast. */
  readonly root: Attachment<HTMLElement>;
  /** On a toast's wrapper: measures it once, at its first paint. */
  measure(id: number): Attachment<HTMLElement>;
  /** Reading a toast must not race its timer: hover or focus holds them all. */
  pause(): void;
  resume(): void;
  /** A pointer over the stack (desktop): expands it and holds the timers. */
  handlePointerEnter(): void;
  handlePointerLeave(): void;
  /** A tap on the stack (phone): toggles both. */
  handleClick(): void;
}

/**
 * Attaches the rendering stack to its queue for as long as it is mounted,
 * and lays its toasts out Blade's way: the newest in front at the edge, the
 * rest peeking behind it until the stack is held. Call during component
 * initialisation.
 */
export function createToastStack<S extends object>(
  options: ToastStackOptions<S>
): ToastStack<S> {
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
  let isPhone = $state(false);

  const query =
    typeof matchMedia === 'function'
      ? matchMedia(options.phoneMedia())
      : undefined;
  if (query) {
    isPhone = query.matches;
    const follow = (event: MediaQueryListEvent) => {
      isPhone = event.matches;
    };
    query.addEventListener?.('change', follow);
    onDestroy(() => query.removeEventListener?.('change', follow));
  }

  // Front first: the model keeps the newest last.
  const order = $derived([...model.entries].reverse().map((entry) => entry.id));
  const isExpanded = $derived(
    isToastStackExpanded(
      order.length,
      isHeld,
      isPhone ? options.minShown().phone : options.minShown().desktop
    )
  );
  const placements = $derived.by(() => {
    const placed = layoutToastStack(
      order.map((id) => heights[id]),
      isExpanded,
      options.geometry()
    );
    const byId: Record<number, ToastPlacement> = {};
    order.forEach((id, index) => {
      byId[id] = placed[index];
    });
    return byId;
  });
  const hoverVars = $derived.by(() => {
    const gutter = options.geometry().gutter;
    const total = order.reduce(
      (sum, id) => sum + (heights[id] ?? 0) + gutter,
      0
    );
    return {
      '--hover-bottom': 0,
      '--hover-height': isExpanded ? total : (heights[order[0]] ?? 0),
    };
  });

  function hold(next: boolean) {
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
    get hoverVars() {
      return hoverVars;
    },
    varsOf(id) {
      const placed = placements[id];
      const index = order.indexOf(id);
      return {
        '--toast-offset': placed?.offset ?? 0,
        '--toast-scale': placed?.scale ?? 1,
        '--toast-opacity': placed?.opacity ?? 1,
        '--toast-z': -index,
        '--toast-height': placed?.height ?? 'auto',
      };
    },
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
        const rest = { ...untrack(() => heights) };
        delete rest[id];
        heights = rest;
      };
    },
    pause: () => model.pause(),
    resume: () => model.resume(),
    handlePointerEnter() {
      if (!isPhone) {
        hold(true);
      }
    },
    handlePointerLeave() {
      if (!isPhone) {
        hold(false);
      }
    },
    handleClick() {
      if (isPhone) {
        hold(!isHeld);
      }
    },
  };
}
