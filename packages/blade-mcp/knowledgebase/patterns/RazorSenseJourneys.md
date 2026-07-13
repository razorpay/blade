## Pattern Name

RazorSense Journeys

## Description

RazorSense Journeys is the Blade pattern for connecting expressive material to real product state without consumer timers, media coordination, shader uniforms, or CSS crossfades. Use one stable RazorSense host for a surface, choose semantic states for product meaning, and use typed sequences only for reusable linear choreography.

This pattern reflects the implementation present on July 13, 2026. The choice of semantic meaning is **product guidance** derived from supplied RazorSense references; runtime behavior is verified in Blade's motion-state types and controller.

## Components and utilities

- `RazorSense`
- `RazorSenseSequence`
- `defineRazorSenseSequence`
- `useRazorSenseController`
- `useRazorSenseSequenceController`
- `razorSenseLoginToDashboardJourney`
- `razorSenseThreePhaseLoadingJourney`
- `preloadRazorSense`
- Blade status, progress, alert, text, and recovery components appropriate to the product flow

## Pattern selection

| Product shape                                          | Pattern                                        |
| ------------------------------------------------------ | ---------------------------------------------- |
| Business events determine the next state               | One controlled `<RazorSense state>` instance.  |
| The same finite choreography is reused across products | A typed `RazorSenseSequence`.                  |
| A loop waits for an external event                     | Manual sequence step plus sequence controller. |
| Code must await readiness or cancel work               | A bound standalone controller.                 |
| A specific branded composition is required             | A branded preset, not a semantic-state alias.  |

Do not create a sequence merely because several states appear over time. Chat remains controlled because reasoning, work, success, caution, and failure follow real events rather than authored wall-clock durations.

## Example

### AI chat journey

Use one material instance for the entire assistant surface.

```tsx
import { useState } from 'react';
import { Box, RazorSense, Text } from '@razorpay/blade/components';

type AgentState = 'idle' | 'typing' | 'thinking' | 'working' | 'success' | 'caution' | 'regret';

const [agentState, setAgentState] = useState<AgentState>('idle');
const [status, setStatus] = useState('Ready');

const startAgent = async (prompt: string): Promise<unknown> => ({});
const streamResult = async (run: unknown): Promise<void> => {};
const canRetry = (error: unknown): boolean => false;
const ChatSurface = (_props: { onSubmit: (prompt: string) => void }): null => null;

const submit = async (prompt: string) => {
  setAgentState('thinking');
  setStatus('Thinking');

  try {
    const run = await startAgent(prompt);
    setAgentState('working');
    setStatus('Working on your request');
    await streamResult(run);
    setAgentState('success');
    setStatus('Complete');
  } catch (error) {
    const recoverable = canRetry(error);
    setAgentState(recoverable ? 'caution' : 'regret');
    setStatus(recoverable ? 'Needs your attention' : 'Could not complete');
  }
};

<Box position="relative">
  <RazorSense state={agentState} accessibilityLabel="Assistant activity" />
  <Text>{status}</Text>
  <ChatSurface onSubmit={submit} />
</Box>;
```

Rules:

- `typing` begins on focus or composition intent, not each keystroke.
- `thinking` is internal deliberation; `working` is observable execution or streaming.
- A new request replaces obsolete visual work.
- Visible status and recovery UI carry meaning; RazorSense does not.
- Chat messages do not each mount their own instance.

### Interrupted AI chat

Application truth changes immediately; controlled replacement retains the outgoing exact frame until the new target is ready.

```tsx
const abortActiveRun = (): void => {};
const setAgentState = (_state: string): void => {};
const setStatus = (_status: string): void => {};

const stop = () => {
  abortActiveRun();
  setAgentState('idle');
  setStatus('Stopped');
};

export {};
```

Do not manually fade out `thinking`, seek a source, or wait for a loop seam before stopping business work. If the visual itself must finish at a boundary, use a controller command without delaying the abort.

