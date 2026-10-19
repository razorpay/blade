import { defaultSchedule } from './schedule';
import type { Schedule } from './schedule';

export interface Flash<T> {
  /** What shows now; undefined between flashes. Tracked. */
  readonly value: T | undefined;
  /** Shows `value` for the flash's span; a flash while one shows starts over. */
  show(value: T): void;
  /** Ends the flash now (a teardown). */
  cancel(): void;
}

/**
 * A value that shows for `ms` and goes: a button's shake, a counter's
 * slide. The schedule is injected so tests never sleep.
 */
export function createFlash<T>(ms: number, schedule: Schedule = defaultSchedule): Flash<T> {
  let value = $state<T | undefined>();
  let cancelTimer: (() => void) | undefined;

  function cancel(): void {
    cancelTimer?.();
    cancelTimer = undefined;
    value = undefined;
  }

  return {
    get value() {
      return value;
    },
    show(next) {
      cancelTimer?.();
      value = next;
      cancelTimer = schedule(() => {
        cancelTimer = undefined;
        value = undefined;
      }, ms);
    },
    cancel,
  };
}
