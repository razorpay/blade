import type { FreshKey, FreshSuccessPiece } from '../RazorSenseEngine/types';
import { cubicBezier } from '../RazorSenseEngine/ease';

/** the orb's tick, and Blade's CheckIcon's centreline (4,12 9,17 20,6 of 24), as points of a 100 x 100 box */
const TICK = [
  [23, 52],
  [42, 70],
  [78, 31],
];
const CHECK = [
  [16.667, 50],
  [37.5, 70.833],
  [83.333, 25],
];

/** One frame of what's drawn over the orb (CSS px from the badge's middle), changed in place: nothing is made per frame but its path. */
type SuccessOverlay = {
  /** the badge: shown (it has started), its scale (its ease goes past 1 and back) and opacity */
  badge: { isShown: boolean; scale: number; opacity: number };
  /** the tick turning into the check: its box's middle and size, its scale and opacity, its path and stroke (in its 100 x 100 box), colour, round caps, how much of it is drawn in (dash offset: 1 none, 0 all) */
  tick: {
    x: number;
    y: number;
    size: number;
    scale: number;
    opacity: number;
    d: string;
    stroke: number;
    color: [number, number, number];
    isRound: boolean;
    dashOffset: number;
  };
};

const makeOverlay = (): SuccessOverlay => ({
  badge: { isShown: false, scale: 0, opacity: 0 },
  tick: {
    x: 0,
    y: 0,
    size: 0,
    scale: 0,
    opacity: 0,
    d: '',
    stroke: 0,
    color: [255, 255, 255],
    isRound: true,
    dashOffset: 1,
  },
});

/** a numbers track's value at t, as the engine evaluates it */
const valueAt = (keys: FreshKey[], t: number): number => {
  const n = keys.length;
  if (t <= keys[0].t) return keys[0].v as number;
  if (t >= keys[n - 1].t) return keys[n - 1].v as number;
  let i = 0;
  while (keys[i + 1].t <= t) i += 1;
  const a = keys[i];
  const b = keys[i + 1];
  if (a.e === 'hold') return a.v as number;
  const u = (t - a.t) / (b.t - a.t);
  return (
    (a.v as number) + ((b.v as number) - (a.v as number)) * cubicBezier(a.e ?? [0, 0, 1, 1], u)
  );
};

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

const hexRgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

/**
 * What's drawn over the orb at time t (success-blob's overlay.js piece(t)): Blade's badge popping in where the orb is as step 2
 * starts, and the orb's white tick, drawn in on it as it arrives, then turning into the badge's check (its size, stroke, shape,
 * colour and place). `ink` is the check's colour (Blade's positive icon colour). With the tick off, the check comes in with the badge.
 */
const overlayAt = (
  piece: FreshSuccessPiece,
  t: number,
  ink: [number, number, number],
  out: SuccessOverlay,
): SuccessOverlay => {
  const { moments: m, tick: T, hand: H, badge: Bd, cssPerComp: z } = piece;
  const bu = (t - m.badge) / Math.max(0.01, Bd.dur);
  const be = cubicBezier(Bd.ease, bu);
  const badgeScale = Math.max(0, Bd.from + (1 - Bd.from) * be);
  out.badge.isShown = bu > 0;
  out.badge.scale = badgeScale;
  out.badge.opacity = clamp01(be);
  const u = (t - m.tick) / Math.max(0.01, T.dur);
  const e = cubicBezier(T.ease, u);
  const hu = (t - m.hand) / Math.max(0.01, H.dur);
  const he = T.on ? cubicBezier(H.ease, hu) : 1;
  const hc = clamp01(he);
  const mix = (a: number, b: number): number => a + (b - a) * he;
  // the orb's middle now, from where it is as step 2 starts (the badge's middle)
  const rise = (valueAt(piece.y, t) - valueAt(piece.y, m.B)) * z;
  const size = mix(T.size * z, H.size);
  out.tick.size = size;
  out.tick.x = 0;
  out.tick.y = T.on ? mix(rise, 0) : 0;
  out.tick.scale = T.on ? T.from + (1 - T.from) * e : badgeScale;
  out.tick.opacity = T.on ? (u <= 0 ? 0 : 1) : clamp01(be);
  out.tick.stroke = (mix(T.stroke * z, H.stroke) / Math.max(0.5, size)) * 100;
  out.tick.d = `M${TICK.map(
    (q, i) => `${mix(q[0], CHECK[i][0]).toFixed(2)} ${mix(q[1], CHECK[i][1]).toFixed(2)}`,
  ).join(' L')}`;
  const white = hexRgb(T.color);
  for (let i = 0; i < 3; i += 1)
    out.tick.color[i] = Math.round(white[i] + (ink[i] - white[i]) * hc);
  out.tick.isRound = T.caps === 'round' || hc >= 0.5;
  out.tick.dashOffset = T.on ? 1 - clamp01(e) : 0;
  return out;
};

export { hexRgb, makeOverlay, overlayAt, valueAt };
export type { SuccessOverlay };
