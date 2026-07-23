import { RazorSenseError } from './razorSenseMotionTypes';
import type {
  RazorSenseCancelReason,
  RazorSenseCompletionReason,
  RazorSenseController,
  RazorSenseControllerEvent,
  RazorSenseControllerOptions,
  RazorSenseControllerPlayOptions,
  RazorSenseControllerSequenceOptions,
  RazorSenseControllerSnapshot,
  RazorSenseControllerStatus,
  RazorSenseControllerTransitionOptions,
  RazorSenseEventContext,
  RazorSenseInterruptionPolicy,
  RazorSensePlaybackCommand,
  RazorSensePlaybackProps,
  RazorSensePlaybackResult,
  RazorSenseReadyResult,
  RazorSenseRunId,
  RazorSenseSequenceCommand,
  RazorSenseSequenceController,
  RazorSenseSequenceDefinition,
  RazorSenseSequenceResult,
  RazorSenseSequenceStep,
  RazorSenseState,
  RazorSenseTarget,
  RazorSenseTransition,
  RazorSenseTransitionCommand,
  RazorSenseTransitionResult,
} from './razorSenseMotionTypes';
import {
  assertValidRazorSenseSequenceDefinition,
  getRazorSenseProgram,
  isValidRazorSenseTransition,
  resolveRazorSensePlayback,
} from './razorSensePrograms';
import type { RazorSenseResolvedPlaybackPlan } from './razorSensePrograms';
import {
  defineRazorSenseSequence,
  getRazorSenseSequenceDefinitionFingerprint,
} from './defineRazorSenseSequence';
import { getRazorSenseBuiltInSequenceManifest } from './razorSenseBuiltInSequences';

type RazorSenseControllerKind = 'standalone' | 'sequence';
type RazorSenseCommandKind = 'transition' | 'play' | 'sequence';
type RazorSenseRecordStatus = 'queued' | 'active' | 'settled' | 'cancelled';

type RazorSensePresentationToken = Readonly<{
  commandId: number;
  occurrenceId: number;
  epoch: number;
  revision: number;
}>;

type RazorSenseControllerHostRequest = Readonly<{
  kind: 'initial' | 'transition' | 'play' | 'sequence-step';
  token: RazorSensePresentationToken;
  target: RazorSenseTarget;
  /** Speculative next target for bounded media preparation. */
  nextTarget?: RazorSenseTarget;
  previousTarget?: RazorSenseTarget;
  playback: RazorSenseResolvedPlaybackPlan;
  transition: RazorSenseTransition;
  runId?: RazorSenseRunId;
  sequenceId?: string;
  stepId?: string;
  stepIndex?: number;
  delayBeforeMs?: number;
  holdAfterMs?: number;
  advance?: 'on-complete' | 'manual';
  /** Private calibrated metadata. Present only for Blade-owned built-in journeys. */
  builtInManifest?: NonNullable<ReturnType<typeof getRazorSenseBuiltInSequenceManifest>>;
}>;

type RazorSenseHostMilestone = Readonly<{
  reducedMotion?: boolean;
  degraded?: boolean;
}>;

type RazorSenseHostTerminalMilestone = RazorSenseHostMilestone &
  Readonly<{
    reason?: RazorSenseCompletionReason;
    iterationCount: number;
  }>;

type RazorSenseControllerHostCallbacks = {
  isCurrent(token: RazorSensePresentationToken): boolean;
  revise(token: RazorSensePresentationToken): RazorSensePresentationToken | undefined;
  setStatus(token: RazorSensePresentationToken, status: RazorSenseControllerStatus): boolean;
  setFlags(token: RazorSensePresentationToken, milestone: RazorSenseHostMilestone): boolean;
  ready(token: RazorSensePresentationToken, milestone?: RazorSenseHostMilestone): boolean;
  transitionStarted(
    token: RazorSensePresentationToken,
    milestone?: RazorSenseHostMilestone,
  ): boolean;
  transitioned(token: RazorSensePresentationToken, milestone?: RazorSenseHostMilestone): boolean;
  iteration(
    token: RazorSensePresentationToken,
    iteration: number,
    milestone?: RazorSenseHostMilestone,
  ): boolean;
  terminal(token: RazorSensePresentationToken, milestone: RazorSenseHostTerminalMilestone): boolean;
  boundary(token: RazorSensePresentationToken, milestone: RazorSenseHostTerminalMilestone): boolean;
  cue(token: RazorSensePresentationToken, cue: string): boolean;
  error(
    token: RazorSensePresentationToken,
    error: Error,
    options?: { recoverable?: boolean },
  ): boolean;
};

type RazorSenseControllerHostBinding = {
  getEnvironmentFlags?(): Pick<RazorSenseHostMilestone, 'reducedMotion'>;
  present(
    request: RazorSenseControllerHostRequest,
    callbacks: RazorSenseControllerHostCallbacks,
  ): void;
  cancel(request: RazorSenseControllerHostRequest, reason: RazorSenseCancelReason): void;
  setPaused(isPaused: boolean): void;
  requestBoundary(
    request: RazorSenseControllerHostRequest,
    reason: 'advance-step' | 'finish-command' | 'interrupt',
  ): void;
};

type RazorSenseBindControllerOptions = {
  sequence?: RazorSenseSequenceDefinition<string, string>;
  runId?: RazorSenseRunId;
};

type RazorSenseBoundController = {
  callbacks: RazorSenseControllerHostCallbacks;
  restartSequence(options?: RazorSenseControllerSequenceOptions): RazorSenseSequenceCommand;
  unbind(): void;
};

type Deferred<T> = {
  promise: Promise<T>;
  settled: boolean;
  resolve(value: T): void;
  reject(error: unknown): void;
};

type CommandMilestones = {
  ready: Deferred<RazorSenseReadyResult>;
  transitioned?: Deferred<RazorSenseTransitionResult>;
  completed?: Deferred<RazorSensePlaybackResult | RazorSenseSequenceResult>;
};

type CommandRecord = {
  commandId: number;
  kind: RazorSenseCommandKind;
  status: RazorSenseRecordStatus;
  interruptionPolicy: RazorSenseInterruptionPolicy;
  target: RazorSenseTarget;
  transition: RazorSenseTransition;
  playback: RazorSenseResolvedPlaybackPlan;
  sequence?: RazorSenseSequenceDefinition<string, string>;
  sequenceFingerprint?: string;
  builtInManifest?: ReturnType<typeof getRazorSenseBuiltInSequenceManifest>;
  sequenceIndex: number;
  runId?: RazorSenseRunId;
  token?: RazorSensePresentationToken;
  milestones: CommandMilestones;
  signal?: AbortSignal;
  removeAbortListener?: () => void;
  finishWhenActive: boolean;
  advanceRequested: boolean;
};

type OccurrenceMilestones = {
  ready: boolean;
  transitionStarted: boolean;
  transitioned: boolean;
  terminal: boolean;
  playbackCompleted: boolean;
  lastIteration: number;
};

type BoundaryIntent =
  | { type: 'advance-step'; token: RazorSensePresentationToken; record: CommandRecord }
  | { type: 'finish-command'; token: RazorSensePresentationToken; record: CommandRecord }
  | {
      type: 'interrupt';
      token: RazorSensePresentationToken;
      pendingRecord: CommandRecord;
    };

type EventQueueItem = {
  event?: RazorSenseControllerEvent;
  after?: () => void;
};

type FrozenSequence = RazorSenseSequenceDefinition<string, string>;

const resolvedPromise = Promise.resolve();

const scheduleMicrotask = (callback: () => void): void => {
  void resolvedPromise.then(callback);
};

