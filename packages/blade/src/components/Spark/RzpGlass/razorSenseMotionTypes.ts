import type { RazorSenseMode } from './modes';
import type { RzpGlassPreset } from './presets';
import type { DurationString } from '~tokens/global';

type RazorSenseState =
  | 'idle'
  | 'typing'
  | 'thinking'
  | 'working'
  | 'loading'
  | 'success'
  | 'caution'
  | 'regret';

type RazorSenseBrandedPreset =
  | 'rippleWave'
  | 'bottomWave'
  | 'success'
  | 'compactLoader'
  | 'audioWave';

/**
 * The public preset vocabulary is additive. Canonical motion targets use only
 * branded presets; compatibility-only names continue through LegacyRazorSenseProps.
 */
type RazorSensePreset = RzpGlassPreset | RazorSenseBrandedPreset;
type RazorSenseLegacyCompatibilityPreset = Exclude<RzpGlassPreset, RazorSenseBrandedPreset>;

type RazorSenseStateTarget<
  State extends RazorSenseState = RazorSenseState
> = State extends RazorSenseState ? { state: State; preset?: never } : never;

type RazorSensePresetTarget<
  Preset extends RazorSenseBrandedPreset = RazorSenseBrandedPreset
> = Preset extends RazorSenseBrandedPreset ? { preset: Preset; state?: never } : never;

/** A literal-distributed target union keeps target-specific playback correlated. */
type RazorSenseTarget = RazorSenseStateTarget | RazorSensePresetTarget;

type RazorSenseTargetProps =
  | { state?: RazorSenseState; mode?: never; preset?: never }
  | { state?: never; mode: RazorSenseMode; preset?: never }
  | { state?: never; mode?: never; preset: RazorSenseBrandedPreset };

type RazorSenseTransition =
  | 'automatic'
  | 'cut'
  | {
      /** Overrides only the duration of the registered transition edge. */
      duration: DurationString;
    };

type RazorSensePlayback = 'automatic' | 'once' | 'repeat' | 'loop';
type RazorSenseExplicitPlayback = Exclude<RazorSensePlayback, 'automatic'>;
type RazorSenseEndBehavior = 'hold' | 'reset-to-start';

type RazorSensePlaybackProps =
  | {
      playback?: 'automatic';
      repeatCount?: never;
      endBehavior?: never;
    }
  | {
      playback: 'once';
      repeatCount?: never;
      endBehavior?: RazorSenseEndBehavior;
    }
  | {
      playback: 'repeat';
      /** Additional iterations after the first. Zero means one total iteration. */
      repeatCount: number;
      endBehavior?: RazorSenseEndBehavior;
    }
  | {
      playback: 'loop';
      repeatCount?: never;
      endBehavior?: never;
    };

type RazorSenseOneShotPlaybackProps = Extract<
  RazorSensePlaybackProps,
  { playback?: 'automatic' } | { playback: 'once' }
>;

type RazorSenseRepeatablePlaybackProps = Exclude<RazorSensePlaybackProps, { playback: 'loop' }>;

type RazorSenseControlledTargetPlaybackProps =
  | ((
      | { state?: RazorSenseState; mode?: never; preset?: never }
      | { state?: never; mode: RazorSenseMode; preset?: never }
    ) &
      RazorSensePlaybackProps)
  | ({
      state?: never;
      mode?: never;
      preset: 'rippleWave';
    } & RazorSensePlaybackProps)
  | ({
      state?: never;
      mode?: never;
      preset: 'bottomWave' | 'compactLoader';
    } & RazorSenseRepeatablePlaybackProps)
  | ({
      state?: never;
      mode?: never;
      preset: 'success' | 'audioWave';
    } & RazorSenseOneShotPlaybackProps);

type RazorSenseReplayKey = string | number;
type RazorSenseRunId = string | number;
type RazorSenseInterruptionPolicy = 'replace' | 'queue' | 'finish-current';
type RazorSenseCompletionReason =
  | 'natural'
  | 'reduced-motion'
  | 'interrupted-at-boundary'
  | 'finished-by-controller';
