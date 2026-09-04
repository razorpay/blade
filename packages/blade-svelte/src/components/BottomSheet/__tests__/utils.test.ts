import { describe, it, expect } from 'vitest';
import { computeSnapPointBounds, resolveSnapPoints } from '../utils';

describe('resolveSnapPoints', () => {
  const windowHeight = 800;
  const fitContentMaxHeight = 0.97;

  it('converts fractions to pixels', () => {
    expect(
      resolveSnapPoints({
        snapPoints: [0.35, 0.5, 0.85],
        windowHeight,
        totalHeight: 1000,
        fitContentMaxHeight,
      }),
    ).toEqual([280, 400, 680]);
  });

  it('resolves fit-content to the measured content height', () => {
    expect(
      resolveSnapPoints({
        snapPoints: [0.35, 0.5, 'fit-content'],
        windowHeight,
        totalHeight: 500,
        fitContentMaxHeight,
      }),
    ).toEqual([280, 400, 500]);
  });

  it('caps fit-content at fitContentMaxHeight of the viewport', () => {
    expect(
      resolveSnapPoints({
        snapPoints: [0.35, 0.5, 'fit-content'],
        windowHeight,
        totalHeight: 5000,
        fitContentMaxHeight,
      }),
    ).toEqual([280, 400, 776]);
  });

  it('sorts ascending when short content makes fit-content the lowest point', () => {
    expect(
      resolveSnapPoints({
        snapPoints: [0.35, 0.5, 'fit-content'],
        windowHeight,
        totalHeight: 120,
        fitContentMaxHeight,
      }),
    ).toEqual([120, 280, 400]);
  });

  it('keeps neighbour lookup coherent once sorted', () => {
    const resolved = resolveSnapPoints({
      snapPoints: [0.35, 0.5, 'fit-content'],
      windowHeight,
      totalHeight: 120,
      fitContentMaxHeight,
    });

    /* Releasing just above the lowest point must offer 120 as `nearest` and
     * clamp `lower` to the same value rather than reaching past it. */
    expect(computeSnapPointBounds(150, resolved)).toEqual([120, 120, 280]);
  });
});
