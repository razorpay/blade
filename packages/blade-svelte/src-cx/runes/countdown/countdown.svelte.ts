import {
  createCountdownClock,
  type CountdownState,
} from '../base/countdown.svelte';

export interface CountdownOptions {
  /** How long to count; a new number starts over. */
  seconds: () => number;
  /** Holds the clock; the time left is kept. */
  isPaused: () => boolean;
  /** Fires once, at zero. */
  onElapsed?: () => void;
}

export interface Countdown {
  readonly current: CountdownState;
}

/**
 * A wall-clock countdown followed as state. The model counts against the
 * wall clock, so a throttled background tab still shows the truth. One per
 * `seconds`; pausing keeps the one it has. Call during component
 * initialisation.
 */
export function createCountdown(options: CountdownOptions): Countdown {
  const countdown = $derived(
    createCountdownClock({
      seconds: options.seconds(),
      onElapsed: () => options.onElapsed?.(),
    })
  );

  $effect(() => {
    const model = countdown;
    return () => model.cancel();
  });

  $effect(() => {
    if (options.isPaused()) {
      countdown.pause();
    } else {
      countdown.start();
    }
  });

  return {
    get current() {
      return countdown.state;
    },
  };
}