type RazorSenseCancelReason = 'replaced' | 'superseded' | 'finish-current' | 'consumer' | 'unmount';
type RazorSenseRendererFamily = 'authored' | 'emotional' | 'legacy';

type RazorSenseEventContext = {
  target: RazorSenseTarget;
  commandId: number;
  occurrenceId: number;
  runId?: RazorSenseRunId;
  stepId?: string;
  reducedMotion: boolean;
  degraded: boolean;
};

type RazorSenseReadyEvent = RazorSenseEventContext & {
  type: 'ready';
};

type RazorSenseTransitionStartEvent = RazorSenseEventContext & {
  type: 'transition-start';
  previousTarget?: RazorSenseTarget;
};

type RazorSenseTransitionCompleteEvent = RazorSenseEventContext & {
  type: 'transition-complete';
  previousTarget?: RazorSenseTarget;
};

type RazorSenseTransitionEvent = RazorSenseTransitionStartEvent | RazorSenseTransitionCompleteEvent;

type RazorSenseIterationEvent = RazorSenseEventContext & {
  type: 'iteration';
  /** One-based count of completed iterations for the occurrence. */
  iteration: number;
};

type RazorSensePlaybackEvent = RazorSenseEventContext & {
  type: 'playback-complete';
  reason: RazorSenseCompletionReason;
  /** Total iterations completed, including the first. */
  iterationCount: number;
};

type RazorSenseSequenceEventContext = RazorSenseEventContext & {
  sequenceId: string;
  runId: RazorSenseRunId;
};

type RazorSenseRunStartEvent = RazorSenseSequenceEventContext & {
  type: 'run-start';
};

type RazorSenseSequenceCompleteEvent = RazorSenseSequenceEventContext & {
  type: 'run-complete';
  reason: RazorSenseCompletionReason;
};

type RazorSenseRunEvent = RazorSenseRunStartEvent | RazorSenseSequenceCompleteEvent;

type RazorSenseStepStartEvent = RazorSenseSequenceEventContext & {
  type: 'step-start';
  stepId: string;
};

type RazorSenseStepCompleteEvent = RazorSenseSequenceEventContext & {
  type: 'step-complete';
  stepId: string;
  reason: RazorSenseCompletionReason;
};

type RazorSenseStepEvent = RazorSenseStepStartEvent | RazorSenseStepCompleteEvent;

type RazorSenseCueEvent<Cue extends string = never> = RazorSenseSequenceEventContext & {
  type: 'cue';
  cue: Cue;
};

type RazorSenseCancelEventBase = {
  type: 'cancel';
  reason: RazorSenseCancelReason;
  /** Present for sequence commands, including controller-level subscriptions. */
  sequenceId?: string;
  runId?: RazorSenseRunId;
  commandId: number;
};

type RazorSenseQueuedCancelEvent = RazorSenseCancelEventBase & {
  status: 'queued';
  occurrenceId?: never;
  target?: never;
  stepId?: never;
  reducedMotion?: never;
  degraded?: never;
};

type RazorSenseActiveCancelEvent = RazorSenseCancelEventBase &
  RazorSenseEventContext & {
    status: 'active';
  };

type RazorSenseCancelEvent = RazorSenseQueuedCancelEvent | RazorSenseActiveCancelEvent;

type RazorSenseSequenceCancelEvent = RazorSenseCancelEvent & {
  sequenceId: string;
  runId: RazorSenseRunId;
};

type RazorSenseErrorCode =
  | 'invalid-target'
  | 'invalid-playback'
  | 'invalid-repeat-count'
  | 'invalid-end-behavior'
  | 'invalid-transition'
  | 'invalid-sequence-definition'
  | 'unsupported-playback'
  | 'sequence-controller-mismatch'
  | 'asset-load-failed'
  | 'renderer-initialization-failed'
  | 'renderer-context-lost'
  | 'capture-failed'
  | 'unsupported-platform'
  | 'unknown';

type RazorSenseErrorOptions = {
  code: RazorSenseErrorCode;
  recoverable: boolean;
  commandId?: number;
  occurrenceId?: number;
  target?: RazorSenseTarget;
  rendererFamily?: RazorSenseRendererFamily;
  originalError?: unknown;
};

