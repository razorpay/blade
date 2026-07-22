/* eslint-disable react/react-in-jsx-scope */

import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { RazorSenseEmotionalMode } from './modes';
import { RazorSenseFallback } from './RazorSenseFallback';
import { RazorSenseMoodMount } from './RazorSenseMoodMount';
import {
  getRazorSenseAsset,
  getRazorSenseRepresentativeFrame,
  selectRazorSenseVideoSource,
} from './razorSenseAssets';
import type { RazorSenseLifecycleState } from './RazorSenseRuntime';
import type { RazorSenseResolvedPlaybackPlan } from './razorSensePrograms';
import { MODE_REPRESENTATIVE_PHASE_SECONDS } from './razorSensePrograms';
import { seekToRazorSenseVideoFrame } from './RazorSenseVideoFrame';
import type { CancelVideoFrameWait } from './RazorSenseVideoFrame';
import type { SemanticRazorSenseProps } from './types';
import { captureVideoCoverFrame, DEFAULT_CDN_PATH } from './utils';
import { useTheme } from '~components/BladeProvider';
import type { ColorSchemeNames } from '~tokens/theme';
import { useMergeRefs } from '~utils/useMergeRefs';

const FADE_IN_MS = 200;
const MOBILE_MEDIA_QUERY = '(max-width: 809.98px)';
const MOBILE_TRANSITION_DISPOSAL_BUFFER_MS = 60;

const FALLBACK_COLORS: Record<ColorSchemeNames, Record<RazorSenseEmotionalMode, string>> = {
  light: {
    calm: '#87C0FE',
    joyful: '#D6F5DA',
    caution: '#FFF0E1',
    regret: '#FBD3C6',
  },
  dark: {
    calm: '#0E1318',
    joyful: '#0E1511',
    caution: '#1A1510',
    regret: '#1A1212',
  },
};

const MOBILE_BASE_COLORS: Record<ColorSchemeNames, Record<RazorSenseEmotionalMode, string>> = {
  light: {
    calm: '#9ABAFD',
    joyful: '#F1F7EB',
    caution: '#FDF1E1',
    regret: '#FDF1E1',
  },
  dark: {
    calm: '#0E1318',
    joyful: '#0E1511',
    caution: '#1A1510',
    regret: '#1A1212',
  },
};

type RazorSenseMoodProps = Omit<SemanticRazorSenseProps, 'mode'> & {
  mode: RazorSenseEmotionalMode;
  /** @internal Resolved pause state from the parent semantic component. */
  paused?: boolean;
  /** @internal Resolved interactive state from the parent semantic component. */
  interactive?: boolean;
  /** @internal Shared runtime lifecycle. Direct internal renderers default to active. */
  runtimeState?: RazorSenseLifecycleState;
  /** @internal Shared runtime admission. Direct internal renderers default to admitted. */
  isRuntimeAdmitted?: boolean;
  /** @internal Used by the fallback exporter after the requested frame is presented. */
  onFrameReady?: () => void;
  /** @internal Reports every exact incoming frame without changing transition behavior. */
  onPresentationReady?: (mode: RazorSenseEmotionalMode) => void;
  /** @internal Identifies a semantic playback occurrence. */
  occurrenceId?: number;
  /** @internal Resolved semantic playback owned by the presentation engine. */
  playback?: RazorSenseResolvedPlaybackPlan;
  /** @internal Reports one-based completed source iterations. */
  onIteration?: (iteration: number) => void;
  /** @internal Reports the exact finite terminal frame after it is presented. */
  onTerminal?: (iterationCount: number) => void;
};

type MobileMoodLayer = {
  id: number;
  mode: RazorSenseEmotionalMode;
  colorScheme: ColorSchemeNames;
  occurrenceId?: number;
  targetTime: number;
  source?: string;
  opacity: number;
  status: 'loading' | 'visible' | 'outgoing';
};

const releaseVideo = (video: HTMLVideoElement | undefined): void => {
  if (!video) return;
  video.pause();
  video.removeAttribute('src');
  video.load();
};

const getPlaybackOccurrenceKey = (
  mode: RazorSenseEmotionalMode,
  occurrenceId: number | undefined,
  playback: RazorSenseResolvedPlaybackPlan | undefined,
): string =>
  `${mode}:${occurrenceId ?? 'legacy'}:${playback?.playback ?? 'native'}:${
    playback?.playback === 'repeat' ? playback.repeatCount : ''
  }:${
    playback?.playback === 'once' || playback?.playback === 'repeat' ? playback.endBehavior : ''
  }`;

const shouldContinueAfterIteration = (
  playback: RazorSenseResolvedPlaybackPlan,
  iterationCount: number,
): boolean =>
  playback.playback === 'loop' ||
  (playback.playback === 'repeat' && iterationCount < playback.repeatCount + 1);

