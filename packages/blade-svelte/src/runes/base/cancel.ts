/**
 * A withdrawal across the blade/app boundary, in place of an
 * `AbortController`: older engines have none, and a signal can't cross a
 * bridge to a native host, where `cancelled.then(...)` can.
 */
export interface Cancel {
  /** Resolves once `cancel()` is called; never rejects. */
  readonly cancelled: Promise<void>;
  /** Withdraws; later calls do nothing. */
  cancel(): void;
  /** Whether `cancel()` was called (sync check, as `signal.aborted`). */
  readonly isCancelled: boolean;
}

/** A fresh, not yet cancelled `Cancel`. */
export function createCancel(): Cancel {
  let resolve: () => void = () => undefined;
  const cancelled = new Promise<void>((done) => {
    resolve = done;
  });
  let isCancelled = false;
  return {
    cancelled,
    cancel() {
      if (!isCancelled) {
        isCancelled = true;
        resolve();
      }
    },
    get isCancelled() {
      return isCancelled;
    },
  };
}