class RazorSenseError extends Error {
  public readonly code: RazorSenseErrorCode;
  public readonly recoverable: boolean;
  public readonly commandId?: number;
  public readonly occurrenceId?: number;
  public readonly target?: RazorSenseTarget;
  public readonly rendererFamily?: RazorSenseRendererFamily;
  public readonly originalError?: unknown;

  public constructor(message: string, options: RazorSenseErrorOptions) {
    super(message);
    this.name = 'RazorSenseError';
    this.code = options.code;
    this.recoverable = options.recoverable;
    this.commandId = options.commandId;
    this.occurrenceId = options.occurrenceId;
    this.target = options.target;
    this.rendererFamily = options.rendererFamily;
    this.originalError = options.originalError;
    Object.setPrototypeOf(this, RazorSenseError.prototype);
  }
}

type RazorSenseErrorEvent = {
  type: 'error';
  error: RazorSenseError;
  /** Present for sequence commands, including controller-level subscriptions. */
  sequenceId?: string;
  runId?: RazorSenseRunId;
  commandId?: number;
  occurrenceId?: number;
  target?: RazorSenseTarget;
  stepId?: string;
};

type RazorSenseSequenceErrorEvent = RazorSenseErrorEvent & {
  sequenceId: string;
  runId: RazorSenseRunId;
};

type RazorSenseSequenceStepBase = RazorSenseTarget & {
  /** Unique inside the definition. */
  id: string;
  /** Gates presentation; Blade may prepare the target during this interval. */
  delayBeforeMs?: number;
  transition?: RazorSenseTransition;
};

type RazorSenseFiniteSequencePlayback =
  | {
      playback?: 'once';
      advance?: 'on-complete' | 'manual';
      holdAfterMs?: number;
      repeatCount?: never;
    }
  | {
      playback: 'repeat';
      repeatCount: number;
      advance?: 'on-complete' | 'manual';
      holdAfterMs?: number;
    };

type RazorSenseLoopSequencePlayback = {
  playback: 'loop';
  advance: 'manual';
  repeatCount?: never;
  holdAfterMs?: never;
};

type RazorSenseOneShotTarget = Extract<RazorSenseTarget, { preset: 'success' | 'audioWave' }>;
type RazorSenseFiniteOnlyTarget = Extract<
  RazorSenseTarget,
  { preset: 'bottomWave' | 'compactLoader' }
>;

type RazorSenseSequencePlaybackFor<Target extends RazorSenseTarget> = [
  Extract<Target, RazorSenseOneShotTarget>,
] extends [never]
  ? [Extract<Target, RazorSenseFiniteOnlyTarget>] extends [never]
    ? RazorSenseFiniteSequencePlayback | RazorSenseLoopSequencePlayback
    : RazorSenseFiniteSequencePlayback
  : Extract<RazorSenseFiniteSequencePlayback, { playback?: 'once' }>;

type RazorSenseSequenceStepFor<Target extends RazorSenseTarget> = Target extends RazorSenseTarget
  ? RazorSenseSequenceStepBase & Target & RazorSenseSequencePlaybackFor<Target>
  : never;

type RazorSenseSequenceStep = RazorSenseSequenceStepFor<RazorSenseTarget>;

type RazorSenseSequenceDefinition<
  Cue extends string = never,
  ForegroundSlot extends string = never
> = {
  id: string;
  steps: readonly RazorSenseSequenceStep[];
  endBehavior?: RazorSenseEndBehavior;
  /** Opaque built-in cue typing. Consumer definitions do not contain cue timing. */
  readonly __cueType?: Cue;
  /** Opaque built-in foreground-slot typing and registered mask program. */
  readonly __foregroundSlotType?: ForegroundSlot;
};

type RazorSenseSequenceEvent<Cue extends string = never> =
  | RazorSenseRunEvent
  | RazorSenseStepEvent
  | RazorSenseCueEvent<Cue>
  | RazorSenseSequenceCancelEvent
  | RazorSenseSequenceErrorEvent;

