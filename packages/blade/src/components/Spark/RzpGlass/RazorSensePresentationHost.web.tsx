/* eslint-disable react/react-in-jsx-scope */

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { RazorSenseAudioWave } from './RazorSenseAudioWave';
import type {
  RazorSenseControllerHostBinding,
  RazorSenseControllerHostCallbacks,
  RazorSenseControllerHostRequest,
  RazorSensePresentationToken,
} from './RazorSenseController';
import { LegacyRzpGlass, SemanticRazorSense } from './RzpGlass';
import {
  getRazorSenseDirectVideoSource,
  getRazorSenseProgram,
  resolveRazorSensePlayback,
  resolveRazorSenseTransition,
} from './razorSensePrograms';
import type { RazorSenseProgramDescriptor } from './razorSensePrograms';
import { RazorSenseStaticFrame } from './RazorSenseStaticFrame';
import { RazorSenseError } from './razorSenseMotionTypes';
import type {
  RazorSenseCancelReason,
  RazorSenseRunId,
  RazorSenseTarget,
} from './razorSenseMotionTypes';
import { useRazorSenseReducedMotion } from './useRazorSenseReducedMotion';
import { DEFAULT_CDN_PATH, preloadRazorSenseTarget } from './utils';
import { useTheme } from '~components/BladeProvider';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

type RazorSenseRendererKind = 'semantic' | 'legacy' | 'audio' | 'static' | 'snapshot';

type RazorSensePresentationSlot = {
  id: number;
  kind: RazorSenseRendererKind;
  request: RazorSenseControllerHostRequest;
  opacity: number;
  transitionMs: number;
  transitionEasing: string;
  snapshotUrl?: string;
  frozenComposition?: boolean;
};

type RazorSenseLoginWindow = Extract<
  NonNullable<RazorSenseControllerHostRequest['builtInManifest']>,
  { kind: 'login-to-dashboard' }
>['windows'][number];

type RazorSenseExecution = {
  request: RazorSenseControllerHostRequest;
  callbacks: RazorSenseControllerHostCallbacks;
  slotId: number;
  reducedMotion: boolean;
  degraded: boolean;
  delayReady: boolean;
  stabilizationReady: boolean;
  rendererReady: boolean;
  playbackStarted: boolean;
  transitionStarted: boolean;
  transitioned: boolean;
  terminal: boolean;
  iterationCount: number;
  boundaryRequested: boolean;
  transitionTimer?: PausableTimer;
  delayTimer?: PausableTimer;
  terminalTimer?: PausableTimer;
  cueTimers?: PausableTimer[];
  reduceWhenFallbackReady: boolean;
};

type PausableTimer = {
  id?: number;
  startedAt?: number;
  remainingMs: number;
  callback: () => void;
};

type RazorSensePresentationHostProps = {
  initialTarget: RazorSenseTarget;
  assetsPath?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  accessibilityLabel?: string;
  isInteractive?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onSuspensionChange?: (suspension: RazorSenseHostSuspension) => void;
  loginMaterialRunId?: RazorSenseRunId;
  preserveCompositionOnCancel?: boolean;
};

type RazorSenseHostSuspension = Readonly<{
  isSuspended: boolean;
  controller: boolean;
  documentHidden: boolean;
  offscreen: boolean;
}>;

type RazorSensePresentationHostHandle = RazorSenseControllerHostBinding;

const createInitialRequest = (target: RazorSenseTarget): RazorSenseControllerHostRequest =>
  Object.freeze({
    kind: 'initial',
    token: Object.freeze({ commandId: 0, occurrenceId: 0, epoch: 0, revision: 0 }),
    target,
    playback: resolveRazorSensePlayback(target),
    transition: 'cut',
  });

const tokenMatches = (
  left: RazorSensePresentationToken,
  right: RazorSensePresentationToken,
): boolean =>
  left.commandId === right.commandId &&
  left.occurrenceId === right.occurrenceId &&
  left.epoch === right.epoch &&
  left.revision === right.revision;

const invokePublicCallback = <Value,>(
  callback: ((value: Value) => void) | undefined,
  value: Value,
): void => {
  if (!callback) return;
  try {
    callback(value);
  } catch (error) {
    queueMicrotask(() => {
      throw error;
    });
  }
};

const invokePublicVoidCallback = (callback: (() => void) | undefined): void => {
  if (!callback) return;
  try {
    callback();
  } catch (error) {
    queueMicrotask(() => {
      throw error;
    });
  }
};

const getTokenKey = (token: RazorSensePresentationToken): string =>
  `${token.commandId}:${token.occurrenceId}:${token.epoch}:${token.revision}`;

const clearPausableTimer = (timer?: PausableTimer): void => {
  if (!timer || typeof window === 'undefined') return;
  if (timer.id !== undefined) window.clearTimeout(timer.id);
  timer.id = undefined;
};

const pausePausableTimer = (timer?: PausableTimer): void => {
  if (!timer || timer.id === undefined || timer.startedAt === undefined) return;
  timer.remainingMs = Math.max(0, timer.remainingMs - (performance.now() - timer.startedAt));
  clearPausableTimer(timer);
  timer.startedAt = undefined;
};

const armPausableTimer = (
  timer: PausableTimer,
  isPaused: boolean,
  getIsPaused?: () => boolean,
): void => {
  clearPausableTimer(timer);
  if (isPaused || typeof window === 'undefined') return;
  timer.startedAt = performance.now();
  timer.id = window.setTimeout(() => {
    timer.id = undefined;
    timer.startedAt = undefined;
    timer.remainingMs = 0;
    if (getIsPaused?.()) return;
    timer.callback();
  }, timer.remainingMs);
};

const getRendererKind = (
  program: RazorSenseProgramDescriptor,
  reducedMotion: boolean,
): RazorSenseRendererKind => {
  if (reducedMotion) return 'static';
  if (program.rendererFamily === 'legacy') return 'legacy';
  if (
    program.rendererFamily === 'authored' &&
    (program.authoredAssetKey === 'audioWave' || program.authoredAssetKey === 'bottomWave')
  ) {
    return 'audio';
  }
  return 'semantic';
};

const getVisualMode = (program: RazorSenseProgramDescriptor): string | undefined =>
  'visualMode' in program ? program.visualMode : undefined;

const getLegacyPreset = (program: RazorSenseProgramDescriptor): 'rippleWave' | 'circleSlideUp' => {
  if (program.rendererFamily !== 'legacy') {
    throw new Error(`RazorSense: ${program.id} is not a legacy program.`);
  }
  return program.legacyPreset;
};

const getLoginWindow = (
  request: RazorSenseControllerHostRequest,
): RazorSenseLoginWindow | undefined => {
  const manifest = request.builtInManifest;
  if (manifest?.kind !== 'login-to-dashboard' || !request.stepId) return undefined;
  return manifest.windows.find((window) => window.stepId === request.stepId);
};

