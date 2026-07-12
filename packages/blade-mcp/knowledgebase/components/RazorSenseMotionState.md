## Component Name

RazorSense Motion State (compatibility discovery entry)

## Description

This entry is retained so older agents searching for “RazorSense Motion State” reach the correct API. The actual Blade component is `RazorSense`; fetch the **RazorSense** component documentation as the canonical contract and the **RazorSense Journeys** pattern for end-to-end recipes.

RazorSense is Blade's declarative API for expressive product states and authored visual journeys. Use it when a product surface moves between intent such as typing, thinking, working, success, caution, or failure while Blade owns media, shader, transition, interruption, accessibility, and lifecycle mechanics. It includes controlled `RazorSense`, typed `RazorSenseSequence`, and advanced controller APIs. Raw shader controls are compatibility and internal-calibration tools documented in the canonical component page; they are not the normal product API.

This compatibility entry describes the implementation present on July 13, 2026. Public types and runtime are verified sources. Product recommendations are labeled **Guidance** when they come from reference media rather than a runtime invariant.

## What RazorSense owns

RazorSense owns:

- semantic target to renderer selection;
- incoming asset and WebGL readiness;
- retaining the exact outgoing composite while waiting;
- cross-renderer transitions;
- playback iterations and exact terminal frames;
- replacement, queueing, finish-current, and cancellation;
- stale async-work rejection;
- page visibility, viewport, runtime admission, and cleanup;
- light/dark provider changes;
- reduced motion and calibrated static output;
- fallback behavior and deterministic events.

The application owns:

- business state and branching;
- status text and recovery instructions;
- focus and navigation;
- deciding when real work starts, finishes, retries, or fails.

## Important Constraints

- `state`, `mode`, and `preset` are mutually exclusive targets.
- A controller-owned `RazorSense` cannot also receive a target, `replayKey`, playback, transition, or pause props.
- `success` and `audioWave` presets accept only automatic or once playback.
- `bottomWave` accepts automatic, once, or finite repeat playback; it has no verified loop seam.
- `compactLoader` accepts only automatic, once, or finite repeat playback.
- `repeatCount` is valid only with `playback="repeat"` and must be a non-negative safe integer.
- `endBehavior` is valid only for finite playback; a sequence declares it on the definition, never on a step.
- A sequence must have a non-empty stable ID, at least one step, and unique non-empty step IDs.
- A looping sequence step must use `advance="manual"` and cannot declare `holdAfterMs`.
- A transition duration override must be a supported Blade `duration.*` token and cannot include a custom easing.
- A standalone controller and a sequence controller are not interchangeable; a sequence controller is bound to one frozen definition ID and fingerprint.
- One controller can drive only one mounted RazorSense host.
- Responsive mobile web is supported; React Native rendering is not supported.

## TypeScript Types

The following public types define the declarative targets, playback, transitions, sequence steps, and controller milestones used by this component family.

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

type RazorSenseBrandedPreset =
  | 'rippleWave'
  | 'bottomWave'
  | 'success'
  | 'compactLoader'
  | 'audioWave';

type RazorSenseStateTarget<
  State extends RazorSenseState = RazorSenseState
> = State extends RazorSenseState ? { state: State; preset?: never } : never;

type RazorSensePresetTarget<
  Preset extends RazorSenseBrandedPreset = RazorSenseBrandedPreset
> = Preset extends RazorSenseBrandedPreset ? { preset: Preset; state?: never } : never;

type RazorSenseTarget = RazorSenseStateTarget | RazorSensePresetTarget;

type RazorSenseTransition =
  | 'automatic'
  | 'cut'
  | {
      duration: DurationString;
    };

type RazorSensePlayback = 'automatic' | 'once' | 'repeat' | 'loop';
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
      repeatCount: number;
      endBehavior?: RazorSenseEndBehavior;
    }
  | {
      playback: 'loop';
      repeatCount?: never;
      endBehavior?: never;
    };

type RazorSenseInterruptionPolicy = 'replace' | 'queue' | 'finish-current';

