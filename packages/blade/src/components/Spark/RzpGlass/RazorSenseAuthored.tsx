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
import {
  getRazorSenseAsset,
  getRazorSenseRepresentativeFrame,
  selectRazorSenseVideoSource,
} from './razorSenseAssets';
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
const SNAPSHOT_INTERVAL_MS = 120;

type RazorSenseAuthoredProps = Omit<SemanticRazorSenseProps, 'mode'> & {
  mode: RazorSenseOperationalMode;
  /** @internal Shared runtime lifecycle. Direct internal renderers default to active. */
  runtimeState?: RazorSenseLifecycleState;
  /** @internal Shared runtime admission. Direct internal renderers default to admitted. */
  isRuntimeAdmitted?: boolean;
  /** @internal Used by the fallback exporter after the requested frame is presented. */
  onFrameReady?: () => void;
};

type AuthoredLayer = {
  id: number;
  mode: RazorSenseOperationalMode;
  colorScheme: ColorSchemeNames;
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
};

type AuthoredLayerHandle = {
  capture(
    canvas: HTMLCanvasElement | null,
    container: HTMLElement | null,
    clearCanvas: boolean,
  ): boolean;
  getPlaybackSnapshot(): LayerPlaybackSnapshot | undefined;
  release(): void;
};

type AuthoredVideoLayerProps = {
  layer: AuthoredLayer;
  source: string;
  playbackRate: number;
  startTime?: number;
  endTime?: number;
  shouldPlay: boolean;
  transitionDurationMs: number;
  restoreSnapshot?: LayerPlaybackSnapshot;
  onReady: (layerId: number) => void;
  onError: (layerId: number, error: Error) => void;
  onSnapshotTick: () => void;
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

const AuthoredVideoLayer = forwardRef<AuthoredLayerHandle, AuthoredVideoLayerProps>(
  function AuthoredVideoLayer(props, forwardedRef) {
    const {
      layer,
      source,
      playbackRate,
      startTime,
      endTime,
      shouldPlay,
      transitionDurationMs,
      restoreSnapshot,
      onReady,
      onError,
      onSnapshotTick,
    } = props;
    const wrapperRef = useRef<HTMLDivElement>(null);
    const primaryRef = useRef<HTMLVideoElement>(null);
    const secondaryRef = useRef<HTMLVideoElement>(null);
    const thinkingRuntimeRef = useRef<ThinkingLoopRuntime | null>(null);
    const thinkingRafRef = useRef<number | null>(null);
    const frameWaitCleanupsRef = useRef(new Set<CancelVideoFrameWait>());
    const preparedVideosRef = useRef(new WeakSet<HTMLVideoElement>());
    const exactReadyVideosRef = useRef(new Set<'primary' | 'secondary'>());
    const secondaryFailedRef = useRef(false);
    const hasReportedReadyRef = useRef(false);
    const shouldPlayRef = useRef(shouldPlay);
    const playbackRateRef = useRef(playbackRate);
    const onReadyRef = useRef(onReady);
    const onErrorRef = useRef(onError);
    const onSnapshotTickRef = useRef(onSnapshotTick);
    const [isExactFrameReady, setIsExactFrameReady] = useState(false);
    const restoreSnapshotRef = useRef(restoreSnapshot);
    const initialRestoreSnapshot = restoreSnapshotRef.current;
    const timing = RAZOR_SENSE_OPERATIONAL_MODE_TIMINGS[layer.mode];
    const loopStart = Math.max(0, startTime ?? timing.startTime);
    const loopEnd = endTime ?? timing.endTime;
    const isTerminalRestore = initialRestoreSnapshot?.isTerminal ?? false;

    shouldPlayRef.current = shouldPlay;
    playbackRateRef.current = playbackRate;
    onReadyRef.current = onReady;
    onErrorRef.current = onError;
    onSnapshotTickRef.current = onSnapshotTick;

    const stopThinkingRaf = useCallback((): void => {
      if (thinkingRafRef.current === null) return;
      window.cancelAnimationFrame(thinkingRafRef.current);
      thinkingRafRef.current = null;
    }, []);

    const release = useCallback((): void => {
      frameWaitCleanupsRef.current.forEach((cleanup) => cleanup());
      frameWaitCleanupsRef.current.clear();
      stopThinkingRaf();
      thinkingRuntimeRef.current = null;
      releaseVideo(primaryRef.current);
      releaseVideo(secondaryRef.current);
    }, [stopThinkingRaf]);

    const tryReportReady = useCallback((): void => {
      if (hasReportedReadyRef.current || !exactReadyVideosRef.current.has('primary')) return;
      if (
        layer.mode === 'thinking' &&
        !secondaryFailedRef.current &&
        !exactReadyVideosRef.current.has('secondary')
      ) {
        return;
      }

      hasReportedReadyRef.current = true;
      setIsExactFrameReady(true);
      onReadyRef.current(layer.id);
    }, [layer.id, layer.mode]);

    const prepareVideo = useCallback(
      (kind: 'primary' | 'secondary', video: HTMLVideoElement, targetTime: number): void => {
        if (preparedVideosRef.current.has(video)) return;
        preparedVideosRef.current.add(video);
        video.playbackRate = playbackRateRef.current;

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
            exactReadyVideosRef.current.add(kind);
            tryReportReady();
          },
        });
        frameWaitCleanupsRef.current.add(cleanup);
      },
      [layer.colorScheme, layer.mode, tryReportReady],
    );

    useImperativeHandle(
      forwardedRef,
      () => ({
        capture: (canvas, container, clearCanvas) => {
          const wrapper = wrapperRef.current;
          const primary = primaryRef.current;
          if (!wrapper || !primary) return false;

          const layerOpacity = getNumericOpacity(window.getComputedStyle(wrapper).opacity);
          if (layerOpacity <= 0.001) return false;
          const verticalAlignment = layer.mode === 'typing' ? 'bottom' : 'center';
          let didCapture = false;
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
              canvas,
              container,
              verticalAlignment,
              layerOpacity * videoOpacity,
              clearCanvas && !didCapture,
            );
            didCapture = true;
          };

          captureVideo(primary);
          captureVideo(secondaryRef.current);
          return didCapture;
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
            isTerminal: !timing.loop && primary.currentTime >= loopEnd - 0.06,
          };
        },
        release,
      }),
      [layer.mode, loopEnd, loopStart, release, timing.loop],
    );

    useLayoutEffect(() => {
      const primary = primaryRef.current;
      const secondary = secondaryRef.current;
      if (!isExactFrameReady) return;

      primary!.playbackRate = playbackRate;
      if (secondary) secondary.playbackRate = playbackRate;
      if (!shouldPlay || isTerminalRestore) {
        primary?.pause();
        secondary?.pause();
        return;
      }

      if (layer.mode !== 'thinking') {
        primary?.play().catch(() => undefined);
        return;
      }

      const runtime = thinkingRuntimeRef.current;
      if (!runtime) return;
      runtime.front.play().catch(() => undefined);
      if (runtime.isCrossfading) runtime.back.play().catch(() => undefined);
      else runtime.back.pause();
    }, [isExactFrameReady, isTerminalRestore, layer.mode, playbackRate, shouldPlay]);

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
      if (crossfadeDuration === 0) {
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
      if (!shouldPlay || isTerminalRestore) {
        runtime.front.pause();
        runtime.back.pause();
        return undefined;
      }

      runtime.front.play().catch(() => undefined);
      if (runtime.isCrossfading) runtime.back.play().catch(() => undefined);
      else runtime.back.pause();

      let lastSnapshotAt = 0;
      const renderLoop = (now: number): void => {
        const crossfadeStart = loopEnd - crossfadeDuration;
        if (!runtime.isCrossfading && runtime.front.currentTime >= crossfadeStart) {
          runtime.back.currentTime = loopStart;
          runtime.back.playbackRate = playbackRateRef.current;
          runtime.back.play().catch(() => undefined);
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
            runtime.front.currentTime = loopStart;
            runtime.front.style.opacity = '0';
            runtime.back.style.opacity = '1';
            [runtime.front, runtime.back] = [runtime.back, runtime.front];
            runtime.isCrossfading = false;
          }
        }

        if (now - lastSnapshotAt >= SNAPSHOT_INTERVAL_MS) {
          onSnapshotTickRef.current();
          lastSnapshotAt = now;
        }
        thinkingRafRef.current = window.requestAnimationFrame(renderLoop);
      };

      thinkingRafRef.current = window.requestAnimationFrame(renderLoop);
      return stopThinkingRaf;
    }, [
      isExactFrameReady,
      isTerminalRestore,
      layer.mode,
      loopEnd,
      loopStart,
      shouldPlay,
      stopThinkingRaf,
      timing.crossfadeDuration,
    ]);

    useEffect(() => release, [release]);

    const handlePrimaryLoaded = (video: HTMLVideoElement): void => {
      const terminalFrameTime = Math.max(loopStart, loopEnd - 1 / 30);
      prepareVideo(
        'primary',
        video,
        Math.max(
          0,
          isTerminalRestore ? terminalFrameTime : initialRestoreSnapshot?.primaryTime ?? loopStart,
        ),
      );
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
          src={source}
          muted
          loop={endTime === undefined && timing.loop}
          playsInline
          preload="auto"
          onLoadedData={(event) => handlePrimaryLoaded(event.currentTarget)}
          onTimeUpdate={(event) => {
            const shouldLoop = endTime !== undefined || timing.loop;
            if (shouldLoop && event.currentTarget.currentTime >= loopEnd) {
              event.currentTarget.currentTime = loopStart;
            }
            onSnapshotTickRef.current();
          }}
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
            onError={() => {
              secondaryFailedRef.current = true;
              primaryRef.current?.setAttribute('loop', '');
              tryReportReady();
            }}
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
      runtimeState = 'active',
      isRuntimeAdmitted = true,
    } = props;
    const { colorScheme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const snapshotCanvasRef = useRef<HTMLCanvasElement>(null);
    const nextLayerIdRef = useRef(2);
    const initialLayerRef = useRef<AuthoredLayer>({
      id: 1,
      mode,
      colorScheme,
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
    const [isSnapshotTransitionEnabled, setIsSnapshotTransitionEnabled] = useState(false);
    const snapshotColorSchemeRef = useRef(colorScheme);
    const [displayedMode, setDisplayedMode] = useState(mode);
    const [displayedColorScheme, setDisplayedColorScheme] = useState(colorScheme);
    const layerHandlesRef = useRef(new Map<number, AuthoredLayerHandle>());
    const pendingRestoreByLayerIdRef = useRef(new Map<number, LayerPlaybackSnapshot>());
    const resolvingLayerIdsRef = useRef(new Set<number>());
    const failedLayerIdsRef = useRef(new Set<number>());
    const requestedLayerIdRef = useRef(1);
    const requestedKeyRef = useRef(
      `${mode}:${colorScheme}:${startTime ?? 'default'}:${endTime ?? 'default'}`,
    );
    const requestedPlaybackWindowRef = useRef({ startTime, endTime });
    const transitionGenerationRef = useRef(0);
    const resourceGenerationRef = useRef(0);
    const transitionTimerRef = useRef<number>();
    const transitionRafRef = useRef<number>();
    const lastSnapshotAtRef = useRef(0);
    const hasLoadedRef = useRef(false);
    const onLoadRef = useRef(onLoad);
    const onErrorRef = useRef(onError);
    const onFrameReadyRef = useRef(onFrameReady);
    const isMountedRef = useRef(true);
    const canPrepareRef = useRef(false);

    layersRef.current = layers;
    sourcesByLayerIdRef.current = sourcesByLayerId;
    isMediaRetainedRef.current = isMediaRetained;
    hasSnapshotRef.current = hasSnapshot;
    onLoadRef.current = onLoad;
    onErrorRef.current = onError;
    onFrameReadyRef.current = onFrameReady;

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

    const releaseLayersExcept = useCallback((retainedLayerIds: ReadonlySet<number>): void => {
      layerHandlesRef.current.forEach((handle, layerId) => {
        if (!retainedLayerIds.has(layerId)) handle.release();
      });
    }, []);

    const captureCurrentFrame = useCallback((shouldShowSnapshot: boolean): boolean => {
      let didCapture = false;
      let capturedScheme = snapshotColorSchemeRef.current;
      layersRef.current.forEach((layer) => {
        const handle = layerHandlesRef.current.get(layer.id);
        if (!handle) return;
        const capturedLayer = handle.capture(
          snapshotCanvasRef.current,
          containerRef.current,
          !didCapture,
        );
        if (capturedLayer) {
          didCapture = true;
          capturedScheme = layer.colorScheme;
        }
      });

      if (!didCapture) return false;
      snapshotColorSchemeRef.current = capturedScheme;
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
      (nextMode: RazorSenseOperationalMode, nextColorScheme: ColorSchemeNames): AuthoredLayer => ({
        id: nextLayerIdRef.current++,
        mode: nextMode,
        colorScheme: nextColorScheme,
        opacity: 0,
        status: 'loading',
      }),
      [],
    );

    useLayoutEffect(() => {
      const requestedKey = `${mode}:${colorScheme}:${startTime ?? 'default'}:${
        endTime ?? 'default'
      }`;
      if (requestedKeyRef.current === requestedKey) return;

      const previousLayers = layersRef.current;
      const previousRequestedLayer =
        [...previousLayers].reverse().find((layer) => layer.id === requestedLayerIdRef.current) ??
        previousLayers[previousLayers.length - 1];
      const didPlaybackWindowChange =
        requestedPlaybackWindowRef.current.startTime !== startTime ||
        requestedPlaybackWindowRef.current.endTime !== endTime;
      requestedKeyRef.current = requestedKey;
      requestedPlaybackWindowRef.current = { startTime, endTime };
      transitionGenerationRef.current += 1;
      clearTransitionWork();

      const alreadyMounted = [...previousLayers]
        .reverse()
        .find((layer) => layer.mode === mode && layer.colorScheme === colorScheme);
      if (
        !didPlaybackWindowChange &&
        alreadyMounted &&
        layerHandlesRef.current.has(alreadyMounted.id)
      ) {
        const retainedIds = new Set([alreadyMounted.id]);
        releaseLayersExcept(retainedIds);
        requestedLayerIdRef.current = alreadyMounted.id;
        replaceLayers([{ ...alreadyMounted, opacity: 1, status: 'visible' }]);
        const source = sourcesByLayerIdRef.current[alreadyMounted.id];
        replaceSources(source ? { [alreadyMounted.id]: source } : {});
        setDisplayedMode(mode);
        setDisplayedColorScheme(colorScheme);
        setSnapshotOpacity(0);
        return;
      }

      const incomingLayer = createLayer(mode, colorScheme);
      requestedLayerIdRef.current = incomingLayer.id;
      failedLayerIdsRef.current.delete(incomingLayer.id);
      pendingRestoreByLayerIdRef.current.clear();

      let incomingRestoreSnapshot: LayerPlaybackSnapshot | undefined;
      if (
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
      const isInterruptedTransition = previousLayers.some((layer) => layer.status === 'outgoing');
      const isSchemeChange = previousRequestedLayer?.colorScheme !== colorScheme;
      if (currentLayer && (isInterruptedTransition || isSchemeChange)) {
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
      captureCurrentFrame,
      clearTransitionWork,
      colorScheme,
      createLayer,
      mode,
      releaseLayersExcept,
      replaceLayers,
      replaceSources,
      startTime,
      endTime,
    ]);

    useLayoutEffect(() => {
      const canOwnMedia =
        runtimeState === 'warm' || (runtimeState === 'active' && isRuntimeAdmitted);
      if (canOwnMedia) {
        if (!isMediaRetainedRef.current) setMediaRetained(true);
        return;
      }

      if (runtimeState === 'suspended') {
        if (isMediaRetainedRef.current) captureCurrentFrame(false);
        return;
      }

      if (isMediaRetainedRef.current) {
        captureCurrentFrame(true);
        transitionGenerationRef.current += 1;
        resourceGenerationRef.current += 1;
        clearTransitionWork();
        releaseLayersExcept(new Set());
        replaceSources({});
        const nextLayer = createLayer(mode, colorScheme);
        requestedLayerIdRef.current = nextLayer.id;
        pendingRestoreByLayerIdRef.current.clear();
        replaceLayers([nextLayer]);
        setMediaRetained(false);
      } else if (hasSnapshotRef.current) {
        setIsSnapshotTransitionEnabled(false);
        setSnapshotOpacity(1);
      }
    }, [
      captureCurrentFrame,
      clearTransitionWork,
      colorScheme,
      createLayer,
      isRuntimeAdmitted,
      mode,
      releaseLayersExcept,
      replaceLayers,
      replaceSources,
      runtimeState,
      setMediaRetained,
    ]);

    const canPrepare =
      isMediaRetained &&
      (runtimeState === 'warm' || (runtimeState === 'active' && isRuntimeAdmitted));
    canPrepareRef.current = canPrepare;

    useEffect(() => {
      if (!canPrepare) return;
      const resourceGeneration = resourceGenerationRef.current;

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
          assetsPath,
          mode: layer.mode,
          colorScheme: layer.colorScheme,
          viewport: 'desktop',
        })
          .then(({ src }) => {
            resolvingLayerIdsRef.current.delete(layer.id);
            if (
              !isMountedRef.current ||
              resourceGenerationRef.current !== resourceGeneration ||
              !canPrepareRef.current ||
              !layersRef.current.some((candidate) => candidate.id === layer.id)
            ) {
              return;
            }
            replaceSources({ ...sourcesByLayerIdRef.current, [layer.id]: src });
          })
          .catch((cause: unknown) => {
            resolvingLayerIdsRef.current.delete(layer.id);
            if (!layersRef.current.some((candidate) => candidate.id === layer.id)) return;
            failedLayerIdsRef.current.add(layer.id);
            onErrorRef.current?.(cause instanceof Error ? cause : new Error(String(cause)));
          });
      });
    }, [assetsPath, canPrepare, layers, replaceSources]);

    const handleLayerReady = useCallback(
      (layerId: number): void => {
        if (layerId !== requestedLayerIdRef.current) return;
        const currentLayers = layersRef.current;
        const incomingLayer = currentLayers.find((layer) => layer.id === layerId);
        if (!incomingLayer) return;
        pendingRestoreByLayerIdRef.current.delete(layerId);

        const generation = ++transitionGenerationRef.current;
        const durationMs = Math.max(0, modeTransitionDuration * 1000);
        const outgoingLayers = currentLayers.filter((layer) => layer.id !== layerId);
        setDisplayedMode(incomingLayer.mode);
        setDisplayedColorScheme(incomingLayer.colorScheme);

        const showExactFrameImmediately = Boolean(onFrameReadyRef.current);
        if (showExactFrameImmediately) {
          replaceLayers(
            currentLayers.map((layer) =>
              layer.id === layerId
                ? { ...layer, opacity: 1, status: 'visible' }
                : { ...layer, opacity: 0, status: 'outgoing' },
            ),
          );
          setIsSnapshotTransitionEnabled(false);
          setSnapshotOpacity(0);
        } else {
          transitionRafRef.current = window.requestAnimationFrame(() => {
            transitionRafRef.current = undefined;
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
          });
        }

        if (!hasLoadedRef.current) {
          hasLoadedRef.current = true;
          onLoadRef.current?.();
        }
        onFrameReadyRef.current?.();

        if (outgoingLayers.length === 0) return;
        transitionTimerRef.current = window.setTimeout(() => {
          transitionTimerRef.current = undefined;
          if (
            generation !== transitionGenerationRef.current ||
            requestedLayerIdRef.current !== layerId
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
      [modeTransitionDuration, releaseLayersExcept, replaceLayers, replaceSources],
    );

    const handleLayerError = useCallback(
      (layerId: number, error: Error): void => {
        if (!layersRef.current.some((layer) => layer.id === layerId)) return;
        failedLayerIdsRef.current.add(layerId);
        pendingRestoreByLayerIdRef.current.delete(layerId);
        transitionGenerationRef.current += 1;
        clearTransitionWork();
        layerHandlesRef.current.get(layerId)?.release();
        layerHandlesRef.current.delete(layerId);

        const remainingLayers = layersRef.current.filter((layer) => layer.id !== layerId);
        const remainingSources = { ...sourcesByLayerIdRef.current };
        delete remainingSources[layerId];
        replaceSources(remainingSources);
        if (remainingLayers.length > 0) {
          const outgoing = remainingLayers[remainingLayers.length - 1];
          replaceLayers([{ ...outgoing, opacity: 1, status: 'visible' }]);
          setDisplayedMode(outgoing.mode);
          setDisplayedColorScheme(outgoing.colorScheme);
          setSnapshotOpacity(0);
        } else {
          replaceLayers([]);
          if (hasSnapshotRef.current) {
            setIsSnapshotTransitionEnabled(false);
            setSnapshotOpacity(1);
          }
        }
        onErrorRef.current?.(error);
      },
      [clearTransitionWork, replaceLayers, replaceSources],
    );

    const handleSnapshotTick = useCallback((): void => {
      const now = performance.now();
      if (now - lastSnapshotAtRef.current < SNAPSHOT_INTERVAL_MS) return;
      captureCurrentFrame(false);
      lastSnapshotAtRef.current = now;
    }, [captureCurrentFrame]);

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
                  startTime={startTime}
                  endTime={endTime}
                  shouldPlay={shouldPlay}
                  transitionDurationMs={
                    onFrameReadyRef.current
                      ? 0
                      : layer.id === initialLayerRef.current.id && !hasLoadedRef.current
                      ? FADE_IN_MS
                      : transitionDurationMs
                  }
                  restoreSnapshot={pendingRestoreByLayerIdRef.current.get(layer.id)}
                  onReady={handleLayerReady}
                  onError={handleLayerError}
                  onSnapshotTick={handleSnapshotTick}
                />
              );
            })
          : null}
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
            transform: snapshotColorSchemeRef.current === 'dark' ? 'scaleX(1.2)' : 'scaleX(1)',
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
