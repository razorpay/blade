# RazorSense motion-state system design

Status: selected architecture

Date: July 12, 2026

## Objective

Ship RazorSense as Blade's declarative motion-state system. Product code expresses intent and authored journeys; Blade owns media preparation, renderer selection, exact-frame continuity, playback, transition timing, interruption, accessibility defaults, appearance, lifecycle, cleanup, and performance.

The design extends the existing productized RazorSense renderer. It does not replace the visual programs, lower their quality, or remove ripple wave, bottom wave, success, loader, audio-wave, or legacy shader use cases.

## Design principles

1. Product intent is public; renderer mechanics are private.
2. One visual zone uses one persistent RazorSense host.
3. Controlled state is the common case.
4. Named sequences describe authored journeys without consumer timers.
5. An imperative controller exists for events that cannot be expressed cleanly as props; it does not replace declarative state.
6. Application statecharts remain application-owned. Blade uses a private reducer/statechart for presentation mechanics and does not depend on XState.
7. An occurrence is distinct from a visual target. Consecutive Loading steps replay even though their target is equal.
8. Business workflow never depends on decorative animation completion.
9. Exact outgoing pixels remain visible until exact incoming pixels are ready.
10. Performance work removes invisible work, not glass, flutes, refraction, edges, palette, bloom, timing, or dark material.

## Approach registry

The API families were explored independently before selection.

| Family                  | Strength                                                                                   | Failure mode                                                                                       | Decision                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Controlled primitive    | Best React source of truth, SSR inspectability, rapid replacement, and common ergonomics   | Cannot naturally queue, await same-state replay, or express long authored journeys                 | **Select as canonical common API.**                                               |
| Declarative sequence    | Best readable representation of login, multi-beat loading, and reusable choreography       | Can become a generic animation DSL if it exposes seconds, shader props, or branching               | **Select as a small, typed sequence layer.**                                      |
| Hook/controller         | Best for awaiting an event-driven transition, canceling work, or replaying the same target | Hidden imperative state, lifecycle-sensitive promises, and more misuse risk                        | **Select as an advanced API bound through a `controller` prop.**                  |
| Public statechart/actor | Excellent for application workflow and branching                                           | Couples Blade to an app-state library and leaks presentation occurrences into business logic       | **Reject as a core API.** Document how any state machine drives controlled state. |
| Public animation DSL    | Maximum apparent flexibility                                                               | Makes consumers coordinate the internals Blade is meant to own                                     | **Reject.** Curated manifests and transition edges stay private.                  |
| UI-baked video journey  | Highest one-off visual similarity                                                          | Duplicates real UI, breaks accessibility/responsiveness/localization, and cannot handle real state | **Reject.** Reference videos are evidence, never production UI textures.          |

XState is not added. Blade currently compiles with TypeScript 4.9 while XState v5 requires TypeScript 5+, and the required renderer mechanics still need Blade-specific adapters even with a statechart dependency.

## Public taxonomy

### Semantic state

The canonical state names express product intent:

```ts
type RazorSenseState =
  | 'idle'
  | 'typing'
  | 'thinking'
  | 'working'
  | 'loading'
  | 'success'
  | 'caution'
  | 'regret';
```

They map to the current visual programs:

| State      | Current visual mode | Meaning                                              |
| ---------- | ------------------- | ---------------------------------------------------- |
| `idle`     | `neutral`           | Available, resting, or waiting for input             |
| `typing`   | `typing`            | User composition/focus; do not restart per keystroke |
| `thinking` | `thinking`          | The system is reasoning or preparing a plan          |
| `working`  | `calm`              | The system is executing known work                   |
| `loading`  | `loading`           | A bounded branded loading beat                       |
| `success`  | `joyful`            | A meaningful completed outcome                       |
| `caution`  | `caution`           | Review, uncertainty, or recoverable risk             |
| `regret`   | `regret`            | Failure, inability, or a blocked result              |

Existing `mode="neutral|typing|thinking|loading|calm|joyful|caution|regret"` remains supported as a compatibility vocabulary. `state` wins when both are provided and emits a development warning.

### Branded preset

Presets are visual programs that are reusable but not durable product states:

```ts
type RazorSenseBrandedPreset =
  | 'rippleWave'
  | 'bottomWave'
  | 'success'
  | 'compactLoader'
  | 'audioWave';
```

`RazorSensePreset` remains the existing exported additive union. It includes every `RazorSenseBrandedPreset` plus `default`, `zoomed`, `circleSlideUp`, and `legacy`. Existing names remain compatibility aliases or calibration escape hatches. Raw shader controls stay supported only through the legacy API.

## Controlled primitive

```tsx
<RazorSense state={agentState} playback="automatic" transition="automatic" />
```