### Login to dashboard

Use the built-in journey for the timestamp-aligned reconstruction of the supplied login reference. Authentication remains independent of decorative playback.

```tsx
import { RazorSenseSequence, razorSenseLoginToDashboardJourney } from '@razorpay/blade/components';

const loginAttemptId = 'attempt-1';
const LoginForm = (): null => null;
const Dashboard = (): null => null;
const reportVisualFailure = (error: unknown): void => {};

<RazorSenseSequence
  sequence={razorSenseLoginToDashboardJourney}
  runId={loginAttemptId}
  foreground={{
    source: <LoginForm />,
    destination: <Dashboard />,
  }}
  onEvent={(event) => {
    if (event.type === 'error') reportVisualFailure(event.error);
  }}
/>
```

Rules:

- Pass live Blade UI in both foreground slots.
- Do not screenshot or rasterize the form/dashboard in product code.
- Do not recreate aperture, cover, loader, or reveal timings with CSS.
- Navigate or complete authentication based on application state, not `onComplete`.
- Use a new `runId` for a new login attempt.

### Three-phase branded loading

```tsx
import { RazorSenseSequence, razorSenseThreePhaseLoadingJourney } from '@razorpay/blade/components';

const operationId = 'op-1';

<RazorSenseSequence sequence={razorSenseThreePhaseLoadingJourney} runId={operationId} />
```

Use this built-in sequence for the authored three-beat composition. If the phases represent actual variable-duration work, define a manual sequence or controlled product states driven by real progress events.

```tsx
import { defineRazorSenseSequence } from '@razorpay/blade/components';

const realProgressJourney = defineRazorSenseSequence({
  id: 'merchant.real-progress.v1',
  steps: [
    { id: 'connect', state: 'loading', playback: 'loop', advance: 'manual' },
    { id: 'verify', state: 'working', playback: 'loop', advance: 'manual' },
    { id: 'complete', state: 'success', playback: 'once' },
  ],
});
```

Call `advance()` from the corresponding progress event. Never substitute fixed timers for unknown network or tool duration.

### Ripple wave

```tsx
import { RazorSense } from '@razorpay/blade/components';

<RazorSense preset="rippleWave" playback="loop" />
```

Use on immersive branded loading or transition surfaces. Pair it with status UI. Do not use it as a compact spinner, table-cell indicator, or decorative background repeated across cards.

### Bottom wave

```tsx
import { RazorSense } from '@razorpay/blade/components';

<RazorSense preset="bottomWave" playback="once" endBehavior="hold" />
```

Use for the supplied exact 10-second, 25fps bottom-edge authored gesture. Keep it clipped to the intended surface. The public type permits `once` and `repeat`; loop is rejected until a verified seam exists.

### Success

Choose between semantic and branded success deliberately.

```tsx
import { RazorSense } from '@razorpay/blade/components';

<>
  {/* Expressive semantic material */}
  <RazorSense state="success" playback="once" endBehavior="hold" />

  {/* Existing success-circle composition */}
  <RazorSense preset="success" playback="once" endBehavior="hold" />
</>;
```

Reserve both for meaningful outcomes. Use ordinary Blade feedback for small saves, toggles, and low-salience confirmations.

### Caution and failure recovery

```tsx
import { RazorSense } from '@razorpay/blade/components';

const canRetry: boolean = true;

<RazorSense state={canRetry ? 'caution' : 'regret'} playback="once" endBehavior="hold" />
```

The surrounding UI must explain what happened and provide a recovery action. Do not infer recoverability from animation completion.

### Manual controller journey

Use a controller only when props cannot express the event relationship.

```tsx
import { useRazorSenseController, RazorSense } from '@razorpay/blade/components';

const runRealWork = async (): Promise<void> => {};

const razorSense = useRazorSenseController({ initialState: 'idle' });

const showWorking = async () => {
  const command = razorSense.play(
    { state: 'working' },
    { playback: 'loop', interruptionPolicy: 'replace' },
  );
  await command.ready;
  await command.transitioned;
  return command;
};

const command = await showWorking();
await runRealWork();
await command.finishAtBoundary();

<RazorSense controller={razorSense} />;
```

