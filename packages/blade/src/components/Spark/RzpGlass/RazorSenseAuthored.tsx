/* eslint-disable react/react-in-jsx-scope */

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { RazorSenseOperationalMode } from './modes';
import {
  getRazorSenseOperationalModeVideoSources,
  RAZOR_SENSE_OPERATIONAL_MODES,
  RAZOR_SENSE_OPERATIONAL_MODE_BACKGROUNDS,
  RAZOR_SENSE_OPERATIONAL_MODE_TIMINGS,
} from './modes';
import type { SemanticRazorSenseProps } from './types';
import { captureVideoCoverFrame, DEFAULT_CDN_PATH } from './utils';
import { useTheme } from '~components/BladeProvider';
import { useMergeRefs } from '~utils/useMergeRefs';

const FADE_IN_MS = 200;
const DEFAULT_STATE_TRANSITION_SECONDS = 0.4;

type RazorSenseAuthoredProps = Omit<SemanticRazorSenseProps, 'mode'> & {
  mode: RazorSenseOperationalMode;
};

type ThinkingLoopRuntime = {
  front: HTMLVideoElement;
  back: HTMLVideoElement;
  isCrossfading: boolean;
};

type ThinkingLoopSnapshot = {
  frontWasPrimary: boolean;
  frontTime: number;
  backTime: number;
  frontOpacity: number;
  backOpacity: number;
  isCrossfading: boolean;
};

type VideoWithFrameCallback = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: () => void) => number;
};