```ts
type RazorSenseTransition =
  | 'automatic'
  | 'cut'
  | {
      /** Overrides only the duration of the registered edge. */
      duration: DurationString;
    };

type RazorSenseTarget =
  | { state: RazorSenseState; preset?: never }
  | { preset: RazorSenseBrandedPreset; state?: never };

type RazorSenseTargetProps =
  | { state?: RazorSenseState; mode?: never; preset?: never }
  | { state?: never; mode: RazorSenseMode; preset?: never }
  | { state?: never; mode?: never; preset: RazorSenseBrandedPreset };

type RazorSensePlaybackProps =
  | {
      playback?: 'automatic';
      repeatCount?: never;
      endBehavior?: never;
    }
  | {
      playback: 'once';
      repeatCount?: never;
      endBehavior?: 'hold' | 'reset-to-start';
    }
  | {
      playback: 'repeat';
      /** Additional iterations after the first. */
      repeatCount: number;
      endBehavior?: 'hold' | 'reset-to-start';
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
      preset: 'rippleWave' | 'bottomWave';
    } & RazorSensePlaybackProps)
  | ({
      state?: never;
      mode?: never;
      preset: 'compactLoader';
    } & RazorSenseRepeatablePlaybackProps)
  | ({
      state?: never;
      mode?: never;
      preset: 'success' | 'audioWave';
    } & RazorSenseOneShotPlaybackProps);

type RazorSenseHostProps = {
  width?: string | number;
  height?: string | number;
  assetsPath?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Stable for the material layer lifetime. Omit for decorative usage. */
  accessibilityLabel?: string;
  isInteractive?: boolean;
  /** Compatibility: fires once for the first displayed occurrence. */
  onLoad?: () => void;
  onError?: (error: Error) => void;
} & StyledPropsBlade &
  TestID &
  DataAnalyticsAttribute;

type RazorSenseControlledProps = RazorSenseHostProps &
  RazorSenseControlledTargetPlaybackProps & {
    /** Distinguishes replays of the same target without remounting the host. */
    replayKey?: string | number;

    /** Defaults to the registered transition edge. */
    transition?: RazorSenseTransition;

    isPaused?: boolean;

    onReady?: (event: RazorSenseReadyEvent) => void;
    onTransitionStart?: (event: RazorSenseTransitionEvent) => void;
    onTransitionComplete?: (event: RazorSenseTransitionEvent) => void;
    onPlaybackComplete?: (event: RazorSensePlaybackEvent) => void;
  };
```

Rules:

- `state` defaults to `idle`.
- A controlled state change always uses replacement semantics: the newest requested state is the source of truth.
- `replayKey` changes create a new occurrence even when the target is unchanged.
- `playback="automatic"` uses the manifest. Idle, Thinking, and Working loop; Typing, Loading, Success, Caution, and Regret play once and hold unless a preset declares otherwise.
- `playback="repeat"` requires `repeatCount`, the number of additional iterations. `0` means one iteration. It must be a non-negative safe integer.
- Known preset restrictions are encoded in TypeScript. `audioWave` and `success` are one-shot-only; `compactLoader` may repeat but does not expose an infinite loop; ripple and bottom wave support the full playback set.
- `defineRazorSenseSequence` validates every target/playback pair. JavaScript misuse raises a typed `unsupported-playback` error and leaves the exact outgoing composite visible.
- `transition="automatic"` selects a curated same-family or cross-family edge. `cut` still waits for exact incoming readiness, then swaps without interpolation.
- A transition override changes only the registered edge's Blade motion-duration token. It never changes edge kind or exposes shader uniforms, easing curves, crop, source times, or renderer choice. Built-in authored edges are timing-locked.
- The forwarded ref remains an `HTMLDivElement` ref.
- Existing `onLoad(): void` remains once-per-mount. New `onReady(event)` fires for every displayed occurrence. For the first occurrence, `onReady` fires before `onLoad`.

Ownership is explicit:

```ts
type RazorSenseProps =
  | ControlledRazorSenseProps
  | ControllerOwnedRazorSenseProps
  | LegacyRazorSenseProps;

type ControllerOwnedRazorSenseProps = RazorSenseHostProps & {
  controller: RazorSenseController;
  state?: never;
  mode?: never;
  preset?: never;
  replayKey?: never;
  playback?: never;
  repeatCount?: never;
  endBehavior?: never;
  transition?: never;
  isPaused?: never;
};
```

`state + mode` is a TypeScript error. JavaScript calls use `state` and warn. Canonical target props plus raw legacy controls use canonical rendering and warn, preserving the current precedence rule.

## Declarative sequence

```tsx
const agentJourney = defineRazorSenseSequence({
  id: 'agent-response',
  steps: [
    { id: 'input', state: 'typing', playback: 'once' },
    { id: 'reason', state: 'thinking', playback: 'loop', advance: 'manual' },
    { id: 'work', state: 'working', playback: 'loop', advance: 'manual' },
    {
      id: 'done',
      state: 'success',
      playback: 'once',
    },
  ],
  endBehavior: 'hold',
});

const razorSense = useRazorSenseSequenceController(agentJourney);

<RazorSenseSequence
  sequence={agentJourney}
  runId={requestId}
  controller={razorSense}
  interruptionPolicy="replace"
  onComplete={handleJourneyComplete}
/>;
```

This definition intentionally pauses at the first unbounded loop. Product events call `razorSense.advance()` when reasoning and working actually finish. A sequence never guesses business duration, and business completion never waits for decorative playback. The recommended AI-chat recipe remains controlled `<RazorSense state>`; this sequence form exists for a deliberately authored, externally advanced journey.

