import { promisePair } from './promise';
import type { BackAnswer } from './back';

export interface Layer<E> {
  id: number;
  entry: E;
  container?: string;
  /** Resolves when the layer leaves the stack. */
  promise: Promise<unknown>;
  /** Removes this layer and everything above it. */
  pop(): void;
  /** Removes everything above this layer. */
  popAfter(): void;
  /** Removes only this layer. */
  close(): void;
  /** Resolves the promise with `value`, then pops. */
  resolve(value?: unknown): void;
}

export interface BackPolicy<E> {
  /** Overlays close before screens: pick the container whose top layer answers first. */
  preferContainer?: string;
  /**
   * The top layer may own back — ask its model here (a dialog's
   * `disclosure.back()`). See `BackAnswer` for the protocol; undefined
   * defers to the stack's default (pop the top layer).
   */
  onTop?: (top: Layer<E>) => BackAnswer;
  /** Runs before popping a screen; return true to intercept (a confirmation is showing). */
  confirmLeave?: (top: Layer<E>) => boolean;
  /** Nothing left to pop. */
  onEmpty?: () => void;
}

export interface LayerStack<E> {
  /** Bottom first; tracked by whatever reads it. */
  readonly entries: readonly Layer<E>[];
  push(entry: E, container?: string): Layer<E>;
  /** Replaces a layer's entry and republishes `entries`; a stranger is ignored. */
  update(layer: Layer<E>, entry: E): void;
  pop(index: number): void;
  popTill(index: number): void;
  clear(): void;
  top(container?: string): Layer<E> | undefined;
  size(container?: string): number;
  /** Back pressed. Returns whether something handled it. */
  back(policy?: BackPolicy<E>): boolean;
}

let nextId = 0;

/** The core of navstack: ordered layers with promises, in named containers. */
export function createLayerStack<E>(): LayerStack<E> {
  let entries = $state.raw<readonly Layer<E>[]>([]);

  function remove(
    predicate: (layer: Layer<E>, index: number) => boolean
  ): void {
    const current = entries;
    const removed = current.filter(predicate);
    if (!removed.length) {
      return;
    }
    entries = current.filter((layer, i) => !predicate(layer, i));
    removed.forEach((layer) => {
      (layer as Layer<E> & { _settle: (v?: unknown) => void })._settle();
    });
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
    push(entry, container) {
      const [promise, settle] = promisePair<unknown>();
      const layer = {
        id: nextId++,
        entry,
        container,
        promise,
        _settle: settle,
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
      } as Layer<E> & { _settle: (v?: unknown) => void };
      entries = [...entries, layer];
      return layer;
    },
    pop(index) {
      remove((_, i) => i === index);
    },
    popTill(index) {
      remove((_, i) => i >= Math.max(0, index));
    },
    clear() {
      remove(() => true);
    },
    top(container) {
      const list = entries;
      for (let i = list.length - 1; i >= 0; i--) {
        if (container === undefined || list[i].container === container) {
          return list[i];
        }
      }
      return undefined;
    },
    size(container) {
      return container === undefined
        ? entries.length
        : entries.filter((l) => l.container === container).length;
    },
    back(policy = {}) {
      const top = stack.top(policy.preferContainer) || stack.top();
      if (!top) {
        policy.onEmpty?.();
        return false;
      }
      const owned = policy.onTop?.(top);
      if (owned !== undefined) {
        return owned;
      }
      if (stack.size() <= 1) {
        policy.onEmpty?.();
        return false;
      }
      if (policy.confirmLeave?.(top)) {
        return true;
      }
      top.close();
      return true;
    },
  };
  return stack;
}