const getBuiltInPlaybackRate = (request: RazorSenseControllerHostRequest): number =>
  getLoginWindow(request)?.playbackRate ?? 1;

const getMediaDimensions = (
  media: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
): { width: number; height: number } => {
  if (media instanceof HTMLImageElement) {
    return { width: media.naturalWidth, height: media.naturalHeight };
  }
  if (media instanceof HTMLVideoElement) {
    return { width: media.videoWidth, height: media.videoHeight };
  }
  return { width: media.width, height: media.height };
};

const getElementOpacityWithin = (element: Element, boundary: Element): number => {
  let opacity = 1;
  let current: Element | null = element;
  while (current && current !== boundary) {
    const computed = window.getComputedStyle(current);
    if (
      computed.display === 'none' ||
      computed.visibility === 'hidden' ||
      computed.visibility === 'collapse'
    ) {
      return 0;
    }
    const currentOpacity = Number(computed.opacity);
    if (Number.isFinite(currentOpacity)) opacity *= currentOpacity;
    current = current.parentElement;
  }
  return opacity;
};

const drawMediaIntoComposite = (
  context: CanvasRenderingContext2D,
  media: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  hostRect: DOMRect,
): boolean => {
  const dimensions = getMediaDimensions(media);
  if (dimensions.width <= 0 || dimensions.height <= 0) return false;
  const rect = media.getBoundingClientRect();
  const destinationX = rect.left - hostRect.left;
  const destinationY = rect.top - hostRect.top;
  const destinationWidth = rect.width;
  const destinationHeight = rect.height;
  if (destinationWidth <= 0 || destinationHeight <= 0) return false;
  const computed = window.getComputedStyle(media);

  if (computed.objectFit === 'cover') {
    const sourceScale = Math.max(
      destinationWidth / dimensions.width,
      destinationHeight / dimensions.height,
    );
    const sourceWidth = destinationWidth / sourceScale;
    const sourceHeight = destinationHeight / sourceScale;
    const sourceX = Math.max(0, (dimensions.width - sourceWidth) / 2);
    const sourceY = computed.objectPosition.includes('bottom')
      ? Math.max(0, dimensions.height - sourceHeight)
      : Math.max(0, (dimensions.height - sourceHeight) / 2);
    context.drawImage(
      media,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      destinationX,
      destinationY,
      destinationWidth,
      destinationHeight,
    );
    return true;
  }

  context.drawImage(media, destinationX, destinationY, destinationWidth, destinationHeight);
  return true;
};

const captureRazorSenseComposite = (
  host: HTMLDivElement,
  slots: readonly RazorSensePresentationSlot[],
  slotNodes: ReadonlyMap<number, HTMLDivElement>,
): string | undefined => {
  const hostRect = host.getBoundingClientRect();
  if (hostRect.width <= 0 || hostRect.height <= 0) return undefined;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(hostRect.width * pixelRatio));
  canvas.height = Math.max(1, Math.round(hostRect.height * pixelRatio));
  const context = canvas.getContext('2d');
  if (!context) return undefined;
  context.scale(pixelRatio, pixelRatio);
  context.beginPath();
  context.rect(0, 0, hostRect.width, hostRect.height);
  context.clip();

  let didDraw = false;
  for (const slot of slots) {
    const slotNode = slotNodes.get(slot.id);
    if (!slotNode || slot.opacity <= 0.001) continue;
    const backgroundColor = window.getComputedStyle(slotNode).backgroundColor;
    if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      context.save();
      context.globalAlpha = slot.opacity;
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, hostRect.width, hostRect.height);
      context.restore();
      didDraw = true;
    }

    const mediaElements = slotNode.querySelectorAll<
      HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
    >('img, video, canvas');
    for (const media of Array.from(mediaElements)) {
      const elementOpacity = getElementOpacityWithin(media, slotNode);
      if (elementOpacity <= 0.001) continue;
      context.save();
      context.globalAlpha = slot.opacity * elementOpacity;
      try {
        didDraw = drawMediaIntoComposite(context, media, hostRect) || didDraw;
      } catch {
        // A single unavailable decoder frame should not discard other visible layers.
      }
      context.restore();
    }
  }

  if (!didDraw) return undefined;
  try {
    return canvas.toDataURL('image/png');
  } catch {
    return undefined;
  }
};

const RazorSensePresentationHost = forwardRef<
  RazorSensePresentationHostHandle,
  RazorSensePresentationHostProps