type RazorSenseSequenceStepBase = RazorSenseTarget & {
  id: string;
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
  readonly __cueType?: Cue;
  readonly __foregroundSlotType?: ForegroundSlot;
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
  advance(): boolean;
  cancel(reason?: unknown): void;
  finishAtBoundary(): Promise<RazorSenseSequenceResult>;
};
```

`RazorSenseControlledProps`, `RazorSenseSequenceProps`, and controller play options further correlate each target with its supported playback at compile time. Do not cast around those correlations.

## Usage Guidelines

**Do**

- Use one controlled `RazorSense` instance for a product surface whose state follows real application events.
- Use semantic `state` names for new product work and branded `preset` names only for their specific compositions.
- Use `replayKey` to replay the same target without remounting.
- Use a typed sequence for reusable linear choreography and a controller for real manual boundaries.
- Pair every loading, outcome, caution, or failure visual with visible and accessible product status.
- Let `BladeProvider` own light/dark appearance and let Blade honor reduced motion.
- Preload only current and probable-next modes.

**Don't**

- Don't mount one instance per chat message or repeated row — use one instance for the containing surface.
- Don't restart `typing` per keystroke — enter it on focus or composition intent.
- Don't use `success` for routine low-salience feedback — use the appropriate standard Blade feedback component.
- Don't coordinate RazorSense with CSS opacity, `setTimeout`, video seeking, or shader props — use controlled state, a sequence, or a controller.
- Don't use raw shader controls for semantic product states — keep them on the compatibility/calibration path.
- Don't force motion or invent a second reduced-motion preference.
- Don't make authentication, navigation, or API completion wait on decorative playback.

## Fast selection

1. Existing React product state: use `<RazorSense state={state} />`.
2. Reusable linear visual journey: use `defineRazorSenseSequence` and `<RazorSenseSequence>`.
3. Need awaitable readiness, cancellation, queueing, or manual boundaries: use a controller.
4. Need ripple, bottom wave, compact loader, branded success, or audio wave: use a branded `preset`.
5. Need an existing calibrated raw shader: use compatibility props only after confirming no semantic state or branded preset matches.

## Semantic states

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

| State      | Select when                                                 | Do not select when                                       |
| ---------- | ----------------------------------------------------------- | -------------------------------------------------------- |
| `idle`     | A surface is ready or resting.                              | Work is actively progressing.                            |
| `typing`   | The user enters composition intent or focuses the composer. | A glyph was added; never restart per keystroke.          |
| `thinking` | The agent is reasoning or deliberating.                     | The agent is visibly executing tools or streaming work.  |
| `working`  | Work or tool execution is active.                           | The system is merely waiting for input.                  |
| `loading`  | A bounded or explicitly looping loading phase is needed.    | A compact branded loader is the required composition.    |
| `success`  | A meaningful outcome completed.                             | A minor save, click, or routine acknowledgment occurred. |
| `caution`  | Recoverable risk or attention is required.                  | The outcome is irrecoverably failed.                     |
| `regret`   | Failure, reversal, or failed outcome occurred.              | A warning can still be resolved in place.                |

The verified internal mapping is `idle -> neutral`, `working -> calm`, and `success -> joyful`. Agents must still write semantic states, not visual mode names, in new product code.

## Branded presets

```ts
type RazorSenseBrandedPreset =
  | 'rippleWave'
  | 'bottomWave'
  | 'success'
  | 'compactLoader'
  | 'audioWave';
```

- `rippleWave`: branded pulse; supports once, repeat, or loop.
- `bottomWave`: exact ten-second bottom-edge source with calibrated light and dark masters; finite `once` or `repeat` only because no seamless loop is verified.
- `success`: branded success-circle composition; one-shot only.
- `compactLoader`: compact finite loading mark; once or finite repeat, never loop.
- `audioWave`: supplied authored audio wave; one-shot only.

`state="success"` is a semantic joyful material. `preset="success"` is the branded success-circle composition.

## Example

### Controlled semantic state

```tsx
import { RazorSense } from '@razorpay/blade/components';

<RazorSense
  state={agentState}
  playback="automatic"
  transition="automatic"
  accessibilityLabel="Assistant activity"
