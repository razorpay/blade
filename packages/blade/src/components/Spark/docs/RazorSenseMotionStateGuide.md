# RazorSense motion-state guide

RazorSense is Blade's declarative visual state system for expressive product moments. Product code declares intent such as `typing`, `thinking`, `working`, `success`, or a branded preset; Blade owns renderer selection, asset readiness, transitions, interruption, playback boundaries, lifecycle, reduced motion, and fallback output.

This guide describes the implementation present in the repository on July 13, 2026.

## Evidence labels

- **Verified** means the behavior is represented in the current public types, program manifest, controller, presentation host, runtime, or built-in sequence manifest.
- **Guidance** means a product-use recommendation inferred from the supplied RazorSense films, the design-language site, and Blade conventions. Guidance is intentionally stricter than the TypeScript union when visual evidence is incomplete.
- Calibration timings and visual observations live in [RazorSenseMotionReference.md](./RazorSenseMotionReference.md). Performance measurements live in [RazorSensePerformanceBaseline.md](./RazorSensePerformanceBaseline.md).

## Three-minute quick start

Use one stable RazorSense instance for one product surface. Change `state` when product intent changes.

```tsx
import { RazorSense } from '@razorpay/blade/components';

const AgentMaterial = ({
  agentState,
}: {
  agentState: 'idle' | 'typing' | 'thinking' | 'working' | 'success';
}) => (
  <RazorSense
    state={agentState}
    width="100%"
    height="320px"
    accessibilityLabel="Assistant activity"
  />
);
```

`playback="automatic"` and `transition="automatic"` are implicit. Blade resolves them from the registered program. A controlled state change uses replacement semantics: the newest state wins, while the current exact frame remains visible until the incoming renderer is ready.

RazorSense currently targets React and responsive mobile web. The React Native component and motion controllers are not yet supported; do not start controller commands on native surfaces.

Replay the same target with `replayKey`; do not remount the component.

```tsx
<RazorSense state="success" replayKey={successfulAttemptId} playback="once" endBehavior="hold" />
```

For a reusable authored journey, define a typed sequence instead of coordinating timers.

```tsx
import { RazorSenseSequence, defineRazorSenseSequence } from '@razorpay/blade/components';

const loadingJourney = defineRazorSenseSequence({
  id: 'merchant.setup-loading.v1',
  steps: [
    { id: 'connect', preset: 'compactLoader', playback: 'once' },
    { id: 'verify', preset: 'compactLoader', playback: 'once' },
    { id: 'finish', state: 'success', playback: 'once', holdAfterMs: 320 },
  ],
  endBehavior: 'hold',
});

<RazorSenseSequence sequence={loadingJourney} runId={setupAttemptId} />;
```

## Choose the right API

| Need                                                               | API                                                 | Rule                                                                               |
| ------------------------------------------------------------------ | --------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Product state already exists in React state                        | `<RazorSense state>`                                | Preferred for AI chat and most application surfaces.                               |
| A reusable, linear, authored visual journey                        | `defineRazorSenseSequence` + `<RazorSenseSequence>` | Steps remain visual; business branching stays outside Blade.                       |
| Awaiting readiness, cancellation, queueing, or event-driven replay | `useRazorSenseController`                           | Advanced API; bind one controller to one mounted host.                             |
| A sequence with manual steps                                       | `useRazorSenseSequenceController(sequence)`         | The controller is bound to that exact frozen definition.                           |
| Existing calibrated shader or legacy preset                        | Compatibility `mode`, legacy preset, or raw props   | Preserve while migrating; do not use raw shader controls for normal product state. |

## Semantic states

The semantic vocabulary communicates product meaning. The renderer mapping is internal and may evolve without changing product code.

