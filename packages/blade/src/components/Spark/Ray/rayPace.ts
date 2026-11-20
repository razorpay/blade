/**
 * How often the Rays on a page draw (the performance re-review, 2026-11-16). Each drawn frame's work (every Ray's) is timed. When it
 * takes more than a quarter of the time between frames, they draw every other frame (then every third, …), never under 30 fps, and
 * go back up once the work would fit in a fifth. A fast machine draws every frame; a slow one keeps the page responsive. His look
 * doesn't change, only how smoothly he moves: his moves run on real time, so their speed stays right.
 */
const BUSY = 0.25; // more than this share of the time between frames: draw less often
const EASY = 0.2; // back up only once the work would fit in this share (so it doesn't flick between two paces)
const SLOWEST_FPS = 30;

/** Draw every `pace`-th frame: the least that keeps the work within BUSY (not under 30 fps), back up only within EASY. */
const paceFor = (costMs: number, intervalMs: number, current: number): number => {
  const slowest = Math.max(1, Math.floor(1000 / SLOWEST_FPS / intervalMs + 0.01));
  const share = (pace: number): number => costMs / (intervalMs * pace);
  let pace = 1;
  while (pace < slowest && share(pace) > BUSY) pace++;
  while (pace < Math.min(current, slowest) && share(pace) > EASY) pace++;
  return pace;
};

export { paceFor };