/>;
```

Controlled state uses replacement semantics. Blade keeps the current exact composite while it prepares the newest request. Do not add a CSS crossfade or placeholder.

Replay the same target with `replayKey`:

```tsx
<RazorSense state="success" replayKey={resultId} playback="once" endBehavior="hold" />
```

Do not remount with `key` merely to replay.

## Playback

```ts
type RazorSensePlayback = 'automatic' | 'once' | 'repeat' | 'loop';
type RazorSenseEndBehavior = 'hold' | 'reset-to-start';
```

- `automatic` uses the registered program default.
- `once` is one iteration.
- `repeatCount` is additional iterations after the first. `repeatCount={2}` means three total.
- `loop` has no natural completion.
- `hold` keeps the exact registered terminal frame.
- `reset-to-start` presents the exact registered start frame after finite completion.
- `isPaused` pauses without creating a new occurrence.

## Transitions

```ts
type RazorSenseTransition = 'automatic' | 'cut' | { duration: DurationString };
```

- Prefer `automatic`.
- `cut` still waits for incoming readiness.
- A duration token changes only the duration of Blade's registered edge.
- Never add consumer opacity, media, shader, or cleanup choreography.

## Sequences

```tsx
const sequence = defineRazorSenseSequence({
  id: 'merchant.setup.v1',
  steps: [
    { id: 'prepare', preset: 'compactLoader', playback: 'once' },
    { id: 'verify', preset: 'compactLoader', playback: 'repeat', repeatCount: 1 },
    { id: 'finish', state: 'success', playback: 'once', holdAfterMs: 320 },
  ],
  endBehavior: 'hold',
});

<RazorSenseSequence sequence={sequence} runId={attemptId} />;
```

Sequence invariants:

- Stable definition ID; unique step IDs.
- `runId` creates a new run. The same `(sequence.id, runId)` is idempotent.
- `delayBeforeMs` gates presentation and permits preparation.
- `holdAfterMs` applies only to finite steps.
- A loop step must use `advance: 'manual'`.
- `endBehavior` belongs on the sequence, not a step.
- Branching and business workflow remain application-owned.

Manual loops require a sequence controller and a real product event:

```tsx
const controller = useRazorSenseSequenceController(sequence);

<RazorSenseSequence sequence={sequence} controller={controller} runId={requestId} />;

controller.advance();
```

Do not use `setTimeout` to guess thinking, working, authentication, or API duration.

## Controller

```tsx
const controller = useRazorSenseController({ initialState: 'idle' });

const command = controller.play(
  { state: 'thinking' },
  { playback: 'loop', interruptionPolicy: 'replace' },
);

await command.ready;
await command.transitioned;

// A later real product event:
await command.finishAtBoundary();