| State      | Verified renderer mapping                            | Automatic playback | Guidance                                                                               |
| ---------- | ---------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------- |
| `idle`     | Authored `neutral`                                   | `loop`             | Resting, ready, or ambient assistant surface.                                          |
| `typing`   | Authored `typing`                                    | `once`, hold       | User composition intent. Enter on focus or typing intent; do not replay per keystroke. |
| `thinking` | Authored `thinking` with a calibrated crossfade seam | `loop`             | Model reasoning or deliberation before work becomes externally observable.             |
| `working`  | Emotional `calm`                                     | `loop`             | Active execution, streaming work, or ongoing tool use.                                 |
| `loading`  | Authored `loading`                                   | `once`, hold       | Bounded loading beat. Request `loop` only for a genuinely indefinite wait.             |
| `success`  | Emotional `joyful`                                   | `once`, hold       | Meaningful completion or outcome, not every minor successful click.                    |
| `caution`  | Emotional `caution`                                  | `once`, hold       | Recoverable risk, attention, or confirmation. Pair with explanatory UI.                |
| `regret`   | Emotional `regret`                                   | `once`, hold       | Failure, reversal, or failed outcome. Pair with recovery action.                       |

**Guidance:** `thinking` and `working` are different product phases. `thinking` communicates internal deliberation; `working` communicates active execution. Do not swap them merely because both loop.

## Branded presets

Presets name durable visual compositions rather than product meaning.

| Preset          | Playback support          | Use                                                                                                 |
| --------------- | ------------------------- | --------------------------------------------------------------------------------------------------- |
| `rippleWave`    | `once`, `repeat`, `loop`  | Branded pulse, ambient transition, or immersive loading surface.                                    |
| `bottomWave`    | `once`, `repeat`          | Exact 10-second, 25fps bottom-edge authored gesture. Loop is rejected until a verified seam exists. |
| `success`       | `once` only               | Existing branded success-circle animation.                                                          |
| `compactLoader` | `once` or finite `repeat` | Compact loading mark and multi-phase loading journeys. It cannot loop forever.                      |
| `audioWave`     | `once` only               | The supplied authored audio-wave gesture; its source is not loop-safe.                              |

Use `state="success"` for a semantic joyful material outcome. Use `preset="success"` when the branded success-circle composition itself is required.

## Transition model

```ts
type RazorSenseTransition = 'automatic' | 'cut' | { duration: `duration.${string}` };
```

- `automatic` selects Blade's registered edge and is the default.
- `cut` still waits for the incoming target to be ready, then replaces the exact outgoing composite with zero blend duration.
- `{ duration: 'duration.quick' }` changes only the duration of the registered edge. It does not change renderer reuse, incoming readiness, the overlap strategy, or an authored sequence's masks and cues.
- Valid duration tokens are `duration.2xquick`, `duration.xquick`, `duration.quick`, `duration.moderate`, `duration.xmoderate`, `duration.gentle`, `duration.xgentle`, and `duration.2xgentle`.

Blade preserves the outgoing composite while the incoming media or WebGL program prepares. Consumers must not add opacity wrappers, placeholder gradients, or manual CSS transitions around RazorSense.

## Playback model

```ts
type RazorSensePlayback = 'automatic' | 'once' | 'repeat' | 'loop';
type RazorSenseEndBehavior = 'hold' | 'reset-to-start';
```

- `automatic` uses the program's registered default.
- `once` completes one iteration.
- `repeat` completes the first iteration plus `repeatCount` additional iterations. `repeatCount={0}` means one total iteration.
- `loop` has no natural completion. Its completion promise remains pending until it is finished at a safe boundary, canceled, or replaced.
- `endBehavior="hold"` keeps the registered terminal frame.
- `endBehavior="reset-to-start"` presents the registered start frame after finite completion.
- `replayKey` creates a new occurrence when the target itself has not changed.
- `isPaused` is a playback latch. Pausing never creates a new occurrence or emits duplicate milestones.

```tsx
<RazorSense
  preset="rippleWave"
  playback="repeat"
  repeatCount={2} // three total iterations
  endBehavior="hold"
/>
```

## Declarative sequences

A sequence is a frozen, linear definition with stable IDs. It is not an application workflow language.