const createDeferred = <T>(): Deferred<T> => {
  let resolvePromise!: (value: T) => void, rejectPromise!: (error: unknown) => void;
  const promise = new Promise<T>((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });
  // Commands are often canceled before a consumer awaits every named milestone.
  // The attached handler prevents environment-level unhandled-rejection noise
  // without changing the rejection observed by the original promise.
  void promise.catch(() => undefined);

  const deferred: Deferred<T> = {
    promise,
    settled: false,
    resolve: (value) => {
      if (deferred.settled) return;
      deferred.settled = true;
      resolvePromise(value);
    },
    reject: (error) => {
      if (deferred.settled) return;
      deferred.settled = true;
      rejectPromise(error);
    },
  };
  return deferred;
};

const createAbortError = (reason?: unknown): Error => {
  const message =
    reason instanceof Error
      ? reason.message
      : typeof reason === 'string'
      ? reason
      : 'RazorSense command was cancelled.';
  if (typeof DOMException !== 'undefined') return new DOMException(message, 'AbortError');
  const error = new Error(message);
  error.name = 'AbortError';
  return error;
};

const freezeTarget = (target: RazorSenseTarget): RazorSenseTarget =>
  Object.freeze(
    target.state !== undefined ? { state: target.state } : { preset: target.preset },
  ) as RazorSenseTarget;

const getStepTarget = (step: RazorSenseSequenceStep): RazorSenseTarget =>
  freezeTarget(step.state !== undefined ? { state: step.state } : { preset: step.preset });

const getStepPlayback = (step: RazorSenseSequenceStep): 'once' | 'repeat' | 'loop' =>
  (step as RazorSenseSequenceStep & { playback?: 'once' | 'repeat' | 'loop' }).playback ?? 'once';

const getStepPlaybackProps = (
  step: RazorSenseSequenceStep,
  terminalEndBehavior?: 'hold' | 'reset-to-start',
): RazorSensePlaybackProps => {
  const playback = getStepPlayback(step);
  if (playback === 'repeat') {
    return {
      playback: 'repeat',
      repeatCount: step.repeatCount!,
      endBehavior: terminalEndBehavior,
    };
  }
  if (playback === 'loop') return { playback: 'loop' };
  return { playback: 'once', endBehavior: terminalEndBehavior };
};

const getPlayOptions = (options: RazorSensePlaybackProps | undefined): RazorSensePlaybackProps => {
  if (options?.playback === 'repeat') {
    return {
      playback: 'repeat',
      repeatCount: options.repeatCount,
      endBehavior: options.endBehavior,
    };
  }
  if (options?.playback === 'loop') return { playback: 'loop' };
  if (options?.playback === 'once') {
    return { playback: 'once', endBehavior: options.endBehavior };
  }
  return { playback: 'automatic' };
};

const normalizeSequence = (
  sequence: RazorSenseSequenceDefinition<string, string>,
): FrozenSequence => {
  if (
    Object.isFrozen(sequence) &&
    Object.isFrozen(sequence.steps) &&
    sequence.steps.every(Object.isFrozen)
  ) {
    return sequence;
  }
  return defineRazorSenseSequence(sequence);
};

const assertSequenceDefinition: (
  definition: unknown,
) => asserts definition is RazorSenseSequenceDefinition<
  string,
  string
> = assertValidRazorSenseSequenceDefinition;

const freezeToken = (
  commandId: number,
  occurrenceId: number,
  epoch: number,
  revision = 0,
): RazorSensePresentationToken => Object.freeze({ commandId, occurrenceId, epoch, revision });

const tokenEquals = (
  left: RazorSensePresentationToken,
  right: RazorSensePresentationToken,
): boolean =>
  left.commandId === right.commandId &&
  left.occurrenceId === right.occurrenceId &&
  left.epoch === right.epoch &&
  left.revision === right.revision;

const freezeSnapshot = (snapshot: RazorSenseControllerSnapshot): RazorSenseControllerSnapshot =>
  Object.freeze({ ...snapshot });

class RazorSenseControllerStore {
  private readonly kind: RazorSenseControllerKind;
  private readonly configuredSequence?: FrozenSequence;
  private readonly configuredSequenceFingerprint?: string;
  private readonly listeners = new Set<() => void>();
  private readonly eventListeners = new Set<(event: RazorSenseControllerEvent) => void>();
  private readonly eventQueue: EventQueueItem[] = [];
  private commandCounter = 0;
  private occurrenceCounter = 0;
  private epochCounter = 0;
  private active?: CommandRecord;
  private queue: CommandRecord[] = [];
  private pendingReplacement?: CommandRecord;
  private finishCurrentPending?: CommandRecord;
  private boundaryIntent?: BoundaryIntent;
  private currentRequest?: RazorSenseControllerHostRequest;
  private occurrenceMilestones?: OccurrenceMilestones;
  private hostBinding?: RazorSenseControllerHostBinding;
  private hostCallbacks?: RazorSenseControllerHostCallbacks;
  private bindingGeneration = 0;
  private isEventDrainScheduled = false;
  private isDrainingEvents = false;
  private isDisposed = false;
  private isPaused = false;
  private executionStatus: RazorSenseControllerStatus = 'idle';
  private reducedMotion = false;
  private degraded = false;
  private snapshot: RazorSenseControllerSnapshot;
  private readonly publicController: RazorSenseController;
  private readonly publicSequenceController?: RazorSenseSequenceController;

  public constructor(
    options: RazorSenseControllerOptions & {
      sequence?: RazorSenseSequenceDefinition<string, string>;
    },
  ) {
    if (options.sequence) {
      assertSequenceDefinition(options.sequence);
      this.kind = 'sequence';
      this.configuredSequence = normalizeSequence(options.sequence);
      this.configuredSequenceFingerprint = getRazorSenseSequenceDefinitionFingerprint(
        this.configuredSequence,
      );
      const firstStep = this.configuredSequence.steps[0];
      const target = getStepTarget(firstStep);
      this.snapshot = freezeSnapshot({
        status: 'idle',
        target,
        sequenceId: this.configuredSequence.id,
        stepId: firstStep.id,
        isPaused: false,
        queueLength: 0,
        reducedMotion: false,
        degraded: false,
      });
    } else {
      this.kind = 'standalone';
      const target = freezeTarget(
        options.initialTarget ?? { state: options.initialState ?? 'idle' },
      );
      // Runtime validation is intentional for JavaScript consumers.
      getRazorSenseProgram(target);
      this.snapshot = freezeSnapshot({
        status: 'idle',
        target,
        isPaused: false,
        queueLength: 0,
        reducedMotion: false,
        degraded: false,
      });
    }

    this.publicController = Object.freeze({
      transitionTo: this.transitionTo,
      play: this.play,
      playSequence: this.playSequence,
      pause: this.pause,
      resume: this.resume,
      advance: this.advance,
      cancel: this.cancel,
      getSnapshot: this.getSnapshot,
      subscribe: this.subscribe,
      subscribeEvents: this.subscribeEvents,
    });

    if (this.configuredSequence) {
      this.publicSequenceController = Object.freeze({
        sequenceId: this.configuredSequence.id,
        pause: this.pause,
        resume: this.resume,
        advance: this.advance,
        cancel: this.cancel,
        getSnapshot: this.getSnapshot,
        subscribe: this.subscribe,
        subscribeEvents: this.subscribeEvents,
      });
    }
  }

  public getController = (): RazorSenseController => this.publicController;

  public getSequenceController = (): RazorSenseSequenceController => {
    if (!this.publicSequenceController) {
      throw new RazorSenseError(
        'A standalone RazorSense controller is not a sequence controller.',
        {
          code: 'sequence-controller-mismatch',
          recoverable: false,
        },
      );
    }
    return this.publicSequenceController;
  };

