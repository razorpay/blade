import { describe, it, expect } from 'vitest';
import { place } from './placement';

const boundary = { left: 0, top: 0, width: 300, height: 400 };
const floating = { width: 100, height: 40 };

describe('place', () => {
  it('centres on the wanted side, a gap away', () => {
    const anchor = { left: 140, top: 200, width: 20, height: 20 };
    expect(place({ anchor, floating, boundary, placement: 'top', gap: 8 })).toEqual({
      x: 100,
      y: 152,
      side: 'top',
      arrow: 50,
    });
    expect(place({ anchor, floating, boundary, placement: 'right', gap: 8 })).toEqual({
      x: 168,
      y: 190,
      side: 'right',
      arrow: 20,
    });
  });

  it('aligns to the start or the end of the anchor', () => {
    const anchor = { left: 100, top: 200, width: 150, height: 20 };
    expect(place({ anchor, floating, boundary, placement: 'bottom-start' })).toMatchObject({
      x: 100,
      y: 220,
      side: 'bottom',
    });
    expect(place({ anchor, floating, boundary, placement: 'bottom-end' })).toMatchObject({
      x: 150,
      side: 'bottom',
    });
  });

  it('flips when the wanted side lacks room and the opposite has it', () => {
    const anchor = { left: 140, top: 10, width: 20, height: 20 };
    expect(place({ anchor, floating, boundary, placement: 'top', gap: 8 })).toMatchObject({
      y: 38,
      side: 'bottom',
    });
  });

  it('keeps the wanted side when neither fits', () => {
    const anchor = { left: 140, top: 10, width: 20, height: 20 };
    const tall = { width: 100, height: 390 };
    expect(place({ anchor, floating: tall, boundary, placement: 'top' }).side).toBe('top');
  });

  it('clamps to the boundary and keeps the arrow on the anchor', () => {
    const anchor = { left: 280, top: 200, width: 16, height: 16 };
    const placed = place({ anchor, floating, boundary, placement: 'top' });
    expect(placed.x).toBe(200);
    // Anchor centre is at 288, the bubble starts at 200.
    expect(placed.arrow).toBe(88);
  });
});