```tsx
const agentJourney = defineRazorSenseSequence({
  id: 'assistant.authored-response.v1',
  steps: [
    { id: 'typing', state: 'typing', playback: 'once' },
    {
      id: 'thinking',
      state: 'thinking',
      playback: 'loop',
      advance: 'manual',
    },
    {
      id: 'working',
      state: 'working',
      playback: 'loop',
      advance: 'manual',
    },
    { id: 'outcome', state: 'success', playback: 'once', holdAfterMs: 320 },
  ],
  endBehavior: 'hold',
});
```

Sequence rules:

- `id` is stable and unique for the definition. Step IDs are unique within it.
- `runId` distinguishes separate executions. Re-rendering the same `(sequence.id, runId)` is idempotent.
- `delayBeforeMs` gates presentation; Blade may prepare the target during the delay.
- `holdAfterMs` applies after finite playback and before advancing.
- A loop step must declare `advance: 'manual'`; it cannot declare `holdAfterMs`.
- Finite steps default to `advance: 'on-complete'` and may opt into manual advance.
- Sequence-level `endBehavior` controls the final visual. Individual steps do not accept `endBehavior`.
- `success` and `audioWave` presets are one-shot only. `bottomWave` and `compactLoader` are finite-only.
- Keep branching, retry decisions, authentication, navigation, and API completion in application state.

```tsx
const controller = useRazorSenseSequenceController(agentJourney);

<RazorSenseSequence
  sequence={agentJourney}
  runId={responseId}
  controller={controller}
  onStepComplete={(event) => analytics.track(event.stepId)}
/>;

// Called by a real product event, not a timer.
controller.advance();
```

## Interruption policies

Controlled `<RazorSense state>` uses replacement semantics. Controller commands and sequences expose all three policies.

| Policy           | Behavior                                                                                           | Watch for                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `replace`        | Cancel active preparation and queued work, retain the exact frame, and prepare the newest request. | Default and best for rapidly changing product truth.                                              |
| `queue`          | Append after existing work.                                                                        | An infinite loop or manual step blocks the queue until advanced, finished, canceled, or replaced. |
| `finish-current` | Supersede older pending requests and start the newest after the nearest registered boundary.       | User pause intentionally delays the boundary.                                                     |

```tsx
controller.play({ state: 'success' }, { playback: 'once', interruptionPolicy: 'finish-current' });
```

`command.cancel()` cancels that command. `controller.cancel({ scope: 'active' })` cancels active work. `scope: 'all'` also clears queued commands. Cancellation is idempotent and rejects unresolved command promises with `AbortError`.

## Controller and named milestones

Commands are deliberately not thenable. Await the milestone that matches the product need.

```tsx
const controller = useRazorSenseController({ initialState: 'idle' });

const startThinking = async () => {
  const command = controller.play(
    { state: 'thinking' },
    { playback: 'loop', interruptionPolicy: 'replace' },
  );

  await command.ready; // exact incoming frame exists
  await command.transitioned; // blend and outgoing cleanup settled

  // Later, at a real product boundary:
  await command.finishAtBoundary();
};

return <RazorSense controller={controller} accessibilityLabel="Assistant activity" />;
```

- `ready` resolves when an exact decoded or post-draw incoming frame exists.
- `transitioned` resolves after transition completion and outgoing cleanup.
- `completed` resolves after finite terminal presentation; it remains pending for an unbounded loop.
- `finishAtBoundary()` finishes at the renderer's registered safe seam.
- A controller may drive exactly one mounted host.
- Controller ownership is exclusive: do not also pass `state`, `mode`, `preset`, `replayKey`, playback props, transition props, or `isPaused`.

## Event ordering

Events are drained in FIFO microtasks. An event fires before its associated promise resolves.

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

There is no universal ordering between `transition-complete`, `iteration`, and `playback-complete`, because transition and playback clocks can overlap. Never infer completion from callback arrival order; inspect `event.type`, `commandId`, `occurrenceId`, `runId`, and `stepId`.