  public assertSequence = (sequence?: RazorSenseSequenceDefinition<string, string>): void => {
    if (this.kind === 'standalone') {
      if (!sequence) return;
      throw new RazorSenseError(
        'A standalone RazorSense controller cannot bind to RazorSenseSequence.',
        {
          code: 'sequence-controller-mismatch',
          recoverable: false,
          originalError: sequence.id,
        },
      );
    }
    if (!sequence) {
      throw new RazorSenseError('A RazorSense sequence controller must bind to its sequence.', {
        code: 'sequence-controller-mismatch',
        recoverable: false,
        originalError: this.configuredSequence?.id,
      });
    }
    assertSequenceDefinition(sequence);
    let fingerprint: string;
    try {
      fingerprint = getRazorSenseSequenceDefinitionFingerprint(sequence);
    } catch (error: unknown) {
      if (
        error instanceof RazorSenseError &&
        error.code === 'invalid-sequence-definition' &&
        sequence.id === this.configuredSequence?.id
      ) {
        throw new RazorSenseError(
          `RazorSense sequence controller for "${this.configuredSequence.id}" received a different definition with the same id.`,
          {
            code: 'sequence-controller-mismatch',
            recoverable: false,
            originalError: error,
          },
        );
      }
      throw error;
    }
    if (
      sequence.id !== this.configuredSequence?.id ||
      fingerprint !== this.configuredSequenceFingerprint
    ) {
      throw new RazorSenseError(
        `RazorSense sequence controller for "${this.configuredSequence?.id}" cannot bind to "${sequence.id}".`,
        {
          code: 'sequence-controller-mismatch',
          recoverable: false,
          originalError: { expected: this.configuredSequenceFingerprint, received: fingerprint },
        },
      );
    }
  };

  public bind = (
    host: RazorSenseControllerHostBinding,
    options: RazorSenseBindControllerOptions = {},
  ): RazorSenseBoundController => {
    this.assertNotDisposed();
    this.assertSequence(options.sequence);
    if (this.hostBinding) {
      throw new RazorSenseError('A RazorSense controller may drive exactly one mounted host.', {
        code: 'unknown',
        recoverable: false,
      });
    }

    const generation = ++this.bindingGeneration;
    this.hostBinding = host;
    const callbacks = this.createHostCallbacks(generation);
    this.hostCallbacks = callbacks;
    host.setPaused(this.isPaused);

    if (this.kind === 'sequence' && this.configuredSequence && !this.active) {
      this.acceptSequence(this.configuredSequence, {
        interruptionPolicy: 'replace',
        runId: options.runId,
      });
    } else if (this.currentRequest) {
      this.presentCurrentRequest();
    } else if (!this.active) {
      this.presentInitialRequest();
    }

    if (this.boundaryIntent && this.currentRequest) {
      host.requestBoundary(this.currentRequest, this.boundaryIntent.type);
    }

    return {
      callbacks,
      restartSequence: (sequenceOptions) => {
        if (!this.configuredSequence) {
          throw new RazorSenseError(
            'Only a RazorSense sequence controller can restart a bound sequence.',
            {
              code: 'sequence-controller-mismatch',
              recoverable: false,
            },
          );
        }
        return this.acceptSequence(this.configuredSequence, sequenceOptions);
      },
      unbind: () => {
        if (generation !== this.bindingGeneration || this.hostBinding !== host) return;
        this.hostBinding = undefined;
        this.hostCallbacks = undefined;
        const detachedGeneration = ++this.bindingGeneration;
        queueMicrotask(() => {
          if (this.hostBinding || this.bindingGeneration !== detachedGeneration) return;
          this.cancelAll('unmount');
        });
      },
    };
  };

  public dispose = (): void => {
    if (this.isDisposed) return;
    this.cancelAll('unmount');
    this.hostBinding = undefined;
    this.hostCallbacks = undefined;
    this.bindingGeneration += 1;
    this.isDisposed = true;
    this.executionStatus = 'disposed';
    this.commitSnapshot({ status: 'disposed' });
    this.listeners.clear();
    this.eventListeners.clear();
  };

  private assertNotDisposed = (): void => {
    if (!this.isDisposed) return;
    throw new RazorSenseError('RazorSense controller has been disposed.', {
      code: 'unknown',
      recoverable: false,
    });
  };

  private getQueueLength = (): number =>
    this.queue.length + (this.pendingReplacement ? 1 : 0) + (this.finishCurrentPending ? 1 : 0);

  private reportSubscriberError = (error: unknown): void => {
    scheduleMicrotask(() => {
      throw error;
    });
  };