return <RazorSense controller={controller} />;
```

Commands are not thenable:

- `ready`: an exact incoming decoded or post-draw frame exists.
- `transitioned`: blend and outgoing cleanup settled.
- `completed`: finite terminal presented; remains pending for an infinite loop.
- `finishAtBoundary()`: finish at the registered safe seam.

One controller drives exactly one mounted host. When `controller` is present, do not pass `state`, `mode`, `preset`, playback, transition, replay, or pause props.

## Interruption

- `replace` (default): newest truth wins; cancel stale active and queued work.
- `queue`: append after existing work. A loop or manual step blocks the queue.
- `finish-current`: keep only the newest pending request and start it at the nearest safe boundary.

`command.cancel()` cancels one command. `controller.cancel({ scope: 'active' })` cancels active work. `scope: 'all'` also clears the queue. Pending promises reject with `AbortError`.

## Event ordering

```text
run-start
step-start
ready
transition-start
transition-complete and iteration/playback-complete in observed time order
step-complete
run-complete
completed promise resolves
```

An event fires before its associated promise resolves. Transition and playback clocks overlap, so never assume a universal order between transition, iteration, and playback completion. Match event `type` and identity fields.

## Appearance, mobile, reduced motion, accessibility

- Appearance comes only from the nearest `BladeProvider`.
- Semantic states, `compactLoader`, and `bottomWave` have calibrated dark output; other supplied branded footage remains appearance-invariant. Never use CSS inversion.
- Mobile means responsive mobile web. Emotional states use portrait media; current operational states use a deliberate responsive crop of their full-resolution source. React Native is unsupported.
- Blade always honors `prefers-reduced-motion`; do not expose or invent a force-motion override.
- RazorSense is decorative by default.
- `accessibilityLabel` names the material; it is not product status.
- Always pair loading, success, caution, and regret with visible text and the appropriate status, progress, alert, or recovery UI.
- Never move focus because decorative playback completed.
- Server output is the registered responsive representative `<picture>`. Media, WebGL, observers, and clocks begin after hydration.
- Keep provider appearance, initial target, replay identity, sequence ID, and run ID stable from the server render through the first client render.

## Preloading and multiple instances

```tsx
await preloadRazorSenseTarget({ state: 'thinking' });
await preloadRazorSenseTarget({ state: 'thinking' }, undefined, 'dark');
await preloadRazorSenseTarget({ preset: 'success' });
```

`preloadRazorSenseTarget(target, assetsPath?, colorScheme?)` is the canonical probable-next preload API. It accepts semantic and branded targets and prepares the registered representative still plus renderer source without mounting a hidden component.

`preloadRazorSense` and `preloadRazorSenseModeAssets` remain compatibility helpers for mode-based integrations. `preloadRazorSenseAssets` accepts legacy presets. Preload only current and probable-next work.

Current internal safety limits are four admitted instances, two admitted WebGL instances, and two temporary preload videos per document. They are not a recommendation to place four animations on a screen. Prefer one stable instance per meaningful surface.

## Compatibility

| Compatibility input      | New semantic input                                         |
| ------------------------ | ---------------------------------------------------------- |
| `<RazorSense />`         | `state="idle"`                                             |
| `preset="default"`       | `state="idle"`                                             |
| `preset="zoomed"`        | `state="thinking"`                                         |
| `mode="neutral"`         | `state="idle"`                                             |
| `mode="typing"`          | `state="typing"`                                           |
| `mode="thinking"`        | `state="thinking"`                                         |
| `mode="calm"`            | `state="working"`                                          |
| `mode="joyful"`          | `state="success"`                                          |
| `mode="caution"`         | `state="caution"`                                          |
| `mode="regret"`          | `state="regret"`                                           |
| `preset="circleSlideUp"` | `preset="success"`                                         |
| `preset="legacy"`        | Raw compatibility renderer                                 |
| Raw loader timing        | `state="loading"`, `preset="compactLoader"`, or a sequence |

Raw shader props remain a compatibility/calibration path. Never generate them for a normal product state. No removal date is declared for `mode` or the raw renderer; `circleSlideUp` is a legacy product-facing name and new code uses `preset="success"`.

## Agent guardrails

An agent must not:

- mount one instance per chat message;
- use RazorSense as the only loading or result signal;
- restart `typing` per keystroke;
- use `success` for every small success;
- place active material in dense repeated rows;
- create CSS transitions around RazorSense;
- use raw shader props for semantic states;
- eagerly mount all states or sequence media;
- forget dark, responsive mobile-web, or reduced-motion behavior;
- loop a one-shot source;
- make authentication, navigation, or API completion wait on animation.

## Debugging cues

- Same state does not replay: change `replayKey`.
- Same sequence does not restart: change `runId`.
- Queue is stuck: inspect a loop/manual step and call `advance`, `finishAtBoundary`, or cancel.
- `completed` is pending: expected for `loop`; await `ready` or `transitioned` instead.
- Motion is static: inspect reduced motion, visibility, viewport, pause, and runtime admission.
- Playback type error: `success`/`audioWave` are once-only; `bottomWave`/`compactLoader` are finite-only.
- Theme flash: remove custom theme state and consumer placeholder/crossfade logic.
- Error: inspect `RazorSenseError.code`, `recoverable`, target, occurrence, and renderer metadata, then keep product recovery application-owned.