Cancellation:

```text
cancel event
pending named promises reject
next eligible command starts
```

Fatal failure emits `error`, calls component `onError`, rejects unresolved milestones, then allows the next eligible queued command to start. Recoverable degradation emits an error without necessarily ending the command.

## Recipes

### AI chat

**Guidance:** chat is product-event-driven, so use controlled state rather than a timed sequence.

```tsx
type AgentState = 'idle' | 'typing' | 'thinking' | 'working' | 'success' | 'caution' | 'regret';

const [agentState, setAgentState] = useState<AgentState>('idle');

const send = async (message: string) => {
  setAgentState('thinking');
  const response = await startAgent(message);
  setAgentState('working');

  try {
    await streamAgentResult(response);
    setAgentState('success');
  } catch (error) {
    setAgentState(isRecoverable(error) ? 'caution' : 'regret');
  }
};

<RazorSense state={agentState} accessibilityLabel="Assistant activity" />;
```

Use one RazorSense instance for the chat surface, not one per message. Keep visible status copy such as “Thinking”, “Working”, or recovery instructions in the chat UI. Do not restart `typing` for every keypress.

### Login to dashboard

The built-in journey is timestamp-aligned to the observed windows and cues in the supplied 24 fps login reference, and accepts live source and destination foreground slots. Product-specific foreground layouts remain real Blade UI, so verify their final crop against the authored product composition.

```tsx
import { RazorSenseSequence, razorSenseLoginToDashboardJourney } from '@razorpay/blade/components';

<RazorSenseSequence
  sequence={razorSenseLoginToDashboardJourney}
  runId={loginAttemptId}
  foreground={{
    source: <LoginForm />,
    destination: <Dashboard />,
  }}
  onEvent={(event) => event.type === 'error' && reportLoginVisualError(event.error)}
/>;
```

Authentication and navigation must not wait on decorative completion. The source and destination remain real DOM; Blade owns the timestamped material-cover, reveal, loader, and status choreography.

### Three-phase loading

```tsx
<RazorSenseSequence
  sequence={razorSenseThreePhaseLoadingJourney}
  runId={operationId}
  onComplete={() => setVisualJourneyComplete(true)}
/>
```

Use the built-in definition when the three beats are the intended branded composition. For real progress stages with variable duration, drive a controlled state or a manual sequence from real progress events.

### Loading

```tsx
// Semantic loading material
<RazorSense state="loading" playback="loop" />

// Finite compact mark
<RazorSense preset="compactLoader" playback="repeat" repeatCount={2} />
```

Always pair either visual with product status text or an appropriate Blade loading pattern.

### Ripple wave

```tsx
<RazorSense preset="rippleWave" playback="loop" />
```

Use for an immersive branded transition, not a compact control or repeated table row.

### Bottom wave

```tsx
<RazorSense preset="bottomWave" playback="once" endBehavior="hold" />
```

The bottom wave maps to the authored typing impulse. Keep the component clipped to the intended bottom-edge surface. Do not claim a seamless infinite loop until that seam is visually verified.

### Success

```tsx
// Semantic material response
<RazorSense state="success" playback="once" endBehavior="hold" />

// Branded circle composition
<RazorSense preset="success" playback="once" endBehavior="hold" />
```

Use success only for a meaningful result. Buttons, saved fields, and minor confirmations should use standard Blade feedback.

### Audio wave

```tsx
<RazorSense preset="audioWave" playback="once" endBehavior="hold" />
```

Audio Wave is a one-shot authored source. Do not request `loop` or `repeat`.

## Appearance and responsive behavior

RazorSense follows the nearest `BladeProvider` `colorScheme`. There is no component-level appearance prop.

```tsx
<BladeProvider themeTokens={bladeTheme} colorScheme="dark">
  <RazorSense state="thinking" />
</BladeProvider>
```

