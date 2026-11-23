import { BackgroundClock } from '../backgroundClock';
import type { FreshBackgroundPlay } from '../../RazorSenseEngine/types';

const play = (over: Partial<FreshBackgroundPlay> = {}): FreshBackgroundPlay => ({
  loop: { a: 0, b: 4, fade: 0.8, speed: 1 },
  alive: 0.9,
  colour: { on: true, a: 1, b: 5, speed: 1, fade: 0.5, stops: {} },
  opacity: { depth: 0.3, period: 4.5, ids: ['root', 'bands'] },
  ...over,
});

describe('BackgroundClock (Default Paused 2.0: the login mirror’s clocks)', () => {
  it('loops the timeline a -> b and keeps the alive clock running at its own speed through the wrap', () => {
    const clock = new BackgroundClock(play());
    expect(clock.t).toBe(0);
    for (let i = 0; i < 50; i += 1) clock.step(0.1);
    expect(clock.t).toBeCloseTo(1, 6);
    expect(clock.alive).toBeCloseTo(4.5, 6);
  });

  it('crossfades into the loop’s start over its last `fade` seconds, and not before', () => {
    const clock = new BackgroundClock(play());
    clock.step(3.1);
    expect(clock.fade).toBe(0);
    clock.step(0.1);
    expect(clock.fade).toBe(0);
    clock.step(0.4);
    expect(clock.fade).toBeCloseTo(0.5, 6);
    clock.step(0.35);
    expect(clock.fade).toBeGreaterThan(0.95);
    // (wrapped: the start, as the crossfade had it, at weight 0)
    clock.step(0.1);
    expect(clock.t).toBeCloseTo(0.05, 6);
    expect(clock.fade).toBe(0);
  });

  it('runs the colour loop on its own clock, blending over its wrap', () => {
    const clock = new BackgroundClock(play());
    expect(clock.colourT).toBe(1);
    clock.step(3.75);
    expect(clock.colourT).toBeCloseTo(4.75, 6);
    expect(clock.colourBlend).toBeCloseTo(0.5, 6);
    expect(clock.colourBack).toBeCloseTo(1, 6);
    clock.step(0.5);
    expect(clock.colourT).toBeCloseTo(1.25, 6);
    expect(clock.colourBlend).toBe(0);
  });

  it('leaves the colours alone when the colour loop is off', () => {
    const clock = new BackgroundClock(
      play({ colour: { on: false, a: 0, b: 5, speed: 1, fade: 0.5, stops: {} } }),
    );
    clock.step(3);
    expect(clock.isColourOn).toBe(false);
    expect(clock.colourBlend).toBe(0);
  });

  it('drifts each comp’s opacity within 1 - depth .. 1, each at its own phase', () => {
    const clock = new BackgroundClock(play());
    const seen = [new Set<number>(), new Set<number>()];
    for (let i = 0; i < 400; i += 1) {
      clock.step(0.05);
      for (const k of [0, 1]) {
        const v = clock.opacity(k);
        expect(v).toBeGreaterThanOrEqual(0.7 - 1e-9);
        expect(v).toBeLessThanOrEqual(1 + 1e-9);
        seen[k].add(Math.round(v * 100));
      }
    }
    expect(clock.opacity(0)).not.toBeCloseTo(clock.opacity(1), 3);
    expect(seen[0].size).toBeGreaterThan(10);
    expect(
      new BackgroundClock(play({ opacity: { depth: 0, period: 4.5, ids: [] } })).opacity(0),
    ).toBe(1);
  });
});
