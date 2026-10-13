import { getAdapters } from '../../adapters';

export type AsyncOutcome<T> =
  | { status: 'pending' }
  | { status: 'done'; value: T }
  | { status: 'failed'; error: unknown };

export interface AsyncOptions<T> {
  promise: () => Promise<T>;
  /** ms before the pending state shows. */
  pendingDelay: () => number;
  onError?: (error: unknown) => void;
}

export interface Async<T> {
  readonly outcome: AsyncOutcome<T>;
  readonly isPendingShown: boolean;
}

/**
 * A promise followed as an outcome, with the pending state held back for a
 * moment. Keyed on the promise alone: a re-render with the same one awaits
 * nothing. Call during component initialisation.
 */
export function createAsync<T>(options: AsyncOptions<T>): Async<T> {
  const adapters = getAdapters();
  let outcome = $state.raw<AsyncOutcome<T>>({ status: 'pending' });
  let isPendingShown = $state(false);

  $effect(() => {
    const current = options.promise();
    const delay = options.pendingDelay();
    let isCurrent = true;
    outcome = { status: 'pending' };
    isPendingShown = delay <= 0;
    const timer = setTimeout(() => {
      isPendingShown = true;
    }, delay);

    current
      .then((value) => {
        if (isCurrent) {
          outcome = { status: 'done', value };
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          outcome = { status: 'failed', error };
          options.onError?.(error);
          adapters.captureError?.(error);
        }
      })
      .finally(() => clearTimeout(timer))
      .catch(() => undefined);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  });

  return {
    get outcome() {
      return outcome;
    },
    get isPendingShown() {
      return isPendingShown;
    },
  };
}
