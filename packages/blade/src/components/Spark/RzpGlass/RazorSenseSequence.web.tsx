/* eslint-disable react/react-in-jsx-scope */

import { forwardRef, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { assertRazorSenseSequenceControllerDefinition } from './RazorSenseController';
import { RazorSenseControllerHost } from './RazorSenseControllerHost';
import type { RazorSenseHostSuspension } from './RazorSensePresentationHost';
import type {
  RazorSenseInterruptionPolicy,
  RazorSenseRunId,
  RazorSenseSequenceCancelEvent,
  RazorSenseSequenceCompleteEvent,
  RazorSenseSequenceController,
  RazorSenseSequenceDefinition,
  RazorSenseSequenceEvent,
  RazorSenseStepEvent,
} from './razorSenseMotionTypes';
import { getRazorSenseBuiltInSequenceManifest } from './razorSenseBuiltInSequences';
import type { RazorSenseLoginCue } from './razorSenseBuiltInSequences';
import { useRazorSenseSequenceController } from './useRazorSenseController';
import type { RazorSenseSharedProps } from './RazorSense';
import { assertValidRazorSenseSequenceDefinition } from './razorSensePrograms';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

type RazorSenseForegroundProps<ForegroundSlot extends string> = [ForegroundSlot] extends [never]
  ? { foreground?: never }
  : { foreground: Record<ForegroundSlot, ReactNode> };

type RazorSenseSequenceProps<
  Cue extends string = never,
  ForegroundSlot extends string = never
> = RazorSenseSharedProps & {
  /** Immutable typed steps describing one authored product journey. */
  sequence: RazorSenseSequenceDefinition<Cue, ForegroundSlot>;
  /** Occurrence identity. Change it to replay the same sequence definition. */
  runId?: RazorSenseRunId;
  /** Behavior when a new run replaces an active run. @default 'replace' */
  interruptionPolicy?: RazorSenseInterruptionPolicy;
  /** Optional sequence-bound controller for manual advance, pause, cancellation, and awaiting. */
  controller?: RazorSenseSequenceController;
  /** Pauses media, transition timers, holds, and authored foreground motion. @default false */
  isPaused?: boolean;
  /** Receives the deterministic ordered sequence event stream. */
  onEvent?: (event: RazorSenseSequenceEvent<Cue>) => void;
  /** Called when a sequence step begins. */
  onStepStart?: (event: Extract<RazorSenseStepEvent, { type: 'step-start' }>) => void;
  /** Called after a sequence step reaches its configured boundary. */
  onStepComplete?: (event: Extract<RazorSenseStepEvent, { type: 'step-complete' }>) => void;
  /** Called once after the sequence completes. */
  onComplete?: (event: RazorSenseSequenceCompleteEvent) => void;
  /** Called once when an active or queued sequence run is cancelled. */
  onCancel?: (event: RazorSenseSequenceCancelEvent) => void;
} & RazorSenseForegroundProps<ForegroundSlot>;

const visuallyHiddenStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const invokePublicCallback = <Event,>(
  callback: ((event: Event) => void) | undefined,
  event: Event,
): void => {
  if (!callback) return;
  try {
    callback(event);
  } catch (error) {
    queueMicrotask(() => {
      throw error;
    });
  }
};

type LoginForegroundProps = {
  foreground: Record<string, ReactNode>;
  cues: ReadonlySet<RazorSenseLoginCue>;
  isPaused: boolean;
  handoffStage: 'idle' | 'waiting' | 'covering' | 'revealing';
  onHandoffPhaseComplete: (phase: 'covering' | 'revealing') => void;
};

const LoginForeground = ({
  foreground,
  cues,
  isPaused,
  handoffStage,
  onHandoffPhaseComplete,
}: LoginForegroundProps): React.ReactElement => {
  const collapseStarted = cues.has('collapse-start');
  const formCovered = cues.has('form-covered');
  const loaderVisible = cues.has('loader-visible');
  const revealStarted = cues.has('dashboard-reveal-start');
  const journeyCopyVisible = cues.has('journey-copy-visible');
  const shellVisible = cues.has('dashboard-shell-visible');
  const contentVisible = cues.has('dashboard-content-visible');
  const cardsVisible = cues.has('dashboard-cards-visible');

  return (
    <div
      data-razor-sense-login-foreground="true"
      data-razor-sense-login-handoff={handoffStage}
      data-journey-copy-visible={journeyCopyVisible ? 'true' : 'false'}
      data-dashboard-shell-visible={shellVisible ? 'true' : 'false'}
      data-dashboard-content-visible={contentVisible ? 'true' : 'false'}
      data-dashboard-cards-visible={cardsVisible ? 'true' : 'false'}
      data-razor-sense-foreground-paused={isPaused ? 'true' : 'false'}
      aria-hidden={handoffStage === 'idle' ? undefined : true}
      onAnimationEnd={({ animationName, currentTarget, target }) => {
        if (currentTarget !== target) return;
        if (animationName === 'razorSenseLoginHandoffCover') {
          onHandoffPhaseComplete('covering');
        } else if (animationName === 'razorSenseLoginHandoffReveal') {
          onHandoffPhaseComplete('revealing');
        }
      }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        animationName:
          handoffStage === 'covering'
            ? 'razorSenseLoginHandoffCover'
            : handoffStage === 'revealing'
            ? 'razorSenseLoginHandoffReveal'
            : undefined,
        animationDuration:
          handoffStage === 'covering' ? '96ms' : handoffStage === 'revealing' ? '160ms' : undefined,
        animationTimingFunction: 'linear',
        animationFillMode: 'both',
        animationPlayState: isPaused ? 'paused' : 'running',
      }}
    >
      <div
        data-razor-sense-foreground-slot="source"
        aria-hidden={formCovered}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 1,
          animationName: collapseStarted ? 'razorSenseLoginForegroundCover' : undefined,
          animationDuration: collapseStarted ? '916ms' : undefined,
          animationTimingFunction: collapseStarted ? 'cubic-bezier(0.3, 0, 0.2, 1)' : undefined,
          animationFillMode: collapseStarted ? 'both' : undefined,
          animationPlayState: isPaused ? 'paused' : 'running',
          pointerEvents: collapseStarted ? 'none' : 'auto',
        }}
      >
        {foreground.source}
      </div>
      <div
        data-razor-sense-foreground-slot="destination"
        aria-hidden={!shellVisible}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          clipPath: 'polygon(46% 44%, 54% 40%, 58% 58%, 50% 62%)',
          animationName: revealStarted
            ? 'razorSenseDashboardReveal, razorSenseDashboardRevealOpacity'
            : undefined,
          animationDuration: revealStarted ? '1417ms, 160ms' : undefined,
          animationTimingFunction: revealStarted ? 'cubic-bezier(0, 0, 0.2, 1), linear' : undefined,
          animationFillMode: revealStarted ? 'both, both' : undefined,
          animationPlayState: isPaused ? 'paused' : 'running',
          pointerEvents: shellVisible ? 'auto' : 'none',
        }}
      >
        {foreground.destination}
      </div>
      <div
        aria-hidden="true"
        data-razor-sense-login-wash="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          opacity: 0,
          background:
            'linear-gradient(104deg, rgba(248, 248, 248, 0.98) 0%, rgba(228, 239, 255, 0.94) 42%, rgba(248, 248, 248, 0.99) 76%)',
          animationName: loaderVisible
            ? 'razorSenseLoginWashOut'
            : collapseStarted
            ? 'razorSenseLoginWashIn'
            : undefined,
          animationDuration: loaderVisible ? '84ms' : collapseStarted ? '916ms' : undefined,
          animationTimingFunction: loaderVisible
            ? 'linear'
            : collapseStarted
            ? 'cubic-bezier(0.3, 0, 0.2, 1)'
            : undefined,
          animationFillMode: loaderVisible || collapseStarted ? 'both' : undefined,
          animationPlayState: isPaused ? 'paused' : 'running',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