  private commitSnapshot = (patch: Partial<RazorSenseControllerSnapshot>): void => {
    const nextStatus = this.isPaused && patch.status !== 'disposed' ? 'paused' : patch.status;
    this.snapshot = freezeSnapshot({
      ...this.snapshot,
      ...patch,
      ...(nextStatus ? { status: nextStatus } : null),
      isPaused: this.isPaused,
      queueLength: this.getQueueLength(),
      reducedMotion: this.reducedMotion,
      degraded: this.degraded,
    });
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (error) {
        this.reportSubscriberError(error);
      }
    });
  };

  private enqueue = (item: EventQueueItem): void => {
    this.eventQueue.push(item);
    if (this.isEventDrainScheduled) return;
    this.isEventDrainScheduled = true;
    scheduleMicrotask(this.drainEvents);
  };

  private drainEvents = (): void => {
    this.isEventDrainScheduled = false;
    if (this.isDrainingEvents) return;
    this.isDrainingEvents = true;
    const batch = this.eventQueue.splice(0);
    try {
      batch.forEach(({ event, after }) => {
        if (event) {
          this.eventListeners.forEach((listener) => {
            try {
              listener(event);
            } catch (error) {
              this.reportSubscriberError(error);
            }
          });
        }
        try {
          after?.();
        } catch (error) {
          this.reportSubscriberError(error);
        }
      });
    } finally {
      this.isDrainingEvents = false;
      if (this.eventQueue.length > 0 && !this.isEventDrainScheduled) {
        this.isEventDrainScheduled = true;
        scheduleMicrotask(this.drainEvents);
      }
    }
  };

  private getEventContext = (request: RazorSenseControllerHostRequest): RazorSenseEventContext => ({
    target: request.target,
    commandId: request.token.commandId,
    occurrenceId: request.token.occurrenceId,
    runId: request.runId,
    stepId: request.stepId,
    reducedMotion: this.reducedMotion,
    degraded: this.degraded,
  });

  private updateFlags = (milestone: RazorSenseHostMilestone): void => {
    if (milestone.reducedMotion !== undefined) this.reducedMotion = milestone.reducedMotion;
    if (milestone.degraded !== undefined) this.degraded = milestone.degraded;
  };

  private attachAbortSignal = (record: CommandRecord): void => {
    if (!record.signal) return;
    const abort = (): void => this.cancelSpecific(record, 'consumer', record.signal?.reason);
    record.signal.addEventListener('abort', abort, { once: true });
    record.removeAbortListener = () => record.signal?.removeEventListener('abort', abort);
  };

  private detachAbortSignal = (record: CommandRecord): void => {
    record.removeAbortListener?.();
    record.removeAbortListener = undefined;
  };

  private createRecord = (
    kind: CommandRecord['kind'],
    target: RazorSenseTarget,
    playback: RazorSenseResolvedPlaybackPlan,
    transition: RazorSenseTransition,
    options: {
      interruptionPolicy?: RazorSenseInterruptionPolicy;
      signal?: AbortSignal;
      sequence?: FrozenSequence;
      builtInManifest?: ReturnType<typeof getRazorSenseBuiltInSequenceManifest>;
      runId?: RazorSenseRunId;
    },
  ): CommandRecord => {
    if (!isValidRazorSenseTransition(transition)) {
      throw new RazorSenseError(
        'RazorSense transition must be automatic, cut, or a Blade duration token.',
        {
          code: 'invalid-transition',
          recoverable: false,
          target,
          originalError: transition,
        },
      );
    }
    const commandId = ++this.commandCounter;
    return {
      commandId,
      kind,
      status: 'queued',
      interruptionPolicy: options.interruptionPolicy ?? 'replace',
      target,
      transition,
      playback,
      sequence: options.sequence,
      sequenceFingerprint: options.sequence
        ? getRazorSenseSequenceDefinitionFingerprint(options.sequence)
        : undefined,
      builtInManifest: options.builtInManifest,
      sequenceIndex: 0,
      runId: options.sequence ? options.runId ?? commandId : undefined,
      milestones: {
        ready: createDeferred<RazorSenseReadyResult>(),
        transitioned:
          kind === 'transition' || kind === 'play'
            ? createDeferred<RazorSenseTransitionResult>()
            : undefined,
        completed:
          kind === 'play'
            ? createDeferred<RazorSensePlaybackResult>()
            : kind === 'sequence'
            ? createDeferred<RazorSenseSequenceResult>()
            : undefined,
      },
      signal: options.signal,
      finishWhenActive: false,
      advanceRequested: false,
    };
  };

  private transitionTo = (
    state: RazorSenseState,
    options: RazorSenseControllerTransitionOptions = {},
  ): RazorSenseTransitionCommand => {
    this.assertNotDisposed();
    const target = freezeTarget({ state });
    const playback = resolveRazorSensePlayback(target);
    const record = this.createRecord(
      'transition',
      target,
      playback,
      options.transition ?? 'automatic',
      options,
    );
    const command: RazorSenseTransitionCommand = Object.freeze({
      ready: record.milestones.ready.promise,
      transitioned: record.milestones.transitioned!.promise,
      cancel: (reason?: unknown) => this.cancelSpecific(record, 'consumer', reason),
    });
    this.accept(record);
    return command;
  };

  private play = <Target extends RazorSenseTarget>(
    requestedTarget: Target,
    options?: RazorSenseControllerPlayOptions<Target>,
  ): RazorSensePlaybackCommand => {
    this.assertNotDisposed();
    const target = freezeTarget(requestedTarget);
    const playback = resolveRazorSensePlayback(
      target,
      getPlayOptions((options as unknown) as RazorSensePlaybackProps | undefined),
    );
    const record = this.createRecord(
      'play',
      target,
      playback,
      options?.transition ?? 'automatic',
      options ?? {},
    );
    const completed = record.milestones.completed!.promise as Promise<RazorSensePlaybackResult>;
    const command: RazorSensePlaybackCommand = Object.freeze({
      ready: record.milestones.ready.promise,
      transitioned: record.milestones.transitioned!.promise,
      completed,
      cancel: (reason?: unknown) => this.cancelSpecific(record, 'consumer', reason),
      finishAtBoundary: () => {
        this.finishRecordAtBoundary(record);
        return completed;
      },
    });
    this.accept(record);
    return command;
  };

  private playSequence = <Cue extends string = never, ForegroundSlot extends string = never>(
    sequence: RazorSenseSequenceDefinition<Cue, ForegroundSlot>,
    options?: RazorSenseControllerSequenceOptions,
  ): RazorSenseSequenceCommand => {
    this.assertNotDisposed();
    if (this.kind === 'sequence') {
      throw new RazorSenseError(
        'A sequence-owned RazorSense controller cannot play an unrelated sequence.',
        {
          code: 'sequence-controller-mismatch',
          recoverable: false,
          originalError: sequence.id,
        },
      );
    }
    assertSequenceDefinition(sequence);
    return this.acceptSequence(sequence as RazorSenseSequenceDefinition<string, string>, options);
  };

  private acceptSequence = (
    requestedSequence: RazorSenseSequenceDefinition<string, string>,
    options: RazorSenseControllerSequenceOptions = {},
  ): RazorSenseSequenceCommand => {
    assertSequenceDefinition(requestedSequence);
    const builtInManifest = getRazorSenseBuiltInSequenceManifest(requestedSequence);
    const sequence = normalizeSequence(requestedSequence);
    const firstStep = sequence.steps[0];
    const target = getStepTarget(firstStep);
    const record = this.createRecord(
      'sequence',
      target,
      resolveRazorSensePlayback(target, getStepPlaybackProps(firstStep)),
      firstStep.transition ?? 'automatic',
      { ...options, sequence, builtInManifest },
    );
    const completed = record.milestones.completed!.promise as Promise<RazorSenseSequenceResult>;
    const command: RazorSenseSequenceCommand = Object.freeze({
      ready: record.milestones.ready.promise,
      completed,
      advance: () => this.advanceRecord(record),
      cancel: (reason?: unknown) => this.cancelSpecific(record, 'consumer', reason),
      finishAtBoundary: () => {
        this.finishRecordAtBoundary(record);
        return completed;
      },
    });
    this.accept(record);
    return command;
  };

  private accept = (record: CommandRecord): void => {
    this.attachAbortSignal(record);
    if (record.signal?.aborted) {
      this.cancelSpecific(record, 'consumer', record.signal.reason);
      return;
    }

    if (record.interruptionPolicy === 'queue') {
      if (this.active || this.pendingReplacement || this.finishCurrentPending) {
        this.queue.push(record);
        this.commitSnapshot({});
      } else {
        this.startRecord(record);
      }
      return;
    }

    if (record.interruptionPolicy === 'finish-current' && this.currentRequest) {
      this.queue.splice(0).forEach((queued) => this.cancelQueuedRecord(queued, 'superseded'));
      if (this.finishCurrentPending) {
        this.cancelQueuedRecord(this.finishCurrentPending, 'superseded');
      }
      this.finishCurrentPending = record;
      this.commitSnapshot({});
      this.requestBoundaryForPendingInterrupt();
      return;
    }

    const recordsToCancel = [
      ...(this.active ? [this.active] : []),
      ...this.queue,
      ...(this.pendingReplacement ? [this.pendingReplacement] : []),
      ...(this.finishCurrentPending ? [this.finishCurrentPending] : []),
    ];
    this.queue = [];
    this.pendingReplacement = undefined;
    this.finishCurrentPending = undefined;
    this.boundaryIntent = undefined;

    if (recordsToCancel.length === 0) {
      this.startRecord(record);
      return;
    }

    recordsToCancel.forEach((existing) => {
      if (existing === this.active) this.cancelActiveRecord(existing, 'replaced');
      else this.cancelQueuedRecord(existing, 'replaced');
    });
    this.pendingReplacement = record;
    this.commitSnapshot({});
    this.enqueue({
      after: () => {
        if (
          this.pendingReplacement !== record ||
          record.status !== 'queued' ||
          record.signal?.aborted ||
          this.active
        ) {
          return;
        }
        this.pendingReplacement = undefined;
        this.commitSnapshot({});
        this.startRecord(record);
      },
    });
  };

  private startRecord = (record: CommandRecord): void => {
    if (record.status !== 'queued' || this.isDisposed || this.active) return;
    this.reducedMotion = this.hostBinding?.getEnvironmentFlags?.().reducedMotion ?? false;
    this.degraded = false;
    record.status = 'active';
    this.active = record;
    record.token = freezeToken(record.commandId, ++this.occurrenceCounter, ++this.epochCounter);
    if (record.kind === 'sequence') {
      this.enqueueSequenceStartEvents(record);
    }
    this.presentRecordOccurrence(record);
  };

  private presentRecordOccurrence = (record: CommandRecord): void => {
    const token = record.token;
    if (!token) return;
    const previousTarget =
      this.snapshot.displayedTarget ?? this.currentRequest?.target ?? this.snapshot.target;
    let request: RazorSenseControllerHostRequest;
    if (record.kind === 'sequence' && record.sequence) {
      const step = record.sequence.steps[record.sequenceIndex];
      record.target = getStepTarget(step);
      const isFinalStep = record.sequenceIndex === record.sequence.steps.length - 1;
      record.playback = resolveRazorSensePlayback(
        record.target,
        getStepPlaybackProps(step, isFinalStep ? record.sequence.endBehavior : undefined),
      );
      record.transition = step.transition ?? 'automatic';
      request = Object.freeze({
        kind: 'sequence-step',
        token,
        target: record.target,
        nextTarget:
          record.sequenceIndex < record.sequence.steps.length - 1
            ? getStepTarget(record.sequence.steps[record.sequenceIndex + 1])
            : undefined,
        previousTarget,
        playback: record.playback,
        transition: record.transition,
        runId: record.runId,
        sequenceId: record.sequence.id,
        stepId: step.id,
        stepIndex: record.sequenceIndex,
        delayBeforeMs: step.delayBeforeMs,
        holdAfterMs: getStepPlayback(step) === 'loop' ? undefined : step.holdAfterMs,
        advance: step.advance ?? (getStepPlayback(step) === 'loop' ? 'manual' : 'on-complete'),
        builtInManifest: record.builtInManifest,
      });
    } else {
      request = Object.freeze({
        kind: record.kind as 'transition' | 'play',
        token,
        target: record.target,
        previousTarget,
        playback: record.playback,
        transition: record.transition,
      });
    }

    this.currentRequest = request;
    this.occurrenceMilestones = {
      ready: false,
      transitionStarted: false,
      transitioned: false,
      terminal: false,
      playbackCompleted: false,
      lastIteration: 0,
    };
    this.executionStatus = request.delayBeforeMs ? 'delaying' : 'preparing';
    this.commitSnapshot({
      status: this.executionStatus,
      target: request.target,
      commandId: token.commandId,
      occurrenceId: token.occurrenceId,
      runId: request.runId,
      sequenceId: request.sequenceId,
      stepId: request.stepId,
    });
    this.presentCurrentRequest();
    if (record.finishWhenActive) this.requestRecordBoundary(record, 'finish-command');
  };

  private presentCurrentRequest = (): void => {
    if (!this.hostBinding || !this.hostCallbacks || !this.currentRequest) return;
    try {
      this.hostBinding.present(this.currentRequest, this.hostCallbacks);
    } catch (error: unknown) {
      this.reportHostError(
        this.currentRequest.token,
        error instanceof Error ? error : new Error(String(error)),
        false,
      );
    }
  };

  private presentInitialRequest = (): void => {
    const target = this.snapshot.target;
    const request: RazorSenseControllerHostRequest = Object.freeze({
      kind: 'initial',
      token: freezeToken(0, 0, 0),
      target,
      playback: resolveRazorSensePlayback(target),
      transition: 'cut',
    });
    this.currentRequest = request;
    this.occurrenceMilestones = {
      ready: false,
      transitionStarted: false,
      transitioned: false,
      terminal: false,
      playbackCompleted: false,
      lastIteration: 0,
    };
    this.executionStatus = 'preparing';
    this.commitSnapshot({ status: 'preparing' });
    this.presentCurrentRequest();
  };

  private enqueueSequenceStartEvents = (record: CommandRecord): void => {
    const token = record.token;
    const sequence = record.sequence;
    if (!token || !sequence) return;
    const step = sequence.steps[record.sequenceIndex];
    const context = {
      target: getStepTarget(step),
      commandId: token.commandId,
      occurrenceId: token.occurrenceId,
      runId: record.runId!,
      stepId: step.id,
      reducedMotion: this.reducedMotion,
      degraded: this.degraded,
      sequenceId: sequence.id,
    };
    if (record.sequenceIndex === 0) this.enqueue({ event: { type: 'run-start', ...context } });
    this.enqueue({ event: { type: 'step-start', ...context } });
  };

  private isCurrentToken = (token: RazorSensePresentationToken): boolean =>
    Boolean(this.currentRequest && tokenEquals(this.currentRequest.token, token));

  private reviseCurrentToken = (
    token: RazorSensePresentationToken,
  ): RazorSensePresentationToken | undefined => {
    if (!this.isCurrentToken(token) || !this.currentRequest) return undefined;
    const nextToken = freezeToken(
      token.commandId,
      token.occurrenceId,
      token.epoch,
      token.revision + 1,
    );
    this.currentRequest = Object.freeze({ ...this.currentRequest, token: nextToken });
    if (this.active?.token && tokenEquals(this.active.token, token)) this.active.token = nextToken;
    if (this.boundaryIntent && tokenEquals(this.boundaryIntent.token, token)) {
      this.boundaryIntent = { ...this.boundaryIntent, token: nextToken } as BoundaryIntent;
    }
    return nextToken;
  };

  private createHostCallbacks = (generation: number): RazorSenseControllerHostCallbacks => {
    const isGenerationCurrent = (): boolean =>
      generation === this.bindingGeneration && Boolean(this.hostBinding);
    return Object.freeze({
      isCurrent: (token) => isGenerationCurrent() && this.isCurrentToken(token),
      revise: (token) => (isGenerationCurrent() ? this.reviseCurrentToken(token) : undefined),
      setStatus: (token, status) => isGenerationCurrent() && this.updateHostStatus(token, status),
      setFlags: (token, milestone) => isGenerationCurrent() && this.setHostFlags(token, milestone),
      ready: (token, milestone = {}) => isGenerationCurrent() && this.reportReady(token, milestone),
      transitionStarted: (token, milestone = {}) =>
        isGenerationCurrent() && this.reportTransitionStarted(token, milestone),
      transitioned: (token, milestone = {}) =>
        isGenerationCurrent() && this.reportTransitioned(token, milestone),
      iteration: (token, iteration, milestone = {}) =>
        isGenerationCurrent() && this.reportIteration(token, iteration, milestone),
      terminal: (token, milestone) =>
        isGenerationCurrent() && this.reportTerminal(token, milestone),
      boundary: (token, milestone) =>
        isGenerationCurrent() && this.reportBoundary(token, milestone),
      cue: (token, cue) => isGenerationCurrent() && this.reportCue(token, cue),
      error: (token, error, options) =>
        isGenerationCurrent() && this.reportHostError(token, error, options?.recoverable ?? false),
    });
  };

  private updateHostStatus = (
    token: RazorSensePresentationToken,
    status: RazorSenseControllerStatus,
  ): boolean => {
    if (!this.isCurrentToken(token) || status === 'disposed') return false;
    this.executionStatus = status;
    this.commitSnapshot({ status });
    return true;
  };

  private setHostFlags = (
    token: RazorSensePresentationToken,
    milestone: RazorSenseHostMilestone,
  ): boolean => {
    if (!this.isCurrentToken(token)) return false;
    this.updateFlags(milestone);
    this.commitSnapshot({});
    return true;
  };

  private reportReady = (
    token: RazorSensePresentationToken,
    milestone: RazorSenseHostMilestone,
  ): boolean => {
    if (!this.isCurrentToken(token) || !this.currentRequest || !this.occurrenceMilestones) {
      return false;
    }
    if (this.occurrenceMilestones.ready) return false;
    this.occurrenceMilestones.ready = true;
    this.updateFlags(milestone);
    this.executionStatus = 'transitioning';
    this.commitSnapshot({ status: 'transitioning' });
    const event = { type: 'ready' as const, ...this.getEventContext(this.currentRequest) };
    const record = this.active;
    this.enqueue({
      event,
      after: () => record?.milestones.ready.resolve(this.omitType(event)),
    });
    return true;
  };

  private reportTransitionStarted = (
    token: RazorSensePresentationToken,
    milestone: RazorSenseHostMilestone,
  ): boolean => {
    if (!this.isCurrentToken(token) || !this.currentRequest || !this.occurrenceMilestones) {
      return false;
    }
    if (this.occurrenceMilestones.transitionStarted) return false;
    this.occurrenceMilestones.transitionStarted = true;
    this.updateFlags(milestone);
    this.executionStatus = 'transitioning';
    this.commitSnapshot({ status: 'transitioning' });
    this.enqueue({
      event: {
        type: 'transition-start',
        ...this.getEventContext(this.currentRequest),
        previousTarget: this.currentRequest.previousTarget,
      },
    });
    return true;
  };

  private reportTransitioned = (
    token: RazorSensePresentationToken,
    milestone: RazorSenseHostMilestone,
  ): boolean => {
    if (!this.isCurrentToken(token) || !this.currentRequest || !this.occurrenceMilestones) {
      return false;
    }
    if (this.occurrenceMilestones.transitioned) return false;
    this.occurrenceMilestones.transitioned = true;
    this.updateFlags(milestone);
    this.executionStatus = 'playing';
    this.commitSnapshot({
      status: 'playing',
      displayedTarget: this.currentRequest.target,
    });
    const request = this.currentRequest;
    const record = this.active;
    const event = {
      type: 'transition-complete' as const,
      ...this.getEventContext(request),
      previousTarget: request.previousTarget,
    };
    this.enqueue({
      event,
      after: () => {
        record?.milestones.transitioned?.resolve(this.omitType(event));
        if (record?.kind === 'transition') {
          record.status = 'settled';
          this.detachAbortSignal(record);
          if (this.active === record) this.active = undefined;
        }
        if (
          this.boundaryIntent?.type === 'interrupt' &&
          tokenEquals(this.boundaryIntent.token, token) &&
          record?.kind === 'transition'
        ) {
          this.resolveInterruptBoundary({ iterationCount: 0 });
        } else if (!this.active) {
          this.startNextQueuedRecord();
        }
      },
    });
    return true;
  };

  private reportIteration = (
    token: RazorSensePresentationToken,
    iteration: number,
    milestone: RazorSenseHostMilestone,
  ): boolean => {
    if (
      !this.isCurrentToken(token) ||
      !this.currentRequest ||
      !this.occurrenceMilestones ||
      !Number.isSafeInteger(iteration) ||
      iteration <= this.occurrenceMilestones.lastIteration
    ) {
      return false;
    }
    this.occurrenceMilestones.lastIteration = iteration;
    this.updateFlags(milestone);
    this.commitSnapshot({});
    this.enqueue({
      event: {
        type: 'iteration',
        ...this.getEventContext(this.currentRequest),
        iteration,
      },
    });
    return true;
  };

  private reportTerminal = (
    token: RazorSensePresentationToken,
    milestone: RazorSenseHostTerminalMilestone,
  ): boolean => {
    if (!this.isCurrentToken(token) || !this.currentRequest || !this.occurrenceMilestones) {
      return false;
    }
    if (this.occurrenceMilestones.terminal) return false;
    this.occurrenceMilestones.terminal = true;
    this.updateFlags(milestone);
    if (this.boundaryIntent && tokenEquals(this.boundaryIntent.token, token)) {
      return this.reportBoundary(token, milestone);
    }
    const activeStep =
      this.active?.kind === 'sequence' && this.active.sequence
        ? this.active.sequence.steps[this.active.sequenceIndex]
        : undefined;
    const activeStepAdvance = activeStep
      ? activeStep.advance ?? (getStepPlayback(activeStep) === 'loop' ? 'manual' : 'on-complete')
      : undefined;
    if (activeStepAdvance === 'manual') {
      const reason = milestone.reason ?? (this.reducedMotion ? 'reduced-motion' : 'natural');
      this.executionStatus = 'holding';
      this.commitSnapshot({ status: 'holding', displayedTarget: this.currentRequest.target });
      this.emitPlaybackComplete(this.currentRequest, reason, milestone.iterationCount);
      return true;
    }
    return this.completeCurrentOccurrence(
      milestone.reason ?? (this.reducedMotion ? 'reduced-motion' : 'natural'),
      milestone.iterationCount,
    );
  };

  private reportBoundary = (
    token: RazorSensePresentationToken,
    milestone: RazorSenseHostTerminalMilestone,
  ): boolean => {
    if (!this.isCurrentToken(token) || !this.boundaryIntent) return false;
    if (!tokenEquals(this.boundaryIntent.token, token)) return false;
    if (this.boundaryIntent.type === 'interrupt') {
      this.resolveInterruptBoundary(milestone);
      return true;
    }
    const intent = this.boundaryIntent;
    this.boundaryIntent = undefined;
    if (intent.type === 'advance-step') {
      intent.record.advanceRequested = false;
      return this.completeCurrentOccurrence('finished-by-controller', milestone.iterationCount);
    }
    return this.completeCurrentOccurrence('finished-by-controller', milestone.iterationCount, true);
  };

  private reportCue = (token: RazorSensePresentationToken, cue: string): boolean => {
    if (
      !this.isCurrentToken(token) ||
      !this.currentRequest?.sequenceId ||
      this.currentRequest.runId === undefined ||
      cue.length === 0
    ) {
      return false;
    }
    this.enqueue({
      event: {
        type: 'cue',
        ...this.getEventContext(this.currentRequest),
        sequenceId: this.currentRequest.sequenceId,
        runId: this.currentRequest.runId,
        cue,
      },
    });
    return true;
  };

  private completeCurrentOccurrence = (
    reason: RazorSenseCompletionReason,
    iterationCount: number,
    terminateSequence = false,
  ): boolean => {
    const request = this.currentRequest;
    const record = this.active;
    if (!request) return false;
    if (!record) {
      this.executionStatus = 'holding';
      this.commitSnapshot({ status: 'holding', displayedTarget: request.target });
      if (request.kind !== 'initial') {
        this.emitPlaybackComplete(request, reason, iterationCount);
      }
      return true;
    }
    if (!record.token || !tokenEquals(record.token, request.token)) return false;
    this.executionStatus = 'holding';
    this.commitSnapshot({ status: 'holding', displayedTarget: request.target });
    this.emitPlaybackComplete(request, reason, iterationCount);

    if (record.kind === 'sequence' && record.sequence) {
      this.completeSequenceStep(record, reason, terminateSequence);
      return true;
    }
    if (record.kind === 'play') {
      const playbackResult = {
        ...this.getEventContext(request),
        reason,
        iterationCount,
      };
      record.status = 'settled';
      this.detachAbortSignal(record);
      this.active = undefined;
      this.enqueue({
        after: () => {
          (record.milestones.completed as Deferred<RazorSensePlaybackResult>).resolve(
            playbackResult,
          );
          this.startNextQueuedRecord();
        },
      });
      return true;
    }
    return false;
  };

  private emitPlaybackComplete = (
    request: RazorSenseControllerHostRequest,
    reason: RazorSenseCompletionReason,
    iterationCount: number,
  ): void => {
    if (!this.occurrenceMilestones || this.occurrenceMilestones.playbackCompleted) return;
    this.occurrenceMilestones.playbackCompleted = true;
    const playbackEvent = {
      type: 'playback-complete' as const,
      ...this.getEventContext(request),
      reason,
      iterationCount,
    };
    this.enqueue({ event: playbackEvent });
  };

  private completeSequenceStep = (
    record: CommandRecord,
    reason: RazorSenseCompletionReason,
    terminateRun = false,
  ): void => {
    const request = this.currentRequest;
    const sequence = record.sequence;
    if (!request || !sequence || !request.stepId) return;
    const context = {
      ...this.getEventContext(request),
      sequenceId: sequence.id,
      runId: record.runId!,
      stepId: request.stepId,
    };
    this.enqueue({ event: { type: 'step-complete', ...context, reason } });

    if (terminateRun || record.sequenceIndex >= sequence.steps.length - 1) {
      record.status = 'settled';
      this.detachAbortSignal(record);
      this.active = undefined;
      const event = { type: 'run-complete' as const, ...context, reason };
      this.enqueue({
        event,
        after: () => {
          (record.milestones.completed as Deferred<RazorSenseSequenceResult>).resolve(
            this.omitType(event),
          );
          this.startNextQueuedRecord();
        },
      });
      return;
    }

    record.sequenceIndex += 1;
    record.advanceRequested = false;
    record.token = freezeToken(
      record.commandId,
      ++this.occurrenceCounter,
      record.token?.epoch ?? ++this.epochCounter,
    );
    this.enqueueSequenceStartEvents(record);
    this.presentRecordOccurrence(record);
  };

  private resolveInterruptBoundary = (milestone: { iterationCount: number }): void => {
    const intent = this.boundaryIntent;
    if (!intent || intent.type !== 'interrupt') return;
    // A renderer can report a requested boundary before its incoming transition has
    // committed (for example, a short one-shot can reach its terminal frame during a
    // longer cross-renderer fade). `reportTransitioned` re-enters this method after
    // settling the transition record, which is the first safe hand-off point.
    if (this.active?.kind === 'transition') return;
    this.boundaryIntent = undefined;
    this.finishCurrentPending = undefined;
    const active = this.active;
    const request = this.currentRequest;
    if (active && request) {
      if (active.kind === 'sequence' || active.kind === 'play') {
        this.completeCurrentOccurrence(
          'interrupted-at-boundary',
          Math.max(1, milestone.iterationCount),
          active.kind === 'sequence',
        );
      }
    }
    this.commitSnapshot({});
    this.enqueue({
      after: () => {
        if (intent.pendingRecord.status === 'queued') this.startRecord(intent.pendingRecord);
      },
    });
  };

  private reportHostError = (
    token: RazorSensePresentationToken,
    originalError: Error,
    recoverable: boolean,
  ): boolean => {
    if (!this.isCurrentToken(token) || !this.currentRequest) return false;
    const request = this.currentRequest;
    const record = this.active;
    const error =
      originalError instanceof RazorSenseError
        ? originalError
        : new RazorSenseError(originalError.message, {
            code: 'unknown',
            recoverable,
            commandId: token.commandId,
            occurrenceId: token.occurrenceId,
            target: request.target,
            originalError,
          });
    this.executionStatus = 'error';
    this.commitSnapshot({ status: 'error' });
    const baseEvent = {
      type: 'error' as const,
      error,
      commandId: token.commandId,
      occurrenceId: token.occurrenceId,
      target: request.target,
      stepId: request.stepId,
    };
    const event: RazorSenseControllerEvent =
      request.sequenceId !== undefined && request.runId !== undefined
        ? {
            ...baseEvent,
            sequenceId: request.sequenceId,
            runId: request.runId,
          }
        : baseEvent;
    this.enqueue({
      event,
      after: recoverable
        ? undefined
        : () => {
            if (record) {
              record.status = 'settled';
              this.detachAbortSignal(record);
              record.milestones.ready.reject(error);
              record.milestones.transitioned?.reject(error);
              record.milestones.completed?.reject(error);
              if (this.active === record) this.active = undefined;
            }
            this.currentRequest = undefined;
            this.startNextQueuedRecord();
          },
    });
    return true;
  };

  private advance = (): boolean => {
    if (!this.active) return false;
    return this.advanceRecord(this.active);
  };

  private advanceRecord = (record: CommandRecord): boolean => {
    if (
      record.status !== 'active' ||
      record.kind !== 'sequence' ||
      !record.sequence ||
      record !== this.active
    ) {
      return false;
    }
    const step = record.sequence.steps[record.sequenceIndex];
    const advance = step.advance ?? (getStepPlayback(step) === 'loop' ? 'manual' : 'on-complete');
    if (advance !== 'manual' || record.advanceRequested) return false;
    record.advanceRequested = true;
    this.requestRecordBoundary(record, 'advance-step');
    return true;
  };

  private finishRecordAtBoundary = (record: CommandRecord): void => {
    if (record.status === 'settled' || record.status === 'cancelled') return;
    record.finishWhenActive = true;
    if (record.status === 'active') this.requestRecordBoundary(record, 'finish-command');
  };

  private requestRecordBoundary = (
    record: CommandRecord,
    type: 'advance-step' | 'finish-command',
  ): void => {
    if (
      !record.token ||
      !this.currentRequest ||
      !tokenEquals(record.token, this.currentRequest.token)
    ) {
      return;
    }
    this.boundaryIntent = { type, token: record.token, record };
    this.hostBinding?.requestBoundary(this.currentRequest, type);
  };

  private requestBoundaryForPendingInterrupt = (): void => {
    if (!this.finishCurrentPending) return;
    if (!this.currentRequest) {
      const pending = this.finishCurrentPending;
      this.finishCurrentPending = undefined;
      this.startRecord(pending);
      return;
    }
    this.boundaryIntent = {
      type: 'interrupt',
      token: this.currentRequest.token,
      pendingRecord: this.finishCurrentPending,
    };
    this.hostBinding?.requestBoundary(this.currentRequest, 'interrupt');
  };

  private pause = (): void => {
    if (this.isDisposed || this.isPaused) return;
    this.isPaused = true;
    this.hostBinding?.setPaused(true);
    this.commitSnapshot({ status: 'paused' });
  };

  private resume = (): void => {
    if (this.isDisposed || !this.isPaused) return;
    this.isPaused = false;
    this.hostBinding?.setPaused(false);
    this.commitSnapshot({ status: this.executionStatus });
  };

  private cancel = (options: { scope?: 'active' | 'all'; reason?: unknown } = {}): void => {
    if (this.isDisposed) return;
    const scope = options.scope ?? 'active';
    const didCancelActive = Boolean(this.active);
    if (this.active) this.cancelActiveRecord(this.active, 'consumer', options.reason);
    if (scope === 'all') {
      this.queue
        .splice(0)
        .forEach((record) => this.cancelQueuedRecord(record, 'consumer', options.reason));
      if (this.finishCurrentPending) {
        this.cancelQueuedRecord(this.finishCurrentPending, 'consumer', options.reason);
        this.finishCurrentPending = undefined;
      }
      if (this.pendingReplacement) {
        this.cancelQueuedRecord(this.pendingReplacement, 'consumer', options.reason);
        this.pendingReplacement = undefined;
      }
    }
    if (didCancelActive || scope === 'all') this.boundaryIntent = undefined;
    this.commitSnapshot({});
    this.enqueue({ after: this.startNextQueuedRecord });
  };

  private cancelAll = (reason: RazorSenseCancelReason): void => {
    if (this.active) this.cancelActiveRecord(this.active, reason);
    this.queue.splice(0).forEach((record) => this.cancelQueuedRecord(record, reason));
    if (this.pendingReplacement) {
      this.cancelQueuedRecord(this.pendingReplacement, reason);
      this.pendingReplacement = undefined;
    }
    if (this.finishCurrentPending) {
      this.cancelQueuedRecord(this.finishCurrentPending, reason);
      this.finishCurrentPending = undefined;
    }
    this.boundaryIntent = undefined;
    this.currentRequest = undefined;
    this.commitSnapshot({ status: this.snapshot.displayedTarget ? 'holding' : 'idle' });
  };

  private cancelSpecific = (
    record: CommandRecord,
    reason: RazorSenseCancelReason,
    originalReason?: unknown,
  ): void => {
    if (record.status === 'settled' || record.status === 'cancelled') return;
    if (record === this.active) {
      this.cancelActiveRecord(record, reason, originalReason);
      this.enqueue({ after: this.startNextQueuedRecord });
      return;
    }
    if (record === this.finishCurrentPending) {
      this.finishCurrentPending = undefined;
      this.boundaryIntent = undefined;
    } else if (record === this.pendingReplacement) {
      this.pendingReplacement = undefined;
    } else {
      this.queue = this.queue.filter((candidate) => candidate !== record);
    }
    this.cancelQueuedRecord(record, reason, originalReason);
    this.commitSnapshot({});
    this.enqueue({ after: this.startNextQueuedRecord });
  };

  private cancelActiveRecord = (
    record: CommandRecord,
    reason: RazorSenseCancelReason,
    originalReason?: unknown,
  ): void => {
    if (record.status === 'cancelled' || record.status === 'settled') return;
    const request = this.currentRequest;
    if (request && record.token && tokenEquals(request.token, record.token)) {
      try {
        this.hostBinding?.cancel(request, reason);
      } catch {
        // Cancellation remains deterministic even if a renderer cleanup throws.
      }
      this.currentRequest = undefined;
      this.occurrenceMilestones = undefined;
    }
    if (this.active === record) this.active = undefined;
    this.cancelRecord(record, reason, 'active', originalReason);
    this.executionStatus = this.snapshot.displayedTarget ? 'holding' : 'idle';
    this.commitSnapshot({ status: this.executionStatus });
  };

  private cancelQueuedRecord = (
    record: CommandRecord,
    reason: RazorSenseCancelReason,
    originalReason?: unknown,
  ): void => {
    if (record.status === 'cancelled' || record.status === 'settled') return;
    this.cancelRecord(record, reason, 'queued', originalReason);
  };

  private cancelRecord = (
    record: CommandRecord,
    reason: RazorSenseCancelReason,
    status: 'queued' | 'active',
    originalReason?: unknown,
  ): void => {
    record.status = 'cancelled';
    this.detachAbortSignal(record);
    let event: RazorSenseControllerEvent;
    if (status === 'active' && record.token) {
      const activeEvent = {
        type: 'cancel' as const,
        reason,
        status,
        commandId: record.commandId,
        occurrenceId: record.token.occurrenceId,
        target: record.target,
        stepId:
          record.kind === 'sequence' ? record.sequence?.steps[record.sequenceIndex]?.id : undefined,
        reducedMotion: this.reducedMotion,
        degraded: this.degraded,
      };
      event = record.sequence
        ? {
            ...activeEvent,
            sequenceId: record.sequence.id,
            runId: record.runId!,
          }
        : activeEvent;
    } else {
      const queuedEvent = {
        type: 'cancel' as const,
        reason,
        status: 'queued' as const,
        commandId: record.commandId,
      };
      event = record.sequence
        ? {
            ...queuedEvent,
            sequenceId: record.sequence.id,
            runId: record.runId!,
          }
        : queuedEvent;
    }
    const error = createAbortError(originalReason ?? reason);
    this.enqueue({
      event,
      after: () => {
        record.milestones.ready.reject(error);
        record.milestones.transitioned?.reject(error);
        record.milestones.completed?.reject(error);
      },
    });
  };

  private startNextQueuedRecord = (): void => {
    if (this.active || this.isDisposed) return;
    if (this.pendingReplacement) {
      const pending = this.pendingReplacement;
      this.pendingReplacement = undefined;
      this.commitSnapshot({});
      this.startRecord(pending);
      return;
    }
    if (this.finishCurrentPending) {
      // A canceled/failed occurrence leaves an exact frozen composite, which is
      // itself a safe boundary. A still-live current request must continue to
      // wait for the host's calibrated seam.
      if (this.currentRequest) return;
      const pending = this.finishCurrentPending;
      this.finishCurrentPending = undefined;
      this.boundaryIntent = undefined;
      this.commitSnapshot({});
      this.startRecord(pending);
      return;
    }
    const next = this.queue.shift();
    if (!next) {
      this.commitSnapshot({});
      return;
    }
    this.commitSnapshot({});
    this.startRecord(next);
  };

  private getSnapshot = (): RazorSenseControllerSnapshot => this.snapshot;

  private subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private subscribeEvents = (
    listener: (event: RazorSenseControllerEvent) => void,
  ): (() => void) => {
    this.eventListeners.add(listener);
    return () => this.eventListeners.delete(listener);
  };

  private omitType = <Event extends { type: string }>(event: Event): Omit<Event, 'type'> => {
    const { type: _type, ...result } = event;
    return result;
  };
}

