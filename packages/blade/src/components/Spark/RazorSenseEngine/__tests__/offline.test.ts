import { OfflineFade } from '../offline';

const run = (fade: OfflineFade, seconds: number, isOffline: boolean): number => {
  let k = fade.k;
  for (let i = 0; i < Math.round(seconds * 100); i++) k = fade.step(0.01, isOffline);
  return k;
};

describe('OfflineFade', () => {
  it('fades away over 1 s easing in, and back over 1 s easing out (flow 10.5)', () => {
    const fade = new OfflineFade();
    expect(run(fade, 0.5, true)).toBeCloseTo(1 - 0.5 * 0.5, 2);
    expect(run(fade, 0.5, true)).toBeCloseTo(0, 5);
    expect(fade.isGone()).toBe(true);
    expect(run(fade, 0.5, false)).toBeCloseTo(1 - 0.5 * 0.5, 2);
    expect(run(fade, 0.5, false)).toBeCloseTo(1, 5);
    expect(fade.isGone()).toBe(false);
  });

  it('turns round mid-way from the k it is at, with no jump', () => {
    const fade = new OfflineFade();
    const k = run(fade, 0.4, true);
    const next = fade.step(0.01, false);
    expect(Math.abs(next - k)).toBeLessThan(0.03);
    expect(next).toBeGreaterThan(k);
    expect(run(fade, 1, false)).toBeCloseTo(1, 5);
  });

  it('is there at once with reduced motion', () => {
    const fade = new OfflineFade();
    fade.set(0);
    expect(fade.isGone()).toBe(true);
    fade.set(1);
    expect(fade.k).toBe(1);
  });
});
