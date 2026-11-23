import { placePiece } from '../placePiece';
import { backgroundPlaceDark, backgroundPlaceLight } from '../place';
import type { FreshBackgroundPlace } from '../../RazorSenseEngine/types';

const flat = (place: FreshBackgroundPlace): FreshBackgroundPlace => ({
  ...place,
  centre: [0, 0],
  piece: { x: 0, y: 0, scale: 1, rotate: 0 },
});

describe('placePiece (Default Paused 2.0 in its box)', () => {
  it('cover-fits the login page’s comp: 1 comp px is 0.5 CSS px on a 1512 x 862 box', () => {
    expect(placePiece(1512, 862, backgroundPlaceLight, 1)?.z).toBeCloseTo(0.5, 6);
    expect(placePiece(1512, 862, backgroundPlaceLight, 1.2)?.z).toBeCloseTo(0.6, 6);
    // (a tall phone: its height decides)
    expect(placePiece(390, 844, backgroundPlaceLight, 1)?.z).toBeCloseTo(844 / 1724, 6);
  });

  it('places the piece where the login page has it: its middle left of the box’s, as the login tab has it', () => {
    const place = placePiece(1512, 862, backgroundPlaceLight, 1);
    if (!place) throw new Error('nothing in the box');
    const middle = place.whole.left + place.whole.width / 2;
    expect(middle).toBeCloseTo(756 + backgroundPlaceLight.centre[0] * 0.5, 6);
    expect(backgroundPlaceLight.centre[0]).toBeLessThan(0);
  });

  it('draws only the box’s part of the piece: unturned and unscaled, the box itself', () => {
    const place = placePiece(1512, 862, flat(backgroundPlaceLight), 1);
    expect(place?.part).toEqual({ left: 0, top: 0, width: 1512, height: 862 });
    // (its region is that part, in comp px: the same shape)
    const [, , w, h] = place?.region ?? [0, 0, 0, 0];
    expect(w / h).toBeCloseTo(1512 / 862, 4);
    expect(w).toBeCloseTo(3024, 4);
  });

  it('turned and scaled down, its part covers every corner of the box the piece reaches, and stays in the comp', () => {
    for (const where of [backgroundPlaceLight, backgroundPlaceDark]) {
      const place = placePiece(1512, 862, where, 1);
      if (!place) throw new Error('nothing in the box');
      const { part, whole, middle } = place;
      const { x, y, scale, rotate } = where.piece;
      const a = (rotate * Math.PI) / 180;
      for (const [cx, cy] of [
        [0, 0],
        [1512, 0],
        [0, 862],
        [1512, 862],
      ]) {
        // the corner in the piece's own frame
        const dx = (cx - middle[0] - x) / scale;
        const dy = (cy - middle[1] - y) / scale;
        const px = middle[0] + dx * Math.cos(a) + dy * Math.sin(a);
        const py = middle[1] - dx * Math.sin(a) + dy * Math.cos(a);
        // (where the box shows the piece, its part covers it; past the piece's own edge there's only its ground)
        const inPiece =
          px >= whole.left &&
          px <= whole.left + whole.width &&
          py >= whole.top &&
          py <= whole.top + whole.height;
        if (inPiece) {
          expect(px).toBeGreaterThanOrEqual(part.left - 1e-6);
          expect(px).toBeLessThanOrEqual(part.left + part.width + 1e-6);
          expect(py).toBeGreaterThanOrEqual(part.top - 1e-6);
          expect(py).toBeLessThanOrEqual(part.top + part.height + 1e-6);
        }
      }
      expect(part.left).toBeGreaterThanOrEqual(Math.floor(whole.left));
      expect(part.top + part.height).toBeLessThanOrEqual(Math.ceil(whole.top + whole.height));
      // (about the box's pixels, not the piece's: a 1512 x 862 box draws far less than its 1901 x 2035 piece)
      expect(part.width * part.height).toBeLessThan(1.6 * 1512 * 862);
      expect(place.transform).toBe(
        `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`,
      );
    }
  });

  it('places nothing in an empty box', () => {
    expect(placePiece(0, 862, backgroundPlaceLight, 1)).toBeNull();
  });
});
