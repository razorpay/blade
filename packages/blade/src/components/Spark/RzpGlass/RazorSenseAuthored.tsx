/* eslint-disable react/react-in-jsx-scope */

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { RazorSenseOperationalMode } from './modes';
import {
  RAZOR_SENSE_OPERATIONAL_MODE_BACKGROUNDS,
  RAZOR_SENSE_OPERATIONAL_MODE_TIMINGS,
} from './modes';
import { RazorSenseFallback } from './RazorSenseFallback';
import { RazorSenseAuthoredTransitionRenderer } from './RazorSenseAuthoredTransition';
import {
  getRazorSenseAsset,
  getRazorSenseRepresentativeFrame,
  selectRazorSenseVideoSource,
} from './razorSenseAssets';
import { MODE_REPRESENTATIVE_PHASE_SECONDS } from './razorSensePrograms';
import type { RazorSenseResolvedPlaybackPlan } from './razorSensePrograms';
import type { RazorSenseLifecycleState } from './RazorSenseRuntime';
import { seekToRazorSenseVideoFrame } from './RazorSenseVideoFrame';
import type { CancelVideoFrameWait } from './RazorSenseVideoFrame';
import type { SemanticRazorSenseProps } from './types';
import { captureVideoCoverFrame, DEFAULT_CDN_PATH } from './utils';
import { useTheme } from '~components/BladeProvider';
import type { ColorSchemeNames } from '~tokens/theme';
import { useMergeRefs } from '~utils/useMergeRefs';

const FADE_IN_MS = 200;
const DEFAULT_STATE_TRANSITION_SECONDS = 0.4;
const OUTGOING_LAYER_DISPOSAL_BUFFER_MS = 80;

type RazorSenseAuthoredProps = Omit<SemanticRazorSenseProps, 'mode'> & {
  mode: RazorSenseOperationalMode;
  /** @internal Resolved pause state from the parent semantic component. */
  paused?: boolean;
  /** @internal Shared runtime lifecycle. Direct internal renderers default to active. */
  runtimeState?: RazorSenseLifecycleState;
  /** @internal Shared runtime admission. Direct internal renderers default to admitted. */
  isRuntimeAdmitted?: boolean;
  /** @internal Used by the fallback exporter after the requested frame is presented. */
  onFrameReady?: () => void;
  /** @internal Reports every exact incoming frame without changing transition behavior. */
  onPresentationReady?: (mode: RazorSenseOperationalMode) => void;
  /** @internal Identifies a playback occurrence. A new identity restarts the same mode. */
  occurrenceId?: number;
  /** @internal Blade-resolved playback contract for this occurrence. */
  playback?: RazorSenseResolvedPlaybackPlan;
  /** @internal Reports each completed authored-source iteration, starting at one. */
  onIteration?: (iteration: number) => void;
  /** @internal Reports a finite occurrence after its exact terminal frame is presented. */
  onTerminal?: (iterationCount: number) => void;
};

type AuthoredLayer = {
  id: number;
  mode: RazorSenseOperationalMode;
  colorScheme: ColorSchemeNames;
  assetsPath: string;
  startTime?: number;
  endTime?: number;
  occurrenceId?: number;
  playback?: RazorSenseResolvedPlaybackPlan;
  resourceGeneration: number;
  opacity: number;
  status: 'loading' | 'visible' | 'outgoing';
};

type ThinkingLoopRuntime = {
  front: HTMLVideoElement;
  back: HTMLVideoElement;
  isCrossfading: boolean;
};

type LayerPlaybackSnapshot = {
  primaryTime: number;
  secondaryTime: number;
  primaryOpacity: number;
  secondaryOpacity: number;
  frontWasPrimary: boolean;
  isCrossfading: boolean;
  isTerminal: boolean;
  iterationCount: number;
  terminalReported: boolean;
};

type AuthoredLayerHandle = {
  capture(
    canvas: HTMLCanvasElement | null,
    container: HTMLElement | null,
    clearCanvas: boolean,
    includeHiddenLayer?: boolean,
  ): boolean;
  getPlaybackSnapshot(): LayerPlaybackSnapshot | undefined;
  release(): void;
};

type AuthoredVideoLayerProps = {
  layer: AuthoredLayer;
  source: string;
  playbackRate: number;
  canPrepareFrame: boolean;
  readinessGeneration: number;
  shouldPlay: boolean;
  transitionDurationMs: number;
  restoreSnapshot?: LayerPlaybackSnapshot;
  onReady: (layerId: number, readinessGeneration: number) => void;
  onIteration: (layerId: number, occurrenceId: number | undefined, iteration: number) => void;
  onTerminal: (layerId: number, occurrenceId: number | undefined, iterationCount: number) => void;
  onError: (layerId: number, error: Error, disposition?: 'fatal' | 'recoverable') => void;
};

type PendingPlaybackFrame = {
  video: HTMLVideoElement;
  targetTime: number;
  onPresented: () => void;
};

const releaseVideo = (video: HTMLVideoElement | null): void => {
  if (!video) return;
  video.pause();
  video.removeAttribute('src');
  video.load();
};

const getNumericOpacity = (value: string, fallback = 1): number => {
  const opacity = Number(value);
  return Number.isFinite(opacity) ? opacity : fallback;
};

const shouldContinueAfterIteration = (
  playback: RazorSenseResolvedPlaybackPlan,
  iterationCount: number,
): boolean =>
  playback.playback === 'loop' ||
  (playback.playback === 'repeat' && iterationCount < playback.repeatCount + 1);

const getPlaybackPlanKey = (playback: RazorSenseResolvedPlaybackPlan | undefined): string => {
  if (!playback) return 'legacy';
  if (playback.playback === 'loop') return 'loop';
  if (playback.playback === 'once') return `once:${playback.endBehavior}`;
  return `repeat:${playback.repeatCount}:${playback.endBehavior}`;
};

