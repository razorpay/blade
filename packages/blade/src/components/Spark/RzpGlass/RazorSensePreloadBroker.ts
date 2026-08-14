type RazorSensePreloadReadiness = 'loadeddata' | 'canplaythrough';

type PreloadDeferredStatus = 'pending' | 'fulfilled' | 'rejected';

type PreloadDeferred = {
  promise: Promise<void>;
  resolve: () => void;
  reject: (error: Error) => void;
  status: PreloadDeferredStatus;
};

type RazorSensePreloadEntry = {
  src: string;
  video?: HTMLVideoElement;
  loadeddata: PreloadDeferred;
  canplaythrough: PreloadDeferred;
  requiredReadiness: RazorSensePreloadReadiness;
  lastRequestedAt: number;
  state: 'queued' | 'loading' | 'retained';
  releaseTimer?: number;
  readinessTimer?: number;
};

const MAX_BROKER_VIDEOS = 2;
const PRELOAD_RELEASE_TTL_MS = 10_000;
const PRELOAD_READINESS_TIMEOUT_MS = 30_000;

const entriesByUrl = new Map<string, RazorSensePreloadEntry>();
const pendingEntries: RazorSensePreloadEntry[] = [];
let ownedVideoCount = 0;
let isPumpingQueue = false;

const READINESS_RANK: Record<RazorSensePreloadReadiness, number> = {
  loadeddata: 0,
  canplaythrough: 1,
};

const createDeferred = (): PreloadDeferred => {
  let resolvePromise!: () => void, rejectPromise!: (error: Error) => void;
  const deferred: PreloadDeferred = {
    promise: new Promise<void>((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
    }),
    resolve: () => {
      if (deferred.status !== 'pending') return;
      deferred.status = 'fulfilled';
      resolvePromise();
    },
    reject: (error) => {
      if (deferred.status !== 'pending') return;
      deferred.status = 'rejected';
      rejectPromise(error);
    },
    status: 'pending',
  };

  // A caller may request one readiness level while the sibling readiness fails.
  // Observe both promises internally so the unused branch never becomes an
  // unhandled rejection.
  void deferred.promise.catch(() => undefined);
  return deferred;
};

const detachVideoHandlers = (video: HTMLVideoElement): void => {
  video.onloadeddata = null;
  video.oncanplaythrough = null;
  video.onerror = null;
};

const releaseVideo = (video: HTMLVideoElement): void => {
  detachVideoHandlers(video);
  try {
    video.pause();
  } catch {
    // Cleanup must continue even when a browser media shim cannot pause.
  }
  video.removeAttribute('src');
  try {
    video.load();
  } catch {
    // Removing the source already releases the retained media reference.
  }
};

const createAbortError = (src: string): Error => {
  if (typeof DOMException !== 'undefined') {
    return new DOMException(`RazorSense preload released before readiness: ${src}`, 'AbortError');
  }
  const error = new Error(`RazorSense preload released before readiness: ${src}`);
  error.name = 'AbortError';
  return error;
};

const createTimeoutError = (src: string): Error => {
  const error = new Error(`RazorSense preload timed out before readiness: ${src}`);
  error.name = 'TimeoutError';
  return error;
};

const clearReleaseTimer = (entry: RazorSensePreloadEntry): void => {
  if (entry.releaseTimer !== undefined && typeof window !== 'undefined') {
    window.clearTimeout(entry.releaseTimer);
  }
  entry.releaseTimer = undefined;
};

const clearReadinessTimer = (entry: RazorSensePreloadEntry): void => {
  if (entry.readinessTimer !== undefined && typeof window !== 'undefined') {
    window.clearTimeout(entry.readinessTimer);
  }
  entry.readinessTimer = undefined;
};

const isRequiredReadinessFulfilled = (entry: RazorSensePreloadEntry): boolean =>
  entry[entry.requiredReadiness].status === 'fulfilled';

const removeEntry = (
  entry: RazorSensePreloadEntry,
  shouldReleaseVideo: boolean,
  shouldPumpQueue = true,
): void => {
  if (entriesByUrl.get(entry.src) !== entry) return;
  entriesByUrl.delete(entry.src);
  clearReleaseTimer(entry);
  clearReadinessTimer(entry);

  if (entry.loadeddata.status === 'pending' || entry.canplaythrough.status === 'pending') {
    const error = createAbortError(entry.src);
    entry.loadeddata.reject(error);
    entry.canplaythrough.reject(error);
  }

  if (entry.video) {
    const video = entry.video;
    entry.video = undefined;
    ownedVideoCount = Math.max(0, ownedVideoCount - 1);
    if (shouldReleaseVideo) releaseVideo(video);
    else detachVideoHandlers(video);
  }

  if (shouldPumpQueue) pumpQueue();
};

const failEntry = (entry: RazorSensePreloadEntry, cause?: unknown): void => {
  if (entriesByUrl.get(entry.src) !== entry) return;
  const error =
    cause instanceof Error ? cause : new Error(`RazorSense: Failed to preload ${entry.src}`);
  entry.loadeddata.reject(error);
  entry.canplaythrough.reject(error);
  removeEntry(entry, true);
};

const scheduleRelease = (entry: RazorSensePreloadEntry): void => {
  if (
    typeof window === 'undefined' ||
    entriesByUrl.get(entry.src) !== entry ||
    entry.state !== 'retained' ||
    !isRequiredReadinessFulfilled(entry)
  ) {
    return;
  }
  clearReleaseTimer(entry);
  entry.releaseTimer = window.setTimeout(() => {
    entry.releaseTimer = undefined;
    removeEntry(entry, true);
  }, PRELOAD_RELEASE_TTL_MS);
};

