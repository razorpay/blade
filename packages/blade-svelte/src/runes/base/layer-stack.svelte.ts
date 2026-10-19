import { promisePair } from './promise';

export interface Layer<E> {
  id: number;
  entry: E;
  /** Resolves when the layer leaves the stack, or once `settle`d. */
  promise: Promise<unknown>;
  /** Removes only this layer. */
  close(): void;
  /** Resolves the promise with `value` and leaves the layer where it is: it goes later. */
  settle(value?: unknown): void;
}

export interface LayerStack<E> {
  /** Bottom first; tracked by whatever reads it. */
  readonly entries: readonly Layer<E>[];
  push(entry: E): Layer<E>;
  /** Replaces a layer's entry and republishes `entries`; a stranger is ignored. */
  update(layer: Layer<E>, entry: E): void;
  clear(): void;
  top(): Layer<E> | undefined;
  size(): number;
}

let nextId = 0;

/**
 * Ordered layers with promises: the open overlays, the toasts. Navigation
 * (back, popping through) is the app's, over `entries` and `close`.
 */
export function createLayerStack<E>(): LayerStack<E> {
  let entries = $state.raw<readonly Layer<E>[]>([]);

  function remove(predicate: (layer: Layer<E>) => boolean): void {
    const current = entries;
    const removed = current.filter(predicate);
    if (!removed.length) {
      return;
    }
    entries = current.filter((layer) => !predicate(layer));
    removed.forEach((layer) => layer.settle());
  }

  const stack: LayerStack<E> = {
    get entries() {
      return entries;
    },
    update(layer, entry) {
      if (entries.includes(layer)) {
        layer.entry = entry;
        entries = [...entries];
      }
    },
    push(entry) {
      const [promise, settle] = promisePair<unknown>();
      const layer: Layer<E> = {
        id: nextId++,
        entry,
        promise,
        settle,
        close() {
          remove((l) => l === layer);
        },
      };
      entries = [...entries, layer];
      return layer;
    },
    clear() {
      remove(() => true);
    },
    top: () => entries[entries.length - 1],
    size: () => entries.length,
  };
  return stack;
}
