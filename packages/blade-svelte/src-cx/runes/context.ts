import { getContext, setContext } from 'svelte';

export interface ContextKey<T> {
  /** What the nearest provider set; `undefined` with none above. */
  get(): T | undefined;
  set(value: T | undefined): void;
}

/**
 * A component-tree context: its key and the pair that reads and writes it.
 * Svelte's own `createContext` throws when nothing above provided one;
 * every Blade context is optional — a host falls back to a default (the
 * page-wide layers, toasts, overlays) or works on its own (an item outside
 * its group) — so `get` returns `undefined` instead. Call at module level;
 * `get` and `set` during component init.
 */
export function defineContext<T>(name: string): ContextKey<T> {
  const key = Symbol(name);
  return {
    get: () => getContext<T | undefined>(key),
    set: (value) => {
      setContext(key, value);
    },
  };
}
