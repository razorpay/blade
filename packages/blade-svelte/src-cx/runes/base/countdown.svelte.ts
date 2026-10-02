import { createTicker, type Schedule } from './schedule';

export interface CountdownState {
  /** Whole seconds left, never negative. */
  remaining: number;
  /** 0..100, elapsed share of the total. */
  progress: number;
}

export interface CountdownClock {
  /** Replaced on every tick; tracked by whatever reads it. */
  readonly state: CountdownState;
  /** Anchors a deadline from the time left and ticks toward it. */
  start(): void;
  /** Halts, retaining the time left for the next `start`. */
  pause(): void;
  /** Halts and forfeits the time left: `start` does nothing after it. */
  cancel(): void;
}

/**
 * Counts `seconds` down against the wall clock: each tick recomputes the
 * remainder from a deadline instead of decrementing, so a background tab
 * whose timers are throttled still reports the truth (QR/session expiry are
 * server deadlines). `onElapsed` fires once, at zero. Inject `now` for
 * deterministic tests.
 */
export function createCountdownClock(options: {
  seconds: number;
  onElapsed?: () => void;
  schedule?: Schedule;
  interval?: number;
  /** Clock in ms. Default `Date.now`. */
  now?: () => number;
}): CountdownClock {
  const total = Math.max(0, options.seconds);
  const now = options.now || Date.now;
  const toState = (remaining: number): CountdownState => ({
    remaining,
    progress: total === 0 ? 100 : ((total - remaining) * 100) / total,
  });
  let state = $state.raw<CountdownState>(toState(total));
  let remainingMs = total * 1000;
  let deadline = 0;

  const ticker = createTicker({
    delay: options.interval ?? 1000,
    schedule: options.schedule,
    onTick() {
      const remaining = Math.max(0, Math.ceil((deadline - now()) / 1000));
      state = toState(remaining);
      if (remaining === 0) {
        ticker.stop();
        remainingMs = 0;
        options.onElapsed?.();
      }
    },
  });

  function start(): void {
    if (!ticker.running() && remainingMs > 0) {
      deadline = now() + remainingMs;
      ticker.start();
    }
  }

  return {
    get state() {
      return state;
    },
    start,
    pause() {
      if (ticker.running()) {
        ticker.stop();
        remainingMs = Math.max(0, deadline - now());
      }
    },
    cancel() {
      ticker.stop();
      remainingMs = 0;
    },
  };
}