```ts
type RazorSenseSequenceStepBase = RazorSenseTarget & {
  /** Unique inside the definition. */
  id: string;
  /** Gates presentation; Blade may prepare the target during this interval. */
  delayBeforeMs?: number;
  transition?: RazorSenseTransition;
};

type RazorSenseSequenceStep =
  | (RazorSenseSequenceStepBase & {
      playback?: 'once';
      advance?: 'on-complete' | 'manual';
      holdAfterMs?: number;
      repeatCount?: never;
    })
  | (RazorSenseSequenceStepBase & {
      playback: 'repeat';
      repeatCount: number;
      advance?: 'on-complete' | 'manual';
      holdAfterMs?: number;
    })
  | (RazorSenseSequenceStepBase & {
      playback: 'loop';
      advance: 'manual';
      repeatCount?: never;
      holdAfterMs?: never;
    });

type RazorSenseSequenceDefinition<
  Cue extends string = never,
  ForegroundSlot extends string = never
> = {
  id: string;
  steps: readonly RazorSenseSequenceStep[];
  endBehavior?: 'hold' | 'reset-to-start';
  /** Opaque built-in cue typing; consumer definitions do not contain cue timing. */
  readonly __cueType?: Cue;
  /** Opaque built-in foreground-slot typing and registered mask program. */
  readonly __foregroundSlotType?: ForegroundSlot;
};

type RazorSenseInterruptionPolicy = 'replace' | 'queue' | 'finish-current';

type RazorSenseForegroundProps<Slot extends string> = [Slot] extends [never]
  ? { foreground?: never }
  : { foreground: Record<Slot, React.ReactNode> };

type RazorSenseSequenceProps<
  Cue extends string = never,
  ForegroundSlot extends string = never
> = RazorSenseHostProps & {
  sequence: RazorSenseSequenceDefinition<Cue, ForegroundSlot>;

  /** A new value starts a distinct run, including the same definition. */
  runId?: string | number;

  interruptionPolicy?: RazorSenseInterruptionPolicy;
  controller?: RazorSenseSequenceController;
  isPaused?: boolean;

  onEvent?: (event: RazorSenseSequenceEvent<Cue>) => void;
  onStepStart?: (event: RazorSenseStepEvent) => void;
  onStepComplete?: (event: RazorSenseStepEvent) => void;
  onComplete?: (event: RazorSenseSequenceCompleteEvent) => void;
  onCancel?: (event: RazorSenseSequenceCancelEvent) => void;
} & RazorSenseForegroundProps<ForegroundSlot>;
```

Sequence constraints:

- `defineRazorSenseSequence` freezes and validates the definition in development.
- IDs must be unique. Array position is not occurrence identity.
- `delayBeforeMs` gates presentation, not loading. Blade may stage the probable next target while the delay runs.
- A nonterminal loop is legal only with `advance="manual"` and a bound controller. Development validation rejects an unreachable loop.
- `advance="manual"` is independent of playback. A finite program can finish and remain presented until `advance()`; a loop stops at its registered boundary when advanced.
- A final `endBehavior="hold"` run is complete after its terminal frame is presented; holding does not keep `onComplete` pending.
- Identical consecutive targets are legal and replay because their step IDs differ.
- Sequence definitions do not contain raw media URLs, source timecodes, shader options, UI components, callbacks that select the next step, or branches. Branching stays in product state.
- Run identity is `(sequence.id, runId)`. Re-rendering the same tuple is idempotent. A new `runId` starts a new run. Reusing one definition ID for different contents is a development invariant error.
- Declarative runs start when their identity tuple changes. Imperative starts use `controller.playSequence()`.

Built-in authored journeys may emit opaque typed cues without exposing timecodes:

```ts
type RazorSenseLoginCue =
  | 'form-covered'
  | 'loader-visible'
  | 'loader-one-complete'
  | 'loader-two-complete'
  | 'journey-copy-visible'
  | 'dashboard-shell-visible'
  | 'dashboard-content-visible'
  | 'dashboard-cards-visible';

type RazorSenseSequenceEvent<Cue extends string = never> =
  | RazorSenseRunEvent
  | RazorSenseStepEvent
  | { type: 'cue'; cue: Cue; runId: string | number; occurrenceId: number }
  | RazorSenseCancelEvent
  | RazorSenseErrorEvent;
```

Cues coordinate decorative foreground reveal only. Authentication, navigation, API completion, focus, and accessible status never depend on a cue.

A built-in definition may also declare typed foreground slots and a private mask/compositing program. Consumers supply real Blade UI nodes; Blade owns their wrappers, z-order, clipping, occlusion, and reveal. Custom consumer definitions cannot invent mask programs.

## Controller

The controller is a hook because Blade component refs remain DOM refs and Blade already uses hooks for imperative systems.

```tsx
function AgentSurface() {
  const razorSense = useRazorSenseController({ initialState: 'idle' });

  const run = async (): Promise<void> => {
    await razorSense.transitionTo('thinking').transitioned;
    await razorSense.transitionTo('working').transitioned;
    await razorSense.transitionTo('success').transitioned;
  };

  return <RazorSense controller={razorSense} />;
}
```

```ts
type RazorSenseController = {
  transitionTo(
    state: RazorSenseState,
    options?: RazorSenseControllerTransitionOptions,
  ): RazorSenseTransitionCommand;

  play<Target extends RazorSenseTarget>(
    target: Target,
    options?: RazorSenseControllerPlayOptions<Target>,
  ): RazorSensePlaybackCommand;

  playSequence(
    sequence: RazorSenseSequenceDefinition,
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

type RazorSensePlaybackPropsFor<Target extends RazorSenseTarget> = Target extends {
  preset: 'success' | 'audioWave';
}
  ? RazorSenseOneShotPlaybackProps
  : Target extends { preset: 'compactLoader' }
  ? RazorSenseRepeatablePlaybackProps
  : RazorSensePlaybackProps;

type RazorSenseControllerPlayOptions<Target extends RazorSenseTarget> = RazorSenseCommandOptions &
  RazorSensePlaybackPropsFor<Target>;

type RazorSenseControllerSequenceOptions = RazorSenseCommandOptions & {
  runId?: string | number;
};

type RazorSenseSequenceController = Pick<
  RazorSenseController,
  'pause' | 'resume' | 'advance' | 'cancel' | 'getSnapshot' | 'subscribe' | 'subscribeEvents'
> & {
  readonly sequenceId: string;
};

declare function useRazorSenseController(options?: {
  /** @default 'idle' */
  initialState?: RazorSenseState;
}): RazorSenseController;

declare function useRazorSenseSequenceController<Cue extends string, Slot extends string>(
  sequence: RazorSenseSequenceDefinition<Cue, Slot>,
): RazorSenseSequenceController;
```

