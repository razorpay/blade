/** how long a state's chunk that failed to load waits before it's asked for again (ms) */
const CHUNK_RETRY_MS = 30000;

/**
 * whether a chunk that failed to load at `failedAt` (performance.now ms; 0: it hasn't) waits a while yet: asked each frame, a deploy
 * that removed the old chunks made a 404 every frame; never asked again, one that failed while offline was gone for the session
 */
const isRetryLater = (failedAt: number): boolean =>
  failedAt > 0 && performance.now() - failedAt < CHUNK_RETRY_MS;

export { CHUNK_RETRY_MS, isRetryLater };
