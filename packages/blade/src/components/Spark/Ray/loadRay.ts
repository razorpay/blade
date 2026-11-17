import type { RayState } from './types';

/**
 * Internal (web): Ray's code, and the film for `state`, fetched while the page is idle, before any Ray is made (code only: no
 * canvases, no GPU; RayMount.prefetch). For a Ray that appears later, a button's as the pointer nears it: he gets going at once
 * instead of downloading first, so his film is ready before the hover (the device test, GTX 1650). Best effort: it never rejects.
 * A failed download (offline, a chunk gone after a deploy) is left to the real load as a Ray mounts, which reports it (the PR
 * review).
 */
const loadRay = (state?: RayState): Promise<void> =>
  new Promise<void>((resolve) => {
    if (typeof requestIdleCallback === 'function')
      requestIdleCallback(() => resolve(), { timeout: 2000 });
    else setTimeout(resolve, 300);
  })
    .then(() => import('./RayMount'))
    .then(({ RayMount }) => RayMount.prefetch(state))
    .catch(() => undefined);

export { loadRay };
