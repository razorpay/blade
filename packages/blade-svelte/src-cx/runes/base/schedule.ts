/** Runs `fn` after `ms`; returns a cancel. Injected so tests never sleep. */
export type Schedule = (fn: () => void, ms: number) => () => void;

export const defaultSchedule: Schedule = (fn, ms) => {
  const id = setTimeout(fn, ms);
  return () => {
    clearTimeout(id);
  };
};

export interface Ticker {
  start(): void;
  stop(): void;
  running(): boolean;
}

/** A repeating timer whose callback is read at each tick, so it never restarts on change. */
export function createTicker(options: {
  delay: number;
  onTick: () => void;
  schedule?: Schedule;
}): Ticker {
  const schedule = options.schedule || defaultSchedule;
  let cancel: (() => void) | undefined;

  function arm(): void {
    cancel = schedule(() => {
      options.onTick();
      if (cancel) {
        arm();
      }
    }, options.delay);
  }

  return {
    start() {
      if (!cancel) {
        arm();
      }
    },
    stop() {
      cancel?.();
      cancel = undefined;
    },
    running: () => Boolean(cancel),
  };
}