type RazorSenseReadyResult = Omit<RazorSenseReadyEvent, 'type'>;
type RazorSenseTransitionResult = Omit<RazorSenseTransitionCompleteEvent, 'type'>;
type RazorSensePlaybackResult = Omit<RazorSensePlaybackEvent, 'type'>;
type RazorSenseSequenceResult = Omit<RazorSenseSequenceCompleteEvent, 'type'>;

type RazorSenseTransitionCommand = {
  readonly ready: Promise<RazorSenseReadyResult>;
  readonly transitioned: Promise<RazorSenseTransitionResult>;
  cancel(reason?: unknown): void;
};

type RazorSensePlaybackCommand = RazorSenseTransitionCommand & {
  readonly completed: Promise<RazorSensePlaybackResult>;
  finishAtBoundary(): Promise<RazorSensePlaybackResult>;
};

type RazorSenseSequenceCommand = {
  readonly ready: Promise<RazorSenseReadyResult>;
  readonly completed: Promise<RazorSenseSequenceResult>;
  /** Returns false when no manual-advance step is active. */
  advance(): boolean;
  cancel(reason?: unknown): void;
  /** Finishes the active step at a safe boundary and cancels the remaining run. */
  finishAtBoundary(): Promise<RazorSenseSequenceResult>;
};

type RazorSenseCommandOptions = {
  /** @default 'replace' */
  interruptionPolicy?: RazorSenseInterruptionPolicy;
  signal?: AbortSignal;
};

type RazorSenseControllerTransitionOptions = RazorSenseCommandOptions & {
  transition?: RazorSenseTransition;
};

type RazorSenseControllerOptions = {
  /** Initial visual before the first command. Defaults to the idle state. */
  initialTarget?: RazorSenseTarget;
  /** Compatibility shorthand for an initial semantic state. */
  initialState?: RazorSenseState;
};

type RazorSensePlaybackPropsFor<Target extends RazorSenseTarget> = [
  Extract<Target, RazorSenseOneShotTarget>,
] extends [never]
  ? [Extract<Target, RazorSenseFiniteOnlyTarget>] extends [never]
    ? RazorSensePlaybackProps
    : RazorSenseRepeatablePlaybackProps
  : RazorSenseOneShotPlaybackProps;

type RazorSenseControllerPlayOptions<Target extends RazorSenseTarget> = RazorSenseCommandOptions &
  RazorSensePlaybackPropsFor<Target> & {
    transition?: RazorSenseTransition;
  };

type RazorSenseControllerSequenceOptions = RazorSenseCommandOptions & {
  runId?: RazorSenseRunId;
};

type RazorSenseControllerStatus =
  | 'idle'
  | 'delaying'
  | 'preparing'
  | 'transitioning'
  | 'playing'
  | 'holding'
  | 'paused'
  | 'error'
  | 'disposed';

type RazorSenseControllerSnapshot = {
  status: RazorSenseControllerStatus;
  target: RazorSenseTarget;
  displayedTarget?: RazorSenseTarget;
  commandId?: number;
  occurrenceId?: number;
  runId?: RazorSenseRunId;
  sequenceId?: string;
  stepId?: string;
  isPaused: boolean;
  queueLength: number;
  reducedMotion: boolean;
  degraded: boolean;
};

type RazorSenseControllerEvent =
  | RazorSenseReadyEvent
  | RazorSenseTransitionEvent
  | RazorSenseIterationEvent
  | RazorSensePlaybackEvent
  | RazorSenseRunEvent
  | RazorSenseStepEvent
  | RazorSenseCueEvent<string>
  | RazorSenseCancelEvent
  | RazorSenseErrorEvent;