const settleEntryIfReady = (entry: RazorSensePreloadEntry): void => {
  if (entriesByUrl.get(entry.src) !== entry || !isRequiredReadinessFulfilled(entry)) return;
  clearReadinessTimer(entry);
  entry.state = 'retained';
  scheduleRelease(entry);
  pumpQueue();
};

const armReadinessTimeout = (entry: RazorSensePreloadEntry): void => {
  clearReadinessTimer(entry);
  if (
    typeof window === 'undefined' ||
    entriesByUrl.get(entry.src) !== entry ||
    isRequiredReadinessFulfilled(entry)
  ) {
    return;
  }
  entry.readinessTimer = window.setTimeout(() => {
    entry.readinessTimer = undefined;
    failEntry(entry, createTimeoutError(entry.src));
  }, PRELOAD_READINESS_TIMEOUT_MS);
};

const startEntry = (entry: RazorSensePreloadEntry): void => {
  if (entriesByUrl.get(entry.src) !== entry || entry.state !== 'queued') return;

  let video: HTMLVideoElement;
  try {
    video = document.createElement('video');
  } catch (error: unknown) {
    failEntry(entry, error);
    return;
  }

  entry.video = video;
  entry.state = 'loading';
  ownedVideoCount += 1;

  video.crossOrigin = 'anonymous';
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.onloadeddata = () => {
    entry.loadeddata.resolve();
    settleEntryIfReady(entry);
  };
  video.oncanplaythrough = () => {
    entry.loadeddata.resolve();
    entry.canplaythrough.resolve();
    settleEntryIfReady(entry);
  };
  video.onerror = () => failEntry(entry);

  armReadinessTimeout(entry);
  try {
    video.src = entry.src;
    video.load();
  } catch (error: unknown) {
    failEntry(entry, error);
  }
};

function pumpQueue(): void {
  if (isPumpingQueue || typeof document === 'undefined') return;
  isPumpingQueue = true;

  try {
    while (pendingEntries.length > 0) {
      const hasQueuedEntry = pendingEntries.some(
        (entry) => entriesByUrl.get(entry.src) === entry && entry.state === 'queued',
      );
      if (!hasQueuedEntry) {
        pendingEntries.length = 0;
        break;
      }

      if (ownedVideoCount >= MAX_BROKER_VIDEOS) {
        const oldestRetained = [...entriesByUrl.values()]
          .filter((entry) => entry.state === 'retained')
          .sort((left, right) => left.lastRequestedAt - right.lastRequestedAt)[0];
        if (!oldestRetained) break;
        removeEntry(oldestRetained, true, false);
        continue;
      }

      let nextEntry = pendingEntries.shift();
      while (
        nextEntry &&
        (entriesByUrl.get(nextEntry.src) !== nextEntry || nextEntry.state !== 'queued')
      ) {
        nextEntry = pendingEntries.shift();
      }
      if (!nextEntry) break;
      startEntry(nextEntry);
    }
  } finally {
    isPumpingQueue = false;
  }
}

const createEntry = (
  src: string,
  readiness: RazorSensePreloadReadiness,
): RazorSensePreloadEntry => {
  const entry: RazorSensePreloadEntry = {
    src,
    loadeddata: createDeferred(),
    canplaythrough: createDeferred(),
    requiredReadiness: readiness,
    lastRequestedAt: Date.now(),
    state: 'queued',
  };
  entriesByUrl.set(src, entry);
  pendingEntries.push(entry);
  pumpQueue();
  return entry;
};

const preloadRazorSenseVideo = (
  src: string,
  readiness: RazorSensePreloadReadiness = 'loadeddata',
): Promise<void> => {
  if (typeof document === 'undefined') return Promise.resolve();
  const entry = entriesByUrl.get(src) ?? createEntry(src, readiness);
  entry.lastRequestedAt = Date.now();
  clearReleaseTimer(entry);

  if (READINESS_RANK[readiness] > READINESS_RANK[entry.requiredReadiness]) {
    entry.requiredReadiness = readiness;
  }

  if (isRequiredReadinessFulfilled(entry)) {
    entry.state = 'retained';
    scheduleRelease(entry);
  } else if (entry.video) {
    entry.state = 'loading';
    armReadinessTimeout(entry);
  }

  pumpQueue();
  return entry[readiness].promise;
};

/**
 * Transfers a prepared media element to a renderer when it can reuse the same
 * element. Callers own disposal after a successful claim.
 */
const claimRazorSensePreloadedVideo = (src: string): HTMLVideoElement | undefined => {
  const entry = entriesByUrl.get(src);
  if (
    !entry?.video ||
    entry.state !== 'retained' ||
    entry.loadeddata.status !== 'fulfilled' ||
    !isRequiredReadinessFulfilled(entry)
  ) {
    return undefined;
  }
  const video = entry.video;
  removeEntry(entry, false);
  return video;
};

const releaseRazorSensePreload = (src: string): void => {
  const entry = entriesByUrl.get(src);
  if (entry) removeEntry(entry, true);
};

const clearRazorSensePreloads = (): void => {
  const entries = [...entriesByUrl.values()];
  pendingEntries.length = 0;
  entries.forEach((entry) => removeEntry(entry, true, false));
};

export {
  claimRazorSensePreloadedVideo,
  clearRazorSensePreloads,
  preloadRazorSenseVideo,
  releaseRazorSensePreload,
};
export type { RazorSensePreloadReadiness };