Do not use `completed` for an infinite loop. Do not bind one controller to multiple mounted hosts.

## Appearance and responsive composition

- RazorSense inherits light/dark from `BladeProvider`; never invent a local appearance prop.
- Verify light and dark for semantic states, `compactLoader`, and `bottomWave`, whose dark output is separately calibrated. Supplied branded footage without a verified dark source is intentionally appearance-invariant; never manufacture dark output with filters or inversion.
- Responsive mobile-web assets and crops are registered internally.
- React Native is unsupported; use a native-specific product pattern instead.
- Foreground content remains real Blade UI above the material.
- Server output is the registered responsive representative still. Keep appearance, initial target, replay identity, sequence ID, and run ID stable through hydration; do not insert a different placeholder on the client.

## Reduced motion and status

- Blade automatically selects calibrated still output for reduced motion.
- Do not force motion or write a second preference override.
- A finite step may complete with reason `reduced-motion`.
- An infinite loop becomes a still and waits for external advance.
- Keep visible text and assistive status updates independent of motion.
- Never announce iterations or move focus on visual completion.

## Preload recipe

Preload one probable next semantic or branded target, including a known next appearance, without mounting it.

```tsx
import { useEffect } from 'react';
import { preloadRazorSenseTarget } from '@razorpay/blade/components';

useEffect(() => {
  void preloadRazorSenseTarget({ state: 'thinking' });
}, []);

await preloadRazorSenseTarget({ state: 'thinking' }, undefined, 'dark');
await preloadRazorSenseTarget({ preset: 'success' });
```

`preloadRazorSenseTarget(target, assetsPath?, colorScheme?)` prepares the registered still and renderer source for a semantic state or branded preset. Do not preload every possible branch.

`preloadRazorSense` and `preloadRazorSenseModeAssets` remain compatibility helpers for mode integrations. `preloadRazorSenseAssets` remains the legacy-preset helper.

## Required agent checklist

Before generating a RazorSense integration, confirm:

1. There is one stable instance per meaningful surface.
2. The target is semantic state or branded preset for the intended meaning.
3. Business events, not timers, drive product transitions.
4. Playback is compatible with the target.
5. The same target replays with `replayKey` or a new controller occurrence.
6. Status remains visible and accessible without animation.
7. Light, dark, mobile web, and reduced motion are handled.
8. Only probable-next media is preloaded.
9. No CSS crossfade, video seeking, uniform interpolation, or renderer cleanup exists in consumer code.
10. Business completion does not await decorative completion.

## Prohibited generated patterns

```tsx
import { RazorSense } from '@razorpay/blade/components';

const messages: { state: 'idle' | 'typing' | 'thinking' | 'working' | 'loading' | 'success' | 'caution' | 'regret' }[] = [];
const state: string = 'idle';
const setState = (_s: string): void => {};
const motion = { div: (_props: { animate?: unknown; children?: unknown }): null => null };

function WrongPatterns() {
  // Wrong: one instance per row/message
  messages.map((message) => <RazorSense state={message.state} />);

  // Wrong: manual transition wrapper
  <motion.div animate={{ opacity: state === 'thinking' ? 1 : 0 }}>
    <RazorSense state="thinking" />
  </motion.div>;

  // Wrong: timer-driven product truth
  setTimeout(() => setState('success'), 2400);

  // Wrong: raw shader controls for a normal state
  <RazorSense numSegments={54} displacementX={-18} />;

  // Wrong: one-shot as infinite loop
  <RazorSense preset="audioWave" playback={'loop' as 'automatic'} />;

  return null;
}
```

Use controlled state, a validated sequence, or a controller instead.