Commands are deliberately not thenable. Named promises prevent a loop's transition milestone from being confused with its playback terminal.

- `ready` resolves when an exact decoded or post-WebGL-draw target frame exists;
- `transitioned` resolves when the target transition and outgoing cleanup settle, regardless of whether the target subsequently loops;
- `completed` resolves at a finite playback or sequence terminal and remains pending for an unbounded loop;
- `finishAtBoundary()` replaces ambiguous `finish()` and respects a registered playback seam.

The controller is bound through a `controller` prop and may drive exactly one mounted host. Controller ownership excludes `state`, `mode`, `preset`, `replayKey`, playback props, transition props, and `isPaused` at the type level. Shared styling, analytics, test ID, one stable accessibility label, and error handling remain legal.

`useRazorSenseController` owns a standalone initial state and cannot bind to `RazorSenseSequence`. `useRazorSenseSequenceController(sequence)` atomically seeds its server and first client snapshot from the sequence's first step and can bind only that definition ID. When no controller is provided, `RazorSenseSequence` creates the same seeded controller internally. This prevents an Idle-to-first-step hydration churn.

A sequence controller stores the definition ID and frozen definition fingerprint. Binding it to another sequence rejects deterministically with `sequence-controller-mismatch` before staging media. Every controller command validates target/playback compatibility before allocating an occurrence; unsupported JavaScript input rejects with `unsupported-playback` while the exact outgoing composition remains untouched.

`interruptionPolicy` defaults to `replace`. `controller.cancel()` defaults to `{ scope: 'active' }`. Controller-level pause is the only public pause latch; commands cannot clear it independently. `advance()` outside an active manual-advance step returns `false` without mutating playback.

The normal product API does not expose a reduced-motion override that can force motion. Blade always honors the system preference. Calibration stories can use an internal fixture.

## Scheduling and interruption

### Replace

1. Capture or retain the current exact composite.
2. Cancel active preparation and queued commands with reason `replaced`.
3. Allocate a new command, occurrence, and command epoch.
4. Prepare the newest target behind the current composite.
5. Ignore and release all stale async work.
6. Transition only after exact readiness.

### Queue

Append the new run after existing work. An unbounded loop or manual hold intentionally blocks the queue until advanced, finished, canceled, or replaced. Development diagnostics identify the blocking step.

### Finish current

Discard older queued work, retain only the newest request, and start it after the nearest safe boundary:

- transition: finish the active blend;
- once: reach the terminal frame;
- loop: finish the current registered iteration;
- manual: advance immediately from the currently presented frame.

The policy means “finish the current visual step,” not “finish an entire queued journey.”

If a newer `finish-current` request arrives before the boundary, the older pending request is canceled as `superseded`; only the newest starts after the boundary. User pause intentionally blocks that boundary until resume or cancel. Page-hidden, offscreen, and admission suspension treat the frozen exact composite as a safe boundary so a hidden instance cannot deadlock replacement.

```text
A loop is playing
B arrives with finish-current
C arrives with finish-current before A reaches its seam
cancel B: superseded
A reaches registered seam
iteration A
step-complete A: interrupted-at-boundary
run-cancel A: finish-current
run-start C
```

### Cancel

Cancellation retains the last exact composite, emits a cancel event, rejects unresolved command promises with `AbortError`, releases stale resources, then allows the next eligible queued command to start. `command.cancel()` affects that command; `controller.cancel({ scope: 'active' })` affects the active command; `scope: 'all'` also clears the queue. Cancellation is idempotent.

Changing `interruptionPolicy` after a run is accepted does not retroactively reschedule it.

## Event ordering

All events use one FIFO microtask drain. A milestone event fires before the promise associated with the milestone settles. Transition and playback clocks may overlap, so there is deliberately no universal ordering between `transition-complete`, `iteration`, and `playback-complete`.

```text
run-start
step-start
prepare-start
ready
transition-start
transition-complete and iteration/playback-complete in observed time order
step-complete
run-complete
completed promise resolves
```

Replacement or cancellation:

```text
cancel
ready rejects if pending
remaining milestone promises reject
next eligible command starts
```

Fatal failure:

```text
error event
component onError
unresolved milestone promises reject as applicable
next eligible queued command starts
```

Every event carries `runId`, `stepId`, `occurrenceId`, `commandId`, target, and reduced/degraded flags as applicable. Stale generations fire no public event.

Reducer commit, callbacks, and promises follow this order:

```text
commit reducer state
onEvent(event)
dedicated callback
settle the associated promise
process commands issued by callbacks in the next reducer turn
```

Completion events carry `natural`, `reduced-motion`, `interrupted-at-boundary`, or `finished-by-controller`. Cancellation events carry a reason (`replaced`, `superseded`, `finish-current`, `consumer`, or `unmount`) and whether the command was `queued` or `active`. Cancellation or fatal failure rejects each still-pending named milestone (`ready`, `transitioned`, and/or `completed`) exactly once. A recoverable error emits one error but does not settle the command. A fatal error emits once, then starts the next eligible queued command.

```ts
type RazorSenseCompletionReason =
  | 'natural'
  | 'reduced-motion'
  | 'interrupted-at-boundary'
  | 'finished-by-controller';

type RazorSenseCancelEvent = {
  type: 'cancel';
  reason: 'replaced' | 'superseded' | 'finish-current' | 'consumer' | 'unmount';
  status: 'queued' | 'active';
  runId?: string | number;
  commandId: number;
  occurrenceId?: number;
};
```

## Internal presentation engine

The public layers compile into one private engine. It is a pure reducer plus effect runner, not a third-party workflow library.

