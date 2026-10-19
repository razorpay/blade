import { describe, it, expect, vi } from 'vitest';
import { createTicker } from './schedule';

function manualSchedule(): {
  schedule: (fn: () => void) => () => void;
  tick: () => void;
  pending: (() => void)[];
} {
  const pending: Array<() => void> = [];
  return {
    schedule: (fn: () => void) => {
      pending.push(fn);
      return () => {
        pending.splice(pending.indexOf(fn), 1);
      };
    },
    tick: () => {
      pending.splice(0).forEach((fn) => fn());
    },
    pending,
  };
}

describe('createTicker', () => {
  it('repeats until stopped and never double-arms', () => {
    const timer = manualSchedule();
    const onTick = vi.fn();
    const t = createTicker({ delay: 10, onTick, schedule: timer.schedule });
    t.start();
    t.start();
    expect(timer.pending.length).toBe(1);
    timer.tick();
    timer.tick();
    expect(onTick).toHaveBeenCalledTimes(2);
    t.stop();
    expect(t.running()).toBe(false);
    timer.tick();
    expect(onTick).toHaveBeenCalledTimes(2);
  });
});
