# RazorSense

RazorSense is Blade's declarative motion-state system for expressive product surfaces. Consumers declare semantic intent or a durable branded preset; Blade owns renderer selection, exact-frame readiness, transitions, playback, interruption, lifecycle, reduced motion, and fallback output. The system supports controlled product state, typed linear journeys, and an advanced event-driven controller without exposing media or shader coordination.

Implementation claims in this decision are verified against the repository on July 12, 2026. Product-use recommendations are marked **Guidance** when they are inferred from supplied films and the design-language site rather than encoded as a runtime invariant.

## Design

- [RazorSense design language](https://razorpay.com/razorsense/#design-language)
- [Timestamped local motion reference](../../docs/RazorSenseMotionReference.md)
- No public Figma component URL was included in the supplied source material.

## Primary research basis

- [React: sharing state between components](https://react.dev/learn/sharing-state-between-components) supports a controlled primary API with one product source of truth.
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) informs the public cancellation signal; RazorSense adds deterministic visual replacement and boundary semantics on top.
- [MDN: requestVideoFrameCallback](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback) is the preferred frame-readiness and frame-pacing signal when available, with a bounded media-event fallback.
- [MDN: Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API), [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), and [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) define the lifecycle and motion-preference inputs; they do not change product truth.
- [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria/) supports a polite status companion while visible text, native controls, focus, progress, and recovery remain application responsibilities.
- [Storybook interaction tests](https://storybook.js.org/docs/9/writing-tests/interaction-testing) informed deterministic executable fixtures; browser verification still inspects fixed transition boundaries and rendered media behavior.
- [XState documentation](https://stately.ai/docs/xstate) informed the statechart alternative. Blade remains statechart-compatible through controlled state but does not make an application workflow engine part of the visual API.

## API

Controlled semantic state is the primary API.

```tsx
import { RazorSense } from '@razorpay/blade/components';

<RazorSense
  state={agentState}
  playback="automatic"
  transition="automatic"
  accessibilityLabel="Assistant activity"
/>;
```

Reusable authored journeys use a frozen definition and a dedicated sequence host.

```tsx
import { RazorSenseSequence, defineRazorSenseSequence } from '@razorpay/blade/components';

const journey = defineRazorSenseSequence({
  id: 'merchant.setup.v1',
  steps: [
    { id: 'prepare', state: 'loading', playback: 'once' },
    { id: 'verify', preset: 'compactLoader', playback: 'repeat', repeatCount: 1 },
    { id: 'complete', state: 'success', playback: 'once', holdAfterMs: 320 },
  ],
  endBehavior: 'hold',
});

<RazorSenseSequence sequence={journey} runId={setupAttemptId} />;
```

Event-driven workflows may bind a controller to one host.

```tsx
const razorSense = useRazorSenseController({ initialState: 'idle' });

const command = razorSense.play(
  { state: 'thinking' },
  { playback: 'loop', interruptionPolicy: 'replace' },
);

await command.ready;
await command.transitioned;

<RazorSense controller={razorSense} />;
```

<details>
  <summary>Alternate APIs considered</summary>

### Controlled component only

```tsx
<RazorSense state={state} />
```

- Pros
  - Smallest API and consistent with React-controlled state.
  - Easy to connect to application statecharts without a dependency.
  - Replacement semantics remain obvious.
- Cons
  - Cannot readably represent repeated authored beats or manual sequence boundaries.
  - Event-driven cancellation and named readiness milestones become awkward.
- Decision
  - Keep as the primary layer, but add sequences and a controller for needs that props cannot express cleanly.

### One generic animation DSL

```tsx
<RazorSense timeline={[{ renderer: 'video', at: 0.4 }, { shader: uniforms }]} />
```

- Pros
  - Could theoretically represent every reference film.
- Cons
  - Exposes renderer and timing internals to product code.
  - Makes normal chat and loading use harder to read.
  - Encourages manual seconds, shader props, and unreviewed choreography.
  - Becomes a second animation framework rather than a design-system component.
- Decision
  - Rejected. Sequence steps contain product targets and playback policies only.

### Public statechart or XState actor

```tsx
<RazorSense actor={motionActor} />
```

- Pros
  - Strong branching, hierarchy, and interruption semantics.
  - Familiar to statechart users.
- Cons
  - Couples Blade to application workflow and a third-party state library.
  - Leaks presentation occurrences into business state.
  - Does not remove the need for Blade-specific renderer adapters.
  - XState v5's TypeScript requirement is incompatible with Blade's current TypeScript baseline.
- Decision
  - Rejected as a public API. Blade uses a private reducer/effect runner; application statecharts drive controlled `state`.

### Imperative controller as the default

```tsx
const razorSense = useRazorSenseController();
razorSense.transitionTo('thinking');
```

- Pros
  - Natural for event handlers and awaitable milestones.
- Cons
  - Hidden state, lifecycle-sensitive promises, and more misuse risk.
  - Less legible than controlled props for normal product state.
- Decision
  - Advanced opt-in only. It does not replace the controlled API.

### One component per renderer or emotion

```tsx
<ThinkingRazorSense />
<JoyfulRazorSense />
```

- Pros
  - Simple local implementation.
- Cons
  - Consumers must coordinate cross-renderer transitions and cleanup.
  - Encourages remounts and blank frames.
  - Prevents one semantic state from evolving to a different renderer.
- Decision
  - Rejected. Renderer families remain private.

</details>

### Props

#### RazorSense

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

type RazorSenseTransition = 'automatic' | 'cut' | { duration: DurationString };

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

type RazorSenseControlledProps = RazorSenseSharedProps &
  // A discriminated union correlates each target with its supported playback:
  // success/audioWave are once-only; bottomWave/compactLoader are finite-only.
  RazorSenseControlledTargetPlaybackProps & {
    /** Distinguishes a replay of the same target without remounting. */
    replayKey?: string | number;
    /** @default 'automatic' */
    transition?: RazorSenseTransition;
    /** @default false */
    isPaused?: boolean;
    onReady?: (event: RazorSenseReadyEvent) => void;
    onTransitionStart?: (event: RazorSenseTransitionStartEvent) => void;
    onTransitionComplete?: (event: RazorSenseTransitionCompleteEvent) => void;
    onPlaybackComplete?: (event: RazorSensePlaybackEvent) => void;
    controller?: never;
  };

type RazorSenseControllerOwnedProps = RazorSenseSharedProps & {
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

type RazorSenseSharedProps = StyledPropsBlade &
  TestID &
  DataAnalyticsAttribute & {
    width?: string | number;
    height?: string | number;
    assetsPath?: string;
    accessibilityLabel?: string;
    isInteractive?: boolean;
    onLoad?: () => void;
    onError?: (error: Error) => void;
    className?: string;
    style?: React.CSSProperties;
  };
```

Target/playback support is correlated at the type level:

- Semantic states and `rippleWave` accept all playback policies. `bottomWave` is finite (`once` or `repeat`) because its exact 10-second source has no verified loop seam.
- `compactLoader` accepts automatic, once, or finite repeat.
- `success` and `audioWave` presets accept automatic or once.
- The compatibility `mode` API remains accepted, but `state` is canonical for new product code.
- Legacy presets and raw shader props remain in a separate compatibility union.

#### RazorSenseSequence

```ts
type RazorSenseSequenceStep = {
  id: string;
  state: RazorSenseState;
  // or: preset: RazorSenseBrandedPreset
  delayBeforeMs?: number;
  transition?: RazorSenseTransition;
} & (
  | {
      playback?: 'once';
      advance?: 'on-complete' | 'manual';
      holdAfterMs?: number;
    }
  | {
      playback: 'repeat';
      repeatCount: number;
      advance?: 'on-complete' | 'manual';
      holdAfterMs?: number;
    }
  | {
      playback: 'loop';
      advance: 'manual';
      holdAfterMs?: never;
    }
);

type RazorSenseSequenceDefinition<
  Cue extends string = never,
  ForegroundSlot extends string = never
> = {
  id: string;
  steps: readonly RazorSenseSequenceStep[];
  endBehavior?: 'hold' | 'reset-to-start';
  readonly __cueType?: Cue;
  readonly __foregroundSlotType?: ForegroundSlot;
};

type RazorSenseSequenceProps<
  Cue extends string = never,
  ForegroundSlot extends string = never
> = RazorSenseSharedProps & {
  sequence: RazorSenseSequenceDefinition<Cue, ForegroundSlot>;
  runId?: string | number;
  /** @default 'replace' */
  interruptionPolicy?: 'replace' | 'queue' | 'finish-current';
  controller?: RazorSenseSequenceController;
  isPaused?: boolean;
  onEvent?: (event: RazorSenseSequenceEvent<Cue>) => void;
  onStepStart?: (event: RazorSenseStepStartEvent) => void;
  onStepComplete?: (event: RazorSenseStepCompleteEvent) => void;
  onComplete?: (event: RazorSenseSequenceCompleteEvent) => void;
  onCancel?: (event: RazorSenseSequenceCancelEvent) => void;
} & ([ForegroundSlot] extends [never]
    ? { foreground?: never }
    : { foreground: Record<ForegroundSlot, React.ReactNode> });
```

Definitions are validated, cloned, deeply frozen, and fingerprinted. Reusing a definition ID for different content is a deterministic development error.

#### useRazorSenseController

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

  playSequence<Cue extends string = never, ForegroundSlot extends string = never>(
    sequence: RazorSenseSequenceDefinition<Cue, ForegroundSlot>,
    options?: RazorSenseControllerSequenceOptions,
  ): RazorSenseSequenceCommand;

  pause(): void;
  resume(): void;
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
```

#### Preload utilities

```ts
type PreloadRazorSenseOptions = {
  modes: RazorSenseMode | readonly RazorSenseMode[];
  colorSchemes?: 'light' | 'dark' | readonly ('light' | 'dark')[];
  assetsPath?: string;
};

preloadRazorSense(options: PreloadRazorSenseOptions): Promise<void>;
preloadRazorSenseModeAssets(
  modes?: RazorSenseMode | readonly RazorSenseMode[],
  assetsPath?: string,
  colorScheme?: 'light' | 'dark',
): Promise<void>;
preloadRazorSenseAssets(preset?: LegacyRazorSensePreset, assetsPath?: string): Promise<void>;
preloadRazorSenseTarget(
  target: RazorSenseTarget,
  assetsPath?: string,
  colorScheme?: 'light' | 'dark',
): Promise<void>;
```

`preloadRazorSenseTarget` is the canonical probable-next helper for semantic and branded targets. It prepares the registered still and renderer source without mounting the component. `preloadRazorSense` and `preloadRazorSenseModeAssets` remain compatibility mode helpers; `preloadRazorSenseAssets` remains the legacy-preset helper.

## Examples

### Basic usage

Controlled semantic state is the normal product integration. No timer or renderer prop is needed.

```tsx
<RazorSense state="idle" />
```

### Controlled AI state

Application events change the semantic state. Blade owns visual replacement and readiness.

```tsx
<RazorSense
  state={agentState}
  accessibilityLabel="Assistant activity"
  onPlaybackComplete={(event) => analytics.track(event.reason)}
/>
```

### Same-target replay

Use occurrence identity rather than React remounting.

```tsx
<RazorSense state="success" replayKey={resultId} playback="once" endBehavior="hold" />
```

### Manual sequence boundary

A real product event advances the loop; the sequence does not guess its duration.

```tsx
const sequence = defineRazorSenseSequence({
  id: 'assistant.work.v1',
  steps: [
    { id: 'thinking', state: 'thinking', playback: 'loop', advance: 'manual' },
    { id: 'working', state: 'working', playback: 'loop', advance: 'manual' },
    { id: 'outcome', state: 'success', playback: 'once' },
  ],
});

const controller = useRazorSenseSequenceController(sequence);

<RazorSenseSequence sequence={sequence} controller={controller} runId={requestId} />;

controller.advance();
```

### Login to dashboard

The built-in journey owns its timestamped foreground cue program derived from the supplied 24 fps reference; source and destination remain live Blade UI and retain product-specific layout ownership.

```tsx
<RazorSenseSequence
  sequence={razorSenseLoginToDashboardJourney}
  runId={loginAttemptId}
  foreground={{ source: <LoginForm />, destination: <Dashboard /> }}
/>
```

### Branded presets

Semantic and branded targets remain distinct.

```tsx
<RazorSense preset="rippleWave" playback="loop" />
<RazorSense preset="bottomWave" playback="once" />
<RazorSense preset="success" playback="once" endBehavior="hold" />
<RazorSense preset="audioWave" playback="once" endBehavior="hold" />
```

## Accessibility

- RazorSense is decorative by default and hidden from assistive technology.
- `accessibilityLabel` gives one stable name to a meaningful material layer; state changes do not rename it.
- Product status must also be conveyed with visible copy and the appropriate Blade status, progress, alert, or recovery pattern.
- Reduced motion is always honored and cannot be overridden by the product API.
- Sequences do not move focus on completion.
- Loop iterations do not create repeated screen-reader announcements.
- The login journey keeps source and destination as real DOM and controls their accessibility exposure with the authored reveal.
- React Native is explicitly unsupported in this release; responsive mobile web uses registered mobile assets and crops.
- Server output uses the registered responsive representative still. Media, WebGL, observers, and playback clocks begin only after hydration; initial target, appearance, replay identity, sequence ID, and run ID must remain hydration-stable.

## Open Questions

- **Resolved boundary:** `bottomWave` uses the exact 10-second, 25fps source and rejects loop playback until an authored seam is verified.
- **Verified current behavior:** `preloadRazorSenseTarget` preloads one semantic or branded target for one appearance. Compatibility preload helpers remain additive and are not removed.
- **Guidance:** chat remains controlled rather than a built-in exported sequence because its transitions depend on real business events.
- **Guidance:** `success` should remain reserved for meaningful outcomes even though the type system cannot encode product significance.
- React Native requires a separate renderer adapter and is not implied by responsive mobile-web support.

## Decision summary

The selected API is the smallest coherent combination of three layers:

1. Controlled semantic state for the common product case.
2. Frozen linear sequences for reusable authored choreography.
3. A bound controller with named promises for advanced event-driven integration.

Blade keeps renderer adapters, media readiness, exact-frame retention, transition execution, cancellation generations, lifecycle admission, reduced motion, and fallback output private. Product code keeps business truth, branching, status content, focus, navigation, and recovery.