```ts
type ExecutionPhase =
  | 'idle'
  | 'delaying'
  | 'preparing'
  | 'transitioning'
  | 'playing'
  | 'holding'
  | 'error'
  | 'disposed';

type RendererFamily = 'authored' | 'emotional' | 'legacy';

type PresentationOccurrence = {
  id: number;
  target: RazorSenseTarget;
  family: RendererFamily;
  appearance: 'light' | 'dark';
  viewport: 'desktop' | 'mobile';
  playback: ResolvedPlaybackPlan;
  epoch: number;
  revision: number;
};

type PresentationState = {
  executionPhase: ExecutionPhase;
  desired: PresentationOccurrence;
  displayed?: PresentationOccurrence;
  incoming?: PresentationOccurrence;
  outgoing?: PresentationOccurrence;
  queue: readonly CommandRecord[];
  runtimeState: 'dormant' | 'warm' | 'active' | 'suspended' | 'cold';
  gates: {
    isUserPaused: boolean;
    isControllerPaused: boolean;
    isDocumentHidden: boolean;
    isOffscreen: boolean;
    isAdmitted: boolean;
  };
  motionPreference: 'full' | 'reduced';
};
```

Renderers must mount before they can prove readiness. WebGL cannot upload a texture or complete a draw into a hypothetical `PreparedFrame`, so the host owns a hidden incoming slot and adapters return concrete mounted leases:

```ts
type PresentationToken = {
  occurrenceId: number;
  epoch: number;
  revision: number;
  signal: AbortSignal;
};

type ReadyFrame = {
  frameIndex: number;
  mediaTime: number;
  readiness: 'video-frame' | 'webgl-draw' | 'canvas-capture' | 'still';
  degraded: boolean;
};

type RazorSenseRendererAdapter = {
  getPeakResourceCost(request: ResolvedPresentationRequest): RazorSenseResourceCost;
  mount(
    slot: HTMLElement,
    request: ResolvedPresentationRequest,
    token: PresentationToken,
    callbacks: RendererCallbacks,
  ): RendererLease;
};

type RendererLease = {
  readonly token: PresentationToken;
  ready: Promise<ReadyFrame>;
  startPlayback(plan: ResolvedPlaybackPlan): void;
  setPauseReason(reason: PauseReason, active: boolean): void;
  finishCurrent(): Promise<PlaybackBoundary>;
  capture(target: HTMLCanvasElement, alpha?: number): Promise<PlaybackSnapshot>;
  retarget?(
    request: ResolvedPresentationRequest,
    token: PresentationToken,
    callbacks: RendererCallbacks,
  ): {
    nextLease: RendererLease;
    transition: RendererTransitionLease;
  };
  dispose(): void;
};

type RendererTransitionLease = {
  ready: Promise<ReadyFrame>;
  start(): void;
  finished: Promise<void>;
  cancel(): void;
};

type PauseReason =
  | 'user'
  | 'controller'
  | 'document-hidden'
  | 'offscreen'
  | 'admission'
  | 'reduced-motion';

type RendererCallbacks = {
  onIteration(boundary: PlaybackBoundary, token: PresentationToken): void;
  onTerminal(boundary: PlaybackBoundary, token: PresentationToken): void;
  onError(error: Error, recoverable: boolean, token: PresentationToken): void;
  onResourceCostChange(cost: RazorSenseResourceCost, token: PresentationToken): void;
};

type RazorSenseResourceCost = {
  videoDecoders: number;
  webglContexts: number;
};
```

The host, not an adapter, owns the exact displayed composite. Replacement during a cross-family blend:

1. reads the actual host blend progress;
2. captures outgoing and incoming leases at their current opacity;
3. composites them into the host snapshot canvas;
4. cancels and releases the stale leases;
5. keeps that exact snapshot visible while the newest target stages.

Cross-family opacity uses WAAPI or a host logical-progress clock. Timer-based CSS cleanup cannot pause, finish, capture an interrupted blend, or provide deterministic completion.

Ownership uses three public-engine identities:

- `occurrenceId` distinguishes replay and consecutive equal steps;
- one monotonic `epoch` owns the active command and invalidates stale async work;
- `revision` replaces appearance, viewport, or fallback material under the same occurrence.

Adapter-internal generations may remain, but adapters never call consumers directly. Every event carries its token into the reducer, and promise settlement has a once-guard.

The host owns:

- one shared-runtime registration;
- one displayed exact surface;
- zero or one hidden incoming slot;
- one optional host-level blend;
- the reducer, command queue, event drain, and promise settlement.

Renderers never register independently with the shared runtime.

```ts
type RazorSenseHost = {
  stage(request: ResolvedPresentationRequest, token: PresentationToken): Promise<RendererLease>;
  freezeComposite(): Promise<RazorSenseCompositionSnapshot>;
  setPauseReason(reason: PauseReason, active: boolean): void;
  dispose(): void;
};

type RazorSenseCompositionSnapshot = {
  material: PlaybackSnapshot;
  /** Logical live-DOM state; arbitrary foreground DOM is never rasterized. */
  foreground?: ForegroundPlaybackSnapshot;
};
```