const DesktopRazorSenseMood = forwardRef<HTMLDivElement, RazorSenseMoodProps>(
  function DesktopRazorSenseMood(props, forwardedRef) {
    const {
      mode,
      width = '100%',
      height = '100%',
      className,
      style,
      assetsPath = DEFAULT_CDN_PATH,
      modeTransitionDuration = 1,
      paused = false,
      playbackRate = 1,
      startTime = 0,
      interactive = true,
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
    const containerRef = useRef<HTMLDivElement>(null);
    const snapshotCanvasRef = useRef<HTMLCanvasElement>(null);
    const mountRef = useRef<RazorSenseMoodMount | null>(null);
    const mountedModeRef = useRef(mode);
    const mountedOccurrenceKeyRef = useRef(getPlaybackOccurrenceKey(mode, occurrenceId, playback));
    const lifecycleKeyRef = useRef(`${runtimeState}:${isRuntimeAdmitted}`);
    const onLoadRef = useRef(onLoad);
    const onErrorRef = useRef(onError);
    const onFrameReadyRef = useRef(onFrameReady);
    const onPresentationReadyRef = useRef(onPresentationReady);
    const onIterationRef = useRef(onIteration);
    const onTerminalRef = useRef(onTerminal);
    const hasLoadedRef = useRef(false);
    const [hasSnapshot, setHasSnapshot] = useState(false);
    const [showSnapshot, setShowSnapshot] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { colorScheme } = useTheme();

    onLoadRef.current = onLoad;
    onErrorRef.current = onError;
    onFrameReadyRef.current = onFrameReady;
    onPresentationReadyRef.current = onPresentationReady;
    onIterationRef.current = onIteration;
    onTerminalRef.current = onTerminal;

    useEffect(() => {
      if (!containerRef.current) return undefined;
      let active = true;
      const mount = new RazorSenseMoodMount(containerRef.current, {
        mode,
        assetsPath,
        transitionDuration: modeTransitionDuration,
        paused,
        playbackRate,
        startTime,
        interactive,
        colorScheme,
        runtimeState,
        isRuntimeAdmitted,
        occurrenceId,
        playback,
        onIteration: (iteration) => onIterationRef.current?.(iteration),
        onTerminal: (iterationCount) => onTerminalRef.current?.(iterationCount),
        onFrameReady: () => {
          onFrameReadyRef.current?.();
          onPresentationReadyRef.current?.(mountedModeRef.current);
        },
        onFirstFrame: () => {
          if (!active) return;
          setHasError(false);
          setShowSnapshot(false);
          if (!hasLoadedRef.current) {
            hasLoadedRef.current = true;
            onLoadRef.current?.();
          }
        },
        onError: (error) => {
          if (!active) return;
          if (!mountRef.current?.hasRenderableOutput()) {
            setHasError(true);
            setShowSnapshot(true);
          }
          onErrorRef.current?.(error);
        },
      });
      mountRef.current = mount;
      mountedModeRef.current = mode;
      mountedOccurrenceKeyRef.current = getPlaybackOccurrenceKey(mode, occurrenceId, playback);
      lifecycleKeyRef.current = `${runtimeState}:${isRuntimeAdmitted}`;

      void mount.loadAssets().catch(() => {
        if (!active) return;
        setHasError(true);
        setShowSnapshot(true);
      });

      return () => {
        active = false;
        mount.dispose();
        mountRef.current = null;
      };
      // Mode, options, and lifecycle changes are handled in-place below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assetsPath]);

    useEffect(() => {
      const occurrenceKey = getPlaybackOccurrenceKey(mode, occurrenceId, playback);
      if (!mountRef.current || mountedOccurrenceKeyRef.current === occurrenceKey) return;
      mountedModeRef.current = mode;
      mountedOccurrenceKeyRef.current = occurrenceKey;
      void mountRef.current.setMode(mode, { occurrenceId, playback }).catch(() => {
        setHasError(true);
        setShowSnapshot(true);
      });
    }, [mode, occurrenceId, playback]);

    useEffect(() => {
      mountRef.current?.setOptions({
        transitionDuration: modeTransitionDuration,
        paused,
        playbackRate,
        startTime,
        interactive,
        colorScheme,
        onFrameReady: () => {
          onFrameReadyRef.current?.();
          onPresentationReadyRef.current?.(mountedModeRef.current);
        },
        onIteration: (iteration) => onIterationRef.current?.(iteration),
        onTerminal: (iterationCount) => onTerminalRef.current?.(iterationCount),
      });
    }, [colorScheme, interactive, modeTransitionDuration, paused, playbackRate, startTime]);

    useLayoutEffect(() => {
      const key = `${runtimeState}:${isRuntimeAdmitted}`;
      if (!mountRef.current || lifecycleKeyRef.current === key) return undefined;
      lifecycleKeyRef.current = key;
      let active = true;
      void mountRef.current
        .setRuntimeState(runtimeState, isRuntimeAdmitted, snapshotCanvasRef.current)
        .then(({ didCapture, didPresent }) => {
          if (!active) return;
          if (didCapture) setHasSnapshot(true);
          if (didPresent) {
            setHasError(false);
            setShowSnapshot(false);
          } else if (
            runtimeState === 'warm' ||
            runtimeState === 'dormant' ||
            runtimeState === 'cold' ||
            (runtimeState === 'active' && !isRuntimeAdmitted)
          ) {
            setShowSnapshot(didCapture || hasSnapshot);
          } else {
            setHasError(true);
            setShowSnapshot(didCapture || hasSnapshot);
          }
        })
        .catch((cause: unknown) => {
          if (!active) return;
          setHasError(true);
          setShowSnapshot(true);
          onErrorRef.current?.(cause instanceof Error ? cause : new Error(String(cause)));
        });
      return () => {
        active = false;
      };
    }, [hasSnapshot, isRuntimeAdmitted, runtimeState]);

    const mergedRef = useMergeRefs(forwardedRef, containerRef);
    const widthStyle = typeof width === 'number' ? `${width}px` : width;
    const heightStyle = typeof height === 'number' ? `${height}px` : height;
    const representativeFrame = getRazorSenseRepresentativeFrame({
      assetsPath,
      mode,
      colorScheme,
      viewport: 'desktop',
    });

    return (
      <div
        ref={mergedRef}
        className={className}
        style={{
          width: widthStyle,
          height: heightStyle,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: FALLBACK_COLORS[colorScheme][mode],
          transition: `${FADE_IN_MS}ms background-color`,
          ...style,
        }}
      >
        <div
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
        >
          <RazorSenseFallback
            src={representativeFrame.src}
            objectPosition={representativeFrame.objectPosition}
          />
        </div>
        <canvas
          ref={snapshotCanvasRef}
          aria-hidden="true"
          data-razor-sense-mood-snapshot={hasSnapshot ? 'ready' : 'empty'}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            zIndex: 2,
            opacity: showSnapshot && hasSnapshot ? 1 : 0,
            pointerEvents: 'none',
          }}
        />
        {hasError ? (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 3,
              backgroundColor: FALLBACK_COLORS[colorScheme][mode],
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
        ) : null}
      </div>
    );
  },
);

const MobileRazorSenseMood = forwardRef<HTMLDivElement, RazorSenseMoodProps>(
  function MobileRazorSenseMood(props, forwardedRef) {
    const {
      mode,
      width = '100%',
      height = '100%',
      className,
      style,
      assetsPath = DEFAULT_CDN_PATH,
      modeTransitionDuration = 0.6,
      paused = false,
      playbackRate = 1,
      startTime = 0,
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
    const layerCaptureCanvasRef = useRef<HTMLCanvasElement>(null);
    const nextLayerIdRef = useRef(2);
    const initialLayerRef = useRef<MobileMoodLayer>({
      id: 1,
      mode,
      colorScheme,
      occurrenceId,
      targetTime: Math.max(0, startTime),
      opacity: 0,
      status: 'loading',
    });
    const [layers, setLayersState] = useState<MobileMoodLayer[]>([initialLayerRef.current]);
    const layersRef = useRef(layers);
    const videoByLayerIdRef = useRef(new Map<number, HTMLVideoElement>());
    const frameWaitByLayerIdRef = useRef(new Map<number, CancelVideoFrameWait>());
    const preparedLayerIdsRef = useRef(new Set<number>());
    const readyLayerIdsRef = useRef(new Set<number>());
    const resolvingAttemptByLayerIdRef = useRef(new Map<number, number>());
    const attemptByLayerIdRef = useRef(new Map<number, number>());
    const requestedLayerIdRef = useRef(1);
    const requestedKeyRef = useRef(
      `${colorScheme}:${assetsPath}:${Math.max(0, startTime)}:${getPlaybackOccurrenceKey(
        mode,
        occurrenceId,
        playback,
      )}`,
    );
    const transitionGenerationRef = useRef(0);
    const resourceGenerationRef = useRef(0);
    const lifecycleGenerationRef = useRef(0);
    const attemptGenerationRef = useRef(0);
    const transitionTimerRef = useRef<number>();
    const transitionRafRef = useRef<number>();
    const lifecycleKeyRef = useRef(`${runtimeState}:${isRuntimeAdmitted}`);
    const hasLoadedRef = useRef(false);
    const reportedAttemptErrorsRef = useRef(new Set<number>());
    const isMountedRef = useRef(true);
    const onLoadRef = useRef(onLoad);
    const onErrorRef = useRef(onError);
    const onFrameReadyRef = useRef(onFrameReady);
    const onPresentationReadyRef = useRef(onPresentationReady);
    const onIterationRef = useRef(onIteration);
    const onTerminalRef = useRef(onTerminal);
    const playbackRef = useRef(playback);
    const occurrenceIdRef = useRef(occurrenceId);
    const playbackFrameWaitByLayerIdRef = useRef(new Map<number, CancelVideoFrameWait>());
    const playbackIterationByLayerIdRef = useRef(new Map<number, number>());
    const playbackPhaseByLayerIdRef = useRef(
      new Map<number, 'playing' | 'boundary' | 'terminal'>(),
    );
    const playbackBoundaryByLayerIdRef = useRef(new Map<number, 'restart' | 'terminal'>());
    if (playback && !playbackPhaseByLayerIdRef.current.has(initialLayerRef.current.id)) {
      playbackIterationByLayerIdRef.current.set(initialLayerRef.current.id, 0);
      playbackPhaseByLayerIdRef.current.set(initialLayerRef.current.id, 'playing');
    }
    const shouldPlayRef = useRef(false);
    const canOwnMediaRef = useRef(false);
    const [hasSnapshot, setHasSnapshot] = useState(false);
    const hasSnapshotRef = useRef(hasSnapshot);
    const [snapshotOpacity, setSnapshotOpacity] = useState(0);
    const [isSnapshotTransitionEnabled, setIsSnapshotTransitionEnabled] = useState(false);
    const [displayedMode, setDisplayedMode] = useState(mode);
    const [displayedColorScheme, setDisplayedColorScheme] = useState(colorScheme);
    const [hasError, setHasError] = useState(false);

    const canOwnMedia = runtimeState === 'warm' || (runtimeState === 'active' && isRuntimeAdmitted);
    const shouldPlay = runtimeState === 'active' && isRuntimeAdmitted && !paused;
    layersRef.current = layers;
    hasSnapshotRef.current = hasSnapshot;
    onLoadRef.current = onLoad;
    onErrorRef.current = onError;
    onFrameReadyRef.current = onFrameReady;
    onPresentationReadyRef.current = onPresentationReady;
    onIterationRef.current = onIteration;
    onTerminalRef.current = onTerminal;
    playbackRef.current = playback;
    occurrenceIdRef.current = occurrenceId;
    shouldPlayRef.current = shouldPlay;
    canOwnMediaRef.current = canOwnMedia;

    const replaceLayers = useCallback((nextLayers: MobileMoodLayer[]): void => {
      layersRef.current = nextLayers;
      setLayersState(nextLayers);
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
    }, []);

    const cancelFrameWait = useCallback((layerId: number): void => {
      frameWaitByLayerIdRef.current.get(layerId)?.();
      frameWaitByLayerIdRef.current.delete(layerId);
      preparedLayerIdsRef.current.delete(layerId);
    }, []);

    const releaseLayer = useCallback(
      (layerId: number): void => {
        cancelFrameWait(layerId);
        readyLayerIdsRef.current.delete(layerId);
        playbackFrameWaitByLayerIdRef.current.get(layerId)?.();
        playbackFrameWaitByLayerIdRef.current.delete(layerId);
        playbackIterationByLayerIdRef.current.delete(layerId);
        playbackPhaseByLayerIdRef.current.delete(layerId);
        playbackBoundaryByLayerIdRef.current.delete(layerId);
        resolvingAttemptByLayerIdRef.current.delete(layerId);
        attemptByLayerIdRef.current.delete(layerId);
        releaseVideo(videoByLayerIdRef.current.get(layerId));
        videoByLayerIdRef.current.delete(layerId);
      },
      [cancelFrameWait],
    );

    const releaseLayersExcept = useCallback(
      (retainedLayerIds: ReadonlySet<number>): void => {
        videoByLayerIdRef.current.forEach((_video, layerId) => {
          if (!retainedLayerIds.has(layerId)) releaseLayer(layerId);
        });
      },
      [releaseLayer],
    );

    const captureCurrentFrame = useCallback((shouldShowSnapshot: boolean): boolean => {
      const target = snapshotCanvasRef.current;
      const scratch = layerCaptureCanvasRef.current;
      const container = containerRef.current;
      if (!target || !scratch || !container) return false;
      let didCapture = false;

      layersRef.current.forEach((layer) => {
        const video = videoByLayerIdRef.current.get(layer.id);
        if (
          !video ||
          video.readyState < video.HAVE_CURRENT_DATA ||
          video.videoWidth === 0 ||
          video.videoHeight === 0
        ) {
          return;
        }
        const computedOpacity = Number(window.getComputedStyle(video).opacity);
        const opacity = Number.isFinite(computedOpacity) ? computedOpacity : layer.opacity;
        if (opacity <= 0.001) return;

        captureVideoCoverFrame(video, scratch, container);
        if (!didCapture) {
          target.width = scratch.width;
          target.height = scratch.height;
        }
        const context = target.getContext('2d');
        if (!context) return;
        if (!didCapture) context.clearRect(0, 0, target.width, target.height);
        const horizontalScale = layer.colorScheme === 'dark' ? 1.2 : 1;
        context.save();
        context.globalAlpha = opacity;
        context.translate(target.width / 2, 0);
        context.scale(horizontalScale, 1);
        context.translate(-target.width / 2, 0);
        context.drawImage(scratch, 0, 0, target.width, target.height);
        context.restore();
        didCapture = true;
      });

      if (!didCapture) return false;
      if (!hasSnapshotRef.current) {
        hasSnapshotRef.current = true;
        setHasSnapshot(true);
      }
      if (shouldShowSnapshot) {
        setIsSnapshotTransitionEnabled(false);
        setSnapshotOpacity(1);
      }
      return true;
    }, []);

    const createLayer = useCallback(
      (
        nextMode: RazorSenseEmotionalMode,
        nextColorScheme: ColorSchemeNames,
        targetTime: number,
        nextOccurrenceId = occurrenceIdRef.current,
      ): MobileMoodLayer => ({
        id: nextLayerIdRef.current++,
        mode: nextMode,
        colorScheme: nextColorScheme,
        occurrenceId: nextOccurrenceId,
        targetTime: Math.max(0, targetTime),
        opacity: 0,
        status: 'loading',
      }),
      [],
    );

    const reportAttemptError = useCallback((generation: number, error: Error): void => {
      if (reportedAttemptErrorsRef.current.has(generation)) return;
      reportedAttemptErrorsRef.current.add(generation);
      onErrorRef.current?.(error);
    }, []);

    const handleLayerReady = useCallback(
      (layerId: number, generation: number): void => {
        if (
          !isMountedRef.current ||
          generation !== transitionGenerationRef.current ||
          layerId !== requestedLayerIdRef.current
        ) {
          return;
        }
        const currentLayers = layersRef.current;
        const incomingLayer = currentLayers.find((layer) => layer.id === layerId);
        if (!incomingLayer) return;
        const isFirstExactReady = !readyLayerIdsRef.current.has(layerId);
        readyLayerIdsRef.current.add(layerId);
        setHasError(false);
        setDisplayedMode(incomingLayer.mode);
        setDisplayedColorScheme(incomingLayer.colorScheme);

        const settleTransition = (): void => {
          if (generation !== transitionGenerationRef.current) return;
          replaceLayers(
            layersRef.current.map((layer) =>
              layer.id === layerId
                ? { ...layer, opacity: 1, status: 'visible' }
                : { ...layer, opacity: 0, status: 'outgoing' },
            ),
          );
          setIsSnapshotTransitionEnabled(true);
          setSnapshotOpacity(0);
        };
        if (onFrameReadyRef.current) settleTransition();
        else {
          transitionRafRef.current = window.requestAnimationFrame(() => {
            transitionRafRef.current = undefined;
            settleTransition();
          });
        }

        if (isFirstExactReady) {
          onFrameReadyRef.current?.();
          onPresentationReadyRef.current?.(incomingLayer.mode);
        }
        if (isFirstExactReady && !hasLoadedRef.current) {
          hasLoadedRef.current = true;
          onLoadRef.current?.();
        }

        const outgoingLayerIds = currentLayers
          .filter((layer) => layer.id !== layerId)
          .map((layer) => layer.id);
        if (outgoingLayerIds.length === 0) return;
        transitionTimerRef.current = window.setTimeout(() => {
          transitionTimerRef.current = undefined;
          if (
            generation !== transitionGenerationRef.current ||
            requestedLayerIdRef.current !== layerId
          ) {
            return;
          }
          outgoingLayerIds.forEach(releaseLayer);
          const settledLayer = layersRef.current.find((layer) => layer.id === layerId);
          if (settledLayer) replaceLayers([{ ...settledLayer, opacity: 1, status: 'visible' }]);
        }, Math.max(0, modeTransitionDuration * 1000) + MOBILE_TRANSITION_DISPOSAL_BUFFER_MS);
      },
      [modeTransitionDuration, releaseLayer, replaceLayers],
    );

    const prepareLayer = useCallback(
      (layer: MobileMoodLayer, video: HTMLVideoElement): void => {
        if (
          !canOwnMediaRef.current ||
          layer.id !== requestedLayerIdRef.current ||
          !layersRef.current.some((candidate) => candidate.id === layer.id) ||
          preparedLayerIdsRef.current.has(layer.id)
        ) {
          return;
        }
        preparedLayerIdsRef.current.add(layer.id);
        video.playbackRate = playbackRate;
        const generation = transitionGenerationRef.current;
        const lifecycleGeneration = lifecycleGenerationRef.current;
        const attemptGeneration = ++attemptGenerationRef.current;
        attemptByLayerIdRef.current.set(layer.id, attemptGeneration);
        const frameRate = getRazorSenseAsset({
          assetsPath,
          mode: layer.mode,
          colorScheme: layer.colorScheme,
          viewport: 'mobile',
        }).fallbackSource.framerate;
        let cleanup: CancelVideoFrameWait = () => undefined;
        cleanup = seekToRazorSenseVideoFrame({
          video,
          targetTime: layer.targetTime,
          frameRate,
          shouldRemainPaused: true,
          onReady: () => {
            const isCurrentAttempt =
              attemptByLayerIdRef.current.get(layer.id) === attemptGeneration;
            if (isCurrentAttempt) {
              frameWaitByLayerIdRef.current.delete(layer.id);
              preparedLayerIdsRef.current.delete(layer.id);
            }
            if (
              generation !== transitionGenerationRef.current ||
              lifecycleGeneration !== lifecycleGenerationRef.current ||
              !canOwnMediaRef.current ||
              !isCurrentAttempt ||
              layer.id !== requestedLayerIdRef.current ||
              !layersRef.current.some((candidate) => candidate.id === layer.id)
            ) {
              return;
            }
            handleLayerReady(layer.id, generation);
            const playbackPhase = playbackPhaseByLayerIdRef.current.get(layer.id);
            if (shouldPlayRef.current && (!playbackRef.current || playbackPhase === 'playing')) {
              video.play().catch(() => undefined);
            }
          },
        });
        frameWaitByLayerIdRef.current.set(layer.id, cleanup);
      },
      [assetsPath, handleLayerReady, playbackRate],
    );

    const seekPlaybackBoundary = useCallback(
      (layer: MobileMoodLayer, video: HTMLVideoElement, boundary: 'restart' | 'terminal'): void => {
        const plan = playbackRef.current;
        if (
          !plan ||
          !isMountedRef.current ||
          layer.id !== requestedLayerIdRef.current ||
          layer.mode !== mode ||
          layer.occurrenceId !== occurrenceIdRef.current
        ) {
          return;
        }

        playbackPhaseByLayerIdRef.current.set(layer.id, 'boundary');
        playbackBoundaryByLayerIdRef.current.set(layer.id, boundary);
        playbackFrameWaitByLayerIdRef.current.get(layer.id)?.();
        playbackFrameWaitByLayerIdRef.current.delete(layer.id);
        video.pause();

        const source = getRazorSenseAsset({
          assetsPath,
          mode: layer.mode,
          colorScheme: layer.colorScheme,
          viewport: 'mobile',
        }).fallbackSource;
        const frameDuration = 1 / Math.max(1, source.framerate);
        const finiteDuration = Number.isFinite(video.duration) ? video.duration : 0;
        const decodedEndTime = Math.max(
          0,
          (finiteDuration > 0 ? finiteDuration : video.currentTime) - frameDuration,
        );
        const calibratedTerminalTime = Math.min(
          decodedEndTime,
          MODE_REPRESENTATIVE_PHASE_SECONDS[layer.mode],
        );
        const targetTime =
          boundary === 'restart' ||
          (plan.playback !== 'loop' && plan.endBehavior === 'reset-to-start')
            ? Math.max(0, startTime)
            : calibratedTerminalTime;
        const transitionGeneration = transitionGenerationRef.current;
        const lifecycleGeneration = lifecycleGenerationRef.current;

        let cleanup: CancelVideoFrameWait = () => undefined;
        cleanup = seekToRazorSenseVideoFrame({
          video,
          targetTime,
          frameRate: source.framerate,
          shouldRemainPaused: true,
          onReady: () => {
            if (playbackFrameWaitByLayerIdRef.current.get(layer.id) === cleanup) {
              playbackFrameWaitByLayerIdRef.current.delete(layer.id);
            }
            if (
              !isMountedRef.current ||
              transitionGeneration !== transitionGenerationRef.current ||
              lifecycleGeneration !== lifecycleGenerationRef.current ||
              !shouldPlayRef.current ||
              layer.id !== requestedLayerIdRef.current ||
              layer.occurrenceId !== occurrenceIdRef.current ||
              playbackBoundaryByLayerIdRef.current.get(layer.id) !== boundary
            ) {
              return;
            }

            if (boundary === 'restart') {
              playbackPhaseByLayerIdRef.current.set(layer.id, 'playing');
              playbackBoundaryByLayerIdRef.current.delete(layer.id);
              video.play().catch(() => undefined);
              return;
            }

            playbackPhaseByLayerIdRef.current.set(layer.id, 'terminal');
            playbackBoundaryByLayerIdRef.current.delete(layer.id);
            onTerminalRef.current?.(playbackIterationByLayerIdRef.current.get(layer.id) ?? 0);
          },
        });
        playbackFrameWaitByLayerIdRef.current.set(layer.id, cleanup);
      },
      [assetsPath, mode, startTime],
    );

    const handlePlaybackEnded = useCallback(
      (layer: MobileMoodLayer, video: HTMLVideoElement): void => {
        const plan = playbackRef.current;
        if (
          !plan ||
          !shouldPlayRef.current ||
          layer.id !== requestedLayerIdRef.current ||
          layer.occurrenceId !== occurrenceIdRef.current ||
          playbackPhaseByLayerIdRef.current.get(layer.id) !== 'playing'
        ) {
          return;
        }

        const iterationCount = (playbackIterationByLayerIdRef.current.get(layer.id) ?? 0) + 1;
        const boundary = shouldContinueAfterIteration(plan, iterationCount)
          ? 'restart'
          : 'terminal';
        playbackIterationByLayerIdRef.current.set(layer.id, iterationCount);
        playbackPhaseByLayerIdRef.current.set(layer.id, 'boundary');
        playbackBoundaryByLayerIdRef.current.set(layer.id, boundary);
        onIterationRef.current?.(iterationCount);
        if (
          layer.id === requestedLayerIdRef.current &&
          layer.occurrenceId === occurrenceIdRef.current
        ) {
          seekPlaybackBoundary(layer, video, boundary);
        }
      },
      [seekPlaybackBoundary],
    );

    useLayoutEffect(() => {
      const requestedKey = `${colorScheme}:${assetsPath}:${Math.max(
        0,
        startTime,
      )}:${getPlaybackOccurrenceKey(mode, occurrenceId, playback)}`;
      if (requestedKeyRef.current === requestedKey) return;
      const previousLayers = layersRef.current;
      const previousRequested =
        previousLayers.find((layer) => layer.id === requestedLayerIdRef.current) ??
        previousLayers[previousLayers.length - 1];
      const previousIteration = previousRequested
        ? playbackIterationByLayerIdRef.current.get(previousRequested.id)
        : undefined;
      const previousPhase = previousRequested
        ? playbackPhaseByLayerIdRef.current.get(previousRequested.id)
        : undefined;
      const previousBoundary = previousRequested
        ? playbackBoundaryByLayerIdRef.current.get(previousRequested.id)
        : undefined;
      requestedKeyRef.current = requestedKey;
      transitionGenerationRef.current += 1;
      clearTransitionWork();
      frameWaitByLayerIdRef.current.forEach((cleanup) => cleanup());
      frameWaitByLayerIdRef.current.clear();
      playbackFrameWaitByLayerIdRef.current.forEach((cleanup) => cleanup());
      playbackFrameWaitByLayerIdRef.current.clear();
      preparedLayerIdsRef.current.clear();

      let targetTime = Math.max(0, startTime);
      if (previousRequested?.mode === mode && previousRequested.colorScheme !== colorScheme) {
        const previousVideo = videoByLayerIdRef.current.get(previousRequested.id);
        if (previousVideo && Number.isFinite(previousVideo.currentTime)) {
          targetTime = previousVideo.currentTime;
        }
      }
      const incomingLayer = createLayer(mode, colorScheme, targetTime);
      if (playback) {
        const isSameOccurrenceAppearanceChange =
          previousRequested?.mode === mode && previousRequested.occurrenceId === occurrenceId;
        playbackIterationByLayerIdRef.current.set(
          incomingLayer.id,
          isSameOccurrenceAppearanceChange ? previousIteration ?? 0 : 0,
        );
        playbackPhaseByLayerIdRef.current.set(
          incomingLayer.id,
          isSameOccurrenceAppearanceChange ? previousPhase ?? 'playing' : 'playing',
        );
        if (isSameOccurrenceAppearanceChange && previousBoundary) {
          playbackBoundaryByLayerIdRef.current.set(incomingLayer.id, previousBoundary);
        }
      }
      requestedLayerIdRef.current = incomingLayer.id;
      readyLayerIdsRef.current.delete(incomingLayer.id);
      setHasError(false);

      const currentLayer = [...previousLayers]
        .reverse()
        .find((layer) => layer.status !== 'loading' && readyLayerIdsRef.current.has(layer.id));
      const isInterrupted =
        previousLayers.length > 1 ||
        previousLayers.some((layer) => layer.status === 'loading' || layer.status === 'outgoing');
      if (isInterrupted) captureCurrentFrame(true);

      if (!canOwnMedia || !currentLayer || isInterrupted) {
        releaseLayersExcept(new Set());
        replaceLayers([incomingLayer]);
      } else {
        releaseLayersExcept(new Set([currentLayer.id]));
        replaceLayers([{ ...currentLayer, opacity: 1, status: 'visible' }, incomingLayer]);
      }
      resourceGenerationRef.current += 1;
    }, [
      assetsPath,
      canOwnMedia,
      captureCurrentFrame,
      clearTransitionWork,
      colorScheme,
      createLayer,
      mode,
      occurrenceId,
      playback,
      releaseLayersExcept,
      replaceLayers,
      startTime,
    ]);

    useLayoutEffect(() => {
      const key = `${runtimeState}:${isRuntimeAdmitted}`;
      if (lifecycleKeyRef.current === key) return;
      lifecycleKeyRef.current = key;
      const previousRequested = layersRef.current.find(
        (layer) => layer.id === requestedLayerIdRef.current,
      );
      const previousIteration = previousRequested
        ? playbackIterationByLayerIdRef.current.get(previousRequested.id) ?? 0
        : 0;
      const previousPhase = previousRequested
        ? playbackPhaseByLayerIdRef.current.get(previousRequested.id) ?? 'playing'
        : 'playing';
      const previousBoundary = previousRequested
        ? playbackBoundaryByLayerIdRef.current.get(previousRequested.id)
        : undefined;
      const previousVideo = previousRequested
        ? videoByLayerIdRef.current.get(previousRequested.id)
        : undefined;
      const previousTargetTime =
        previousVideo && Number.isFinite(previousVideo.currentTime)
          ? previousVideo.currentTime
          : startTime;
      clearTransitionWork();
      lifecycleGenerationRef.current += 1;
      resourceGenerationRef.current += 1;
      resolvingAttemptByLayerIdRef.current.clear();
      attemptByLayerIdRef.current.clear();
      frameWaitByLayerIdRef.current.forEach((cleanup) => cleanup());
      frameWaitByLayerIdRef.current.clear();
      playbackFrameWaitByLayerIdRef.current.forEach((cleanup) => cleanup());
      playbackFrameWaitByLayerIdRef.current.clear();
      preparedLayerIdsRef.current.clear();

      if (runtimeState === 'suspended') {
        captureCurrentFrame(true);
        videoByLayerIdRef.current.forEach((video) => video.pause());
        const requestedLayer = layersRef.current.find(
          (layer) => layer.id === requestedLayerIdRef.current,
        );
        if (requestedLayer) {
          releaseLayersExcept(new Set([requestedLayer.id]));
          replaceLayers([{ ...requestedLayer, opacity: 0 }]);
        }
        return;
      }

      if (
        runtimeState === 'dormant' ||
        runtimeState === 'cold' ||
        (runtimeState === 'active' && !isRuntimeAdmitted)
      ) {
        captureCurrentFrame(true);
        transitionGenerationRef.current += 1;
        releaseLayersExcept(new Set());
        const nextLayer = createLayer(mode, colorScheme, previousTargetTime);
        if (playback) {
          playbackIterationByLayerIdRef.current.set(nextLayer.id, previousIteration);
          playbackPhaseByLayerIdRef.current.set(nextLayer.id, previousPhase);
          if (previousBoundary) {
            playbackBoundaryByLayerIdRef.current.set(nextLayer.id, previousBoundary);
          }
        }
        requestedLayerIdRef.current = nextLayer.id;
        replaceLayers([nextLayer]);
        return;
      }

      let requestedLayer = layersRef.current.find(
        (layer) => layer.id === requestedLayerIdRef.current,
      );
      if (!requestedLayer) {
        requestedLayer = createLayer(mode, colorScheme, previousTargetTime);
        if (playback) {
          playbackIterationByLayerIdRef.current.set(requestedLayer.id, previousIteration);
          playbackPhaseByLayerIdRef.current.set(requestedLayer.id, previousPhase);
          if (previousBoundary) {
            playbackBoundaryByLayerIdRef.current.set(requestedLayer.id, previousBoundary);
          }
        }
        requestedLayerIdRef.current = requestedLayer.id;
        replaceLayers([requestedLayer]);
        return;
      }
      if (requestedLayer && readyLayerIdsRef.current.has(requestedLayer.id)) {
        handleLayerReady(requestedLayer.id, transitionGenerationRef.current);
      } else if (requestedLayer) {
        const requestedVideo = videoByLayerIdRef.current.get(requestedLayer.id);
        if (
          requestedVideo?.readyState &&
          requestedVideo.readyState >= requestedVideo.HAVE_CURRENT_DATA
        ) {
          prepareLayer(requestedLayer, requestedVideo);
        }
      }
    }, [
      captureCurrentFrame,
      clearTransitionWork,
      colorScheme,
      createLayer,
      handleLayerReady,
      isRuntimeAdmitted,
      mode,
      playback,
      prepareLayer,
      releaseLayersExcept,
      replaceLayers,
      runtimeState,
      startTime,
    ]);

    useEffect(() => {
      if (!canOwnMedia) return;
      const resourceGeneration = resourceGenerationRef.current;
      const lifecycleGeneration = lifecycleGenerationRef.current;
      layersRef.current.forEach((layer) => {
        if (
          layer.source ||
          layer.id !== requestedLayerIdRef.current ||
          resolvingAttemptByLayerIdRef.current.has(layer.id)
        ) {
          return;
        }
        const attemptGeneration = ++attemptGenerationRef.current;
        resolvingAttemptByLayerIdRef.current.set(layer.id, attemptGeneration);
        attemptByLayerIdRef.current.set(layer.id, attemptGeneration);
        void selectRazorSenseVideoSource({
          assetsPath,
          mode: layer.mode,
          colorScheme: layer.colorScheme,
          viewport: 'mobile',
        })
          .then(({ src }) => {
            if (resolvingAttemptByLayerIdRef.current.get(layer.id) === attemptGeneration) {
              resolvingAttemptByLayerIdRef.current.delete(layer.id);
            }
            if (
              !isMountedRef.current ||
              !canOwnMediaRef.current ||
              lifecycleGeneration !== lifecycleGenerationRef.current ||
              resourceGeneration !== resourceGenerationRef.current ||
              attemptByLayerIdRef.current.get(layer.id) !== attemptGeneration ||
              layer.id !== requestedLayerIdRef.current ||
              !layersRef.current.some((candidate) => candidate.id === layer.id)
            ) {
              return;
            }
            replaceLayers(
              layersRef.current.map((candidate) =>
                candidate.id === layer.id ? { ...candidate, source: src } : candidate,
              ),
            );
          })
          .catch((cause: unknown) => {
            if (resolvingAttemptByLayerIdRef.current.get(layer.id) === attemptGeneration) {
              resolvingAttemptByLayerIdRef.current.delete(layer.id);
            }
            if (
              !canOwnMediaRef.current ||
              lifecycleGeneration !== lifecycleGenerationRef.current ||
              resourceGeneration !== resourceGenerationRef.current ||
              attemptByLayerIdRef.current.get(layer.id) !== attemptGeneration ||
              layer.id !== requestedLayerIdRef.current
            ) {
              return;
            }
            const remainingLayers = layersRef.current.filter(
              (candidate) => candidate.id !== layer.id,
            );
            if (remainingLayers.length > 0) {
              const retained = remainingLayers[remainingLayers.length - 1];
              replaceLayers([{ ...retained, opacity: 1, status: 'visible' }]);
              setDisplayedMode(retained.mode);
              setDisplayedColorScheme(retained.colorScheme);
              setSnapshotOpacity(0);
            } else {
              replaceLayers([]);
              setHasError(true);
            }
            reportAttemptError(
              attemptGeneration,
              cause instanceof Error ? cause : new Error(String(cause)),
            );
          });
      });
    }, [assetsPath, canOwnMedia, layers, replaceLayers, reportAttemptError]);

    useEffect(() => {
      videoByLayerIdRef.current.forEach((video, layerId) => {
        video.playbackRate = playbackRate;
        const isReady = readyLayerIdsRef.current.has(layerId);
        const layer = layersRef.current.find((candidate) => candidate.id === layerId);
        const isPlaybackTarget = Boolean(
          playback && layer && layerId === requestedLayerIdRef.current,
        );
        video.loop = !isPlaybackTarget;
        if (!shouldPlay || !isReady) {
          video.pause();
          return;
        }
        if (!isPlaybackTarget || !layer) {
          video.play().catch(() => undefined);
          return;
        }

        const phase = playbackPhaseByLayerIdRef.current.get(layerId) ?? 'playing';
        if (phase === 'terminal') {
          video.pause();
          return;
        }
        if (phase === 'boundary') {
          const boundary = playbackBoundaryByLayerIdRef.current.get(layerId);
          if (boundary && !playbackFrameWaitByLayerIdRef.current.has(layerId)) {
            seekPlaybackBoundary(layer, video, boundary);
          }
          return;
        }
        if (video.ended) {
          handlePlaybackEnded(layer, video);
          return;
        }
        video.play().catch(() => undefined);
      });
    }, [handlePlaybackEnded, layers, playback, playbackRate, seekPlaybackBoundary, shouldPlay]);

    useEffect(
      () => () => {
        isMountedRef.current = false;
        transitionGenerationRef.current += 1;
        resourceGenerationRef.current += 1;
        lifecycleGenerationRef.current += 1;
        resolvingAttemptByLayerIdRef.current.clear();
        attemptByLayerIdRef.current.clear();
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
      viewport: 'mobile',
    });
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
          backgroundColor: MOBILE_BASE_COLORS[displayedColorScheme][displayedMode],
          transition: `${transitionDurationMs}ms background-color`,
          ...style,
        }}
      >
        <div
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
        >
          <RazorSenseFallback
            src={representativeFrame.src}
            objectPosition={representativeFrame.objectPosition}
          />
        </div>
        {layers.map((layer) =>
          layer.source ? (
            <video
              key={layer.id}
              crossOrigin="anonymous"
              ref={(video) => {
                if (video) videoByLayerIdRef.current.set(layer.id, video);
                else videoByLayerIdRef.current.delete(layer.id);
              }}
              aria-hidden="true"
              data-razor-sense-mobile-layer={layer.mode}
              data-razor-sense-mobile-layer-status={layer.status}
              src={layer.source}
              muted
              loop={!playback || layer.id !== requestedLayerIdRef.current}
              playsInline
              preload="auto"
              onLoadedData={(event) => prepareLayer(layer, event.currentTarget)}
              onEnded={(event) => handlePlaybackEnded(layer, event.currentTarget)}
              onError={() => {
                if (
                  layer.id !== requestedLayerIdRef.current ||
                  !layersRef.current.some((candidate) => candidate.id === layer.id)
                ) {
                  return;
                }
                const attemptGeneration =
                  attemptByLayerIdRef.current.get(layer.id) ?? ++attemptGenerationRef.current;
                if (!canOwnMediaRef.current) {
                  cancelFrameWait(layer.id);
                  readyLayerIdsRef.current.delete(layer.id);
                  releaseVideo(videoByLayerIdRef.current.get(layer.id));
                  videoByLayerIdRef.current.delete(layer.id);
                  resolvingAttemptByLayerIdRef.current.delete(layer.id);
                  attemptByLayerIdRef.current.delete(layer.id);
                  replaceLayers(
                    layersRef.current.map((candidate) =>
                      candidate.id === layer.id
                        ? { ...candidate, source: undefined, status: 'loading' }
                        : candidate,
                    ),
                  );
                  return;
                }
                releaseLayer(layer.id);
                const remainingLayers = layersRef.current.filter(
                  (candidate) => candidate.id !== layer.id,
                );
                if (remainingLayers.length > 0) {
                  const retained = remainingLayers[remainingLayers.length - 1];
                  replaceLayers([{ ...retained, opacity: 1, status: 'visible' }]);
                  setDisplayedMode(retained.mode);
                  setDisplayedColorScheme(retained.colorScheme);
                  setSnapshotOpacity(0);
                } else {
                  replaceLayers([]);
                  setHasError(true);
                }
                reportAttemptError(
                  attemptGeneration,
                  new Error(`RazorSense: Failed to load the ${layer.mode} mobile mode`),
                );
              }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'block',
                width: '100%',
                height: '100%',
                zIndex: 1,
                objectFit: 'cover',
                opacity: layer.opacity,
                transform: layer.colorScheme === 'dark' ? 'scaleX(1.2)' : 'scaleX(1)',
                transitionDuration: `${
                  layer.id === initialLayerRef.current.id && !hasLoadedRef.current
                    ? FADE_IN_MS
                    : transitionDurationMs
                }ms`,
                transitionTimingFunction: 'ease',
                transitionProperty: 'opacity, transform',
                pointerEvents: 'none',
              }}
            />
          ) : null,
        )}
        <canvas
          ref={snapshotCanvasRef}
          aria-hidden="true"
          data-razor-sense-mobile-snapshot={hasSnapshot ? 'ready' : 'empty'}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            zIndex: 2,
            opacity: hasSnapshot ? snapshotOpacity : 0,
            transition: isSnapshotTransitionEnabled
              ? `${transitionDurationMs}ms ease opacity`
              : 'none',
            pointerEvents: 'none',
          }}
        />
        <canvas ref={layerCaptureCanvasRef} aria-hidden="true" style={{ display: 'none' }} />
        {hasError ? (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 3,
              backgroundColor: FALLBACK_COLORS[colorScheme][mode],
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
        ) : null}
      </div>
    );
  },
);

const RazorSenseMood = forwardRef<HTMLDivElement, RazorSenseMoodProps>(function RazorSenseMood(
  props,
  forwardedRef,
) {
  const [useMobileRenderer, setUseMobileRenderer] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const updateRenderer = (event: MediaQueryListEvent): void =>
      setUseMobileRenderer(event.matches);
    setUseMobileRenderer(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateRenderer);
    return () => mediaQuery.removeEventListener('change', updateRenderer);
  }, []);

  if (useMobileRenderer === null) {
    const width = props.width ?? '100%';
    const height = props.height ?? '100%';
    return (
      <div
        ref={forwardedRef}
        className={props.className}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          position: 'relative',
          overflow: 'hidden',
          ...props.style,
          opacity: 0,
        }}
      />
    );
  }

  if (useMobileRenderer) {
    return <MobileRazorSenseMood {...props} ref={forwardedRef} />;
  }
  return <DesktopRazorSenseMood {...props} ref={forwardedRef} />;
});

export { RazorSenseMood, MobileRazorSenseMood };
export type { RazorSenseMoodProps };
