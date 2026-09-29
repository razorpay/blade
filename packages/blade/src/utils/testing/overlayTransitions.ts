import { act } from '@testing-library/react';

/**
 * Helpers for testing how hover overlays (Tooltip, hover Popover) replace each other. Web only
 * (jsdom computed styles, @testing-library/react).
 *
 * A replaced overlay has to be gone before its exit animation (`motion.duration.quick`, 200ms)
 * could have finished. Tests advance fake time by `REPLACED_OVERLAY_TIME` and then check, so the
 * result does not depend on how busy the machine running the tests is.
 */

/**
 * Shorter than Popover / Tooltip's exit animation (`motion.duration.quick`, 200ms)
 */
const REPLACED_OVERLAY_TIME = 100;

/**
 * Advances jest's fake timers by `ms`, in 10ms steps.
 *
 * Timers that fire schedule React updates, and those updates schedule the next timers (e.g. a
 * closing overlay's unmount). A single `jest.advanceTimersByTime(ms)` would skip the timers that
 * only exist once React has applied the updates from the step before.
 *
 * Requires `jest.useFakeTimers()`.
 */
const advanceTime = (ms: number): void => {
  for (let elapsed = 0; elapsed < ms; elapsed += 10) {
    act(() => {
      jest.advanceTimersByTime(10);
    });
  }
};

/**
 * The `transition-duration` Popover's content fades in with. `useTransitionStyles` applies it
 * through a styled-components class, so it is read from the computed style of the dialog or its
 * descendants.
 */
const getOpenTransitionDuration = (dialog: HTMLElement): string | undefined =>
  [dialog, ...Array.from(dialog.querySelectorAll<HTMLElement>('*'))]
    .map((element) => window.getComputedStyle(element).transitionDuration)
    .find(Boolean);

export { REPLACED_OVERLAY_TIME, advanceTime, getOpenTransitionDuration };