- Semantic states, the compact loader, and Bottom Wave use calibrated light and dark assets or palettes; dark is not CSS inversion.
- `rippleWave`, branded `success`, and `audioWave` preserve their authored source appearance because no verified dark source was supplied. Treat those presets as appearance-invariant rather than fabricating an inverted material.
- An appearance change preserves the current composite until the new appearance is ready.
- Keep `state`, `replayKey`, sequence ID, and `runId` stable across server and initial client render.
- “Mobile” currently means responsive mobile web. RazorSense is not supported on React Native.
- Emotional states use registered portrait sources. Operational states currently preserve their full-resolution authored source and use a registered responsive crop; do not compensate with ad hoc transforms.
- Verify both portrait and landscape containers; meaningful foreground UI remains outside the material layer.

### Server rendering and hydration

- Server output is a stable decorative `<picture>` containing the registered desktop still and a mobile `<source>` at Blade's responsive breakpoint. The browser selects the crop without changing the React tree.
- Media, WebGL, observers, playback clocks, and controller effects begin only after hydration.
- The server frame is the registered representative target frame, not source grayscale, an empty canvas, a placeholder gradient, or a theme-neutral substitute.
- Keep the nearest provider appearance, initial target, `replayKey`, sequence ID, and `runId` identical between the server render and the first client render.
- Do not conditionally omit RazorSense on the server and insert it after mount. If a framework cannot serve the registered still assets, render the surrounding product status independently and treat the missing material as a recoverable visual failure.

## Reduced motion and accessibility

Blade always honors `prefers-reduced-motion`; the product API cannot force motion on.

- Finite decorative playback collapses to a calibrated still and completes with reason `reduced-motion`.
- A loop becomes a still and waits for external advance; Blade does not invent iteration events.
- Pointer response is disabled.
- Product status and business progression continue independently.

RazorSense is decorative by default. `accessibilityLabel` names the material only when the visual itself is meaningful. It does not replace visible copy, `role="status"`, a progress indicator, an alert, or recovery instructions.

Never use RazorSense as the only loading, success, caution, or failure signal. Do not move focus on animation completion, and do not announce every loop iteration.

## Preloading and performance

Preload only a probable next target. Do not mount hidden copies of every state.

```tsx
useEffect(() => {
  void preloadRazorSenseTarget({ state: 'thinking' });
}, []);
```

`preloadRazorSenseTarget(target, assetsPath?, colorScheme?)` accepts a semantic state or branded preset and prepares its representative still plus renderer source without mounting it. Preload one probable next target. When a provider appearance change is known in advance, pass `'dark'` or `'light'` as the third argument.

The default jsDelivr asset host is CORS-enabled. A custom cross-origin `assetsPath` must return an appropriate `Access-Control-Allow-Origin` header for images and videos. Blade loads capture-eligible media with anonymous CORS so an interrupted cross-renderer blend can preserve its exact composite frame.

```tsx
await preloadRazorSenseTarget({ state: 'thinking' }, undefined, 'dark');
await preloadRazorSenseTarget({ preset: 'success' });
```

Compatibility helpers remain available for existing mode and legacy-preset integrations:

```tsx
await preloadRazorSenseModeAssets(['neutral', 'thinking'], undefined, 'dark');
await preloadRazorSenseAssets('rippleWave');
```

Source-verified runtime limits as of July 13, 2026:

- The shared runtime admits at most four active instances per document.
- At most two admitted instances may consume WebGL concurrently.
- The preload broker owns at most two temporary video elements and releases retained entries after a short TTL.
- Hidden, offscreen, paused, and denied instances stop active scheduling; cold instances retain a static composite and release expensive resources.

These are internal safety limits, not layout targets or a guarantee that four animated instances are good product design. Prefer one instance per meaningful surface. Avoid animated material in dense rows, menus, or message lists.

The checked-in performance document contains the final schema-v2 headed capture for this API, including request bytes, sourced media, current WebGL contexts, frame cadence, and dropped frames under a repeatable protocol.

Performance optimization may reduce network, decoder, scheduling, memory, and idle-GPU cost. It must not simplify flute geometry, refraction, chromatic edges, bloom, palette, or dark material.