const RazorSenseAuthored = forwardRef<HTMLDivElement, RazorSenseAuthoredProps>(
  function RazorSenseAuthored(props, forwardedRef) {
    const {
      mode,
      width = '100%',
      height = '100%',
      className,
      style,
      assetsPath = DEFAULT_CDN_PATH,
      modeTransitionDuration = DEFAULT_STATE_TRANSITION_SECONDS,
      paused = false,
      playbackRate = 1,
      startTime,
      endTime,
      onLoad,
      onError,
    } = props;
    const { colorScheme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const schemeSnapshotCanvasRef = useRef<HTMLCanvasElement>(null);
    const videoRefs = useRef<Partial<Record<RazorSenseOperationalMode, HTMLVideoElement>>>({});
    const thinkingLoopVideoRef = useRef<HTMLVideoElement>(null);
    const thinkingLoopRafRef = useRef<number | null>(null);
    const thinkingLoopRuntimeRef = useRef<ThinkingLoopRuntime | null>(null);
    const playbackTimesRef = useRef<Partial<Record<RazorSenseOperationalMode, number>>>({});
    const pendingPlaybackTimesRef = useRef<Partial<Record<RazorSenseOperationalMode, number>>>({});
    const pendingTerminalModeRef = useRef<RazorSenseOperationalMode | null>(null);
    const pendingThinkingLoopSnapshotRef = useRef<ThinkingLoopSnapshot | null>(null);
    const lastSnapshotAtRef = useRef(0);
    const displayedColorSchemeRef = useRef(colorScheme);
    const requestedColorSchemeRef = useRef(colorScheme);
    const schemeTransitionPendingRef = useRef(false);
    const schemeTransitionGenerationRef = useRef(0);
    const modeRef = useRef(mode);
    const pausedRef = useRef(paused);
    const playbackRateRef = useRef(playbackRate);
    const startTimeRef = useRef(startTime);
    const endTimeRef = useRef(endTime);
    const transitionDurationRef = useRef(modeTransitionDuration);
    const onLoadRef = useRef(onLoad);
    const onErrorRef = useRef(onError);
    const loadedModesRef = useRef(new Set<RazorSenseOperationalMode>());
    const failedModeErrorsRef = useRef(new Map<RazorSenseOperationalMode, Error>());
    const hasLoadedRef = useRef(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isThinkingLoopReady, setIsThinkingLoopReady] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [, setSchemeTransitionEpoch] = useState(0);
    const sources = getRazorSenseOperationalModeVideoSources(assetsPath, colorScheme);

    if (requestedColorSchemeRef.current !== colorScheme) {
      const pendingTimes = { ...playbackTimesRef.current };
      const activeVideo = videoRefs.current[mode];
      if (activeVideo?.readyState && Number.isFinite(activeVideo.currentTime)) {
        pendingTimes[mode] = activeVideo.currentTime;
      }
      pendingPlaybackTimesRef.current = pendingTimes;

      const timing = RAZOR_SENSE_OPERATIONAL_MODE_TIMINGS[mode];
      const terminalTime = endTimeRef.current ?? timing.endTime;
      pendingTerminalModeRef.current =
        !timing.loop && activeVideo && activeVideo.currentTime >= terminalTime - 0.06 ? mode : null;

      const thinkingRuntime = thinkingLoopRuntimeRef.current;
      const thinkingPrimary = videoRefs.current.thinking;
      pendingThinkingLoopSnapshotRef.current =
        thinkingRuntime && thinkingPrimary
          ? {
              frontWasPrimary: thinkingRuntime.front === thinkingPrimary,
              frontTime: thinkingRuntime.front.currentTime,
              backTime: thinkingRuntime.back.currentTime,
              frontOpacity: Number(thinkingRuntime.front.style.opacity || 1),
              backOpacity: Number(thinkingRuntime.back.style.opacity || 0),
              isCrossfading: thinkingRuntime.isCrossfading,
            }
          : null;

      requestedColorSchemeRef.current = colorScheme;
      schemeTransitionPendingRef.current = true;
      schemeTransitionGenerationRef.current += 1;
    }

    const completeSchemeTransition = useCallback(
      (candidate: RazorSenseOperationalMode): void => {
        if (
          candidate !== modeRef.current ||
          !schemeTransitionPendingRef.current ||
          requestedColorSchemeRef.current !== colorScheme
        ) {
          return;
        }
        const completionGeneration = schemeTransitionGenerationRef.current;
        window.requestAnimationFrame(() => {
          if (
            !schemeTransitionPendingRef.current ||
            requestedColorSchemeRef.current !== colorScheme ||
            schemeTransitionGenerationRef.current !== completionGeneration
          ) {
            return;
          }
          displayedColorSchemeRef.current = colorScheme;
          schemeTransitionPendingRef.current = false;
          pendingPlaybackTimesRef.current = {};
          pendingTerminalModeRef.current = null;
          pendingThinkingLoopSnapshotRef.current = null;
          setSchemeTransitionEpoch((epoch) => epoch + 1);
        });
      },
      [colorScheme],
    );

    const completeSchemeTransitionAfterDecodedFrames = useCallback(
      (
        candidate: RazorSenseOperationalMode,
        videos: HTMLVideoElement[],
        waitForVideoFrame = true,
      ): void => {
        if (videos.length === 0) {
          completeSchemeTransition(candidate);
          return;
        }

        let remainingFrames = videos.length;
        const markFrameReady = (): void => {
          remainingFrames -= 1;
          if (remainingFrames === 0) completeSchemeTransition(candidate);
        };

        videos.forEach((video) => {
          const waitForPresentedFrame = (): void => {
            const frameVideo = video as VideoWithFrameCallback;
            if (
              waitForVideoFrame &&
              !pausedRef.current &&
              !document.hidden &&
              frameVideo.requestVideoFrameCallback
            ) {
              frameVideo.requestVideoFrameCallback(markFrameReady);
            } else {
              window.requestAnimationFrame(markFrameReady);
            }
          };

          if (video.seeking) {
            video.addEventListener('seeked', waitForPresentedFrame, { once: true });
          } else {
            waitForPresentedFrame();
          }
        });
      },
      [completeSchemeTransition],
    );

    const getModeStartTime = (candidate: RazorSenseOperationalMode): number =>
      startTimeRef.current ?? RAZOR_SENSE_OPERATIONAL_MODE_TIMINGS[candidate].startTime;

    modeRef.current = mode;
    pausedRef.current = paused;
    playbackRateRef.current = playbackRate;
    startTimeRef.current = startTime;
    endTimeRef.current = endTime;
    transitionDurationRef.current = modeTransitionDuration;
    onLoadRef.current = onLoad;
    onErrorRef.current = onError;

    useEffect(() => {
      loadedModesRef.current.clear();
      failedModeErrorsRef.current.clear();
      setHasError(false);
      setIsThinkingLoopReady(false);
    }, [colorScheme]);

    useEffect(() => {
      const knownError = failedModeErrorsRef.current.get(mode);
      if (knownError) {
        setHasError(true);
        onErrorRef.current?.(knownError);
      } else if (loadedModesRef.current.has(mode)) {
        setHasError(false);
        setIsInitialized(true);
        if (!hasLoadedRef.current) {
          hasLoadedRef.current = true;
          onLoadRef.current?.();
        }
      }

      const targetVideo = videoRefs.current[mode];
      if (targetVideo) {
        targetVideo.currentTime = Math.max(0, getModeStartTime(mode));
        targetVideo.playbackRate = playbackRateRef.current;
        if (!pausedRef.current && !document.hidden) {
          targetVideo.play().catch(() => undefined);
        }
      }

      const pausePreviousVideos = window.setTimeout(() => {
        Object.entries(videoRefs.current).forEach(([candidate, video]) => {
          if (candidate !== mode) video?.pause();
        });
        if (mode !== 'thinking') thinkingLoopVideoRef.current?.pause();
      }, transitionDurationRef.current * 1000 + 60);

      return () => window.clearTimeout(pausePreviousVideos);
    }, [mode]);

    useEffect(() => {
      Object.entries(videoRefs.current).forEach(([candidate, video]) => {
        if (!video) return;
        video.playbackRate = playbackRate;
        if (candidate === 'thinking') return;
        if (paused || candidate !== mode || document.hidden) {
          video.pause();
        } else {
          video.play().catch(() => undefined);
        }
      });

      const thinkingRuntime = thinkingLoopRuntimeRef.current;
      if (thinkingRuntime) {
        thinkingRuntime.front.playbackRate = playbackRate;
        thinkingRuntime.back.playbackRate = playbackRate;

        if (mode !== 'thinking' || paused || document.hidden) {
          thinkingRuntime.front.pause();
          thinkingRuntime.back.pause();
        } else if (thinkingRuntime.isCrossfading) {
          thinkingRuntime.front.play().catch(() => undefined);
          thinkingRuntime.back.play().catch(() => undefined);
        } else {
          thinkingRuntime.front.play().catch(() => undefined);
          thinkingRuntime.back.pause();
        }
      } else if (mode !== 'thinking' || paused) {
        thinkingLoopVideoRef.current?.pause();
      }
    }, [mode, paused, playbackRate]);

    useEffect(() => {
      if (thinkingLoopRafRef.current !== null) {
        cancelAnimationFrame(thinkingLoopRafRef.current);
        thinkingLoopRafRef.current = null;
      }

      const primary = videoRefs.current.thinking;
      const secondary = thinkingLoopVideoRef.current;
      if (
        mode !== 'thinking' ||
        !isInitialized ||
        !isThinkingLoopReady ||
        !loadedModesRef.current.has('thinking') ||
        !primary ||
        !secondary
      )
        return undefined;

      const timing = RAZOR_SENSE_OPERATIONAL_MODE_TIMINGS.thinking;
      const loopStart = startTime ?? timing.startTime;
      const loopEnd = endTime ?? timing.endTime;
      const crossfadeDuration = Math.min(
        timing.crossfadeDuration ?? 0,
        Math.max(0, loopEnd - loopStart) / 2,
      );
      if (crossfadeDuration === 0) return undefined;

      const schemeSnapshot = schemeTransitionPendingRef.current
        ? pendingThinkingLoopSnapshotRef.current
        : null;
      const runtime: ThinkingLoopRuntime = {
        front: schemeSnapshot?.frontWasPrimary === false ? secondary : primary,
        back: schemeSnapshot?.frontWasPrimary === false ? primary : secondary,
        isCrossfading: schemeSnapshot?.isCrossfading ?? false,
      };
      thinkingLoopRuntimeRef.current = runtime;
      let active = true;

      runtime.front.currentTime = Math.max(
        0,
        schemeSnapshot?.frontTime ?? pendingPlaybackTimesRef.current.thinking ?? loopStart,
      );
      runtime.front.playbackRate = playbackRateRef.current;
      runtime.front.style.opacity = String(schemeSnapshot?.frontOpacity ?? 1);
      runtime.back.currentTime = Math.max(0, schemeSnapshot?.backTime ?? loopStart);
      runtime.back.playbackRate = playbackRateRef.current;
      runtime.back.style.opacity = String(schemeSnapshot?.backOpacity ?? 0);
      if (!pausedRef.current && !document.hidden) {
        runtime.front.play().catch(() => undefined);
        if (runtime.isCrossfading) {
          runtime.back.play().catch(() => undefined);
        } else {
          runtime.back.pause();
        }
      } else {
        runtime.front.pause();
        runtime.back.pause();
      }

      if (schemeTransitionPendingRef.current) {
        completeSchemeTransitionAfterDecodedFrames(
          'thinking',
          runtime.isCrossfading ? [runtime.front, runtime.back] : [runtime.front],
        );
      }

      const renderLoop = (): void => {
        if (!active) return;

        playbackTimesRef.current.thinking = runtime.front.currentTime;

        const crossfadeStart = loopEnd - crossfadeDuration;
        if (!runtime.isCrossfading && runtime.front.currentTime >= crossfadeStart) {
          runtime.back.currentTime = Math.max(0, loopStart);
          runtime.back.playbackRate = playbackRateRef.current;
          if (!pausedRef.current && !document.hidden) {
            runtime.back.play().catch(() => undefined);
          }
          runtime.isCrossfading = true;
        }

        if (runtime.isCrossfading) {
          const progress = Math.max(
            0,
            Math.min(1, (runtime.front.currentTime - crossfadeStart) / crossfadeDuration),
          );
          runtime.front.style.opacity = String(1 - progress);
          runtime.back.style.opacity = String(progress);

          if (progress >= 0.995 || runtime.front.ended) {
            runtime.front.pause();
            runtime.front.currentTime = Math.max(0, loopStart);
            runtime.front.style.opacity = '0';
            runtime.back.style.opacity = '1';
            [runtime.front, runtime.back] = [runtime.back, runtime.front];
            runtime.isCrossfading = false;
          }
        }

        const now = performance.now();
        if (!schemeTransitionPendingRef.current && now - lastSnapshotAtRef.current >= 120) {
          const frontOpacity = Number(runtime.front.style.opacity || 1);
          const backOpacity = Number(runtime.back.style.opacity || 0);
          captureVideoCoverFrame(
            runtime.front,
            schemeSnapshotCanvasRef.current,
            containerRef.current,
            'center',
            frontOpacity,
          );
          if (backOpacity > 0.001) {
            captureVideoCoverFrame(
              runtime.back,
              schemeSnapshotCanvasRef.current,
              containerRef.current,
              'center',
              backOpacity,
              false,
            );
          }
          lastSnapshotAtRef.current = now;
        }

        thinkingLoopRafRef.current = requestAnimationFrame(renderLoop);
      };

      thinkingLoopRafRef.current = requestAnimationFrame(renderLoop);
      return () => {
        active = false;
        if (thinkingLoopRafRef.current !== null) {
          cancelAnimationFrame(thinkingLoopRafRef.current);
          thinkingLoopRafRef.current = null;
        }
        thinkingLoopRuntimeRef.current = null;
        primary.style.opacity = '1';
        secondary.style.opacity = '0';
        secondary.pause();
      };
    }, [
      completeSchemeTransitionAfterDecodedFrames,
      endTime,
      isInitialized,
      isThinkingLoopReady,
      mode,
      startTime,
    ]);

    useEffect(() => {
      const handleVisibilityChange = (): void => {
        if (document.hidden) {
          Object.values(videoRefs.current).forEach((video) => video?.pause());
          thinkingLoopVideoRef.current?.pause();
          return;
        }

        if (!pausedRef.current) {
          if (modeRef.current === 'thinking') {
            const runtime = thinkingLoopRuntimeRef.current;
            if (runtime?.isCrossfading) {
              runtime.front.play().catch(() => undefined);
              runtime.back.play().catch(() => undefined);
            } else if (runtime) {
              runtime.front.play().catch(() => undefined);
              runtime.back.pause();
            } else {
              videoRefs.current.thinking?.play().catch(() => undefined);
            }
          } else {
            videoRefs.current[modeRef.current]?.play().catch(() => undefined);
          }
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    useEffect(
      () => () => {
        Object.values(videoRefs.current).forEach((video) => {
          video?.pause();
          if (video) {
            video.src = '';
            video.load();
          }
        });
        if (thinkingLoopRafRef.current !== null) cancelAnimationFrame(thinkingLoopRafRef.current);
        thinkingLoopVideoRef.current?.pause();
        if (thinkingLoopVideoRef.current) {
          thinkingLoopVideoRef.current.src = '';
          thinkingLoopVideoRef.current.load();
        }
      },
      [],
    );

    const mergedRef = useMergeRefs(forwardedRef, containerRef);
    const widthStyle = typeof width === 'number' ? `${width}px` : width;
    const heightStyle = typeof height === 'number' ? `${height}px` : height;
    const displayedColorScheme = schemeTransitionPendingRef.current
      ? displayedColorSchemeRef.current
      : colorScheme;

    return (
      <div
        ref={mergedRef}
        className={className}
        style={{
          width: widthStyle,
          height: heightStyle,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: RAZOR_SENSE_OPERATIONAL_MODE_BACKGROUNDS[displayedColorScheme][mode],
          transition: `${FADE_IN_MS}ms opacity, ${
            modeTransitionDuration * 1000
          }ms background-color`,
          opacity: isInitialized || hasError ? 1 : 0,
          ...style,
        }}
      >
        {RAZOR_SENSE_OPERATIONAL_MODES.map((candidate) => (
          <div
            key={candidate}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: mode === candidate ? 1 : 0,
              transition: `${modeTransitionDuration * 1000}ms linear opacity`,
              transform: colorScheme === 'dark' ? 'scaleX(1.2)' : 'scaleX(1)',
              transitionProperty: 'opacity, transform',
              pointerEvents: 'none',
            }}
          >
            <video
              ref={(video) => {
                if (video) videoRefs.current[candidate] = video;
              }}
              src={sources[candidate]}
              muted
              loop={endTime === undefined && RAZOR_SENSE_OPERATIONAL_MODE_TIMINGS[candidate].loop}
              playsInline
              preload={candidate === mode ? 'auto' : 'metadata'}
              onLoadedData={() => {
                loadedModesRef.current.add(candidate);
                failedModeErrorsRef.current.delete(candidate);
                if (candidate !== modeRef.current) return;
                const video = videoRefs.current[candidate];
                const isTerminalRestore = pendingTerminalModeRef.current === candidate;
                if (video) {
                  const restoredTime = schemeTransitionPendingRef.current
                    ? pendingPlaybackTimesRef.current[candidate]
                    : undefined;
                  const timing = RAZOR_SENSE_OPERATIONAL_MODE_TIMINGS[candidate];
                  const terminalFrameTime = Math.max(
                    getModeStartTime(candidate),
                    (endTimeRef.current ?? timing.endTime) - 1 / 30,
                  );
                  video.currentTime = Math.max(
                    0,
                    isTerminalRestore
                      ? terminalFrameTime
                      : restoredTime ?? getModeStartTime(candidate),
                  );
                  video.playbackRate = playbackRateRef.current;
                  if (!pausedRef.current && !document.hidden && !isTerminalRestore) {
                    video.play().catch(() => undefined);
                  } else {
                    video.pause();
                  }
                }
                setHasError(false);
                setIsInitialized(true);
                if (!hasLoadedRef.current) {
                  hasLoadedRef.current = true;
                  onLoadRef.current?.();
                }
                if (candidate !== 'thinking' && video) {
                  completeSchemeTransitionAfterDecodedFrames(
                    candidate,
                    [video],
                    !isTerminalRestore,
                  );
                }
              }}
              onTimeUpdate={(event) => {
                const timing = RAZOR_SENSE_OPERATIONAL_MODE_TIMINGS[candidate];
                const activeEndTime = endTimeRef.current ?? timing.endTime;
                const shouldLoop = endTimeRef.current !== undefined || timing.loop;
                if (
                  candidate === modeRef.current &&
                  shouldLoop &&
                  event.currentTarget.currentTime >= activeEndTime
                ) {
                  event.currentTarget.currentTime = Math.max(0, getModeStartTime(candidate));
                }
                playbackTimesRef.current[candidate] = event.currentTarget.currentTime;
                if (candidate === modeRef.current && !schemeTransitionPendingRef.current) {
                  captureVideoCoverFrame(
                    event.currentTarget,
                    schemeSnapshotCanvasRef.current,
                    containerRef.current,
                    candidate === 'typing' ? 'bottom' : 'center',
                  );
                }
              }}
              onError={() => {
                const error = new Error(
                  `RazorSense: Failed to load the ${candidate} authored state`,
                );
                loadedModesRef.current.delete(candidate);
                failedModeErrorsRef.current.set(candidate, error);
                if (candidate !== modeRef.current) return;
                setHasError(true);
                onErrorRef.current?.(error);
              }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: candidate === 'typing' ? 'center bottom' : 'center',
                opacity: 1,
                pointerEvents: 'none',
              }}
            />
            {candidate === 'thinking' ? (
              <video
                ref={thinkingLoopVideoRef}
                src={sources.thinking}
                muted
                playsInline
                preload={mode === 'thinking' ? 'auto' : 'metadata'}
                onLoadedData={() => setIsThinkingLoopReady(true)}
                onError={() => {
                  setIsThinkingLoopReady(false);
                  const primary = videoRefs.current.thinking;
                  if (primary) primary.loop = true;
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />
            ) : null}
          </div>
        ))}
        <canvas
          ref={schemeSnapshotCanvasRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            opacity: schemeTransitionPendingRef.current ? 1 : 0,
            transform: displayedColorScheme === 'dark' ? 'scaleX(1.2)' : 'scaleX(1)',
            transition: schemeTransitionPendingRef.current
              ? 'none'
              : `${modeTransitionDuration * 1000}ms ease opacity`,
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  },
);

export { RazorSenseAuthored };
export type { RazorSenseAuthoredProps };
