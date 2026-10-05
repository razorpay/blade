import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import Countdown from '../components/countdown/Countdown.svelte';
import { expectClass } from './classes';

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

const tick = (ms: number): void => {
  vi.advanceTimersByTime(ms);
  flushSync();
};

describe('Countdown', () => {
  it('counts mm:ss down to zero and says so once', () => {
    const onElapsed = vi.fn();
    const { getByRole } = render(Countdown, {
      props: { seconds: 65, onElapsed, accessibilityLabel: 'Expires in' },
    });
    const timer = getByRole('timer', { name: 'Expires in' });
    expect(timer.textContent?.trim()).toBe('01:05');
    expect(timer.getAttribute('datetime')).toBe('PT65S');

    tick(6000);
    expect(timer.textContent?.trim()).toBe('00:59');
    tick(59000);
    expect(timer.textContent?.trim()).toBe('00:00');
    expect(onElapsed).toHaveBeenCalledTimes(1);
    tick(5000);
    expect(onElapsed).toHaveBeenCalledTimes(1);
  });

  it('pausing holds the time left; resuming carries on from it', () => {
    const { getByRole, rerender } = render(Countdown, {
      props: { seconds: 30 },
    });
    const timer = getByRole('timer');
    tick(10000);
    expect(timer.textContent?.trim()).toBe('00:20');

    return rerender({ seconds: 30, isPaused: true })
      .then(() => {
        tick(60000);
        expect(timer.textContent?.trim()).toBe('00:20');
        return rerender({ seconds: 30, isPaused: false });
      })
      .then(() => {
        tick(5000);
        expect(timer.textContent?.trim()).toBe('00:15');
      });
  });

  it('turns urgent at the threshold; a new `seconds` starts over', () => {
    const { getByRole, rerender } = render(Countdown, {
      props: { seconds: 12, urgentBelow: 10 },
    });
    const timer = getByRole('timer');
    expectClass(timer, 'tabular-nums');
    tick(2000);
    expectClass(timer, 'text-feedback-negative-intense');

    return rerender({ seconds: 90, urgentBelow: 10 }).then(() => {
      expect(timer.textContent?.trim()).toBe('01:30');
      expectClass(timer, 'tabular-nums');
    });
  });
});
