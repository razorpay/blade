import { paceFor } from './rayPace';

/**
 * The one frame loop the page's Rays draw in: every Ray's (RayMount) and every Ray loader's (RayLoaderMount; Saurav's round-6 review:
 * the loader had a loop of its own, outside the pace, so it drew every frame, 120 a second on a 120 Hz screen, while the page loaded).
 * Each animation frame, the ones booked for it first read what they need measured (all of them, before any of them writes), then
 * draw. Their work is timed together and they draw every `pace`-th frame (rayPace): one pace for the whole page.
 */
type FrameClient = {
  /** The start of its frame, before any of them writes: what it needs measured is read now. */
  readLayout?: (now: number) => void;
  frame: (now: number) => void;
};

const PACE_EVERY_MS = 2000; // how often the pace they draw at is looked at again (rayPace)

const booked = new Set<FrameClient>(); // the ones that want the next frame
let raf = 0;
// the pace they draw at (rayPace): every `pace`-th animation frame, from how long a drawn frame's work takes
let frames = 0;
let pace = 1;
let interval = 1000 / 60; // ms between animation frames, smoothed
let cost = 0; // ms a drawn frame's work takes (all of theirs), smoothed
let lastAt = 0;
let pacedAt = 0;

/** One's fault never stops another: it's reported as an uncaught error would be, and the rest draw on. */
const guard = (run: () => void): void => {
  try {
    run();
  } catch (error: unknown) {
    queueMicrotask(() => {
      throw error;
    });
  }
};

const onFrame = (now: number): void => {
  raf = 0;
  const gap = now - lastAt;
  lastAt = now;
  if (gap > 0 && gap < 100) interval += (gap - interval) * 0.05;
  frames += 1;
  if (frames % pace !== 0) {
    // a frame they sit out: still booked, for the next
    if (booked.size) raf = requestAnimationFrame(onFrame);
    return;
  }
  const due = [...booked];
  booked.clear();
  const started = performance.now();
  due.forEach((client) => client.readLayout && guard(() => client.readLayout?.(now)));
  due.forEach((client) => guard(() => client.frame(now)));
  cost += (performance.now() - started - cost) * 0.1;
  if (now - pacedAt >= PACE_EVERY_MS) {
    pacedAt = now;
    pace = paceFor(cost, interval, pace);
  }
};

/** It draws in the next frame the pace lets them draw in (booked again from its frame for the one after). */
const bookFrame = (client: FrameClient): void => {
  booked.add(client);
  if (!raf) raf = requestAnimationFrame(onFrame);
};

const unbookFrame = (client: FrameClient): void => {
  booked.delete(client);
  if (booked.size || !raf) return;
  cancelAnimationFrame(raf);
  raf = 0;
};

/** The pace they draw at now: every `framePace()`-th animation frame (the debug view and the tests). */
const framePace = (): number => pace;

export { bookFrame, unbookFrame, framePace };
export type { FrameClient };
