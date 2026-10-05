import { promisePair } from './promise';
import type { BackAnswer } from './back';

export interface Layer<E> {
  id: number;
  entry: E;
  /** Resolves when the layer leaves the stack, or once `settle`d. */
  promise: Promise<unknown>;
  /** Removes this layer and everything above it. */
  pop(): void;
  /** Removes everything above this layer. */
  popAfter(): void;
  /** Removes only this layer. */
  close(): void;
  /** Resolves the promise with `value`, then pops. */
  resolve(value?: unknown): void;
  /** Resolves the promise with `value` and leaves the layer where it is: it goes later. */
  settle(value?: unknown): void;
}

export interface BackPolicy<E> {
  /**
   * The top layer may own back — ask its model here (a dialog's
   * `disclosure.back()`). See `BackAnswer` for the protocol; undefined
   * defers to the stack's default (pop the top layer).
   */
  onTop?: (top: Layer<E>) => BackAnswer;
}

export interface LayerStack<E> {
  /** Bottom first; tracked by whatever reads it. */
  readonly entries: readonly Layer<E>[];
  push(entry: E): Layer<E>;
  /** Replaces a layer's entry and republishes `entries`; a stranger is ignored. */
  update(layer: Layer<E>, entry: E): void;
  popTill(index: number): void;
  clear(): void;
  top(): Layer<E> | undefined;
  size(): number;
  /** Back pressed. Returns whether something handled it; the root layer stays. */
  back(policy?: BackPolicy<E>): boolean;
}

let nextId = 0;

/** The core of navstack: ordered layers with promises. */
export function createLayerStack<E>(): LayerStack<E> {
  let entries = $state.raw<readonly Layer<E>[]>([]);

  function remove(predicate: (layer: Layer<E>, index: number) => boolean): void {
    const current = entries;
    const removed = current.filter(predicate);
    if (!removed.length) {
      return;
    }
    entries = current.filter((layer, i) => !predicate(layer, i));
    removed.forEach((layer) => layer.settle());
  }

  function indexOf(layer: Layer<E>): number {
    return entries.indexOf(layer);
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
        pop() {
          const i = indexOf(layer);
          if (i >= 0) {
            stack.popTill(i);
          }
        },
        popAfter() {
          const i = indexOf(layer);
          if (i >= 0) {
            stack.popTill(i + 1);
          }
        },
        close() {
          remove((l) => l === layer);
        },
        resolve(value) {
          settle(value);
          layer.pop();
        },
      };
      entries = [...entries, layer];
      return layer;
    },
    popTill(index) {
      remove((_, i) => i >= Math.max(0, index));
    },
    clear() {
      remove(() => true);
    },
    top: () => entries[entries.length - 1],
    size: () => entries.length,
    back(policy = {}) {
      const top = stack.top();
      if (!top) {
        return false;
      }
      const owned = policy.onTop?.(top);
      if (owned !== undefined) {
        return owned;
      }
      if (stack.size() <= 1) {
        return false;
      }
      top.close();
      return true;
    },
  };
  return stack;
}
