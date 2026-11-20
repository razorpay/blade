import { splashRemaining, stepSplashClock } from '../splashClock';
import type { SplashClock, SplashClockState } from '../splashClock';

// the glyph's loop runs 1 -> 3 at speed 1; past it, piece 2 runs to 6 at speed 2
const clock: SplashClock = { a: 1, b: 3, r1: 1, r2: 2, end: 6 };

const play = (state: SplashClockState, seconds: number, isLoading: boolean): number => {
  let t = state.t;
  for (let i = 0; i < seconds * 100; i++) t = stepSplashClock(clock, state, 0.01, isLoading);
  return t;
};

describe('splashClock', () => {
  it('keeps the glyph looping while loading', () => {
    const state: SplashClockState = { t: 0, alive: 0 };
    const t = play(state, 20, true);
    expect(t).toBeGreaterThanOrEqual(clock.a);
    expect(t).toBeLessThan(clock.b);
  });

  it('plays on to the end once loading is over, and holds there', () => {
    const state: SplashClockState = { t: 0, alive: 0 };
    play(state, 2, true);
    expect(play(state, 5, false)).toBe(clock.end);
    expect(play(state, 1, false)).toBe(clock.end);
  });

  it('knows how long it still has to play once loading is over', () => {
    // 1 s of the first pass left (3 - 2, at speed 1), then piece 2: (6 - 3) / 2
    expect(splashRemaining(clock, { t: 2, alive: 0 })).toBeCloseTo(2.5);
    // in piece 2: (6 - 4) / 2
    expect(splashRemaining(clock, { t: 4, alive: 0 })).toBeCloseTo(1);
    expect(splashRemaining(clock, { t: 6, alive: 0 })).toBeCloseTo(0);
  });

  it('plays out at its own pace once ready: the rest of its pass, then the grow and the fade', () => {
    // flow 9's own light splash: its first pass (the glyph coming in, then its loop) is 4.2 s, the loop 2.1 s, piece 2 4.1 s
    const flow9: SplashClock = { a: 2.9167, b: 5.8333, r1: 1.38, r2: 1.2, end: 10.75 };
    for (const loading of [0.5, 3, 4.6, 6.2]) {
      const state: SplashClockState = { t: 0, alive: 0 };
      for (let i = 0; i < loading * 100; i++) stepSplashClock(flow9, state, 0.01, true);
      const expected = splashRemaining(flow9, state);
      let seconds = 0;
      while (stepSplashClock(flow9, state, 0.01, false) < flow9.end) seconds += 0.01;
      expect(seconds).toBeCloseTo(expected, 1);
      expect(seconds).toBeGreaterThan(4);
      expect(seconds).toBeLessThan(5.8333 / 1.38 + (10.75 - 5.8333) / 1.2);
    }
  });
});
