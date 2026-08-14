type VideoFrameMetadataLike = {
  mediaTime: number;
};

type OptionalVideoFrameCallbacks = {
  requestVideoFrameCallback?: (
    callback: (now: number, metadata: VideoFrameMetadataLike) => void,
  ) => number;
  cancelVideoFrameCallback?: (callbackId: number) => void;
};

type SeekToRazorSenseVideoFrameOptions = {
  video: HTMLVideoElement;
  targetTime: number;
  frameRate: number;
  shouldRemainPaused: boolean;
  onReady: () => void;
};

type CancelVideoFrameWait = () => void;

const MEDIA_TIME_EPSILON_SECONDS = 0.0005;

const seekToRazorSenseVideoFrame = ({
  video,
  targetTime,
  frameRate,
  shouldRemainPaused,
  onReady,
}: SeekToRazorSenseVideoFrameOptions): CancelVideoFrameWait => {
  const frameCallbacks = (video as unknown) as OptionalVideoFrameCallbacks;
  const requestedTime = Math.max(0, targetTime);
  const frameDuration = 1 / Math.max(1, frameRate);
  const expectedFrameTime =
    Math.floor((requestedTime + MEDIA_TIME_EPSILON_SECONDS) * frameRate) / frameRate;
  let isCancelled = false;
  let frameCallbackId: number | null = null;
  let firstRafId: number | null = null;
  let secondRafId: number | null = null;
  let hasSeekCompleted = false;

  const cancelScheduledWork = (): void => {
    if (frameCallbackId !== null && frameCallbacks.cancelVideoFrameCallback) {
      frameCallbacks.cancelVideoFrameCallback(frameCallbackId);
    }
    frameCallbackId = null;
    if (firstRafId !== null) window.cancelAnimationFrame(firstRafId);
    if (secondRafId !== null) window.cancelAnimationFrame(secondRafId);
    firstRafId = null;
    secondRafId = null;
  };

  const cleanup = (): void => {
    video.removeEventListener('seeked', handleSeeked);
    video.removeEventListener('seeked', handleConfirmedFrameSeeked);
    cancelScheduledWork();
  };

  const finish = (): void => {
    if (isCancelled) return;
    isCancelled = true;
    cleanup();
    if (shouldRemainPaused) video.pause();
    onReady();
  };

  const isVideoStateReady = (): boolean =>
    !video.seeking &&
    video.readyState >= video.HAVE_CURRENT_DATA &&
    Math.abs(video.currentTime - requestedTime) <= frameDuration + MEDIA_TIME_EPSILON_SECONDS;

  const isExpectedFramePresented = (mediaTime: number): boolean =>
    isVideoStateReady() && Math.abs(mediaTime - expectedFrameTime) <= MEDIA_TIME_EPSILON_SECONDS;

  const waitWithAnimationFrames = (): void => {
    firstRafId = window.requestAnimationFrame(() => {
      firstRafId = null;
      secondRafId = window.requestAnimationFrame(() => {
        secondRafId = null;
        if (isCancelled) return;
        if (isVideoStateReady()) {
          finish();
        } else {
          waitWithAnimationFrames();
        }
      });
    });
  };

  const waitForPresentedFrame = (): void => {
    if (isCancelled) return;
    if (!frameCallbacks.requestVideoFrameCallback) {
      waitWithAnimationFrames();
      return;
    }

    frameCallbackId = frameCallbacks.requestVideoFrameCallback((_now, metadata) => {
      frameCallbackId = null;
      if (isCancelled) return;
      if (isExpectedFramePresented(metadata.mediaTime)) {
        if (shouldRemainPaused) {
          // Playback is only a delivery nudge for rVFC. Seek back to the exact
          // confirmed source timestamp before handing control to the exporter,
          // so scheduling jitter cannot leave the element on the next frame.
          video.pause();
          video.addEventListener('seeked', handleConfirmedFrameSeeked, { once: true });
          // Keep the media clock at the requested phase, safely inside the
          // already-confirmed frame's presentation interval. Seeking to the
          // frame's exact boundary can make Chromium composite either adjacent
          // frame even though both callbacks report the same mediaTime.
          video.currentTime = requestedTime;
          if (!video.seeking) handleConfirmedFrameSeeked();
        } else {
          finish();
        }
        return;
      }

      // A callback queued before the seek can still present the old frame. Keep
      // waiting until the browser reports the frame whose presentation interval
      // contains the requested time.
      if (
        !hasSeekCompleted ||
        video.seeking ||
        metadata.mediaTime < expectedFrameTime - MEDIA_TIME_EPSILON_SECONDS
      ) {
        waitForPresentedFrame();
        return;
      }

      // An unexpectedly late frame is corrected with a fresh seek. Register
      // the listener before assigning currentTime so a synchronous seek cannot
      // escape the readiness gate.
      hasSeekCompleted = false;
      video.addEventListener('seeked', handleSeeked, { once: true });
      waitForPresentedFrame();
      video.currentTime = expectedFrameTime;
      if (!video.seeking) handleSeeked();
    });
  };

  function handleSeeked(): void {
    video.removeEventListener('seeked', handleSeeked);
    if (isCancelled) return;
    hasSeekCompleted = true;
    if (!frameCallbacks.requestVideoFrameCallback) {
      waitWithAnimationFrames();
    } else if (shouldRemainPaused && video.paused && !document.hidden) {
      // Chromium does not guarantee rVFC delivery for a paused video after a
      // seek. Advance only until the requested frame is presented, then pause
      // again in finish(). This path is internal to deterministic still export.
      video.play().catch(() => undefined);
    }
  }

  function handleConfirmedFrameSeeked(): void {
    video.removeEventListener('seeked', handleConfirmedFrameSeeked);
    if (isCancelled) return;
    hasSeekCompleted = true;
    waitWithAnimationFrames();
  }

  video.addEventListener('seeked', handleSeeked, { once: true });
  if (frameCallbacks.requestVideoFrameCallback) waitForPresentedFrame();
  video.currentTime = requestedTime;
  if (!video.seeking) handleSeeked();

  return () => {
    if (isCancelled) return;
    isCancelled = true;
    cleanup();
  };
};

export { seekToRazorSenseVideoFrame };
export type { CancelVideoFrameWait };
