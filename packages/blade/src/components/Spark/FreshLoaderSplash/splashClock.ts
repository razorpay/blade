import type { FreshDoc } from '../RazorSenseEngine';

/**
 * The loading splash's clock, as flow 9 plays its loader: the glyph's loop (piece 1) runs from the start to b at speed r1 and
 * goes round a -> b for as long as the page is loading; once it isn't, it carries on past b into piece 2 (the piece grows, then
 * everything fades to the ground) at speed r2, and is done at `end`.
 */
type SplashClock = {
  a: number;
  b: number;
  r1: number;
  r2: number;
  end: number;
};

type SplashClockState = {
  /** the comp's time */
  t: number;
  /** the breathing clock */
  alive: number;
};

const getSplashClock = (doc: FreshDoc): SplashClock | null => {
  const c = doc.ui?.freshSplash;
  if (!c?.r1) return null;
  return { a: c.a, b: c.b, r1: c.r1, r2: c.r2, end: c.end };
};

/** Moves the clock on by dt (s); while isLoading it stays in the glyph's loop. Returns the comp time to show. */
const stepSplashClock = (
  c: SplashClock,
  state: SplashClockState,
  dt: number,
  isLoading: boolean,
): number => {
  const rate = state.t < c.b ? c.r1 : c.r2;
  state.t += dt * rate;
  state.alive += dt * rate;
  if (isLoading && state.t >= c.b) state.t = c.a + ((state.t - c.b) % (c.b - c.a));
  return Math.min(state.t, c.end);
};

/**
 * How long (s, real time) the clock still has to run once loading is over: the rest of the glyph's first pass, if it's still
 * on it, then piece 2 to the end.
 */
const splashRemaining = (c: SplashClock, state: SplashClockState): number => {
  const first = state.t < c.b ? (c.b - state.t) / c.r1 : 0;
  return first + (c.end - Math.max(state.t, c.b)) / c.r2;
};

export { getSplashClock, stepSplashClock, splashRemaining };
export type { SplashClock, SplashClockState };
