import type { FreshBackgroundPlace } from '../RazorSenseEngine/types';

type Rect = { left: number; top: number; width: number; height: number };

/** Where Default Paused 2.0's piece goes in a box, and the part of it the box shows (CSS px from the box's top-left). */
type PiecePlace = {
  /** comp px -> CSS px, before the piece's own scale */
  z: number;
  /** the whole comp, in the piece's own frame (before it's moved, scaled and turned) */
  whole: Rect;
  /** the part of it the box can show (its canvas): the box's corners taken back into the piece's frame, round it, whole CSS px */
  part: Rect;
  /** that part as comp px [x, y, w, h] from the comp's top-left (the engine's region) */
  region: [number, number, number, number];
  /** the piece's CSS transform (moved, turned, scaled), round the box's middle */
  transform: string;
  /** the box's middle (CSS px from the box's top-left): the transform's origin */
  middle: [number, number];
};

/**
 * Default Paused 2.0 in a W x H box, as the login page has it: its tab's comp cover-fitted to the box (1 comp px = 0.5 CSS px on a
 * 1512 x 862 page), x scale; this comp's middle where the tab has it; then the whole piece moved, scaled and turned round the box's
 * middle (its `piece` values). The canvas is only the part of the piece the box can show, so a piece about twice the page's size
 * draws about the page's pixels, not its own. Null when none of it is in the box.
 */
const placePiece = (
  boxWidth: number,
  boxHeight: number,
  place: FreshBackgroundPlace,
  scale: number,
): PiecePlace | null => {
  const { comp } = place;
  if (!(boxWidth > 0 && boxHeight > 0)) return null;
  const z = Math.max(boxWidth / place.ref.w, boxHeight / place.ref.h) * scale;
  const mx = boxWidth / 2;
  const my = boxHeight / 2;
  const whole: Rect = {
    left: mx + (place.centre[0] - comp.w / 2) * z,
    top: my + (place.centre[1] - comp.h / 2) * z,
    width: comp.w * z,
    height: comp.h * z,
  };
  const { x, y, scale: k, rotate } = place.piece;
  const a = (rotate * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const kk = k > 0 ? k : 1;
  // the box's corners in the piece's own frame: back round its middle, the move undone, the scale undone, the turn undone
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const [cx, cy] of [
    [0, 0],
    [boxWidth, 0],
    [0, boxHeight],
    [boxWidth, boxHeight],
  ]) {
    const dx = (cx - mx - x) / kk;
    const dy = (cy - my - y) / kk;
    const px = mx + dx * cos + dy * sin;
    const py = my - dx * sin + dy * cos;
    x0 = Math.min(x0, px);
    y0 = Math.min(y0, py);
    x1 = Math.max(x1, px);
    y1 = Math.max(y1, py);
  }
  // only what's in the comp, rounded out to whole CSS px
  const left = Math.floor(Math.max(x0, whole.left));
  const top = Math.floor(Math.max(y0, whole.top));
  const right = Math.ceil(Math.min(x1, whole.left + whole.width));
  const bottom = Math.ceil(Math.min(y1, whole.top + whole.height));
  if (right - left < 1 || bottom - top < 1) return null;
  const part: Rect = { left, top, width: right - left, height: bottom - top };
  return {
    z,
    whole,
    part,
    region: [
      (part.left - whole.left) / z,
      (part.top - whole.top) / z,
      part.width / z,
      part.height / z,
    ],
    transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${kk})`,
    middle: [mx, my],
  };
};

export { placePiece };
export type { PiecePlace };