## Compatibility and migration

| Existing call                      | Recommended path                                                  | Status                                                                                                                                     |
| ---------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `<RazorSense />`                   | `state="idle"`                                                    | Compatible default; explicit state is clearer.                                                                                             |
| `preset="default"`                 | `state="idle"`                                                    | Compatibility alias.                                                                                                                       |
| `preset="zoomed"`                  | `state="thinking"`                                                | Compatibility alias.                                                                                                                       |
| `mode="neutral"`                   | `state="idle"`                                                    | `mode` remains compatible.                                                                                                                 |
| `mode="typing"`                    | `state="typing"`                                                  | Preserve focus/intent trigger; do not replay per glyph.                                                                                    |
| `mode="thinking"`                  | `state="thinking"`                                                | Same authored material, now managed playback.                                                                                              |
| `mode="calm"`                      | `state="working"`                                                 | Same emotional visual mapping.                                                                                                             |
| `mode="joyful"`                    | `state="success"`                                                 | Same emotional visual mapping.                                                                                                             |
| `mode="caution"`                   | `state="caution"`                                                 | Semantic name already matches.                                                                                                             |
| `mode="regret"`                    | `state="regret"`                                                  | Semantic name already matches.                                                                                                             |
| `preset="bottomWave"`              | Same preset on the managed API                                    | Fidelity correction: now plays the complete ten-second source, supports finite `once`/`repeat`, and selects its authenticated dark master. |
| `preset="rippleWave"`              | Same preset plus explicit playback                                | Preserved.                                                                                                                                 |
| `preset="circleSlideUp"`           | `preset="success"`                                                | Legacy alias remains for compatibility.                                                                                                    |
| `preset="legacy"`                  | Raw compatibility renderer                                        | Calibration and existing specialized compositions only.                                                                                    |
| Raw loader `startTime` / `endTime` | `state="loading"`, `preset="compactLoader"`, or built-in sequence | Raw timing is calibration-only.                                                                                                            |
| Custom onboarding timers           | Typed sequence                                                    | Replace consumer `setTimeout` and CSS fades.                                                                                               |
| Legacy login-page timing           | `razorSenseLoginToDashboardJourney`                               | Use live source/destination foreground slots.                                                                                              |
| `RazorSenseGradient` overlay       | Specialized Spark Animation compatibility pattern                 | Keep only when the authored two-layer composition is required.                                                                             |
| Raw shader uniforms                | Legacy compatibility path                                         | Do not migrate normal product state to raw controls.                                                                                       |

Legacy props remain supported for calibrated use cases, but they are intentionally excluded from normal state, sequence, and agent recipes. No removal date is declared for `mode` or the raw renderer. `circleSlideUp` is a legacy product-facing name: use `preset="success"` in new code. Compatibility support does not make a legacy API appropriate for new product work.

### Repository occurrence audit

| Existing occurrence                                                       | Product meaning                                                                | Disposition                                                                                                        |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `RazorSense.stories.tsx` Default, Default Paused, Zoomed, and Bottom Wave | Ambient, calibration pause, thinking close-up, and typing/bottom-edge material | Retained for compatibility; normal recipes use `idle`, `thinking`, `isPaused`, and managed `bottomWave`.           |
| `RazorSense.stories.tsx` Rzp Glass Success Animation                      | Existing success-circle composition plus independently animated UI             | Use managed `preset="success"`; any retained raw composition belongs under legacy/internal calibration.            |
| `RazorSense.stories.tsx` Ripple Wave Animation                            | Ripple material plus a separately animated Ray mark                            | Use managed `preset="rippleWave"`; retain the two-layer version only as the Spark Animation compatibility pattern. |
| `RazorSense.stories.tsx` Onboarding Playback Controls                     | Multi-phase authored playback                                                  | Replace product timers and source seeking with a typed sequence. Raw controls remain useful only for calibration.  |
| `RazorSense.stories.tsx` Tweakpane Playground                             | Shader calibration                                                             | Internal calibration path; never a product recipe.                                                                 |
| `RazorSense.stories.tsx` Login Page                                       | Login material and transition into application UI                              | Use `razorSenseLoginToDashboardJourney` for the supplied authored journey.                                         |
| `RazorSenseModes.stories.tsx`, fallback exporter, and performance stories | Visual calibration, fallback generation, and resource measurement              | Internal verification surfaces; compatibility `mode` is acceptable there.                                          |
| `RazorSenseGradient` and the Spark Animation MCP pattern                  | Masked gradient icon over branded material                                     | Retained specialized composition; it does not replace semantic state or managed status UI.                         |