- `authored` adapts Neutral, Typing, Thinking, Loading, compact loader, audio wave, and other video programs.
- `emotional` adapts Calm/Working, Joyful/Success, Caution, and Regret across desktop WebGL and mobile authored video.
- `legacy` preserves ripple, circle success, raw shader calibration, and compatibility presets.
- The host keeps one family in place for same-family target changes by using `retarget` where supported.
- `retarget` atomically invalidates the previous occurrence callbacks and returns a new occurrence-bound lease plus the transition between old and new. Playback, boundary, error, and completion delivery always use the new lease token.
- A same-family retarget transfers physical renderer ownership at transition commit. Old and new leases are logical occurrence handles over one reference-counted renderer allocation. Disposing the old lease releases only its occurrence contribution; it cannot destroy the canvas, videos, or WebGL objects owned by the committed next lease.
- During cross-family transitions it mounts only the incoming family, waits for post-presentation readiness, transitions, then releases the outgoing family.
- Emotional-to-Legacy and Legacy-to-Emotional capture the outgoing exact composite, release its WebGL context, mount the incoming context behind the snapshot, then crossfade snapshot to incoming. One host does not retain two WebGL contexts.
- No state change remounts the public host.
- Stale continuations compare token epoch and revision before mutating output.
- Occurrence readiness is never cached as a family boolean. Every target occurrence must provide a matching exact-ready token.
- Unexpected WebGL loss can restore the last committed exact checkpoint. Blade checkpoints after readiness, transition settlement, loop seam, and terminal hold; it does not promise the arbitrary final GPU frame because continuous readback or `preserveDrawingBuffer` would damage performance.
- The shared runtime accounts actual retained video decoders and WebGL contexts, not only family names.
- Before mounting, the host reserves the adapter's declared peak resource cost with the shared runtime. Leases report real cost changes as dual-deck videos, fallbacks, and transitions allocate or release resources. Mount begins only after reservation; disposal always releases the final reported cost.
- An asynchronous adapter registry dynamically imports authored, emotional, and legacy families on demand. Import promises deduplicate by family, remain behind the displayed still/snapshot, and are checked against epoch/revision before mounting. Server rendering never imports browser renderer modules.
- User pause does not prevent warm preparation. Visibility, admission, user pause, controller pause, and reduced motion remain independent pause reasons.
- On cold, the host captures the displayed composite, releases media/GPU work, preserves logical phase, rebuilds at that phase, and hides the snapshot only after exact readiness.

The family adapters require parity before sequence support is claimed:

- authored: separate readiness from playback start, replace `timeupdate` boundaries with frame callbacks, and emit iteration, terminal, transition, and occurrence-scoped errors;
- emotional: accept finite and looping playback plans, expose internal blend completion, and checkpoint after readiness, transition, seam, and terminal;
- legacy: stage initialization, exact seek/post-draw readiness, demand-driven RAF, capture, frame boundaries, shared lifecycle, context-loss recovery, and calibrated fallback.

Wrapping the current `LegacyRzpGlass` component with a CSS fade does not satisfy this contract.

The reducer has orthogonal lifecycle and playback concerns. Offscreen suspension does not masquerade as a user pause, and resuming one pause source cannot override another.

## Renderer readiness

`loadeddata` alone is insufficient.

- Video readiness means the requested source time has decoded and its frame has reached a `requestVideoFrameCallback` or equivalent presentation gate.
- WebGL readiness means the texture was uploaded and a draw completed.
- CSS/WAAPI transition readiness means the incoming exact frame already exists; the transition promise then tracks the blend itself.
- Cross-family readiness never clears the outgoing visual early.
- A source failure retains the outgoing composite and resolves to the registered fallback only after that fallback is exact.

## Playback model

- Logical playback time advances only while the document is visible, the instance intersects, runtime admission is granted, the user has not paused it, and reduced motion does not suppress autoplay.
- `once` reaches the final decodable frame, emits one completion event, and applies its end behavior.
- `loop` emits an iteration event at a registered seam. It never seeks through a visibly incompatible whole-file boundary.
- `finish-current` stops a loop at its next registered seam.
- `advance="manual"` in the public sequence API controls step advancement; it is independent of once/repeat/loop playback. Raw seek/progress remains a controller/calibration capability, not a normal state prop.
- A terminal hold is a settled state. It does not emit duplicate completion events on resume, appearance change, or reattachment.
- Appearance replacement restores the same logical phase where the registered sources permit it.

## Appearance

The nearest `BladeProvider` remains the only appearance source.

- Light and dark descriptors are separate calibrated assets or palettes.
- Appearance changes increment only the occurrence `revision`; they do not create a new product occurrence or command epoch.
- The current exact composite remains visible until the newest appearance frame is ready.
- A stale light or dark source can never win after a newer provider update.
- Dark mode preserves dark material, saturated rails, bloom, and edge definition from the launch film. It is not CSS inversion.

## Server rendering and hydration

- Server output uses stable `<picture>` markup with registered mobile and desktop representative stills. The browser selects the crop before hydration without changing the React tree.
- The first client render matches server markup exactly.
- Media, observers, controllers, timers, and WebGL begin only after hydration.
- A controller supplies a stable `getServerSnapshot`.
- No source grayscale, empty canvas, or theme-dependent placeholder appears during hydration.
- `state`, `replayKey`, `sequence.id`, and `runId` must be hydration-stable.
- “Mobile” in this release means responsive web/mobile browser. React Native remains explicitly unsupported until a native renderer adapter exists.

## Reduced motion

Blade always honors `prefers-reduced-motion`.

- Commit the responsive representative target frame.
- Collapse transition duration to zero after incoming readiness.
- Resolve finite decorative steps with completion reason `reduced-motion` without waiting for their authored wall-clock duration.
- Present an unbounded loop as a still and wait for external advance; do not synthesize iteration events.
- Keep status text and real UI progression intact.
- Do not resume an already collapsed step when the preference returns to no preference.
- Pointer response is disabled.

Reduced motion is not a quality tier. The still is a calibrated final-color frame.

## Accessibility

- RazorSense is decorative by default and `aria-hidden`.
- One stable `accessibilityLabel` labels only the internal material layer. When a sequence contains real foreground UI, the outer host never receives `role="img"`. Steps never rename the material.
- Product recipes pair state with visible text and, when appropriate, Blade status/live-region patterns.
- RazorSense is never the sole loading, success, caution, or failure signal.
- Sequence completion does not move focus.
- Story controls and demo applications remain keyboard operable.
- Repeated visual progress must not create repeated screen-reader announcements.

