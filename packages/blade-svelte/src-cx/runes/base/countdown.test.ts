import { describe, it, expect, vi } from 'vitest';
import { createCountdownClock } from './countdown.svelte';
import { createTicker } from './schedule';

function manualSchedule() {
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

function fakeClock(start = 0) {
  let t = start;
  return {
    now: () => t,
    advance(ms: number) {
      t += ms;
    },
  };
}

describe('createCountdownClock', () => {
  it('counts down against the clock, reports progress and fires once at zero', () => {
    const timer = manualSchedule();
    const clock = fakeClock();
    const onElapsed = vi.fn();
    const c = createCountdownClock({
      seconds: 2,
      onElapsed,
      schedule: timer.schedule,
      now: clock.now,
    });
    expect(c.state).toEqual({ remaining: 2, progress: 0 });
    c.start();
    clock.advance(1000);
    timer.tick();
    expect(c.state).toEqual({ remaining: 1, progress: 50 });
    clock.advance(1000);
    timer.tick();
    expect(c.state).toEqual({ remaining: 0, progress: 100 });
    expect(onElapsed).toHaveBeenCalledTimes(1);
    timer.tick();
    expect(onElapsed).toHaveBeenCalledTimes(1);
  });

  it('stays truthful when ticks are throttled: the deadline, not the tick count, decides', () => {
    const timer = manualSchedule();
    const clock = fakeClock();
    const onElapsed = vi.fn();
    const c = createCountdownClock({
      seconds: 30,
      onElapsed,
      schedule: timer.schedule,
      now: clock.now,
    });
    c.start();
    // A background tab fires one tick after 30s of wall time.
    clock.advance(30_000);
    timer.tick();
    expect(c.state.remaining).toBe(0);
    expect(onElapsed).toHaveBeenCalledTimes(1);
  });

  it('pause retains the remainder and start re-anchors the deadline', () => {
    const timer = manualSchedule();
    const clock = fakeClock();
    const c = createCountdownClock({
      seconds: 10,
      schedule: timer.schedule,
      now: clock.now,
    });
    c.start();
    clock.advance(4000);
    timer.tick();
    expect(c.state.remaining).toBe(6);

    c.pause();
    // Time passing while paused does not count.
    clock.advance(60_000);
    c.start();
    clock.advance(1000);
    timer.tick();
    expect(c.state.remaining).toBe(5);
  });

  it('cancel forfeits the remainder: start does nothing after it', () => {
    const timer = manualSchedule();
    const clock = fakeClock();
    const c = createCountdownClock({
      seconds: 5,
      schedule: timer.schedule,
      now: clock.now,
    });
    c.start();
    c.cancel();
    c.start();
    expect(timer.pending.length).toBe(0);
  });

  it('a zero-second countdown is already complete', () => {
    const c = createCountdownClock({ seconds: 0 });
    expect(c.state.progress).toBe(100);
    c.start();
  });
});
