import { paceFor } from '../rayPace';

const HZ_120 = 1000 / 120;
const HZ_60 = 1000 / 60;

describe('how often the Rays draw (paceFor)', () => {
  it('should draw every frame when the work fits in a quarter of a frame', () => {
    expect(paceFor(0.7, HZ_120, 1)).toBe(1);
    expect(paceFor(4, HZ_60, 1)).toBe(1);
  });

  it('should draw less often, the least that fits, when the work runs long', () => {
    expect(paceFor(7.7, HZ_60, 1)).toBe(2); // 46% of a 60 Hz frame: every other frame (23%)
    expect(paceFor(4.9, HZ_120, 1)).toBe(3); // 59% of a 120 Hz frame: every third (20%)
  });

  it('should never go under 30 fps', () => {
    expect(paceFor(16.6, HZ_120, 1)).toBe(4);
    expect(paceFor(40, HZ_60, 1)).toBe(2);
  });

  it('should go back up only once the work fits well, not at the edge', () => {
    expect(paceFor(3.8, HZ_60, 2)).toBe(2); // 23% at every frame: within a quarter, but not a fifth, so it stays
    expect(paceFor(3, HZ_60, 2)).toBe(1); // 18%: back to every frame
  });
});