## Performance

The existing per-document runtime remains the only lifecycle/admission system.

- One shared `IntersectionObserver` and one Page Visibility listener.
- Warm only the current and probable next target.
- Normal transitions retain at most current and incoming media.
- Do not mount every sequence step or every emotional source eagerly.
- `requestVideoFrameCallback` marks video textures dirty; RAF runs only for visible time-dependent work, a live transition, or pointer trail.
- Offscreen, hidden, paused, and denied instances freeze clocks and stop decode/GPU scheduling.
- Cold instances retain an exact 2D composite and release decoders and WebGL resources.
- Asset requests and promises deduplicate by capability-selected URL.
- A bounded preload broker retains only current and probable-next preparation, hands a prepared source to the renderer where possible, and releases temporary video elements after handoff or a short TTL. Preload caches promises/metadata, not permanent duplicate decoders.
- Audio Wave and other large sources are transcoded only when frame comparison proves no visible regression.
- No “low quality” shader path may simplify flute geometry, refraction, edges, bloom, palette, or dark material.

## Compatibility and migration

| Existing use                 | New path                                      | Compatibility                                    |
| ---------------------------- | --------------------------------------------- | ------------------------------------------------ |
| `mode="neutral"`             | `state="idle"`                                | Keep `mode`; document `state` as canonical.      |
| `mode="calm"`                | `state="working"`                             | Keep exact visual mode mapping.                  |
| `mode="joyful"`              | `state="success"`                             | Keep `joyful`; discourage minor-success overuse. |
| `preset="bottomWave"`        | `preset="bottomWave"`                         | Preserve.                                        |
| `preset="rippleWave"`        | `preset="rippleWave"`                         | Preserve and move consumer timers into playback. |
| `preset="circleSlideUp"`     | `preset="success"`                            | Keep alias with deprecation guidance.            |
| Loader raw time controls     | `state="loading"` or `preset="compactLoader"` | Raw timing remains calibration-only.             |
| Onboarding custom RAF/timers | Built-in typed sequence                       | Migrate story and recipe.                        |
| Login raw shader page        | Built-in login journey with real Blade UI     | Keep raw legacy story under calibration.         |
| Raw uniforms                 | `preset="legacy"` compatibility path          | Never show in normal product docs.               |

Legacy rendering must receive the same readiness, completion, pause, cancellation, lifecycle, and failure adapter contract before the sequence layer claims support for it.

Preloading extends the existing mode API additively:

```ts
type PreloadRazorSenseOptions =
  | {
      targets: RazorSenseTarget | readonly RazorSenseTarget[];
      modes?: never;
      colorSchemes?: OneOrMany<'light' | 'dark'>;
      assetsPath?: string;
    }
  | {
      modes: RazorSenseMode | readonly RazorSenseMode[];
      targets?: never;
      colorSchemes?: OneOrMany<'light' | 'dark'>;
      assetsPath?: string;
    };
```

Existing `preloadRazorSenseAssets` and `preloadRazorSenseModeAssets` signatures remain valid. Shared URL promises do not change their readiness semantics.

`onError` remains assignable as `(error: Error) => void`; `RazorSenseError` extends `Error` with recoverability, command, occurrence, and renderer metadata. A stale request that never displays fires neither `onReady` nor legacy `onLoad`.

## Built-in journeys

Blade ships typed definitions, not wrapper components:

- `razorSenseLoginToDashboardJourney`
- `razorSenseThreePhaseLoadingJourney`

Chat remains a controlled-state recipe because its phase changes are business-event-driven. Interrupted chat is a Storybook fixture, not an exported sequence. The finite login journey uses registered private cues for `collapse-to-mark`, three compact-loader occurrences, and `expand-from-mark`. Stories render actual Blade surfaces and react to sequence events. They contain no `setTimeout`, manual media seeking, shader props, or CSS opacity choreography.

The login definition declares two foreground slots:

```tsx
<RazorSenseSequence
  sequence={razorSenseLoginToDashboardJourney}
  runId={loginAttemptId}
  foreground={{
    source: <LoginForm />,
    destination: <Dashboard />,
  }}
/>
```

Blade wraps both nodes in its internal foreground compositor. `collapse-to-mark` advances a material-derived mask across the crisp source UI, holds the material-only bleach, then hands off to the compact mark. `expand-from-mark` grows the registered aperture/rail mask, reveals destination chrome first, then heading/prompt and cards at opaque private cues. The compositor owns z-order, clipping, mask textures, overscan, transition progress, and exact interruption capture; consumers provide no opacity or mask styles.

```ts
type ForegroundCompositorLease = {
  bind(slots: Record<'source' | 'destination', HTMLElement>): void;
  start(edge: 'collapse-to-mark' | 'expand-from-mark', token: PresentationToken): void;
  freeze(): ForegroundPlaybackSnapshot;
  setPauseReason(reason: PauseReason, active: boolean): void;
  finished: Promise<void>;
  dispose(): void;
};

type ForegroundPlaybackSnapshot = {
  edge: 'collapse-to-mark' | 'expand-from-mark';
  progress: number;
  activeSlot: 'source' | 'destination';
  maskRevision: number;
};
```

Browsers cannot losslessly rasterize arbitrary DOM into canvas. Interruption therefore freezes the compositor's WAAPI/logical mask progress and retains the real source/destination wrappers as the outgoing composition lease. The host snapshots only RazorSense material. Exact continuity is the combination of that material snapshot and the still-mounted DOM wrappers at the frozen edge progress; old wrappers release only after the next composition settles.