/**
 * Plays a typed multi-step RazorSense journey without consumer timers, media seeking, opacity
 * coordination, or renderer cleanup.
 *
 * @example
 * ```tsx
 * const sequence = defineRazorSenseSequence({
 *   id: 'assistant-response',
 *   steps: [
 *     { id: 'think', state: 'thinking', playback: 'once' },
 *     { id: 'work', state: 'working', playback: 'loop', advance: 'manual' },
 *   ],
 * });
 * const controller = useRazorSenseSequenceController(sequence);
 * <RazorSenseSequence sequence={sequence} controller={controller} runId={requestId} />;
 * ```
 */
const RazorSenseSequence = forwardRef(function RazorSenseSequence<
  Cue extends string = never,
  ForegroundSlot extends string = never
>(
  props: RazorSenseSequenceProps<Cue, ForegroundSlot>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    sequence,
    runId,
    interruptionPolicy = 'replace',
    controller: externalController,
    isPaused = false,
    onEvent,
    onStepStart,
    onStepComplete,
    onComplete,
    onCancel,
    foreground,
    width = '100%',
    height = '100%',
    assetsPath,
    accessibilityLabel,
    isInteractive,
    onLoad,
    onError,
    className,
    style,
  } = props;
  assertValidRazorSenseSequenceDefinition(sequence, {
    hasController: externalController !== undefined,
  });
  const internalController = useRazorSenseSequenceController(sequence);
  const controller = externalController ?? internalController;
  if (externalController) {
    assertRazorSenseSequenceControllerDefinition(
      externalController,
      sequence as RazorSenseSequenceDefinition<string, string>,
    );
  }
  const callbacksRef = useRef({ onEvent, onStepStart, onStepComplete, onComplete, onCancel });
  const [loginCueState, setLoginCueState] = useState<{
    runId: RazorSenseRunId | undefined;
    cues: ReadonlySet<RazorSenseLoginCue>;
  }>({ runId, cues: new Set() });
  const loginCueStateRef = useRef(loginCueState);
  const pendingLoginRunIdRef = useRef<RazorSenseRunId>();
  const pendingLoginCuesRef = useRef(new Set<RazorSenseLoginCue>());
  const [loginHandoffStage, setLoginHandoffStage] = useState<
    'idle' | 'waiting' | 'covering' | 'revealing'
  >('idle');
  const loginHandoffStageRef = useRef(loginHandoffStage);
  const [statusState, setStatusState] = useState<{
    runId: RazorSenseRunId | undefined;
    text: string;
  }>({ runId, text: '' });
  const [hostSuspension, setHostSuspension] = useState<RazorSenseHostSuspension>({
    isSuspended: false,
    controller: false,
    documentHidden: false,
    offscreen: false,
  });
  const manifest = getRazorSenseBuiltInSequenceManifest(
    sequence as RazorSenseSequenceDefinition<string, string>,
  );

  callbacksRef.current = { onEvent, onStepStart, onStepComplete, onComplete, onCancel };
  loginHandoffStageRef.current = loginHandoffStage;
  const loginCues = loginCueState.cues;
  const statusText = statusState.text;

  useEffect(() => {
    const resetCueState = { runId: undefined, cues: new Set<RazorSenseLoginCue>() };
    loginCueStateRef.current = resetCueState;
    pendingLoginRunIdRef.current = undefined;
    pendingLoginCuesRef.current = new Set();
    setLoginHandoffStage('idle');
    setLoginCueState(resetCueState);
    setStatusState({ runId: undefined, text: '' });
  }, [manifest]);

  useIsomorphicLayoutEffect(
    () =>
      controller.subscribeEvents((controllerEvent) => {
        const event = controllerEvent as RazorSenseSequenceEvent<Cue>;
        if (event.type === 'run-start') {
          const current = loginCueStateRef.current;
          if (
            manifest?.kind === 'login-to-dashboard' &&
            current.runId !== undefined &&
            current.runId !== event.runId &&
            (current.cues.size > 0 || loginHandoffStageRef.current !== 'idle')
          ) {
            pendingLoginRunIdRef.current = event.runId;
            pendingLoginCuesRef.current = new Set();
            if (loginHandoffStageRef.current === 'idle') setLoginHandoffStage('waiting');
          } else {
            const nextCueState = {
              runId: event.runId,
              cues: new Set<RazorSenseLoginCue>(),
            };
            loginCueStateRef.current = nextCueState;
            pendingLoginRunIdRef.current = undefined;
            pendingLoginCuesRef.current = new Set();
            setLoginHandoffStage('idle');
            setLoginCueState(nextCueState);
          }
          setStatusState({
            runId: event.runId,
            text:
              manifest?.kind === 'login-to-dashboard'
                ? manifest.statusLabel
                : accessibilityLabel ?? '',
          });
        } else if (
          controllerEvent.type === 'transition-start' &&
          'runId' in controllerEvent &&
          pendingLoginRunIdRef.current === controllerEvent.runId
        ) {
          if (foreground) {
            setLoginHandoffStage((current) =>
              current === 'idle' || current === 'waiting' ? 'covering' : current,
            );
          } else {
            const nextCueState = {
              runId: controllerEvent.runId,
              cues: new Set(pendingLoginCuesRef.current),
            };
            loginCueStateRef.current = nextCueState;
            pendingLoginRunIdRef.current = undefined;
            pendingLoginCuesRef.current = new Set();
            setLoginHandoffStage('idle');
            setLoginCueState(nextCueState);
          }
        } else if (event.type === 'step-start') {
          invokePublicCallback(callbacksRef.current.onStepStart, event);
        } else if (event.type === 'step-complete') {
          invokePublicCallback(callbacksRef.current.onStepComplete, event);
        } else if (event.type === 'run-complete') {
          setStatusState((current) =>
            current.runId === event.runId ? { runId: event.runId, text: '' } : current,
          );
          invokePublicCallback(callbacksRef.current.onComplete, event);
        } else if (event.type === 'cancel' && 'sequenceId' in event) {
          setStatusState((current) =>
            current.runId === event.runId ? { runId: event.runId, text: '' } : current,
          );
          invokePublicCallback(
            callbacksRef.current.onCancel,
            event as RazorSenseSequenceCancelEvent,
          );
        } else if (event.type === 'error' && !event.error.recoverable) {
          setStatusState((current) =>
            event.runId !== undefined && current.runId === event.runId
              ? { runId: event.runId, text: '' }
              : current,
          );
        } else if (event.type === 'cue' && manifest?.kind === 'login-to-dashboard') {
          const cue = event.cue as RazorSenseLoginCue;
          if (pendingLoginRunIdRef.current === event.runId) {
            pendingLoginCuesRef.current.add(cue);
          } else {
            const current = loginCueStateRef.current;
            const nextCueState = {
              runId: event.runId,
              cues: new Set([...(current.runId === event.runId ? current.cues : []), cue]),
            };
            loginCueStateRef.current = nextCueState;
            setLoginCueState(nextCueState);
          }
        }
        if (
          controllerEvent.type === 'run-start' ||
          controllerEvent.type === 'run-complete' ||
          controllerEvent.type === 'step-start' ||
          controllerEvent.type === 'step-complete' ||
          controllerEvent.type === 'cue' ||
          controllerEvent.type === 'cancel' ||
          controllerEvent.type === 'error'
        ) {
          invokePublicCallback(callbacksRef.current.onEvent, event);
        }
      }),
    [accessibilityLabel, controller, foreground, manifest, runId],
  );

  useIsomorphicLayoutEffect(() => {
    if (isPaused) controller.pause();
    else controller.resume();
  }, [controller, isPaused]);

  const foregroundRecord = foreground as Record<string, ReactNode> | undefined;
  const isCompositionPaused = isPaused || hostSuspension.isSuspended;
  const isForegroundPaused = isCompositionPaused || loginHandoffStage === 'waiting';
  const isMaterialPaused =
    isCompositionPaused || loginHandoffStage === 'waiting' || loginHandoffStage === 'covering';
  const loginMaterialPhase = loginCues.has('dashboard-reveal-start')
    ? 'reveal'
    : loginCues.has('loader-visible')
    ? 'loader'
    : loginCues.has('collapse-start')
    ? 'collapse'
    : 'ambient';
  const handleLoginHandoffPhaseComplete = (phase: 'covering' | 'revealing'): void => {
    if (phase === 'revealing') {
      setLoginHandoffStage(pendingLoginRunIdRef.current === undefined ? 'idle' : 'covering');
      return;
    }
    const pendingRunId = pendingLoginRunIdRef.current;
    if (pendingRunId === undefined) {
      setLoginHandoffStage('idle');
      return;
    }
    const nextCueState = {
      runId: pendingRunId,
      cues: new Set(pendingLoginCuesRef.current),
    };
    loginCueStateRef.current = nextCueState;
    pendingLoginRunIdRef.current = undefined;
    pendingLoginCuesRef.current = new Set();
    setLoginCueState(nextCueState);
    setLoginHandoffStage('revealing');
  };

  return (
    <BaseBox
      ref={forwardedRef as never}
      width={width as never}
      height={height as never}
      position="relative"
      overflow="hidden"
      className={className}
      style={style as never}
      {...getStyledProps(props)}
      {...metaAttribute({ name: MetaConstants.RazorSense, testID: props.testID })}
      {...makeAnalyticsAttribute(props)}
    >
      <div
        data-razor-sense-login-material={
          manifest?.kind === 'login-to-dashboard' ? 'true' : undefined
        }
        data-razor-sense-login-material-phase={
          manifest?.kind === 'login-to-dashboard' ? loginMaterialPhase : undefined
        }
        data-razor-sense-login-material-paused={isMaterialPaused ? 'true' : 'false'}
        style={{ position: 'absolute', inset: 0 }}
      >
        <RazorSenseControllerHost
          controller={controller}
          sequence={sequence as RazorSenseSequenceDefinition<string, string>}
          runId={runId}
          interruptionPolicy={interruptionPolicy}
          assetsPath={assetsPath}
          width="100%"
          height="100%"
          accessibilityLabel={accessibilityLabel}
          isInteractive={isInteractive}
          onLoad={onLoad}
          onError={onError}
          onSuspensionChange={setHostSuspension}
          loginMaterialRunId={loginCueState.runId}
          preserveCompositionOnCancel={
            manifest?.kind === 'login-to-dashboard' &&
            (loginCues.size > 0 || loginHandoffStage !== 'idle')
          }
        />
      </div>
      {manifest?.kind === 'login-to-dashboard' ? (
        <style>{`
          [data-razor-sense-login-material="true"] [data-razor-sense-login-active="true"][data-razor-sense-step-id="login-ambient"]:not([data-razor-sense-renderer-kind="snapshot"]),
          [data-razor-sense-login-material="true"] [data-razor-sense-login-active="true"][data-razor-sense-step-id="dashboard-ambient"]:not([data-razor-sense-renderer-kind="snapshot"]) {
            transform-origin: 50% 50%;
            will-change: transform, clip-path, filter;
          }
          [data-razor-sense-login-material-phase="collapse"] [data-razor-sense-login-active="true"][data-razor-sense-step-id="login-ambient"]:not([data-razor-sense-renderer-kind="snapshot"]) {
            animation-name: razorSenseLoginMaterialCollapse;
            animation-duration: 916ms;
            animation-timing-function: cubic-bezier(0.3, 0, 0.2, 1);
            animation-fill-mode: both;
          }
          [data-razor-sense-login-material-phase="loader"] [data-razor-sense-login-active="true"][data-razor-sense-step-id="login-ambient"]:not([data-razor-sense-renderer-kind="snapshot"]) {
            transform: scale(0.085, 0.11) skewX(-8deg);
            clip-path: polygon(38% 18%, 64% 14%, 60% 86%, 34% 90%);
            filter: blur(0.8px) saturate(0.9) brightness(1.25);
            mix-blend-mode: multiply;
          }
          [data-razor-sense-login-material-phase="reveal"] [data-razor-sense-login-active="true"][data-razor-sense-step-id="dashboard-ambient"]:not([data-razor-sense-renderer-kind="snapshot"]) {
            animation-name: razorSenseLoginMaterialReveal;
            animation-duration: 1417ms;
            animation-timing-function: linear;
            animation-fill-mode: both;
          }
          [data-razor-sense-login-material-paused="true"] [data-razor-sense-login-active="true"][data-razor-sense-step-id="login-ambient"],
          [data-razor-sense-login-material-paused="true"] [data-razor-sense-login-active="true"][data-razor-sense-step-id="dashboard-ambient"] {
            animation-play-state: paused;
          }
          @keyframes razorSenseLoginMaterialCollapse {
            0% {
              transform: scale(1) skewX(0deg);
              clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
              filter: blur(0) saturate(1) brightness(1);
              mix-blend-mode: normal;
            }
            55% {
              transform: scale(1.06, 1.02) skewX(-1deg);
              clip-path: polygon(-3% -5%, 103% -5%, 100% 105%, -6% 105%);
              filter: blur(0.2px) saturate(1.04) brightness(1.08);
              mix-blend-mode: multiply;
            }
            78% {
              transform: scale(0.72, 0.76) skewX(-3deg);
              clip-path: polygon(23% -10%, 73% -10%, 63% 110%, 13% 110%);
              filter: blur(0.4px) saturate(0.98) brightness(1.18);
              mix-blend-mode: multiply;
            }
            100% {
              transform: scale(0.085, 0.11) skewX(-8deg);
              clip-path: polygon(38% 18%, 64% 14%, 60% 86%, 34% 90%);
              filter: blur(0.8px) saturate(0.9) brightness(1.25);
              mix-blend-mode: multiply;
            }
          }
          @keyframes razorSenseLoginMaterialReveal {
            0% {
              transform: scale(0.085, 0.11) skewX(-8deg);
              clip-path: polygon(38% 18%, 64% 14%, 60% 86%, 34% 90%);
              filter: blur(0.8px) saturate(0.9) brightness(1.25);
              mix-blend-mode: multiply;
            }
            45% {
              transform: scale(0.14, 0.17) skewX(-6deg);
              clip-path: polygon(34% 8%, 68% 4%, 64% 96%, 29% 100%);
              filter: blur(0.65px) saturate(0.94) brightness(1.2);
              mix-blend-mode: multiply;
            }
            68% {
              transform: scale(0.23, 0.29) skewX(-4deg);
              clip-path: polygon(28% -6%, 74% -8%, 68% 108%, 20% 110%);
              filter: blur(0.45px) saturate(0.98) brightness(1.14);
              mix-blend-mode: multiply;
            }
            84% {
              transform: scale(0.58, 0.66) skewX(-2deg);
              clip-path: polygon(12% -10%, 91% -10%, 86% 110%, 2% 110%);
              filter: blur(0.2px) saturate(1.02) brightness(1.07);
              mix-blend-mode: multiply;
            }
            100% {
              transform: scale(1) skewX(0deg);
              clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
              filter: blur(0) saturate(1) brightness(1);
              mix-blend-mode: normal;
            }
          }
          @keyframes razorSenseLoginForegroundCover {
            0%, 62% { opacity: 1; }
            100% { opacity: 0; }
          }
          @keyframes razorSenseLoginHandoffCover {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes razorSenseLoginHandoffReveal {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes razorSenseLoginWashIn {
            from {
              opacity: 0;
              clip-path: polygon(-20% -10%, 18% -10%, 4% 110%, -34% 110%);
            }
            to {
              opacity: 1;
              clip-path: polygon(-8% -10%, 132% -10%, 116% 110%, -24% 110%);
            }
          }
          @keyframes razorSenseLoginWashOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes razorSenseDashboardReveal {
            from { clip-path: polygon(46% 44%, 54% 40%, 58% 58%, 50% 62%); }
            to { clip-path: polygon(-24% -12%, 112% -12%, 124% 112%, -12% 112%); }
          }
          @keyframes razorSenseDashboardRevealOpacity {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes razorSenseDashboardShellIn {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes razorSenseJourneyCopyInOut {
            0% { opacity: 0; transform: translate(-50%, 8px); }
            24%, 68% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -6px); }
          }
          [data-journey-copy-visible='true'] [data-razor-sense-journey-copy] {
            animation: razorSenseJourneyCopyInOut 500ms cubic-bezier(0, 0, 0.2, 1) both;
          }
          @keyframes razorSenseDashboardContentIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          [data-dashboard-shell-visible='true'] [data-razor-sense-dashboard-shell] {
            animation: razorSenseDashboardShellIn 280ms cubic-bezier(0, 0, 0.2, 1) both;
          }
          [data-dashboard-content-visible='true'] [data-razor-sense-dashboard-content] {
            animation: razorSenseDashboardContentIn 360ms cubic-bezier(0, 0, 0.2, 1) both;
          }
          [data-dashboard-cards-visible='true'] [data-razor-sense-dashboard-cards] {
            animation: razorSenseDashboardContentIn 480ms cubic-bezier(0, 0, 0.2, 1) both;
          }
          [data-razor-sense-foreground-paused='true'] [data-razor-sense-dashboard-shell],
          [data-razor-sense-foreground-paused='true'] [data-razor-sense-dashboard-content],
          [data-razor-sense-foreground-paused='true'] [data-razor-sense-dashboard-cards],
          [data-razor-sense-foreground-paused='true'] [data-razor-sense-journey-copy] {
            animation-play-state: paused;
          }
          @media (prefers-reduced-motion: reduce) {
            [data-razor-sense-login-handoff='covering'],
            [data-razor-sense-login-handoff='revealing'] {
              animation-duration: 1ms !important;
            }
          }
        `}</style>
      ) : null}
      {manifest?.kind === 'login-to-dashboard' && foregroundRecord ? (
        <LoginForeground
          foreground={foregroundRecord}
          cues={loginCues}
          isPaused={isForegroundPaused}
          handoffStage={loginHandoffStage}
          onHandoffPhaseComplete={handleLoginHandoffPhaseComplete}
        />
      ) : null}
      <span role="status" aria-live="polite" aria-atomic="true" style={visuallyHiddenStyle}>
        {statusText}
      </span>
    </BaseBox>
  );
}) as <Cue extends string = never, ForegroundSlot extends string = never>(
  props: RazorSenseSequenceProps<Cue, ForegroundSlot> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  },
) => React.ReactElement;

export { RazorSenseSequence };
export type { RazorSenseSequenceProps };
