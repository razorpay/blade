import { makeOverlay, overlayAt, valueAt } from '../successOverlay';
import { successPieceDark, successPieceLight } from '../piece';

const INK: [number, number, number] = [0, 117, 59];

describe('successOverlay (Rzp Glass Success Animation 2.0’s badge and tick)', () => {
  it.each([
    ['light', successPieceLight],
    ['dark', successPieceDark],
  ])(
    '%s: the tick draws in on the orb, then turns into the badge’s check as the badge pops in',
    (_mode, piece) => {
      const m = piece.moments;
      const o = makeOverlay();
      // before the tick: nothing
      overlayAt(piece, m.tick - 0.01, INK, o);
      expect(o.tick.opacity).toBe(0);
      expect(o.badge.isShown).toBe(false);
      // drawn in, white, on the orb (still rising to the badge's place)
      overlayAt(piece, m.land, INK, o);
      expect(o.tick.opacity).toBe(1);
      expect(o.tick.dashOffset).toBeCloseTo(0, 6);
      expect(o.tick.color).toEqual([255, 255, 255]);
      expect(o.tick.size).toBeCloseTo(piece.tick.size * piece.cssPerComp, 6);
      expect(o.tick.y).toBeGreaterThan(0);
      // step 2's end: Blade's check (24 px, stroke 2, its colour) at the badge's middle; the badge in, at its size
      overlayAt(piece, m.handEnd, INK, o);
      expect(o.tick.size).toBeCloseTo(piece.hand.size, 6);
      expect(o.tick.stroke).toBeCloseTo((piece.hand.stroke / piece.hand.size) * 100, 6);
      expect(o.tick.color).toEqual(INK);
      expect(o.tick.y).toBeCloseTo(0, 6);
      expect(o.tick.isRound).toBe(true);
      expect(o.tick.d).toBe('M16.67 50.00 L37.50 70.83 L83.33 25.00');
      expect(o.badge.isShown).toBe(true);
      expect(o.badge.scale).toBeCloseTo(1, 6);
      expect(o.badge.opacity).toBe(1);
    },
  );

  it('brings the label in after the badge starts popping, fading and rising into place', () => {
    const piece = successPieceLight;
    const o = makeOverlay();
    overlayAt(piece, piece.moments.badge + 0.29, INK, o);
    expect(o.label.opacity).toBe(0);
    expect(o.label.y).toBe(20);
    overlayAt(piece, piece.moments.badge + 0.55, INK, o);
    expect(o.label.opacity).toBeGreaterThan(0.3);
    expect(o.label.opacity).toBeLessThan(1);
    overlayAt(piece, piece.moments.badge + 0.8, INK, o);
    expect(o.label.opacity).toBe(1);
    expect(o.label.y).toBe(0);
    // (before the badge: nowhere)
    overlayAt(piece, piece.moments.top, INK, o);
    expect(o.label.opacity).toBe(0);
  });

  it('pops the badge on Blade’s ease: past 1 and back', () => {
    const piece = successPieceLight;
    const o = makeOverlay();
    let peak = 0;
    for (let t = piece.moments.badge; t <= piece.moments.badgeEnd; t += 0.01) {
      peak = Math.max(peak, overlayAt(piece, t, INK, o).badge.scale);
    }
    expect(peak).toBeGreaterThan(1.05);
  });

  it('with the tick off, the check comes in with the badge', () => {
    const piece = { ...successPieceLight, tick: { ...successPieceLight.tick, on: false } };
    const o = overlayAt(piece, piece.moments.badge + 0.2, INK, makeOverlay());
    expect(o.tick.scale).toBeCloseTo(o.badge.scale, 6);
    expect(o.tick.opacity).toBeCloseTo(o.badge.opacity, 6);
    expect(o.tick.color).toEqual(INK);
  });

  it('reads the orb’s rise as the engine does', () => {
    const keys = successPieceLight.y;
    expect(valueAt(keys, 0)).toBe(keys[0].v);
    expect(valueAt(keys, 99)).toBe(keys[keys.length - 1].v);
    expect(valueAt(keys, keys[1].t)).toBeCloseTo(keys[1].v as number, 6);
  });

  it('with no colour read off the token: no blend and no colour of its own, the tick white then the check in the token itself', () => {
    const piece = successPieceLight;
    const m = piece.moments;
    const o = makeOverlay();
    overlayAt(piece, m.land, null, o);
    expect(o.tick.color).toEqual([255, 255, 255]);
    expect(o.tick.isInk).toBe(false);
    overlayAt(piece, m.handEnd, null, o);
    expect(o.tick.color).toEqual([255, 255, 255]);
    expect(o.tick.isInk).toBe(true);
    // (with the colour read, it's blended as before)
    overlayAt(piece, m.handEnd, INK, o);
    expect(o.tick.isInk).toBe(false);
    expect(o.tick.color).toEqual(INK);
  });
});