type RazorSenseController = {
  transitionTo(
    state: RazorSenseState,
    options?: RazorSenseControllerTransitionOptions,
  ): RazorSenseTransitionCommand;

  play<Target extends RazorSenseTarget>(
    target: Target,
    options?: RazorSenseControllerPlayOptions<Target>,
  ): RazorSensePlaybackCommand;

  playSequence<Cue extends string = never, ForegroundSlot extends string = never>(
    sequence: RazorSenseSequenceDefinition<Cue, ForegroundSlot>,
    options?: RazorSenseControllerSequenceOptions,
  ): RazorSenseSequenceCommand;

  pause(): void;
  resume(): void;
  /** Returns false when no manual-advance step is active. */
  advance(): boolean;
  cancel(options?: { scope?: 'active' | 'all'; reason?: unknown }): void;
  getSnapshot(): RazorSenseControllerSnapshot;
  subscribe(listener: () => void): () => void;
  subscribeEvents(listener: (event: RazorSenseControllerEvent) => void): () => void;
};

type RazorSenseSequenceController = Pick<
  RazorSenseController,
  'pause' | 'resume' | 'advance' | 'cancel' | 'getSnapshot' | 'subscribe' | 'subscribeEvents'
> & {
  readonly sequenceId: string;
};

type RazorSenseControlledMotionProps = RazorSenseControlledTargetPlaybackProps & {
  /** Distinguishes replays of the same target without remounting the host. */
  replayKey?: RazorSenseReplayKey;
  /** Defaults to the registered transition edge. */
  transition?: RazorSenseTransition;
  isPaused?: boolean;
  onReady?: (event: RazorSenseReadyEvent) => void;
  onTransitionStart?: (event: RazorSenseTransitionStartEvent) => void;
  onTransitionComplete?: (event: RazorSenseTransitionCompleteEvent) => void;
  onPlaybackComplete?: (event: RazorSensePlaybackEvent) => void;
};

export { RazorSenseError };

export type {
  RazorSenseBrandedPreset,
  RazorSenseCancelEvent,
  RazorSenseCancelReason,
  RazorSenseCommandOptions,
  RazorSenseCompletionReason,
  RazorSenseControlledMotionProps,
  RazorSenseControlledTargetPlaybackProps,
  RazorSenseController,
  RazorSenseControllerEvent,
  RazorSenseControllerOptions,
  RazorSenseControllerPlayOptions,
  RazorSenseControllerSequenceOptions,
  RazorSenseControllerSnapshot,
  RazorSenseControllerStatus,
  RazorSenseControllerTransitionOptions,
  RazorSenseCueEvent,
  RazorSenseEndBehavior,
  RazorSenseErrorCode,
  RazorSenseErrorEvent,
  RazorSenseErrorOptions,
  RazorSenseEventContext,
  RazorSenseExplicitPlayback,
  RazorSenseFiniteSequencePlayback,
  RazorSenseInterruptionPolicy,
  RazorSenseIterationEvent,
  RazorSenseLegacyCompatibilityPreset,
  RazorSenseLoopSequencePlayback,
  RazorSenseOneShotPlaybackProps,
  RazorSensePlayback,
  RazorSensePlaybackCommand,
  RazorSensePlaybackEvent,
  RazorSensePlaybackProps,
  RazorSensePlaybackPropsFor,
  RazorSensePlaybackResult,
  RazorSensePreset,
  RazorSensePresetTarget,
  RazorSenseReadyEvent,
  RazorSenseReadyResult,
  RazorSenseRendererFamily,
  RazorSenseRepeatablePlaybackProps,
  RazorSenseReplayKey,
  RazorSenseRunEvent,
  RazorSenseRunId,
  RazorSenseSequenceCancelEvent,
  RazorSenseSequenceCommand,
  RazorSenseSequenceCompleteEvent,
  RazorSenseSequenceController,
  RazorSenseSequenceDefinition,
  RazorSenseSequenceErrorEvent,
  RazorSenseSequenceEvent,
  RazorSenseSequenceResult,
  RazorSenseSequenceStep,
  RazorSenseSequenceStepBase,
  RazorSenseSequenceStepFor,
  RazorSenseState,
  RazorSenseStateTarget,
  RazorSenseStepEvent,
  RazorSenseTarget,
  RazorSenseTargetProps,
  RazorSenseTransition,
  RazorSenseTransitionCommand,
  RazorSenseTransitionCompleteEvent,
  RazorSenseTransitionEvent,
  RazorSenseTransitionResult,
  RazorSenseTransitionStartEvent,
};