>(function RazorSensePresentationHost(props, forwardedRef) {
  const {
    initialTarget,
    assetsPath = DEFAULT_CDN_PATH,
    width = '100%',
    height = '100%',
    className,
    style,
    accessibilityLabel,
    isInteractive = true,
    onLoad,
    onError,
    onSuspensionChange,
    loginMaterialRunId,
    preserveCompositionOnCancel = false,
  } = props;
  const { colorScheme, theme } = useTheme();
  const prefersReducedMotion = useRazorSenseReducedMotion();
  const initialRequestRef = useRef(createInitialRequest(initialTarget));
  const initialSlotRef = useRef<RazorSensePresentationSlot>({
    id: 0,
    kind: 'static',
    request: initialRequestRef.current,
    opacity: 1,
    transitionMs: 0,
    transitionEasing: 'linear',
  });
  const [slots, setSlots] = useState<RazorSensePresentationSlot[]>([initialSlotRef.current]);
  const slotsRef = useRef(slots);
  const slotNodesRef = useRef(new Map<number, HTMLDivElement>());
  const fallbackReadyTokensRef = useRef(new Map<number, string>());
  const fallbackErrorsRef = useRef(new Map<number, { tokenKey: string; error: Error }>());
  const executionRef = useRef<RazorSenseExecution>();
  const slotCounterRef = useRef(0);
  const [controllerPaused, setControllerPaused] = useState(false);
  const controllerPausedRef = useRef(controllerPaused);
  const [isDocumentHidden, setIsDocumentHidden] = useState(
    typeof document !== 'undefined' ? document.hidden : false,
  );
  const [isInViewport, setIsInViewport] = useState(true);
  const isDocumentHiddenRef = useRef(isDocumentHidden);
  const isInViewportRef = useRef(isInViewport);
  const hostNodeRef = useRef<HTMLDivElement>(null);
  const orchestrationPaused = controllerPaused || isDocumentHidden || !isInViewport;
  const orchestrationPausedRef = useRef(orchestrationPaused);
  const hasLoadedRef = useRef(false);
  const cancelSettleTimerRef = useRef<PausableTimer>();

  slotsRef.current = slots;
  controllerPausedRef.current = controllerPaused;
  isDocumentHiddenRef.current = isDocumentHidden;
  isInViewportRef.current = isInViewport;
  orchestrationPausedRef.current = orchestrationPaused;

  useIsomorphicLayoutEffect(() => {
    onSuspensionChange?.({
      isSuspended: orchestrationPaused,
      controller: controllerPaused,
      documentHidden: isDocumentHidden,
      offscreen: !isInViewport,
    });
  }, [controllerPaused, isDocumentHidden, isInViewport, onSuspensionChange, orchestrationPaused]);

  const commitSlots = useCallback((nextSlots: RazorSensePresentationSlot[]): void => {
    const retainedSlotIds = new Set(nextSlots.map((slot) => slot.id));
    fallbackReadyTokensRef.current.forEach((_token, slotId) => {
      if (!retainedSlotIds.has(slotId)) fallbackReadyTokensRef.current.delete(slotId);
    });
    fallbackErrorsRef.current.forEach((_failure, slotId) => {
      if (!retainedSlotIds.has(slotId)) fallbackErrorsRef.current.delete(slotId);
    });
    slotsRef.current = nextSlots;
    setSlots(nextSlots);
  }, []);

  const clearExecutionTimers = useCallback((execution?: RazorSenseExecution): void => {
    if (!execution) return;
    clearPausableTimer(execution.delayTimer);
    clearPausableTimer(execution.transitionTimer);
    clearPausableTimer(execution.terminalTimer);
    execution.cueTimers?.forEach(clearPausableTimer);
    execution.delayTimer = undefined;
    execution.transitionTimer = undefined;
    execution.terminalTimer = undefined;
    execution.cueTimers = undefined;
  }, []);

  const freezeVisibleSlots = useCallback((preserveAll = false): RazorSensePresentationSlot[] => {
    const frozen = slotsRef.current
      .map((slot) => {
        const node = slotNodesRef.current.get(slot.id);
        const computedOpacity = node ? Number(window.getComputedStyle(node).opacity) : slot.opacity;
        return {
          ...slot,
          opacity: Number.isFinite(computedOpacity) ? computedOpacity : slot.opacity,
          transitionMs: 0,
        };
      })
      .filter((slot) => preserveAll || slot.opacity > 0.001);
    return frozen.length > 0 ? frozen : [initialSlotRef.current];
  }, []);

  const pauseActiveOrchestration = useCallback((): void => {
    const execution = executionRef.current;
    pausePausableTimer(execution?.delayTimer);
    pausePausableTimer(execution?.transitionTimer);
    pausePausableTimer(execution?.terminalTimer);
    execution?.cueTimers?.forEach(pausePausableTimer);
    pausePausableTimer(cancelSettleTimerRef.current);
    if (execution?.transitionTimer) commitSlots(freezeVisibleSlots(true));
  }, [commitSlots, freezeVisibleSlots]);

  const getTransitionTiming = useCallback(
    (
      request: RazorSenseControllerHostRequest,
      reducedMotion: boolean,
    ): { durationMs: number; easing: string } => {
      const loginWindow = getLoginWindow(request);
      if (!reducedMotion && request.builtInManifest?.kind === 'login-to-dashboard') {
        if (request.stepId?.startsWith('loader-')) {
          return { durationMs: 0, easing: String(theme.motion.easing.standard) };
        }
        if (request.stepId === 'dashboard-ambient') {
          const edge = request.builtInManifest.authoredEdges.find(
            (candidate) => candidate.id === 'expand-from-mark',
          );
          return {
            durationMs: edge
              ? ((edge.endFrame - edge.startFrame) /
                  request.builtInManifest.sourceFramesPerSecond) *
                1000
              : 0,
            easing: String(theme.motion.easing.standard),
          };
        }
        if (loginWindow) return { durationMs: 0, easing: String(theme.motion.easing.standard) };
      }
      const descriptor = resolveRazorSenseTransition(
        request.previousTarget,
        request.target,
        request.transition,
      );
      const easingKey = descriptor.easing.replace(
        'easing.',
        '',
      ) as keyof typeof theme.motion.easing;
      if (reducedMotion || descriptor.strategy === 'cut') {
        return { durationMs: 0, easing: String(theme.motion.easing[easingKey]) };
      }
      const durationKey = descriptor.duration.replace(
        'duration.',
        '',
      ) as keyof typeof theme.motion.duration;
      return {
        durationMs: theme.motion.duration[durationKey],
        easing: String(theme.motion.easing[easingKey]),
      };
    },
    [theme.motion.duration, theme.motion.easing],
  );

  const isCurrentExecution = useCallback((token: RazorSensePresentationToken): boolean => {
    const execution = executionRef.current;
    return Boolean(execution && tokenMatches(execution.request.token, token));
  }, []);

  const completeTerminal = useCallback(
    (execution: RazorSenseExecution, reason: 'natural' | 'reduced-motion' = 'natural'): void => {
      if (
        execution.terminal ||
        !isCurrentExecution(execution.request.token) ||
        !execution.callbacks.isCurrent(execution.request.token)
      ) {
        return;
      }
      execution.terminal = true;
      if (execution.boundaryRequested) {
        execution.boundaryRequested = false;
        execution.callbacks.boundary(execution.request.token, {
          reason,
          iterationCount: Math.max(1, execution.iterationCount),
          reducedMotion: execution.reducedMotion,
          degraded: execution.degraded,
        });
        return;
      }
      execution.callbacks.terminal(execution.request.token, {
        reason,
        iterationCount: Math.max(1, execution.iterationCount),
        reducedMotion: execution.reducedMotion,
        degraded: execution.degraded,
      });
    },
    [isCurrentExecution],
  );

  const scheduleTerminal = useCallback(
    (execution: RazorSenseExecution): void => {
      const loginWindow = getLoginWindow(execution.request);
      if (!loginWindow || execution.reducedMotion || typeof window === 'undefined') return;
      const framesPerSecond = execution.request.builtInManifest?.sourceFramesPerSecond ?? 24;
      const durationMs =
        ((loginWindow.endFrame - loginWindow.startFrame + 1) / framesPerSecond) * 1000;
      execution.terminalTimer = {
        remainingMs: durationMs,
        callback: () => {
          execution.terminalTimer = undefined;
          execution.iterationCount = Math.max(1, execution.iterationCount);
          completeTerminal(execution);
        },
      };
      armPausableTimer(
        execution.terminalTimer,
        orchestrationPausedRef.current,
        () => orchestrationPausedRef.current,
      );
    },
    [completeTerminal],
  );

  const scheduleBuiltInCues = useCallback(
    (execution: RazorSenseExecution): void => {
      const manifest = execution.request.builtInManifest;
      const window = getLoginWindow(execution.request);
      if (manifest?.kind !== 'login-to-dashboard' || !window) return;
      const activeCues = manifest.cues.filter(
        (cue) => cue.sourceFrame >= window.startFrame && cue.sourceFrame <= window.endFrame,
      );
      const startFrameCues = activeCues.filter((cue) => cue.sourceFrame === window.startFrame);
      startFrameCues.forEach((cue) => {
        if (!isCurrentExecution(execution.request.token)) return;
        execution.callbacks.cue(execution.request.token, cue.cue);
      });
      if (execution.reducedMotion) {
        activeCues.slice(startFrameCues.length).forEach((cue) => {
          if (!isCurrentExecution(execution.request.token)) return;
          execution.callbacks.cue(execution.request.token, cue.cue);
        });
        return;
      }
      execution.cueTimers = activeCues
        .filter((cue) => cue.sourceFrame > window.startFrame)
        .map((cue) => {
          const timer: PausableTimer = {
            remainingMs:
              ((cue.sourceFrame - window.startFrame) / manifest.sourceFramesPerSecond) * 1000,
            callback: () => {
              if (!isCurrentExecution(execution.request.token)) return;
              execution.callbacks.cue(execution.request.token, cue.cue);
            },
          };
          armPausableTimer(
            timer,
            orchestrationPausedRef.current,
            () => orchestrationPausedRef.current,
          );
          return timer;
        });
    },
    [isCurrentExecution],
  );

  const settleTransition = useCallback(
    (execution: RazorSenseExecution): void => {
      if (
        execution.transitioned ||
        !isCurrentExecution(execution.request.token) ||
        !execution.callbacks.isCurrent(execution.request.token)
      ) {
        return;
      }
      execution.transitioned = true;
      const retained = slotsRef.current.find((slot) => slot.id === execution.slotId);
      if (retained) commitSlots([{ ...retained, opacity: 1, transitionMs: 0 }]);
      execution.callbacks.transitioned(execution.request.token, {
        reducedMotion: execution.reducedMotion,
        degraded: execution.degraded,
      });

      if (
        (execution.reducedMotion || execution.degraded) &&
        (execution.request.playback.playback !== 'loop' || execution.boundaryRequested)
      ) {
        completeTerminal(execution, execution.reducedMotion ? 'reduced-motion' : 'natural');
      }
    },
    [commitSlots, completeTerminal, isCurrentExecution],
  );

  const beginTransition = useCallback(
    (execution: RazorSenseExecution): void => {
      if (
        execution.transitioned ||
        !execution.delayReady ||
        !execution.stabilizationReady ||
        !execution.rendererReady ||
        orchestrationPausedRef.current ||
        !isCurrentExecution(execution.request.token)
      ) {
        return;
      }
      const transitionTiming = getTransitionTiming(execution.request, execution.reducedMotion);
      const durationMs = transitionTiming.durationMs;
      execution.playbackStarted = true;
      if (!execution.transitionStarted) {
        execution.transitionStarted = true;
        execution.callbacks.transitionStarted(execution.request.token, {
          reducedMotion: execution.reducedMotion,
          degraded: execution.degraded,
        });
      }
      if (
        execution.request.builtInManifest?.kind === 'login-to-dashboard' &&
        execution.request.runId !== loginMaterialRunId
      ) {
        return;
      }
      const isLoginMaterialMorph =
        execution.request.builtInManifest?.kind === 'login-to-dashboard' && durationMs > 0;
      commitSlots(
        slotsRef.current.map((slot) => ({
          ...slot,
          opacity: isLoginMaterialMorph ? 1 : slot.id === execution.slotId ? 1 : 0,
          transitionMs: isLoginMaterialMorph ? 0 : durationMs,
          transitionEasing: transitionTiming.easing,
        })),
      );
      scheduleTerminal(execution);
      scheduleBuiltInCues(execution);
      if (typeof window === 'undefined' || durationMs === 0) {
        settleTransition(execution);
        return;
      }
      execution.transitionTimer = {
        remainingMs: durationMs + 32,
        callback: () => {
          execution.transitionTimer = undefined;
          settleTransition(execution);
        },
      };
      armPausableTimer(
        execution.transitionTimer,
        orchestrationPausedRef.current,
        () => orchestrationPausedRef.current,
      );
    },
    [
      commitSlots,
      getTransitionTiming,
      isCurrentExecution,
      loginMaterialRunId,
      scheduleBuiltInCues,
      scheduleTerminal,
      settleTransition,
    ],
  );

  const handleRendererReady = useCallback(
    (slotId: number, token: RazorSensePresentationToken): void => {
      const execution = executionRef.current;
      if (
        !execution ||
        execution.slotId !== slotId ||
        !tokenMatches(execution.request.token, token) ||
        execution.rendererReady ||
        !execution.callbacks.isCurrent(token)
      ) {
        return;
      }
      execution.rendererReady = true;
      execution.callbacks.ready(token, {
        reducedMotion: execution.reducedMotion,
        degraded: execution.degraded,
      });
      if (!execution.delayReady) execution.callbacks.setStatus(token, 'delaying');
      const shouldNotifyLoad = !hasLoadedRef.current;
      if (!hasLoadedRef.current) {
        hasLoadedRef.current = true;
      }
      beginTransition(execution);
      if (shouldNotifyLoad) invokePublicVoidCallback(onLoad);
    },
    [beginTransition, onLoad],
  );

  const handleFallbackReady = useCallback(
    (slotId: number, token: RazorSensePresentationToken): void => {
      fallbackReadyTokensRef.current.set(slotId, getTokenKey(token));
      const slot = slotsRef.current.find((candidate) => candidate.id === slotId);
      const execution = executionRef.current;
      if (
        execution?.slotId === slotId &&
        tokenMatches(execution.request.token, token) &&
        execution.reduceWhenFallbackReady
      ) {
        execution.reduceWhenFallbackReady = false;
        commitSlots(
          slotsRef.current.map((candidate) =>
            candidate.id === slotId ? { ...candidate, kind: 'static', transitionMs: 0 } : candidate,
          ),
        );
      } else if (slot?.kind !== 'static') {
        return;
      }
      if (
        execution?.slotId === slotId &&
        tokenMatches(execution.request.token, token) &&
        execution.rendererReady
      ) {
        if (execution.transitioned) {
          execution.callbacks.setStatus(token, 'playing');
          if (
            !getLoginWindow(execution.request) &&
            execution.request.playback.playback !== 'loop'
          ) {
            completeTerminal(execution);
          }
        }
        return;
      }
      handleRendererReady(slotId, token);
      const current = executionRef.current;
      if (
        current?.slotId === slotId &&
        tokenMatches(current.request.token, token) &&
        current.transitioned
      ) {
        current.callbacks.setStatus(token, 'playing');
        if (!getLoginWindow(current.request) && current.request.playback.playback !== 'loop') {
          completeTerminal(current);
        }
      }
    },
    [commitSlots, completeTerminal, handleRendererReady],
  );

  const handleRendererError = useCallback(
    (slotId: number, token: RazorSensePresentationToken, error: Error): void => {
      const execution = executionRef.current;
      if (
        !execution ||
        execution.slotId !== slotId ||
        !tokenMatches(execution.request.token, token)
      ) {
        return;
      }
      execution.degraded = true;
      const program = getRazorSenseProgram(execution.request.target);
      const rendererError =
        error instanceof RazorSenseError
          ? error
          : new RazorSenseError(error.message, {
              code: /context\s+lost/i.test(error.message)
                ? 'renderer-context-lost'
                : 'renderer-initialization-failed',
              recoverable: true,
              commandId: token.commandId,
              occurrenceId: token.occurrenceId,
              target: execution.request.target,
              rendererFamily: program.rendererFamily,
              originalError: error,
            });
      const fallbackError = fallbackErrorsRef.current.get(slotId);
      if (fallbackError?.tokenKey === getTokenKey(token)) {
        const fatalError = new RazorSenseError(
          `RazorSense: Live renderer and calibrated fallback both failed. ${rendererError.message} ${fallbackError.error.message}`,
          {
            code: rendererError.code,
            recoverable: false,
            commandId: token.commandId,
            occurrenceId: token.occurrenceId,
            target: execution.request.target,
            rendererFamily: program.rendererFamily,
            originalError: { rendererError, fallbackError: fallbackError.error },
          },
        );
        execution.callbacks.error(token, fatalError, { recoverable: false });
        invokePublicCallback(onError, fatalError);
        return;
      }
      execution.callbacks.setFlags(token, { degraded: true });
      execution.callbacks.error(token, rendererError, { recoverable: true });
      commitSlots(
        slotsRef.current.map((slot) => (slot.id === slotId ? { ...slot, kind: 'static' } : slot)),
      );
      if (fallbackReadyTokensRef.current.get(slotId) === getTokenKey(token)) {
        queueMicrotask(() => {
          const current = executionRef.current;
          if (!current || !tokenMatches(current.request.token, token)) return;
          if (!current.rendererReady) handleRendererReady(slotId, token);
          else if (current.transitioned) {
            current.callbacks.setStatus(token, 'playing');
            if (!getLoginWindow(current.request) && current.request.playback.playback !== 'loop') {
              completeTerminal(current);
            }
          }
        });
      }
      invokePublicCallback(onError, rendererError);
    },
    [commitSlots, completeTerminal, handleRendererReady, onError],
  );

  const handleIteration = useCallback(
    (slotId: number, token: RazorSensePresentationToken, iteration: number): void => {
      const execution = executionRef.current;
      if (
        !execution ||
        execution.slotId !== slotId ||
        !tokenMatches(execution.request.token, token) ||
        !execution.playbackStarted ||
        !execution.callbacks.isCurrent(token)
      ) {
        return;
      }
      execution.iterationCount = Math.max(execution.iterationCount, iteration);
      execution.callbacks.iteration(token, iteration, { reducedMotion: execution.reducedMotion });
      if (execution.boundaryRequested && execution.transitioned) {
        execution.callbacks.boundary(token, {
          iterationCount: iteration,
          reducedMotion: execution.reducedMotion,
          degraded: execution.degraded,
        });
        execution.boundaryRequested = false;
      }
    },
    [],
  );

  const handleTerminal = useCallback(
    (slotId: number, token: RazorSensePresentationToken, iterationCount: number): void => {
      const execution = executionRef.current;
      if (
        !execution ||
        execution.slotId !== slotId ||
        !tokenMatches(execution.request.token, token) ||
        !execution.playbackStarted ||
        getLoginWindow(execution.request)
      ) {
        return;
      }
      execution.iterationCount = Math.max(execution.iterationCount, iterationCount);
      if (execution.boundaryRequested) {
        execution.callbacks.boundary(token, {
          iterationCount: execution.iterationCount,
          reducedMotion: execution.reducedMotion,
          degraded: execution.degraded,
        });
        execution.boundaryRequested = false;
        return;
      }
      const holdAfterMs = execution.request.holdAfterMs ?? 0;
      if (holdAfterMs <= 0 || typeof window === 'undefined') {
        completeTerminal(execution);
        return;
      }
      execution.callbacks.setStatus(token, 'holding');
      execution.terminalTimer = {
        remainingMs: holdAfterMs,
        callback: () => {
          execution.terminalTimer = undefined;
          completeTerminal(execution);
        },
      };
      armPausableTimer(
        execution.terminalTimer,
        orchestrationPausedRef.current,
        () => orchestrationPausedRef.current,
      );
    },
    [completeTerminal],
  );

  const present = useCallback(
    (
      request: RazorSenseControllerHostRequest,
      callbacks: RazorSenseControllerHostCallbacks,
    ): void => {
      clearExecutionTimers(executionRef.current);
      const reducedMotion = prefersReducedMotion;
      const program = getRazorSenseProgram(request.target);
      const kind = getRendererKind(program, reducedMotion);
      const transitionDescriptor = resolveRazorSenseTransition(
        request.previousTarget,
        request.target,
        request.transition,
      );
      const frozenSlots = freezeVisibleSlots();
      const reusable = [...frozenSlots].reverse().find((slot) => {
        if (slot.kind !== kind || slot.opacity < 0.999 || slot.frozenComposition) return false;
        const isSameProgram = getRazorSenseProgram(slot.request.target).id === program.id;
        if (request.builtInManifest?.kind === 'login-to-dashboard' && !isSameProgram) {
          return false;
        }
        if (transitionDescriptor.strategy === 'program-continuation') return isSameProgram;
        return (
          kind === 'semantic' &&
          (transitionDescriptor.strategy === 'material-morph' ||
            transitionDescriptor.strategy === 'authored-crossfade' ||
            transitionDescriptor.strategy === 'semantic-crossfade')
        );
      });
      const slotId = reusable?.id ?? ++slotCounterRef.current;
      const nextSlot: RazorSensePresentationSlot = {
        id: slotId,
        kind,
        request,
        opacity: reusable ? reusable.opacity : frozenSlots.length === 0 ? 1 : 0,
        transitionMs: 0,
        transitionEasing: 'linear',
      };
      const nextSlots = reusable
        ? frozenSlots.map((slot) => (slot.id === reusable.id ? nextSlot : slot))
        : [...frozenSlots, nextSlot];
      const delayBeforeMs = request.delayBeforeMs ?? 0;
      const execution: RazorSenseExecution = {
        request,
        callbacks,
        slotId,
        reducedMotion,
        degraded: false,
        delayReady: delayBeforeMs <= 0,
        stabilizationReady: cancelSettleTimerRef.current === undefined,
        rendererReady: false,
        playbackStarted: false,
        transitionStarted: false,
        transitioned: false,
        terminal: false,
        iterationCount: 0,
        boundaryRequested: false,
        reduceWhenFallbackReady: false,
      };
      executionRef.current = execution;
      commitSlots(nextSlots);
      if (request.nextTarget) {
        void preloadRazorSenseTarget(request.nextTarget, assetsPath, colorScheme).catch(() => {
          // Speculation never changes the active occurrence's fallback contract.
        });
      }
      callbacks.setStatus(request.token, delayBeforeMs > 0 ? 'delaying' : 'preparing');
      if (
        kind === 'static' &&
        fallbackReadyTokensRef.current.get(slotId) === getTokenKey(request.token)
      ) {
        queueMicrotask(() => handleRendererReady(slotId, request.token));
      }

      if (delayBeforeMs > 0 && typeof window !== 'undefined') {
        execution.delayTimer = {
          remainingMs: delayBeforeMs,
          callback: () => {
            execution.delayTimer = undefined;
            if (!isCurrentExecution(request.token)) return;
            execution.delayReady = true;
            callbacks.setStatus(
              request.token,
              execution.rendererReady ? 'transitioning' : 'preparing',
            );
            beginTransition(execution);
          },
        };
        armPausableTimer(
          execution.delayTimer,
          orchestrationPausedRef.current,
          () => orchestrationPausedRef.current,
        );
      }
    },
    [
      beginTransition,
      clearExecutionTimers,
      commitSlots,
      freezeVisibleSlots,
      handleRendererReady,
      isCurrentExecution,
      prefersReducedMotion,
      assetsPath,
      colorScheme,
    ],
  );

  const cancel = useCallback(
    (request: RazorSenseControllerHostRequest, _reason: RazorSenseCancelReason): void => {
      const execution = executionRef.current;
      if (!execution || !tokenMatches(execution.request.token, request.token)) return;
      if (cancelSettleTimerRef.current) {
        clearPausableTimer(cancelSettleTimerRef.current);
        cancelSettleTimerRef.current = undefined;
      }
      clearExecutionTimers(execution);
      const frozenSlots = freezeVisibleSlots();
      if (preserveCompositionOnCancel) {
        executionRef.current = undefined;
        commitSlots(
          frozenSlots.map((slot) => ({
            ...slot,
            frozenComposition: true,
            transitionMs: 0,
          })),
        );
        return;
      }
      const committedTarget = execution.transitioned
        ? execution.request.target
        : execution.request.previousTarget;
      const committedProgramId = committedTarget
        ? getRazorSenseProgram(committedTarget).id
        : undefined;
      const committed =
        frozenSlots.find(
          (slot) => getRazorSenseProgram(slot.request.target).id === committedProgramId,
        ) ?? [...frozenSlots].sort((left, right) => right.opacity - left.opacity)[0];
      const snapshotUrl =
        typeof window !== 'undefined' &&
        (!execution.transitioned || frozenSlots.length > 1 || preserveCompositionOnCancel) &&
        hostNodeRef.current
          ? captureRazorSenseComposite(hostNodeRef.current, frozenSlots, slotNodesRef.current)
          : undefined;
      if (!snapshotUrl && (frozenSlots.length > 1 || preserveCompositionOnCancel)) {
        const captureError = new RazorSenseError(
          'RazorSense could not preserve the interrupted composite frame.',
          {
            code: 'capture-failed',
            recoverable: true,
            commandId: request.token.commandId,
            occurrenceId: request.token.occurrenceId,
            target: request.target,
            rendererFamily: getRazorSenseProgram(request.target).rendererFamily,
          },
        );
        execution.callbacks.error(request.token, captureError, { recoverable: true });
        invokePublicCallback(onError, captureError);
      }
      executionRef.current = undefined;
      if (snapshotUrl && committed) {
        commitSlots([
          {
            id: ++slotCounterRef.current,
            kind: 'snapshot',
            request: committed.request,
            snapshotUrl,
            opacity: 1,
            transitionMs: 0,
            transitionEasing: 'linear',
          },
        ]);
        return;
      }
      if (frozenSlots.length <= 1 || typeof window === 'undefined') {
        commitSlots(frozenSlots);
        return;
      }
      const settleDurationMs = theme.motion.duration.xquick;
      commitSlots(
        frozenSlots.map((slot) => ({
          ...slot,
          opacity: slot.id === committed.id ? 1 : 0,
          transitionMs: settleDurationMs,
          transitionEasing: String(theme.motion.easing.standard),
        })),
      );
      const cancelSettleTimer: PausableTimer = {
        remainingMs: settleDurationMs + 32,
        callback: () => {
          cancelSettleTimerRef.current = undefined;
          const retained = slotsRef.current.find((slot) => slot.id === committed.id);
          if (!retained) return;
          const currentExecution = executionRef.current;
          const prepared = currentExecution
            ? slotsRef.current.find((slot) => slot.id === currentExecution.slotId)
            : undefined;
          commitSlots([
            { ...retained, opacity: 1, transitionMs: 0 },
            ...(prepared && prepared.id !== retained.id
              ? [{ ...prepared, opacity: 0, transitionMs: 0 }]
              : []),
          ]);
          if (currentExecution) {
            currentExecution.stabilizationReady = true;
            beginTransition(currentExecution);
          }
        },
      };
      cancelSettleTimerRef.current = cancelSettleTimer;
      armPausableTimer(
        cancelSettleTimer,
        orchestrationPausedRef.current,
        () => orchestrationPausedRef.current,
      );
    },
    [
      beginTransition,
      clearExecutionTimers,
      commitSlots,
      freezeVisibleSlots,
      onError,
      preserveCompositionOnCancel,
      theme.motion,
    ],
  );

  const setPaused = useCallback(
    (isPaused: boolean): void => {
      controllerPausedRef.current = isPaused;
      orchestrationPausedRef.current =
        isPaused || isDocumentHiddenRef.current || !isInViewportRef.current;
      if (orchestrationPausedRef.current) pauseActiveOrchestration();
      setControllerPaused(isPaused);
    },
    [pauseActiveOrchestration],
  );

  const requestBoundary = useCallback(
    (
      request: RazorSenseControllerHostRequest,
      _reason: 'advance-step' | 'finish-command' | 'interrupt',
    ): void => {
      const execution = executionRef.current;
      if (!execution || !tokenMatches(execution.request.token, request.token)) return;
      if (orchestrationPausedRef.current) {
        execution.boundaryRequested = true;
        return;
      }
      if (
        execution.terminal ||
        ((execution.reducedMotion || execution.degraded) && execution.transitioned)
      ) {
        execution.callbacks.boundary(request.token, {
          iterationCount: Math.max(1, execution.iterationCount),
          reducedMotion: execution.reducedMotion,
          degraded: execution.degraded,
        });
        return;
      }
      execution.boundaryRequested = true;
    },
    [],
  );

  const presentRef = useRef(present);
  const cancelRef = useRef(cancel);
  const setPausedRef = useRef(setPaused);
  const requestBoundaryRef = useRef(requestBoundary);
  presentRef.current = present;
  cancelRef.current = cancel;
  setPausedRef.current = setPaused;
  requestBoundaryRef.current = requestBoundary;
  const imperativeHandleRef = useRef<RazorSensePresentationHostHandle>({
    getEnvironmentFlags: () => ({ reducedMotion: prefersReducedMotion }),
    present: (request, callbacks) => presentRef.current(request, callbacks),
    cancel: (request, reason) => cancelRef.current(request, reason),
    setPaused: (isPaused) => setPausedRef.current(isPaused),
    requestBoundary: (request, reason) => requestBoundaryRef.current(request, reason),
  });

  imperativeHandleRef.current.getEnvironmentFlags = () => ({
    reducedMotion: prefersReducedMotion,
  });

  useImperativeHandle(forwardedRef, () => imperativeHandleRef.current, []);

  useEffect(
    () => () => {
      if (cancelSettleTimerRef.current) {
        clearPausableTimer(cancelSettleTimerRef.current);
        cancelSettleTimerRef.current = undefined;
      }
      clearExecutionTimers(executionRef.current);
      executionRef.current = undefined;
    },
    [clearExecutionTimers],
  );

  useEffect(() => {
    const updateVisibility = (): void => {
      const isHidden = document.hidden;
      isDocumentHiddenRef.current = isHidden;
      orchestrationPausedRef.current =
        controllerPausedRef.current || isHidden || !isInViewportRef.current;
      if (orchestrationPausedRef.current) pauseActiveOrchestration();
      setIsDocumentHidden(isHidden);
    };
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, [pauseActiveOrchestration]);

  useEffect(() => {
    const node = hostNodeRef.current;
    const Observer = node?.ownerDocument.defaultView?.IntersectionObserver;
    if (!node) return undefined;
    if (Observer) {
      const observer = new Observer(
        ([entry]) => {
          const nextIsInViewport = Boolean(entry?.isIntersecting && entry.intersectionRatio > 0);
          isInViewportRef.current = nextIsInViewport;
          orchestrationPausedRef.current =
            controllerPausedRef.current || isDocumentHiddenRef.current || !nextIsInViewport;
          if (orchestrationPausedRef.current) pauseActiveOrchestration();
          setIsInViewport(nextIsInViewport);
        },
        { threshold: [0, 0.01] },
      );
      observer.observe(node);
      return () => observer.disconnect();
    }

    const view = node.ownerDocument.defaultView;
    if (!view) return undefined;
    const updateViewportState = (): void => {
      const rect = node.getBoundingClientRect();
      const nextIsInViewport =
        rect.width > 0 &&
        rect.height > 0 &&
        rect.right > 0 &&
        rect.bottom > 0 &&
        rect.left < view.innerWidth &&
        rect.top < view.innerHeight;
      isInViewportRef.current = nextIsInViewport;
      orchestrationPausedRef.current =
        controllerPausedRef.current || isDocumentHiddenRef.current || !nextIsInViewport;
      if (orchestrationPausedRef.current) pauseActiveOrchestration();
      setIsInViewport(nextIsInViewport);
    };
    updateViewportState();
    view.addEventListener('scroll', updateViewportState, { capture: true, passive: true });
    view.addEventListener('resize', updateViewportState, { passive: true });
    return () => {
      view.removeEventListener('scroll', updateViewportState, true);
      view.removeEventListener('resize', updateViewportState);
    };
  }, [pauseActiveOrchestration]);

  useEffect(() => {
    const execution = executionRef.current;
    if (!execution) return;
    if (orchestrationPaused) {
      pausePausableTimer(execution.delayTimer);
      pausePausableTimer(execution.transitionTimer);
      pausePausableTimer(execution.terminalTimer);
      execution.cueTimers?.forEach(pausePausableTimer);
      if (execution.transitionTimer) commitSlots(freezeVisibleSlots(true));
      return;
    }

    if (execution.transitionTimer) {
      commitSlots(
        slotsRef.current.map((slot) => ({
          ...slot,
          opacity: slot.id === execution.slotId ? 1 : 0,
          transitionMs: execution.transitionTimer?.remainingMs ?? 0,
        })),
      );
    }
    if (execution.delayTimer) {
      armPausableTimer(execution.delayTimer, false, () => orchestrationPausedRef.current);
    }
    if (execution.transitionTimer) {
      armPausableTimer(execution.transitionTimer, false, () => orchestrationPausedRef.current);
    }
    if (execution.terminalTimer) {
      armPausableTimer(execution.terminalTimer, false, () => orchestrationPausedRef.current);
    }
    execution.cueTimers?.forEach((timer) =>
      armPausableTimer(timer, false, () => orchestrationPausedRef.current),
    );
    if (cancelSettleTimerRef.current) {
      armPausableTimer(cancelSettleTimerRef.current, false, () => orchestrationPausedRef.current);
    }
    if (
      execution.boundaryRequested &&
      (execution.terminal ||
        ((execution.reducedMotion || execution.degraded) && execution.transitioned))
    ) {
      execution.boundaryRequested = false;
      execution.callbacks.boundary(execution.request.token, {
        iterationCount: Math.max(1, execution.iterationCount),
        reducedMotion: execution.reducedMotion,
        degraded: execution.degraded,
      });
      return;
    }
    if (!execution.transitioned && execution.delayReady && execution.rendererReady) {
      beginTransition(execution);
    }
  }, [beginTransition, commitSlots, freezeVisibleSlots, orchestrationPaused]);

  useEffect(() => {
    const execution = executionRef.current;
    if (!prefersReducedMotion || !execution || execution.reducedMotion) return;
    const revisedToken = execution.callbacks.revise(execution.request.token);
    if (!revisedToken) return;

    clearPausableTimer(execution.delayTimer);
    clearPausableTimer(execution.transitionTimer);
    clearPausableTimer(execution.terminalTimer);
    execution.cueTimers?.forEach(clearPausableTimer);
    execution.delayTimer = undefined;
    execution.transitionTimer = undefined;
    execution.terminalTimer = undefined;
    execution.cueTimers = undefined;
    execution.request = Object.freeze({ ...execution.request, token: revisedToken });
    execution.reducedMotion = true;
    execution.delayReady = true;
    execution.rendererReady = false;
    execution.terminal = false;
    execution.reduceWhenFallbackReady = true;

    commitSlots(
      freezeVisibleSlots(true).map((slot) =>
        slot.id === execution.slotId
          ? { ...slot, request: execution.request, transitionMs: 0 }
          : slot,
      ),
    );
  }, [commitSlots, freezeVisibleSlots, prefersReducedMotion]);

  // Appearance revisions stay in-place inside calibrated renderers. Enabling
  // reduced motion collapses the current occurrence to its decoded still;
  // disabling it again waits for the next occurrence instead of restarting.

  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;
  const hasAccessibleName = Boolean(accessibilityLabel);

  return (
    <div
      ref={hostNodeRef}
      className={className}
      role={hasAccessibleName ? 'img' : undefined}
      aria-label={hasAccessibleName ? accessibilityLabel : undefined}
      aria-hidden={hasAccessibleName ? undefined : true}
      data-razor-sense-presentation-host="true"
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: widthStyle,
        height: heightStyle,
        ...style,
      }}
    >
      {slots.map((slot) => {
        const program = getRazorSenseProgram(slot.request.target);
        const mode = getVisualMode(program);
        const token = slot.request.token;
        const effectivePaused =
          orchestrationPaused ||
          slot.id !== executionRef.current?.slotId ||
          Boolean(
            executionRef.current?.slotId === slot.id && !executionRef.current.playbackStarted,
          ) ||
          Boolean(executionRef.current?.reducedMotion && slot.kind !== 'static');
        const playbackRate = getBuiltInPlaybackRate(slot.request);
        const transitionMs = getTransitionTiming(slot.request, slot.kind === 'static').durationMs;
        const runtimePriority =
          slot.id === executionRef.current?.slotId ? 100 : slots.length > 1 ? 90 : 0;
        const isCompactLoader = program.id === 'preset:compactLoader';
        const compactLoaderTransform = isCompactLoader ? 'scale(0.58)' : undefined;

        return (
          <div
            key={slot.id}
            ref={(node) => {
              if (node) slotNodesRef.current.set(slot.id, node);
              else slotNodesRef.current.delete(slot.id);
            }}
            data-razor-sense-presentation-slot={slot.id}
            data-razor-sense-program={program.id}
            data-razor-sense-step-id={slot.request.stepId}
            data-razor-sense-renderer-kind={slot.kind}
            data-razor-sense-login-active={
              slot.request.runId !== undefined && slot.request.runId === loginMaterialRunId
                ? 'true'
                : undefined
            }
            style={{
              position: 'absolute',
              inset: 0,
              opacity: slot.opacity,
              transition: `opacity ${slot.transitionMs}ms ${slot.transitionEasing}`,
              pointerEvents: slot.opacity > 0.999 ? 'auto' : 'none',
              backgroundColor: isCompactLoader
                ? colorScheme === 'dark'
                  ? '#17171D'
                  : '#F8F8F8'
                : undefined,
            }}
          >
            {slot.kind === 'snapshot' && slot.snapshotUrl ? (
              <img
                src={slot.snapshotUrl}
                alt=""
                aria-hidden="true"
                data-razor-sense-frozen-composite="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  pointerEvents: 'none',
                }}
              />
            ) : (
              <RazorSenseStaticFrame
                target={slot.request.target}
                readinessKey={getTokenKey(token)}
                assetsPath={assetsPath}
                width="100%"
                height="100%"
                style={{ transform: compactLoaderTransform, transformOrigin: 'center' }}
                onReady={() => handleFallbackReady(slot.id, token)}
                onError={(error) => {
                  const assetError =
                    error instanceof RazorSenseError
                      ? error
                      : new RazorSenseError(error.message, {
                          code: 'asset-load-failed',
                          recoverable: false,
                          commandId: token.commandId,
                          occurrenceId: token.occurrenceId,
                          target: slot.request.target,
                          rendererFamily: program.rendererFamily,
                          originalError: error,
                        });
                  fallbackErrorsRef.current.set(slot.id, {
                    tokenKey: getTokenKey(token),
                    error: assetError,
                  });
                  if (slot.kind === 'static' && isCurrentExecution(token)) {
                    executionRef.current?.callbacks.error(token, assetError, {
                      recoverable: false,
                    });
                    invokePublicCallback(onError, assetError);
                  }
                }}
              />
            )}

            {slot.kind === 'semantic' && mode ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  transform: compactLoaderTransform,
                  transformOrigin: 'center',
                }}
              >
                <SemanticRazorSense
                  mode={mode as never}
                  runtimePriority={runtimePriority}
                  assetsPath={assetsPath}
                  width="100%"
                  height="100%"
                  occurrenceId={token.occurrenceId}
                  playback={slot.request.playback}
                  endTime={
                    program.terminalFrame.kind === 'source-time'
                      ? program.terminalFrame.timeSeconds + 1 / 30
                      : undefined
                  }
                  paused={effectivePaused}
                  playbackRate={playbackRate}
                  interactive={isInteractive && !slot.kind.includes('static')}
                  modeTransitionDuration={transitionMs / 1000}
                  onPresentationReady={() => handleRendererReady(slot.id, token)}
                  onIteration={(iteration) => handleIteration(slot.id, token, iteration)}
                  onTerminal={(iterationCount) => handleTerminal(slot.id, token, iterationCount)}
                  onError={(error) => handleRendererError(slot.id, token, error)}
                />
              </div>
            ) : null}

            {slot.kind === 'legacy' ? (
              <div style={{ position: 'absolute', inset: 0 }}>
                <LegacyRzpGlass
                  preset={getLegacyPreset(program)}
                  runtimePriority={runtimePriority}
                  assetsPath={assetsPath}
                  width="100%"
                  height="100%"
                  occurrenceId={token.occurrenceId}
                  playback={slot.request.playback}
                  endTime={
                    program.terminalFrame.kind === 'source-time'
                      ? program.terminalFrame.timeSeconds + 1 / 30
                      : undefined
                  }
                  paused={effectivePaused}
                  onPresentationReady={() => handleRendererReady(slot.id, token)}
                  onIteration={(iteration) => handleIteration(slot.id, token, iteration)}
                  onTerminal={(iterationCount) => handleTerminal(slot.id, token, iterationCount)}
                  onError={(error) => handleRendererError(slot.id, token, error)}
                />
              </div>
            ) : null}

            {slot.kind === 'audio' ? (
              <div style={{ position: 'absolute', inset: 0 }}>
                <RazorSenseAudioWave
                  assetKey={program.authoredAssetKey as 'audioWave' | 'bottomWave'}
                  sourceFile={getRazorSenseDirectVideoSource(program, colorScheme)}
                  frameRate={program.authoredAssetKey === 'bottomWave' ? 25 : 30}
                  terminalTimeSeconds={
                    program.authoredAssetKey === 'bottomWave' ? 249 / 25 : 241 / 30
                  }
                  assetsPath={assetsPath}
                  width="100%"
                  height="100%"
                  occurrenceId={token.occurrenceId}
                  playback={slot.request.playback}
                  paused={effectivePaused}
                  runtimePriority={runtimePriority}
                  onReady={() => handleRendererReady(slot.id, token)}
                  onIteration={(iteration) => handleIteration(slot.id, token, iteration)}
                  onTerminal={(iterationCount) => handleTerminal(slot.id, token, iterationCount)}
                  onError={(error) => handleRendererError(slot.id, token, error)}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
});

export { RazorSensePresentationHost };
export type {
  RazorSenseHostSuspension,
  RazorSensePresentationHostHandle,
  RazorSensePresentationHostProps,
};
