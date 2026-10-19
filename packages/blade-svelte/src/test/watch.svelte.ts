import { flushSync } from 'svelte';

export interface Watched<T> {
  /** Every settled value, the first one included. */
  readonly seen: T[];
  readonly last: T;
  stop(): void;
}

/**
 * Records what `read` settles to after each `flushSync()`: the reactive
 * counterpart of a Signal subscription in a test. Writes between two
 * flushes coalesce into one entry.
 */
export function watch<T>(read: () => T): Watched<T> {
  const seen: T[] = [];
  const stop = $effect.root(() => {
    $effect(() => {
      seen.push(read());
    });
  });
  flushSync();
  return {
    seen,
    get last() {
      return seen[seen.length - 1];
    },
    stop,
  };
}