Only one foreground slot is interactive and exposed to assistive technology at a time:

- before handoff, `source` is interactive and `destination` is `inert`, `aria-hidden`, and pointer-disabled;
- once the source is fully covered, `source` becomes inert/hidden/pointer-disabled immediately while `destination` remains inert; a Blade-owned semantic loading region becomes the only exposed interstitial surface;
- the interstitial region supplies stable product-status text, `role="status"`, and a programmatic focus landmark. If focus was inside the source, focus moves to that landmark once; hidden login controls cannot remain focused or tabbable through the loader beats;
- when the destination shell is exact-ready, the loading region leaves the accessibility tree, `destination` becomes interactive/exposed, and focus moves from the interstitial landmark to the destination landmark exactly once;
- reduced motion performs the same ownership handoff atomically after destination readiness;
- tab order, pointer ownership, and assistive-technology ownership never depend on opacity alone.

These two authored edge programs are part of the built-in login manifest, not selectable generic transitions. Their frame progress and foreground cues are calibrated against source frames 149-172 and 296-348.

## Failure behavior

- Asset failure retains the exact current composite and tries the registered final-color fallback.
- WebGL failure switches to the same target's mobile/final-color authored source or representative still.
- Context loss during a transition cannot reveal a blank canvas.
- Recoverable degradation emits one recoverable error and continues; command results report `degraded: true`.
- Fatal failure emits one error, settles the active command exactly once, then allows queued work to continue where safe.
- Unmount cancels active and queued work, media frame callbacks, WAAPI animations, RAF, decoders, textures, buffers, and programs.

## Adversarial traces

### Slow target replaced twice

```text
success/WebGL visible
request idle#11; authored preparation begins
request working#12 before idle is ready
idle#11 is canceled; success exact composite stays visible
late idle#11 frame arrives; generation mismatch releases it silently
working#12 post-draw frame is ready
transition success -> working
release old success resources after transition completion
```

### Identical loading beats

```text
loading step-1 occurrence 21 completes
step-2 targets loading but allocates occurrence 22
renderer host remains mounted
source seeks to registered start, presents exact first frame, then replays
only occurrence 22 can complete step-2
```

### Appearance changes during preparation

```text
thinking-light visible -> caution-light preparing
provider changes to dark
appearance revision increments; caution-light readiness becomes stale
caution-dark prepares under the same command and occurrence
transition completes once; one callback; one promise settlement
```

### Independent pause sources

```text
user pauses
page becomes hidden
user resumes; visual remains suspended
page becomes visible but runtime denies admission; visual remains suspended
runtime admits; logical time resumes from the frozen phase
```

### Unmount during readiness

```text
working target waits for decoded/post-draw frame
host unmounts
cancel(unmount); promises reject AbortError
late loadeddata/rVFC callback arrives
binding epoch/revision mismatch; resources release; no event fires
```

## Agent and human misuse boundaries

Documentation and MCP guidance must explicitly reject:

- one RazorSense instance per chat message;
- using RazorSense as the only progress or result signal;
- restarting Typing for every keystroke;
- using Success/Joyful for every small success;
- animated material inside dense repeated rows;
- manual CSS transitions around RazorSense;
- raw shader props for normal states;
- eagerly mounting all sequence media;
- forcing motion against reduced-motion preference;
- omitting dark and mobile verification;
- treating a one-shot as an infinite loop;
- making authentication, navigation, or API completion wait on animation.

## Verification gates

The implementation is complete only when browser evidence proves:

- all eight states in light/dark and desktop/mobile;
- every valid state pair in the transition lab;
- exact outgoing-frame retention while incoming assets are delayed;
- AI chat normal and interrupted journeys;
- login-to-dashboard boundary captures listed in `RazorSenseMotionReference.md`;
- three distinct loading occurrences and interrupted third beat;
- ripple, bottom wave, success, compact loader, audio wave, and raw legacy paths;
- once, loop, repeat, hold, pause/resume, manual advance, replace, queue, finish-current, and cancel;
- provider appearance changes during preparation and transition;
- reduced motion, asset failure, WebGL failure/context loss, and unmount races;
- multiple-instance admission, offscreen suspension, and page visibility;
- no console error, blank frame, grayscale source, theme flash, duplicate callback, or stale transition win;
- request count, transferred bytes, active video count, WebGL context count, frame pacing, and dropped frames recorded without visual simplification.

## Research basis

- React controlled props remain the primary source of truth; imperative handles are reserved for behavior that cannot be expressed as props.
- React hydration requires the initial client output to match server output.
- Web Animations defines explicit play, pause, finish, cancellation, finished promises, and stable event ordering.
- Page Visibility and Intersection Observer provide browser lifecycle signals; they do not replace application state.
- `prefers-reduced-motion` communicates a system request to remove or replace non-essential motion.
- WCAG status-message guidance requires product status to be available to assistive technology when it is presented visually.
- Storybook play functions provide deterministic, browser-debuggable interaction fixtures.
- Statecharts contribute deterministic transition, re-entry, cancel-on-exit, and run-to-completion ideas, but RazorSense keeps those mechanics private and dependency-free.

Primary references:

- https://react.dev/reference/react/useImperativeHandle
- https://react.dev/reference/react/useSyncExternalStore
- https://react.dev/reference/react-dom/client/hydrateRoot
- https://www.w3.org/TR/web-animations-1/
- https://www.w3.org/TR/page-visibility-2/
- https://www.w3.org/TR/intersection-observer/
- https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages
- https://storybook.js.org/docs/writing-tests/interaction-testing
- https://stately.ai/docs/transitions
- https://www.w3.org/TR/scxml/#AlgorithmforSCXMLInterpretation
