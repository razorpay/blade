import { describe, it, expect, vi } from 'vitest';
import { createToasts, type ToastsOptions } from './toasts.svelte';

function manualSchedule() {
  const pending: Array<{ fn: () => void; at: number }> = [];
  let clock = 0;
  return {
    now: () => clock,
    schedule: (fn: () => void, ms: number) => {
      const entry = { fn, at: clock + ms };
      pending.push(entry);
      return () => {
        const i = pending.indexOf(entry);
        if (i >= 0) {
          pending.splice(i, 1);
        }
      };
    },
    advance(ms: number) {
      clock += ms;
      pending
        .filter((entry) => entry.at <= clock)
        .forEach((entry) => {
          pending.splice(pending.indexOf(entry), 1);
          entry.fn();
        });
    },
  };
}

function toasts(options: ToastsOptions<string> = {}) {
  const timer = manualSchedule();
  const onDismiss = vi.fn();
  const model = createToasts<string>({
    schedule: timer.schedule,
    now: timer.now,
    hooks: { onDismiss },
    ...options,
  });
  return { model, timer, onDismiss };
}

describe('show and timeout', () => {
  it('auto-dismisses after its duration and reports the reason', async () => {
    const { model, timer, onDismiss } = toasts();
    const handle = model.show('saved', { duration: 2000 });
    expect(model.entries).toEqual([{ id: handle.id, content: 'saved' }]);

    timer.advance(1999);
    expect(model.entries).toHaveLength(1);
    timer.advance(1);
    expect(model.entries).toEqual([]);
    expect(onDismiss).toHaveBeenCalledWith('saved', 'timeout');
    await expect(handle.dismissed).resolves.toBe('timeout');
  });

  it('a toast without a duration is sticky until dismissed', async () => {
    const { model, timer } = toasts();
    const handle = model.show('sticky');
    timer.advance(60_000);
    expect(model.entries).toHaveLength(1);
    handle.dismiss();
    expect(model.entries).toEqual([]);
    await expect(handle.dismissed).resolves.toBe('dismiss');
  });

  it('dismiss by id only touches that toast', () => {
    const { model } = toasts();
    const first = model.show('a');
    model.show('b');
    expect(model.dismiss(first.id)).toBe(true);
    expect(model.dismiss(first.id)).toBe(false);
    expect(model.entries.map((entry) => entry.content)).toEqual(['b']);
  });
});

describe('capacity', () => {
  it('a new toast evicts the oldest and cancels its timer', async () => {
    const { model, timer, onDismiss } = toasts({ capacity: 1 });
    const first = model.show('first', { duration: 2000 });
    timer.advance(1500);
    const second = model.show('second', { duration: 2000 });

    expect(model.entries).toEqual([{ id: second.id, content: 'second' }]);
    expect(onDismiss).toHaveBeenCalledWith('first', 'evicted');
    await expect(first.dismissed).resolves.toBe('evicted');

    // The replaced toast's timer must not kill the replacement early.
    timer.advance(500);
    expect(model.entries).toHaveLength(1);
    timer.advance(1500);
    expect(model.entries).toEqual([]);
  });
});

describe('pause and resume', () => {
  it('paused time does not count against a duration', () => {
    const { model, timer } = toasts();
    model.show('promo', { duration: 2000 });
    timer.advance(1500);
    model.pause();
    timer.advance(60_000);
    model.resume();
    timer.advance(499);
    expect(model.entries).toHaveLength(1);
    timer.advance(1);
    expect(model.entries).toEqual([]);
  });

  it('a toast shown while paused arms only on resume', () => {
    const { model, timer } = toasts();
    model.pause();
    model.show('late', { duration: 1000 });
    timer.advance(5000);
    expect(model.entries).toHaveLength(1);
    model.resume();
    timer.advance(1000);
    expect(model.entries).toEqual([]);
  });
});

describe('clear', () => {
  it('removes everything with the cleared reason', () => {
    const { model, onDismiss } = toasts();
    model.show('a');
    model.show('b', { duration: 1000 });
    model.clear();
    expect(model.entries).toEqual([]);
    expect(onDismiss).toHaveBeenCalledWith('a', 'cleared');
    expect(onDismiss).toHaveBeenCalledWith('b', 'cleared');
  });
});