const controllerStores = new WeakMap<object, RazorSenseControllerStore>();

const createRazorSenseController = (
  options: RazorSenseControllerOptions = {},
): RazorSenseController => {
  const store = new RazorSenseControllerStore(options);
  const controller = store.getController();
  controllerStores.set(controller, store);
  return controller;
};

const createRazorSenseSequenceController = <Cue extends string, ForegroundSlot extends string>(
  sequence: RazorSenseSequenceDefinition<Cue, ForegroundSlot>,
): RazorSenseSequenceController => {
  const store = new RazorSenseControllerStore({
    sequence: sequence as RazorSenseSequenceDefinition<string, string>,
  });
  const controller = store.getSequenceController();
  controllerStores.set(controller, store);
  return controller;
};

const getControllerStore = (
  controller: RazorSenseController | RazorSenseSequenceController,
): RazorSenseControllerStore => {
  const store = controllerStores.get(controller);
  if (!store) {
    throw new RazorSenseError('RazorSense controller was not created by Blade.', {
      code: 'unknown',
      recoverable: false,
    });
  }
  return store;
};

const bindRazorSenseControllerHost = (
  controller: RazorSenseController | RazorSenseSequenceController,
  host: RazorSenseControllerHostBinding,
  options?: RazorSenseBindControllerOptions,
): RazorSenseBoundController => getControllerStore(controller).bind(host, options);

const disposeRazorSenseController = (
  controller: RazorSenseController | RazorSenseSequenceController,
): void => getControllerStore(controller).dispose();

const assertRazorSenseSequenceControllerDefinition = (
  controller: RazorSenseSequenceController,
  sequence: RazorSenseSequenceDefinition<string, string>,
): void => getControllerStore(controller).assertSequence(sequence);

export {
  assertRazorSenseSequenceControllerDefinition,
  bindRazorSenseControllerHost,
  createRazorSenseController,
  createRazorSenseSequenceController,
  disposeRazorSenseController,
};

export type {
  RazorSenseBindControllerOptions,
  RazorSenseBoundController,
  RazorSenseControllerHostBinding,
  RazorSenseControllerHostCallbacks,
  RazorSenseControllerHostRequest,
  RazorSenseHostMilestone,
  RazorSenseHostTerminalMilestone,
  RazorSensePresentationToken,
};