The repository contains no separate product-package integration of RazorSense outside the Spark implementation, stories, scripts, and MCP knowledge at this audit point. Migration therefore focuses on the public contract, examples, and agent guidance rather than silently rewriting unrelated application code.

## Common mistakes and visual misuse

- Mounting one RazorSense per chat message.
- Restarting `typing` for every keystroke.
- Using `success` for every minor successful action.
- Treating `thinking` and `working` as interchangeable decoration.
- Using RazorSense as the only product status.
- Wrapping RazorSense in manual CSS opacity transitions.
- Coordinating states with `setTimeout`, manual video seeking, or shader uniform interpolation.
- Passing raw shader props for a normal semantic state.
- Eagerly mounting every sequence step or preloading every mode.
- Using an infinite loop where the authored source is one-shot.
- Forgetting dark, mobile-web, and reduced-motion verification.
- Waiting for animation before completing authentication, navigation, API work, or other business state.
- Embedding live material inside dense repeated rows.

## Debugging

### The visual does not replay

Changing to the same target is idempotent. Change `replayKey`, `runId`, or issue a new controller command.

### A queue never starts

Check for an active `loop` or `advance: 'manual'` step. Call `advance()`, `finishAtBoundary()`, or cancel the blocking command.

### `completed` never resolves

This is expected for an unbounded loop. Await `ready` or `transitioned`, then finish or cancel at the real product boundary.

### The first frame flashes or appears blank

Remove consumer opacity transitions and placeholder swaps. Preload only the probable next source. Verify the component has a non-zero container and that its `BladeProvider` appearance is stable through hydration.

### The wrong light/dark material appears

Do not pass custom appearance state. Confirm the nearest `BladeProvider` and pass the expected appearance to `preloadRazorSenseTarget` when the next target and appearance are known.

### Motion does not run

Inspect `prefers-reduced-motion`, page visibility, viewport intersection, `isPaused`, and shared-runtime admission. A still can be correct behavior.

### A preset rejects playback

`success` and `audioWave` are one-shot. `bottomWave` and `compactLoader` are finite-only. Use the TypeScript-correlated target/playback props instead of casting.

### A controller throws a sequence mismatch

`useRazorSenseSequenceController(sequence)` is bound to one frozen sequence ID and fingerprint. Create a controller for the new definition instead of mutating or reusing it.

### A renderer or asset fails

Handle `onError` and controller `error` events. Check `RazorSenseError.code`, `recoverable`, target, occurrence, and renderer metadata. Blade preserves or falls back to registered output; product recovery and status copy remain application-owned.

## Source boundaries

Verified implementation details in this guide come from:

- `razorSenseMotionTypes.ts`
- `razorSensePrograms.ts`
- `RazorSense.web.tsx`
- `RazorSenseSequence.web.tsx`
- `RazorSenseController.ts`
- `RazorSensePresentationHost.web.tsx`
- `RazorSenseRuntime.ts`
- `RazorSensePreloadBroker.ts`
- `razorSenseBuiltInSequences.ts`

The intended visual behavior comes from the supplied reference films, the [RazorSense design-language site](https://razorpay.com/razorsense/#design-language), and the timestamped local motion reference. Where a source seam or product meaning was not directly verified, this guide labels the statement as guidance instead of claiming exact fidelity.