const AuthoredVideoLayer = forwardRef<AuthoredLayerHandle, AuthoredVideoLayerProps>(
  function AuthoredVideoLayer(props, forwardedRef) {
    const {
      layer,
      source,
      playbackRate,
      canPrepareFrame,
      readinessGeneration,
      shouldPlay,
      transitionDurationMs,
      restoreSnapshot,
      onReady,
      onIteration,
      onTerminal,
      onError,
    } = props;
    const wrapperRef = useRef<HTMLDivElement>(null);
    const primaryRef = useRef<HTMLVideoElement>(null);
    const secondaryRef = useRef<HTMLVideoElement>(null);
    const captureCanvasRef = useRef<HTMLCanvasElement>();
    const thinkingRuntimeRef = useRef<ThinkingLoopRuntime | null>(null);
    const thinkingRafRef = useRef<number | null>(null);
    const frameWaitCleanupsRef = useRef(new Set<CancelVideoFrameWait>());
    const playbackFrameWaitCleanupRef = useRef<CancelVideoFrameWait>();
    const pendingPlaybackFrameRef = useRef<PendingPlaybackFrame>();
    const loadedVideosRef = useRef<Partial<Record<'primary' | 'secondary', HTMLVideoElement>>>({});
    const targetTimesRef = useRef<Partial<Record<'primary' | 'secondary', number>>>({});
    const preparingKindsRef = useRef(new Set<'primary' | 'secondary'>());
    const exactReadyVideosRef = useRef(new Set<'primary' | 'secondary'>());
    const secondaryFailedRef = useRef(false);
    const hasReportedReadyRef = useRef(false);
    const restoreSnapshotRef = useRef(restoreSnapshot);
    const initialRestoreSnapshot = restoreSnapshotRef.current;
    const playbackGenerationRef = useRef(0);
    const iterationRef = useRef(initialRestoreSnapshot?.iterationCount ?? 0);
    const isBoundaryPendingRef = useRef(false);
    const isTerminalRef = useRef(initialRestoreSnapshot?.isTerminal ?? false);
    const hasReportedTerminalRef = useRef(initialRestoreSnapshot?.terminalReported ?? false);
    const canPrepareFrameRef = useRef(canPrepareFrame);
    const readinessGenerationRef = useRef(readinessGeneration);
    const shouldPlayRef = useRef(shouldPlay);
    const playbackRateRef = useRef(playbackRate);
    const onReadyRef = useRef(onReady);
    const onIterationRef = useRef(onIteration);
    const onTerminalRef = useRef(onTerminal);
    const onErrorRef = useRef(onError);
    const [isExactFrameReady, setIsExactFrameReady] = useState(false);
    const [isPlaybackTerminal, setIsPlaybackTerminal] = useState(
      initialRestoreSnapshot?.isTerminal ?? false,
    );
    const timing = RAZOR_SENSE_OPERATIONAL_MODE_TIMINGS[layer.mode];
    const loopStart = Math.max(0, layer.startTime ?? timing.startTime);
    const loopEnd = layer.endTime ?? timing.endTime;
    const frameRate = getRazorSenseAsset({
      assetsPath: '',
      mode: layer.mode,
      colorScheme: layer.colorScheme,
      viewport: 'desktop',
    }).fallbackSource.framerate;
    const terminalFrameTime = Math.max(loopStart, loopEnd - 1 / frameRate);
    const terminalHoldTime = Math.min(
      terminalFrameTime,
      Math.max(loopStart, MODE_REPRESENTATIVE_PHASE_SECONDS[layer.mode]),
    );

    canPrepareFrameRef.current = canPrepareFrame;
    readinessGenerationRef.current = readinessGeneration;
    shouldPlayRef.current = shouldPlay;
    playbackRateRef.current = playbackRate;
    onReadyRef.current = onReady;
    onIterationRef.current = onIteration;
    onTerminalRef.current = onTerminal;
    onErrorRef.current = onError;

    const stopThinkingRaf = useCallback((): void => {
      if (thinkingRafRef.current === null) return;
      window.cancelAnimationFrame(thinkingRafRef.current);
      thinkingRafRef.current = null;
    }, []);

    const cancelFrameWaits = useCallback((): void => {
      frameWaitCleanupsRef.current.forEach((cleanup) => cleanup());
      frameWaitCleanupsRef.current.clear();
      preparingKindsRef.current.clear();
    }, []);

    const syncFailedSeamPlayback = useCallback((): void => {
      if (!secondaryFailedRef.current) return;
      const primary = primaryRef.current;
      if (!primary) return;

      if (
        canPrepareFrameRef.current &&
        shouldPlayRef.current &&
        exactReadyVideosRef.current.has('primary')
      ) {
        primary.play().catch(() => undefined);
      } else {
        primary.pause();
      }
    }, []);

    const release = useCallback((): void => {
      playbackGenerationRef.current += 1;
      cancelFrameWaits();
      playbackFrameWaitCleanupRef.current?.();
      playbackFrameWaitCleanupRef.current = undefined;
      pendingPlaybackFrameRef.current = undefined;
      stopThinkingRaf();
      thinkingRuntimeRef.current = null;
      releaseVideo(primaryRef.current);
      releaseVideo(secondaryRef.current);
    }, [cancelFrameWaits, stopThinkingRaf]);

    const tryReportReady = useCallback((): void => {
      if (
        hasReportedReadyRef.current ||
        !canPrepareFrameRef.current ||
        !exactReadyVideosRef.current.has('primary')
      ) {
        return;
      }
      if (
        layer.mode === 'thinking' &&
        !secondaryFailedRef.current &&
        !exactReadyVideosRef.current.has('secondary')
      ) {
        return;
      }

      hasReportedReadyRef.current = true;
      setIsExactFrameReady(true);
      onReadyRef.current(layer.id, readinessGenerationRef.current);
      if (layer.playback && initialRestoreSnapshot?.isTerminal && !hasReportedTerminalRef.current) {
        hasReportedTerminalRef.current = true;
        onTerminalRef.current(layer.id, layer.occurrenceId, iterationRef.current);
      }
    }, [
      initialRestoreSnapshot?.isTerminal,
      layer.id,
      layer.mode,
      layer.occurrenceId,
      layer.playback,
    ]);

    const armVideo = useCallback(
      (kind: 'primary' | 'secondary'): void => {
        const video = loadedVideosRef.current[kind];
        const targetTime = targetTimesRef.current[kind];
        if (
          !video ||
          targetTime === undefined ||
          !canPrepareFrameRef.current ||
          (kind === 'secondary' && secondaryFailedRef.current) ||
          exactReadyVideosRef.current.has(kind) ||
          preparingKindsRef.current.has(kind)
        ) {
          return;
        }
        preparingKindsRef.current.add(kind);
        video.playbackRate = playbackRateRef.current;
        const armedGeneration = readinessGenerationRef.current;

        let cleanup: CancelVideoFrameWait = () => undefined;
        cleanup = seekToRazorSenseVideoFrame({
          video,
          targetTime,
          frameRate: getRazorSenseAsset({
            assetsPath: '',
            mode: layer.mode,
            colorScheme: layer.colorScheme,
            viewport: 'desktop',
          }).fallbackSource.framerate,
          shouldRemainPaused: true,
          onReady: () => {
            frameWaitCleanupsRef.current.delete(cleanup);
            preparingKindsRef.current.delete(kind);
            if (!canPrepareFrameRef.current || readinessGenerationRef.current !== armedGeneration) {
              return;
            }
            exactReadyVideosRef.current.add(kind);
            tryReportReady();
            if (kind === 'primary') syncFailedSeamPlayback();
          },
        });
        frameWaitCleanupsRef.current.add(cleanup);
      },
      [layer.colorScheme, layer.mode, syncFailedSeamPlayback, tryReportReady],
    );

    const prepareVideo = useCallback(
      (kind: 'primary' | 'secondary', video: HTMLVideoElement, targetTime: number): void => {
        loadedVideosRef.current[kind] = video;
        targetTimesRef.current[kind] = targetTime;
        armVideo(kind);
      },
      [armVideo],
    );

    useEffect(() => {
      if (!canPrepareFrame) {
        cancelFrameWaits();
        hasReportedReadyRef.current = false;
        return;
      }
      armVideo('primary');
      armVideo('secondary');
      tryReportReady();
    }, [armVideo, canPrepareFrame, cancelFrameWaits, readinessGeneration, tryReportReady]);

    const seekPlaybackFrame = useCallback(
      (video: HTMLVideoElement, targetTime: number, onPresented: () => void): void => {
        pendingPlaybackFrameRef.current = { video, targetTime, onPresented };
        const generation = playbackGenerationRef.current;
        playbackFrameWaitCleanupRef.current?.();
        playbackFrameWaitCleanupRef.current = seekToRazorSenseVideoFrame({
          video,
          targetTime,
          frameRate,
          shouldRemainPaused: true,
          onReady: () => {
            if (generation !== playbackGenerationRef.current) return;
            playbackFrameWaitCleanupRef.current = undefined;
            pendingPlaybackFrameRef.current = undefined;
            onPresented();
          },
        });
      },
      [frameRate],
    );

    useEffect(() => {
      if (canPrepareFrame) {
        const pendingFrame = pendingPlaybackFrameRef.current;
        if (pendingFrame && !playbackFrameWaitCleanupRef.current) {
          seekPlaybackFrame(pendingFrame.video, pendingFrame.targetTime, pendingFrame.onPresented);
        }
        return;
      }

      playbackFrameWaitCleanupRef.current?.();
      playbackFrameWaitCleanupRef.current = undefined;
    }, [canPrepareFrame, seekPlaybackFrame]);

    const completeExplicitIteration = useCallback(
      (front: HTMLVideoElement, back?: HTMLVideoElement): void => {
        const playback = layer.playback;
        if (
          !playback ||
          isBoundaryPendingRef.current ||
          isTerminalRef.current ||
          !canPrepareFrameRef.current ||
          !shouldPlayRef.current
        ) {
          return;
        }

        isBoundaryPendingRef.current = true;
        const iterationCount = ++iterationRef.current;
        onIterationRef.current(layer.id, layer.occurrenceId, iterationCount);

        if (shouldContinueAfterIteration(playback, iterationCount)) {
          front.pause();
          back?.pause();
          seekPlaybackFrame(front, loopStart, () => {
            isBoundaryPendingRef.current = false;
            if (canPrepareFrameRef.current && shouldPlayRef.current && !isTerminalRef.current) {
              front.playbackRate = playbackRateRef.current;
              front.play().catch(() => undefined);
            }
          });
          return;
        }

        isTerminalRef.current = true;
        setIsPlaybackTerminal(true);
        stopThinkingRaf();
        front.pause();
        front.style.opacity = '1';
        if (back) {
          back.pause();
          back.style.opacity = '0';
        }
        const terminalTime =
          playback.playback !== 'loop' && playback.endBehavior === 'reset-to-start'
            ? loopStart
            : terminalHoldTime;
        seekPlaybackFrame(front, terminalTime, () => {
          isBoundaryPendingRef.current = false;
          hasReportedTerminalRef.current = true;
          onTerminalRef.current(layer.id, layer.occurrenceId, iterationCount);
        });
      },
      [
        layer.id,
        layer.occurrenceId,
        layer.playback,
        loopStart,
        seekPlaybackFrame,
        stopThinkingRaf,
        terminalHoldTime,
      ],
    );

    const handlePrimaryPlaybackBoundary = useCallback(
      (video: HTMLVideoElement, force = false): void => {
        if (!layer.playback || (layer.mode === 'thinking' && !secondaryFailedRef.current)) return;
        if (!force && video.currentTime < terminalFrameTime) return;
        completeExplicitIteration(video, secondaryRef.current ?? undefined);
      },
      [completeExplicitIteration, layer.mode, layer.playback, terminalFrameTime],
    );

    useImperativeHandle(
      forwardedRef,
      () => ({
        capture: (canvas, container, clearCanvas, includeHiddenLayer = false) => {
          const wrapper = wrapperRef.current;
          const primary = primaryRef.current;
          if (!wrapper || !primary || !canvas || !container) return false;

          const layerOpacity = includeHiddenLayer
            ? 1
            : getNumericOpacity(window.getComputedStyle(wrapper).opacity);
          if (layerOpacity <= 0.001) return false;
          if (!captureCanvasRef.current) {
            captureCanvasRef.current = wrapper.ownerDocument.createElement('canvas');
          }
          const layerCanvas = captureCanvasRef.current;
          const verticalAlignment = layer.mode === 'typing' ? 'bottom' : 'center';
          let didCaptureVideo = false;
          const captureVideo = (video: HTMLVideoElement | null): void => {
            if (
              !video ||
              video.readyState < video.HAVE_CURRENT_DATA ||
              video.videoWidth === 0 ||
              video.videoHeight === 0
            ) {
              return;
            }
            const videoOpacity = getNumericOpacity(video.style.opacity);
            if (videoOpacity <= 0.001) return;
            captureVideoCoverFrame(
              video,
              layerCanvas,
              container,
              verticalAlignment,
              videoOpacity,
              !didCaptureVideo,
            );
            didCaptureVideo = true;
          };

          captureVideo(primary);
          captureVideo(secondaryRef.current);
          if (!didCaptureVideo) return false;

          if (canvas.width !== layerCanvas.width || canvas.height !== layerCanvas.height) {
            canvas.width = layerCanvas.width;
            canvas.height = layerCanvas.height;
          }
          const context = canvas.getContext('2d');
          if (!context) return false;
          if (clearCanvas) context.clearRect(0, 0, canvas.width, canvas.height);

          const horizontalScale = layer.colorScheme === 'dark' ? 1.2 : 1;
          const scaledWidth = canvas.width * horizontalScale;
          context.save();
          context.globalAlpha = layerOpacity;
          context.drawImage(
            layerCanvas,
            (canvas.width - scaledWidth) / 2,
            0,
            scaledWidth,
            canvas.height,
          );
          context.restore();
          return true;
        },
        getPlaybackSnapshot: () => {
          const primary = primaryRef.current;
          if (!primary || primary.readyState < primary.HAVE_CURRENT_DATA) return undefined;
          const secondary = secondaryRef.current;
          const runtime = thinkingRuntimeRef.current;
          return {
            primaryTime: primary.currentTime,
            secondaryTime: secondary?.currentTime ?? loopStart,
            primaryOpacity: getNumericOpacity(primary.style.opacity),
            secondaryOpacity: getNumericOpacity(secondary?.style.opacity ?? '0', 0),
            frontWasPrimary: runtime ? runtime.front === primary : true,
            isCrossfading: runtime?.isCrossfading ?? false,
            isTerminal:
              isTerminalRef.current ||
              (layer.mode !== 'thinking' && !timing.loop && primary.currentTime >= loopEnd - 0.06),
            iterationCount: iterationRef.current,
            terminalReported: hasReportedTerminalRef.current,
          };
        },
        release,
      }),
      [layer.mode, loopEnd, loopStart, release, timing.loop],
    );

    useLayoutEffect(() => {
      const primary = primaryRef.current;
      const secondary = secondaryRef.current;
      if (primary) primary.playbackRate = playbackRate;
      if (secondary) secondary.playbackRate = playbackRate;
      if (!canPrepareFrame || !shouldPlay || isPlaybackTerminal) {
        primary?.pause();
        secondary?.pause();
        if (!canPrepareFrame) cancelFrameWaits();
        return;
      }
      if (!isExactFrameReady) return;

      if (layer.mode !== 'thinking') {
        primary?.play().catch(() => undefined);
        return;
      }

      const runtime = thinkingRuntimeRef.current;
      if (!runtime) return;
      runtime.front.play().catch(() => undefined);
      if (runtime.isCrossfading) runtime.back.play().catch(() => undefined);
      else runtime.back.pause();
    }, [
      canPrepareFrame,
      cancelFrameWaits,
      isExactFrameReady,
      isPlaybackTerminal,
      layer.mode,
      playbackRate,
      shouldPlay,
    ]);

    useEffect(() => {
      stopThinkingRaf();
      if (
        layer.mode !== 'thinking' ||
        !isExactFrameReady ||
        secondaryFailedRef.current ||
        !primaryRef.current ||
        !secondaryRef.current
      ) {
        return undefined;
      }

      const primary = primaryRef.current;
      const secondary = secondaryRef.current;
      const crossfadeDuration = Math.min(
        timing.crossfadeDuration ?? 0,
        Math.max(0, loopEnd - loopStart) / 2,
      );
      if (crossfadeDuration === 0 && !layer.playback) {
        primary.loop = true;
        return undefined;
      }

      if (!thinkingRuntimeRef.current) {
        thinkingRuntimeRef.current = {
          front: initialRestoreSnapshot?.frontWasPrimary === false ? secondary : primary,
          back: initialRestoreSnapshot?.frontWasPrimary === false ? primary : secondary,
          isCrossfading: initialRestoreSnapshot?.isCrossfading ?? false,
        };
        primary.style.opacity = String(initialRestoreSnapshot?.primaryOpacity ?? 1);
        secondary.style.opacity = String(initialRestoreSnapshot?.secondaryOpacity ?? 0);
      }

      const runtime = thinkingRuntimeRef.current;
      runtime.front.playbackRate = playbackRateRef.current;
      runtime.back.playbackRate = playbackRateRef.current;
      if (!shouldPlay || isPlaybackTerminal) {
        runtime.front.pause();
        runtime.back.pause();
        return undefined;
      }

      runtime.front.play().catch(() => undefined);
      if (runtime.isCrossfading) runtime.back.play().catch(() => undefined);
      else runtime.back.pause();

      const renderLoop = (): void => {
        const crossfadeStart = loopEnd - crossfadeDuration;
        if (!runtime.isCrossfading) {
          const nextIteration = iterationRef.current + 1;
          const shouldContinue = layer.playback
            ? shouldContinueAfterIteration(layer.playback, nextIteration)
            : true;

          if (shouldContinue && runtime.front.currentTime >= crossfadeStart) {
            runtime.back.currentTime = loopStart;
            runtime.back.playbackRate = playbackRateRef.current;
            runtime.back.play().catch(() => undefined);
            runtime.isCrossfading = true;
          } else if (
            layer.playback &&
            !shouldContinue &&
            runtime.front.currentTime >= terminalFrameTime
          ) {
            completeExplicitIteration(runtime.front, runtime.back);
            return;
          }
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
            runtime.front.currentTime = loopStart;
            runtime.front.style.opacity = '0';
            runtime.back.style.opacity = '1';
            [runtime.front, runtime.back] = [runtime.back, runtime.front];
            runtime.isCrossfading = false;
            if (layer.playback) {
              const iterationCount = ++iterationRef.current;
              onIterationRef.current(layer.id, layer.occurrenceId, iterationCount);
            }
          }
        }

        thinkingRafRef.current = window.requestAnimationFrame(renderLoop);
      };

      thinkingRafRef.current = window.requestAnimationFrame(renderLoop);
      return stopThinkingRaf;
    }, [
      isExactFrameReady,
      completeExplicitIteration,
      isPlaybackTerminal,
      layer.mode,
      layer.id,
      layer.occurrenceId,
      layer.playback,
      loopEnd,
      loopStart,
      shouldPlay,
      stopThinkingRaf,
      terminalFrameTime,
      timing.crossfadeDuration,
    ]);

    useEffect(() => release, [release]);

    const handlePrimaryLoaded = (video: HTMLVideoElement): void => {
      prepareVideo('primary', video, Math.max(0, initialRestoreSnapshot?.primaryTime ?? loopStart));
    };

    const handleSecondaryError = (): void => {
      if (secondaryFailedRef.current) return;
      secondaryFailedRef.current = true;
      cancelFrameWaits();
      stopThinkingRaf();
      thinkingRuntimeRef.current = null;

      const primary = primaryRef.current;
      const secondary = secondaryRef.current;
      if (primary) {
        primary.loop = !layer.playback;
        primary.style.opacity = '1';
        primary.pause();
      }
      if (secondary) {
        secondary.pause();
        secondary.style.opacity = '0';
      }
      onErrorRef.current(
        layer.id,
        new Error(`RazorSense: Failed to load the ${layer.mode} authored seam`),
        'recoverable',
      );
      armVideo('primary');
      tryReportReady();
      syncFailedSeamPlayback();
    };

    return (
      <div
        ref={wrapperRef}
        aria-hidden="true"
        data-razor-sense-authored-layer={layer.mode}
        data-razor-sense-authored-layer-status={layer.status}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: layer.opacity,
          transition: `${transitionDurationMs}ms linear opacity`,
          transform: layer.colorScheme === 'dark' ? 'scaleX(1.2)' : 'scaleX(1)',
          pointerEvents: 'none',
        }}
      >
        <video
          ref={primaryRef}
          crossOrigin="anonymous"
          src={source}
          muted
          loop={!layer.playback && layer.endTime === undefined && timing.loop}
          playsInline
          preload="auto"
          onLoadedData={(event) => handlePrimaryLoaded(event.currentTarget)}
          onTimeUpdate={(event) => {
            if (layer.playback) {
              handlePrimaryPlaybackBoundary(event.currentTarget);
              return;
            }
            const shouldLoop = layer.endTime !== undefined || timing.loop;
            if (shouldLoop && event.currentTarget.currentTime >= loopEnd) {
              event.currentTarget.currentTime = loopStart;
            }
          }}
          onEnded={(event) => handlePrimaryPlaybackBoundary(event.currentTarget, true)}
          onError={() => {
            onErrorRef.current(
              layer.id,
              new Error(`RazorSense: Failed to load the ${layer.mode} authored state`),
            );
          }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: layer.mode === 'typing' ? 'center bottom' : 'center',
            opacity: initialRestoreSnapshot?.primaryOpacity ?? 1,
            pointerEvents: 'none',
          }}
        />
        {layer.mode === 'thinking' ? (
          <video
            ref={secondaryRef}
            crossOrigin="anonymous"
            src={source}
            muted
            playsInline
            preload="auto"
            onLoadedData={(event) => {
              prepareVideo(
                'secondary',
                event.currentTarget,
                Math.max(0, initialRestoreSnapshot?.secondaryTime ?? loopStart),
              );
            }}
            onError={handleSecondaryError}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: initialRestoreSnapshot?.secondaryOpacity ?? 0,
              pointerEvents: 'none',
            }}
          />
        ) : null}
      </div>
    );
  },
);

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
      onFrameReady,
      onPresentationReady,
      occurrenceId,
      playback,
      onIteration,
      onTerminal,
      runtimeState = 'active',
      isRuntimeAdmitted = true,
    } = props;
    const { colorScheme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const snapshotCanvasRef = useRef<HTMLCanvasElement>(null);
    const transitionCanvasRef = useRef<HTMLCanvasElement>(null);
    const transitionFromCanvasRef = useRef<HTMLCanvasElement>();
    const transitionToCanvasRef = useRef<HTMLCanvasElement>();
    const transitionRendererRef = useRef<RazorSenseAuthoredTransitionRenderer>();
    const isTransitionPausedRef = useRef(false);
    const resourceGenerationRef = useRef(0);
    const nextLayerIdRef = useRef(2);
    const initialLayerRef = useRef<AuthoredLayer>({
      id: 1,
      mode,
      colorScheme,
      assetsPath,
      startTime,
      endTime,
      occurrenceId,
      playback,
      resourceGeneration: resourceGenerationRef.current,
      opacity: 0,
      status: 'loading',
    });
    const [layers, setLayersState] = useState<AuthoredLayer[]>([initialLayerRef.current]);
    const layersRef = useRef(layers);
    const [sourcesByLayerId, setSourcesByLayerIdState] = useState<Record<number, string>>({});
    const sourcesByLayerIdRef = useRef(sourcesByLayerId);
    const [isMediaRetained, setIsMediaRetainedState] = useState(
      runtimeState === 'warm' || (runtimeState === 'active' && isRuntimeAdmitted),
    );
    const isMediaRetainedRef = useRef(isMediaRetained);
    const [hasSnapshot, setHasSnapshot] = useState(false);
    const hasSnapshotRef = useRef(hasSnapshot);
    const [snapshotOpacity, setSnapshotOpacity] = useState(0);
    const snapshotOpacityRef = useRef(snapshotOpacity);
    const [isSnapshotTransitionEnabled, setIsSnapshotTransitionEnabled] = useState(false);
    const [isMaterialTransitioning, setIsMaterialTransitioning] = useState(false);
    const [displayedMode, setDisplayedMode] = useState(mode);
    const [displayedColorScheme, setDisplayedColorScheme] = useState(colorScheme);
    const layerHandlesRef = useRef(new Map<number, AuthoredLayerHandle>());
    const pendingRestoreByLayerIdRef = useRef(new Map<number, LayerPlaybackSnapshot>());
    const resolvingLayerIdsRef = useRef(new Set<number>());
    const failedLayerIdsRef = useRef(new Set<number>());
    const requestedLayerIdRef = useRef(1);
    const requestedKeyRef = useRef(
      `${mode}:${colorScheme}:${assetsPath}:${startTime ?? 'default'}:${endTime ?? 'default'}:${
        occurrenceId ?? 'legacy'
      }:${getPlaybackPlanKey(playback)}`,
    );
    const requestedProgramRef = useRef({ assetsPath, startTime, endTime });
    const transitionGenerationRef = useRef(0);
    const readinessGenerationRef = useRef(0);
    const lastCanPrepareRef = useRef(
      runtimeState === 'warm' || (runtimeState === 'active' && isRuntimeAdmitted),
    );
    const transitionTimerRef = useRef<number>();
    const transitionRafRef = useRef<number>();
    const hasLoadedRef = useRef(false);
    const frameReadyNotifiedLayerIdsRef = useRef(new Set<number>());
    const onLoadRef = useRef(onLoad);
    const onErrorRef = useRef(onError);
    const onFrameReadyRef = useRef(onFrameReady);
    const onPresentationReadyRef = useRef(onPresentationReady);
    const onIterationRef = useRef(onIteration);
    const onTerminalRef = useRef(onTerminal);
    const isMountedRef = useRef(true);
    const canPrepareRef = useRef(false);

    layersRef.current = layers;
    sourcesByLayerIdRef.current = sourcesByLayerId;
    isMediaRetainedRef.current = isMediaRetained;
    hasSnapshotRef.current = hasSnapshot;
    snapshotOpacityRef.current = snapshotOpacity;
    onLoadRef.current = onLoad;
    onErrorRef.current = onError;
    onFrameReadyRef.current = onFrameReady;
    onPresentationReadyRef.current = onPresentationReady;
    onIterationRef.current = onIteration;
    onTerminalRef.current = onTerminal;

    const replaceLayers = useCallback((nextLayers: AuthoredLayer[]): void => {
      layersRef.current = nextLayers;
      setLayersState(nextLayers);
    }, []);

    const replaceSources = useCallback((nextSources: Record<number, string>): void => {
      sourcesByLayerIdRef.current = nextSources;
      setSourcesByLayerIdState(nextSources);
    }, []);

    const setMediaRetained = useCallback((nextValue: boolean): void => {
      isMediaRetainedRef.current = nextValue;
      setIsMediaRetainedState(nextValue);
    }, []);

    const releaseTransitionFrames = useCallback((): void => {
      const fromCanvas = transitionFromCanvasRef.current;
      const toCanvas = transitionToCanvasRef.current;
      if (fromCanvas) {
        fromCanvas.width = 1;
        fromCanvas.height = 1;
      }
      if (toCanvas) {
        toCanvas.width = 1;
        toCanvas.height = 1;
      }
    }, []);

    const clearTransitionWork = useCallback((): void => {
      if (transitionTimerRef.current !== undefined) {
        window.clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = undefined;
      }
      if (transitionRafRef.current !== undefined) {
        window.cancelAnimationFrame(transitionRafRef.current);
        transitionRafRef.current = undefined;
      }
      transitionRendererRef.current?.dispose();
      transitionRendererRef.current = undefined;
      if (transitionCanvasRef.current) transitionCanvasRef.current.style.opacity = '0';
      releaseTransitionFrames();
      if (isMountedRef.current) setIsMaterialTransitioning(false);
    }, [releaseTransitionFrames]);

    const releaseLayersExcept = useCallback((retainedLayerIds: ReadonlySet<number>): void => {
      layerHandlesRef.current.forEach((handle, layerId) => {
        if (!retainedLayerIds.has(layerId)) handle.release();
      });
    }, []);

    const captureCurrentFrame = useCallback((shouldShowSnapshot: boolean): boolean => {
      let didCapture = false;
      const snapshotCanvas = snapshotCanvasRef.current;
      const renderer = transitionRendererRef.current;
      if (snapshotCanvas && renderer?.isPresenting()) {
        didCapture = renderer.copyFrameTo(snapshotCanvas);
      }
      if (!didCapture) {
        layersRef.current.forEach((layer) => {
          const handle = layerHandlesRef.current.get(layer.id);
          if (!handle) return;
          const capturedLayer = handle.capture(snapshotCanvas, containerRef.current, !didCapture);
          if (capturedLayer) didCapture = true;
        });
      }

      if (!didCapture) return false;
      if (!hasSnapshotRef.current) {
        hasSnapshotRef.current = true;
        setHasSnapshot(true);
      }
      if (shouldShowSnapshot) {
        setIsSnapshotTransitionEnabled(false);
        snapshotOpacityRef.current = 1;
        setSnapshotOpacity(1);
      }
      return true;
    }, []);

    const createLayer = useCallback(
      (
        nextMode: RazorSenseOperationalMode,
        nextColorScheme: ColorSchemeNames,
        nextAssetsPath: string,
        nextStartTime?: number,
        nextEndTime?: number,
        nextOccurrenceId?: number,
        nextPlayback?: RazorSenseResolvedPlaybackPlan,
      ): AuthoredLayer => ({
        id: nextLayerIdRef.current++,
        mode: nextMode,
        colorScheme: nextColorScheme,
        assetsPath: nextAssetsPath,
        startTime: nextStartTime,
        endTime: nextEndTime,
        occurrenceId: nextOccurrenceId,
        playback: nextPlayback,
        resourceGeneration: resourceGenerationRef.current,
        opacity: 0,
        status: 'loading',
      }),
      [],
    );

    useLayoutEffect(() => {
      const requestedKey = `${mode}:${colorScheme}:${assetsPath}:${startTime ?? 'default'}:${
        endTime ?? 'default'
      }:${occurrenceId ?? 'legacy'}:${getPlaybackPlanKey(playback)}`;
      if (requestedKeyRef.current === requestedKey) return;

      const previousLayers = layersRef.current;
      const previousRequestedLayer =
        [...previousLayers].reverse().find((layer) => layer.id === requestedLayerIdRef.current) ??
        previousLayers[previousLayers.length - 1];
      const didAssetsPathChange = requestedProgramRef.current.assetsPath !== assetsPath;
      const didPlaybackWindowChange =
        requestedProgramRef.current.startTime !== startTime ||
        requestedProgramRef.current.endTime !== endTime;
      if (didAssetsPathChange) resourceGenerationRef.current += 1;
      requestedKeyRef.current = requestedKey;
      requestedProgramRef.current = { assetsPath, startTime, endTime };
      transitionGenerationRef.current += 1;
      readinessGenerationRef.current += 1;
      if (transitionRendererRef.current?.isPresenting()) captureCurrentFrame(true);
      clearTransitionWork();

      const incomingLayer = createLayer(
        mode,
        colorScheme,
        assetsPath,
        startTime,
        endTime,
        occurrenceId,
        playback,
      );
      requestedLayerIdRef.current = incomingLayer.id;
      failedLayerIdsRef.current.delete(incomingLayer.id);
      pendingRestoreByLayerIdRef.current.clear();

      let incomingRestoreSnapshot: LayerPlaybackSnapshot | undefined;
      if (
        !didAssetsPathChange &&
        !didPlaybackWindowChange &&
        previousRequestedLayer?.mode === mode &&
        previousRequestedLayer.colorScheme !== colorScheme
      ) {
        incomingRestoreSnapshot = layerHandlesRef.current
          .get(previousRequestedLayer.id)
          ?.getPlaybackSnapshot();
      }

      const currentLayer = [...previousLayers]
        .reverse()
        .find((layer) => layer.status !== 'loading' && layerHandlesRef.current.has(layer.id));
      const isSchemeChange = previousRequestedLayer?.colorScheme !== colorScheme;
      if (currentLayer && (previousLayers.length > 1 || isSchemeChange)) {
        captureCurrentFrame(true);
      }

      if (!currentLayer || !isMediaRetainedRef.current) {
        releaseLayersExcept(new Set());
        replaceSources({});
        if (incomingRestoreSnapshot) {
          pendingRestoreByLayerIdRef.current.set(incomingLayer.id, incomingRestoreSnapshot);
        }
        replaceLayers([incomingLayer]);
        return;
      }

      const retainedIds = new Set([currentLayer.id]);
      releaseLayersExcept(retainedIds);
      const currentSource = sourcesByLayerIdRef.current[currentLayer.id];
      replaceSources(currentSource ? { [currentLayer.id]: currentSource } : {});
      if (incomingRestoreSnapshot) {
        pendingRestoreByLayerIdRef.current.set(incomingLayer.id, incomingRestoreSnapshot);
      }
      replaceLayers([{ ...currentLayer, opacity: 1, status: 'visible' }, incomingLayer]);
    }, [
      assetsPath,
      captureCurrentFrame,
      clearTransitionWork,
      colorScheme,
      createLayer,
      mode,
      occurrenceId,
      playback,
      releaseLayersExcept,
      replaceLayers,
      replaceSources,
      endTime,
      startTime,
    ]);

    useLayoutEffect(() => {
      const canOwnMedia =
        runtimeState === 'warm' || (runtimeState === 'active' && isRuntimeAdmitted);
      if (canOwnMedia) {
        if (!isMediaRetainedRef.current) setMediaRetained(true);
        return;
      }

      if (runtimeState === 'suspended') {
        transitionGenerationRef.current += 1;
        if (isMediaRetainedRef.current) captureCurrentFrame(true);
        clearTransitionWork();
        return;
      }

      if (isMediaRetainedRef.current) {
        captureCurrentFrame(true);
        transitionGenerationRef.current += 1;
        resourceGenerationRef.current += 1;
        clearTransitionWork();
        releaseLayersExcept(new Set());
        replaceSources({});
        const nextLayer = createLayer(
          mode,
          colorScheme,
          assetsPath,
          startTime,
          endTime,
          occurrenceId,
          playback,
        );
        requestedLayerIdRef.current = nextLayer.id;
        pendingRestoreByLayerIdRef.current.clear();
        replaceLayers([nextLayer]);
        setMediaRetained(false);
      } else if (hasSnapshotRef.current) {
        setIsSnapshotTransitionEnabled(false);
        snapshotOpacityRef.current = 1;
        setSnapshotOpacity(1);
      }
    }, [
      assetsPath,
      captureCurrentFrame,
      clearTransitionWork,
      colorScheme,
      createLayer,
      isRuntimeAdmitted,
      mode,
      occurrenceId,
      playback,
      releaseLayersExcept,
      replaceLayers,
      replaceSources,
      runtimeState,
      setMediaRetained,
      startTime,
      endTime,
    ]);

    const canPrepare =
      isMediaRetained &&
      (runtimeState === 'warm' || (runtimeState === 'active' && isRuntimeAdmitted));
    if (lastCanPrepareRef.current !== canPrepare) {
      lastCanPrepareRef.current = canPrepare;
      readinessGenerationRef.current += 1;
    }
    canPrepareRef.current = canPrepare;

    useEffect(() => {
      if (!canPrepare) return;

      layersRef.current.forEach((layer) => {
        if (
          sourcesByLayerIdRef.current[layer.id] ||
          resolvingLayerIdsRef.current.has(layer.id) ||
          failedLayerIdsRef.current.has(layer.id)
        ) {
          return;
        }
        resolvingLayerIdsRef.current.add(layer.id);

        void selectRazorSenseVideoSource({
          assetsPath: layer.assetsPath,
          mode: layer.mode,
          colorScheme: layer.colorScheme,
          viewport: 'desktop',
        })
          .then(({ src }) => {
            resolvingLayerIdsRef.current.delete(layer.id);
            if (
              !isMountedRef.current ||
              resourceGenerationRef.current !== layer.resourceGeneration ||
              !canPrepareRef.current ||
              !layersRef.current.some((candidate) => candidate.id === layer.id)
            ) {
              return;
            }
            replaceSources({ ...sourcesByLayerIdRef.current, [layer.id]: src });
          })
          .catch((cause: unknown) => {
            resolvingLayerIdsRef.current.delete(layer.id);
            if (
              resourceGenerationRef.current !== layer.resourceGeneration ||
              !layersRef.current.some((candidate) => candidate.id === layer.id)
            ) {
              return;
            }
            failedLayerIdsRef.current.add(layer.id);
            onErrorRef.current?.(cause instanceof Error ? cause : new Error(String(cause)));
          });
      });
    }, [canPrepare, layers, replaceSources]);

    const handleLayerReady = useCallback(
      (layerId: number, readyGeneration: number): void => {
        if (
          layerId !== requestedLayerIdRef.current ||
          readyGeneration !== readinessGenerationRef.current ||
          !canPrepareRef.current ||
          !isMediaRetainedRef.current
        ) {
          return;
        }
        const currentLayers = layersRef.current;
        const incomingLayer = currentLayers.find((layer) => layer.id === layerId);
        if (!incomingLayer || incomingLayer.resourceGeneration !== resourceGenerationRef.current) {
          return;
        }
        pendingRestoreByLayerIdRef.current.delete(layerId);

        const generation = ++transitionGenerationRef.current;
        const durationMs = Math.max(0, modeTransitionDuration * 1000);
        const outgoingLayers = currentLayers.filter((layer) => layer.id !== layerId);
        setDisplayedMode(incomingLayer.mode);
        setDisplayedColorScheme(incomingLayer.colorScheme);

        const notifyReady = (): void => {
          if (!frameReadyNotifiedLayerIdsRef.current.has(layerId)) {
            frameReadyNotifiedLayerIdsRef.current.add(layerId);
            onFrameReadyRef.current?.();
            onPresentationReadyRef.current?.(incomingLayer.mode);
          }
          if (!hasLoadedRef.current) {
            hasLoadedRef.current = true;
            onLoadRef.current?.();
          }
        };

        const showExactFrameImmediately = Boolean(onFrameReadyRef.current);
        const outgoingLayer = outgoingLayers[outgoingLayers.length - 1];
        const transitionCanvas = transitionCanvasRef.current;
        const outgoingHandle = outgoingLayer
          ? layerHandlesRef.current.get(outgoingLayer.id)
          : undefined;
        const incomingHandle = layerHandlesRef.current.get(layerId);
        if (
          !showExactFrameImmediately &&
          durationMs > 0 &&
          outgoingLayer &&
          transitionCanvas &&
          incomingHandle
        ) {
          const fromCanvas =
            transitionFromCanvasRef.current ??
            (transitionFromCanvasRef.current = document.createElement('canvas'));
          const toCanvas =
            transitionToCanvasRef.current ??
            (transitionToCanvasRef.current = document.createElement('canvas'));
          let capturedOutgoing = false;
          let capturedOutgoingFromSnapshot = false;
          const snapshotCanvas = snapshotCanvasRef.current;
          if (snapshotCanvas && snapshotOpacityRef.current > 0.001 && snapshotCanvas.width > 0) {
            fromCanvas.width = snapshotCanvas.width;
            fromCanvas.height = snapshotCanvas.height;
            const context = fromCanvas.getContext('2d');
            if (context) {
              context.clearRect(0, 0, fromCanvas.width, fromCanvas.height);
              context.drawImage(snapshotCanvas, 0, 0);
              capturedOutgoing = true;
              capturedOutgoingFromSnapshot = true;
            }
          }
          if (!capturedOutgoing && outgoingHandle) {
            capturedOutgoing = outgoingHandle.capture(fromCanvas, containerRef.current, true);
          }
          const capturedIncoming = incomingHandle.capture(
            toCanvas,
            containerRef.current,
            true,
            true,
          );
          if (capturedOutgoing && capturedIncoming) {
            const renderer = new RazorSenseAuthoredTransitionRenderer(transitionCanvas);
            transitionRendererRef.current = renderer;
            const started = renderer.start({
              from: fromCanvas,
              to: toCanvas,
              fromMode: outgoingLayer.mode,
              toMode: incomingLayer.mode,
              durationMs,
              isPaused: () => isTransitionPausedRef.current,
              onBeforeFrame: () => {
                if (!capturedOutgoingFromSnapshot) {
                  outgoingHandle?.capture(fromCanvas, containerRef.current, true, true);
                }
                incomingHandle.capture(toCanvas, containerRef.current, true, true);
              },
              onComplete: () => {
                if (
                  generation !== transitionGenerationRef.current ||
                  requestedLayerIdRef.current !== layerId ||
                  !canPrepareRef.current
                ) {
                  return;
                }
                const settledLayer = layersRef.current.find((layer) => layer.id === layerId);
                if (!settledLayer) return;
                replaceLayers([{ ...settledLayer, opacity: 1, status: 'visible' }]);
                transitionRafRef.current = window.requestAnimationFrame(() => {
                  transitionRafRef.current = undefined;
                  if (
                    generation !== transitionGenerationRef.current ||
                    requestedLayerIdRef.current !== layerId ||
                    !canPrepareRef.current
                  ) {
                    return;
                  }
                  transitionCanvas.style.opacity = '0';
                  renderer.dispose();
                  if (transitionRendererRef.current === renderer) {
                    transitionRendererRef.current = undefined;
                  }
                  releaseTransitionFrames();
                  setIsMaterialTransitioning(false);
                  const retainedIds = new Set([layerId]);
                  releaseLayersExcept(retainedIds);
                  const source = sourcesByLayerIdRef.current[layerId];
                  replaceSources(source ? { [layerId]: source } : {});
                });
              },
            });
            if (started) {
              transitionCanvas.style.opacity = '1';
              setIsMaterialTransitioning(true);
              replaceLayers(
                currentLayers.map((layer) =>
                  layer.id === layerId
                    ? { ...layer, opacity: 0, status: 'visible' }
                    : { ...layer, opacity: 0, status: 'outgoing' },
                ),
              );
              setIsSnapshotTransitionEnabled(false);
              snapshotOpacityRef.current = 0;
              setSnapshotOpacity(0);
              notifyReady();
              return;
            }
            transitionRendererRef.current = undefined;
            renderer.dispose();
          }
        }

        if (showExactFrameImmediately) {
          replaceLayers(
            currentLayers.map((layer) =>
              layer.id === layerId
                ? { ...layer, opacity: 1, status: 'visible' }
                : { ...layer, opacity: 0, status: 'outgoing' },
            ),
          );
          setIsSnapshotTransitionEnabled(false);
          snapshotOpacityRef.current = 0;
          setSnapshotOpacity(0);
        } else {
          transitionRafRef.current = window.requestAnimationFrame(() => {
            transitionRafRef.current = undefined;
            if (
              generation !== transitionGenerationRef.current ||
              readyGeneration !== readinessGenerationRef.current ||
              !canPrepareRef.current
            ) {
              return;
            }
            replaceLayers(
              layersRef.current.map((layer) =>
                layer.id === layerId
                  ? { ...layer, opacity: 1, status: 'visible' }
                  : { ...layer, opacity: 0, status: 'outgoing' },
              ),
            );
            setIsSnapshotTransitionEnabled(true);
            snapshotOpacityRef.current = 0;
            setSnapshotOpacity(0);
          });
        }

        notifyReady();

        if (outgoingLayers.length === 0) return;
        transitionTimerRef.current = window.setTimeout(() => {
          transitionTimerRef.current = undefined;
          if (
            generation !== transitionGenerationRef.current ||
            requestedLayerIdRef.current !== layerId ||
            !canPrepareRef.current
          ) {
            return;
          }
          const retainedIds = new Set([layerId]);
          releaseLayersExcept(retainedIds);
          const source = sourcesByLayerIdRef.current[layerId];
          replaceSources(source ? { [layerId]: source } : {});
          const settledLayer = layersRef.current.find((layer) => layer.id === layerId);
          if (settledLayer) {
            replaceLayers([{ ...settledLayer, opacity: 1, status: 'visible' }]);
          }
        }, durationMs + OUTGOING_LAYER_DISPOSAL_BUFFER_MS);
      },
      [
        modeTransitionDuration,
        releaseLayersExcept,
        releaseTransitionFrames,
        replaceLayers,
        replaceSources,
      ],
    );

    const handleLayerIteration = useCallback(
      (layerId: number, layerOccurrenceId: number | undefined, iteration: number): void => {
        if (layerId !== requestedLayerIdRef.current) return;
        const layer = layersRef.current.find((candidate) => candidate.id === layerId);
        if (!layer || layer.occurrenceId !== layerOccurrenceId) return;
        onIterationRef.current?.(iteration);
      },
      [],
    );

    const handleLayerTerminal = useCallback(
      (layerId: number, layerOccurrenceId: number | undefined, iterationCount: number): void => {
        if (layerId !== requestedLayerIdRef.current) return;
        const layer = layersRef.current.find((candidate) => candidate.id === layerId);
        if (!layer || layer.occurrenceId !== layerOccurrenceId) return;
        onTerminalRef.current?.(iterationCount);
      },
      [],
    );

    const handleLayerError = useCallback(
      (layerId: number, error: Error, disposition: 'fatal' | 'recoverable' = 'fatal'): void => {
        if (disposition === 'recoverable') {
          onErrorRef.current?.(error);
          return;
        }
        if (!layersRef.current.some((layer) => layer.id === layerId)) return;
        const capturedComposite = captureCurrentFrame(true);
        failedLayerIdsRef.current.add(layerId);
        pendingRestoreByLayerIdRef.current.delete(layerId);
        transitionGenerationRef.current += 1;
        clearTransitionWork();
        layerHandlesRef.current.get(layerId)?.release();
        layerHandlesRef.current.delete(layerId);

        const remainingLayers = layersRef.current.filter((layer) => layer.id !== layerId);
        const remainingSources = { ...sourcesByLayerIdRef.current };
        Reflect.deleteProperty(remainingSources, layerId);
        replaceSources(remainingSources);
        if (remainingLayers.length > 0) {
          const outgoing = remainingLayers[remainingLayers.length - 1];
          replaceLayers([{ ...outgoing, opacity: 1, status: 'visible' }]);
          setDisplayedMode(outgoing.mode);
          setDisplayedColorScheme(outgoing.colorScheme);
          if (capturedComposite || hasSnapshotRef.current) {
            setIsSnapshotTransitionEnabled(false);
            snapshotOpacityRef.current = 1;
            setSnapshotOpacity(1);
          }
        } else {
          replaceLayers([]);
          if (hasSnapshotRef.current) {
            setIsSnapshotTransitionEnabled(false);
            snapshotOpacityRef.current = 1;
            setSnapshotOpacity(1);
          }
        }
        onErrorRef.current?.(error);
      },
      [captureCurrentFrame, clearTransitionWork, replaceLayers, replaceSources],
    );

    useEffect(
      () => () => {
        isMountedRef.current = false;
        resourceGenerationRef.current += 1;
        transitionGenerationRef.current += 1;
        clearTransitionWork();
        releaseLayersExcept(new Set());
      },
      [clearTransitionWork, releaseLayersExcept],
    );

    const mergedRef = useMergeRefs(forwardedRef, containerRef);
    const widthStyle = typeof width === 'number' ? `${width}px` : width;
    const heightStyle = typeof height === 'number' ? `${height}px` : height;
    const representativeFrame = getRazorSenseRepresentativeFrame({
      assetsPath,
      mode,
      colorScheme,
      viewport: 'desktop',
    });
    const shouldPlay = runtimeState === 'active' && isRuntimeAdmitted && !paused;
    isTransitionPausedRef.current = !shouldPlay;
    const transitionDurationMs = Math.max(0, modeTransitionDuration * 1000);

    return (
      <div
        ref={mergedRef}
        className={className}
        style={{
          width: widthStyle,
          height: heightStyle,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor:
            RAZOR_SENSE_OPERATIONAL_MODE_BACKGROUNDS[displayedColorScheme][displayedMode],
          transition: `${transitionDurationMs}ms background-color`,
          ...style,
        }}
      >
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <RazorSenseFallback
            src={representativeFrame.src}
            objectPosition={representativeFrame.objectPosition}
          />
        </div>
        {isMediaRetained
          ? layers.map((layer) => {
              const source = sourcesByLayerId[layer.id];
              if (!source) return null;
              return (
                <AuthoredVideoLayer
                  key={layer.id}
                  ref={(handle) => {
                    if (handle) layerHandlesRef.current.set(layer.id, handle);
                    else layerHandlesRef.current.delete(layer.id);
                  }}
                  layer={layer}
                  source={source}
                  playbackRate={playbackRate}
                  canPrepareFrame={canPrepare}
                  readinessGeneration={readinessGenerationRef.current}
                  shouldPlay={shouldPlay}
                  transitionDurationMs={
                    isMaterialTransitioning || onFrameReadyRef.current
                      ? 0
                      : layer.id === initialLayerRef.current.id && !hasLoadedRef.current
                      ? FADE_IN_MS
                      : transitionDurationMs
                  }
                  restoreSnapshot={pendingRestoreByLayerIdRef.current.get(layer.id)}
                  onReady={handleLayerReady}
                  onIteration={handleLayerIteration}
                  onTerminal={handleLayerTerminal}
                  onError={handleLayerError}
                />
              );
            })
          : null}
        <canvas
          ref={transitionCanvasRef}
          aria-hidden="true"
          data-razor-sense-authored-transition="true"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
        <canvas
          ref={snapshotCanvasRef}
          aria-hidden="true"
          data-razor-sense-authored-snapshot={hasSnapshot ? 'ready' : 'empty'}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            opacity: hasSnapshot ? snapshotOpacity : 0,
            transition: isSnapshotTransitionEnabled
              ? `${transitionDurationMs}ms linear opacity`
              : 'none',
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  },
);

export { RazorSenseAuthored };
export type { RazorSenseAuthoredProps };
