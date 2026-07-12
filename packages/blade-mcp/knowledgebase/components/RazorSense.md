## Component Name

RazorSense

## Description

RazorSense is Blade's declarative visual state system for expressive product moments. Product code declares semantic intent such as `typing`, `thinking`, `working`, `success`, `caution`, or `regret`, or selects a durable branded preset. Blade owns renderer selection, source readiness, exact-frame retention, transitions, playback, interruption, cleanup, appearance, reduced motion, and fallback output.

This is the canonical component document. Fetch the **RazorSense Journeys** pattern for full AI chat, login-to-dashboard, loading, ripple, bottom-wave, success, caution, and recovery recipes. The `mode` API, legacy preset names, and raw shader controls remain documented below only for compatibility and internal calibration.

## Three-minute quick start

Use one stable instance for one meaningful product surface. Change `state` when product truth changes.

```tsx
import { RazorSense } from '@razorpay/blade/components';

<RazorSense
  state={agentState}
  width="100%"
  height="320px"
  accessibilityLabel="Assistant activity"
/>;
```

`playback="automatic"` and `transition="automatic"` are implicit. A controlled state change uses replacement semantics: the newest state wins, and the current exact frame remains visible until the incoming target is ready.

Replay the same finite target by changing `replayKey`; do not remount the host.

```tsx
<RazorSense state="success" replayKey={successfulAttemptId} playback="once" endBehavior="hold" />
```

## Choose the right API

| Product need                                                        | API                                                          |
| ------------------------------------------------------------------- | ------------------------------------------------------------ |
| Existing application state determines the visual                    | One controlled `<RazorSense state={state} />`.               |
| Reusable linear choreography                                        | `defineRazorSenseSequence` and `<RazorSenseSequence>`.       |
| Awaitable readiness, cancellation, queueing, or event-driven replay | One `useRazorSenseController` bound to one host.             |
| A loop in a sequence waits for a real product event                 | `useRazorSenseSequenceController(sequence)` and `advance()`. |
| A specific durable composition is required                          | A branded `preset`, not a semantic-state alias.              |
| Existing calibrated shader or old preset                            | Compatibility surface below; never a normal state recipe.    |

Business branching, authentication, navigation, API completion, status copy, focus, and recovery remain application-owned. A public statechart is intentionally not part of RazorSense; application statecharts drive controlled `state`.

## Semantic states and branded presets

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
```

- `idle`: resting or ready surface.
- `typing`: focus or composition intent; never restart it per keystroke.
- `thinking`: internal deliberation.
- `working`: active execution, streaming, or tool use.
- `loading`: bounded preparation. Request a loop only for a genuinely indefinite wait.
- `state="success"`: meaningful completion, not every minor successful action.
- `caution`: recoverable attention or confirmation.
- `regret`: failed, reversed, or unavailable outcome with recovery UI.
- `rippleWave` and `bottomWave`: durable branded wave compositions.
- `preset="success"`: the existing branded success-circle composition, distinct from semantic `state="success"`.
- `compactLoader`: finite compact loading mark.
- `audioWave`: finite authored audio-wave gesture.

## Transitions, playback, and interruption

```ts
type RazorSenseTransition = 'automatic' | 'cut' | { duration: DurationString };
type RazorSensePlayback = 'automatic' | 'once' | 'repeat' | 'loop';
type RazorSenseEndBehavior = 'hold' | 'reset-to-start';
type RazorSenseInterruptionPolicy = 'replace' | 'queue' | 'finish-current';
```

- Prefer `automatic`. `cut` still waits for incoming readiness. A duration token changes only the registered edge duration, not its easing or renderer strategy.
- `repeatCount` is the number of additional iterations after the first.
- A loop has no natural completion. Finish, advance, replace, or cancel it at a real product boundary.
- `success` and `audioWave` presets are once-only. `bottomWave` and `compactLoader` are finite-only.
- `replace` makes newest truth win. `queue` appends. `finish-current` starts the newest pending request at the nearest registered safe boundary.
- Do not add opacity wrappers, media seeking, shader interpolation, or cleanup timers around RazorSense.

## Sequences and controller

```tsx
const setupJourney = defineRazorSenseSequence({
  id: 'merchant.setup.v1',
  steps: [
    { id: 'connect', preset: 'compactLoader', playback: 'once' },
    { id: 'verify', state: 'working', playback: 'loop', advance: 'manual' },
    { id: 'finish', state: 'success', playback: 'once' },
  ],
  endBehavior: 'hold',
});

const controller = useRazorSenseSequenceController(setupJourney);

<RazorSenseSequence sequence={setupJourney} controller={controller} runId={attemptId} />;
```

Sequence definitions have stable IDs, unique step IDs, and immutable content. `runId` distinguishes executions. Finite steps advance on completion by default. Loop steps require `advance="manual"` and cannot declare `holdAfterMs`. Keep branching outside the sequence.

Standalone controller commands expose named milestones rather than being thenable:

```tsx
const controller = useRazorSenseController({ initialState: 'idle' });
const command = controller.play(
  { state: 'thinking' },
  { playback: 'loop', interruptionPolicy: 'replace' },
);

await command.ready;
await command.transitioned;
await command.finishAtBoundary();

return <RazorSense controller={controller} />;
```

One controller drives exactly one mounted host. Do not pass controlled target, playback, transition, replay, or pause props alongside `controller`.

## Appearance, lifecycle, accessibility, and preload

- Appearance comes only from the nearest `BladeProvider`; semantic states, `compactLoader`, and `bottomWave` have calibrated dark output. Other branded footage without a verified dark source remains appearance-invariant; never use CSS inversion.
- Responsive mobile web uses registered portrait sources and crops. React Native motion orchestration is unsupported in this release.
- Server output is the registered responsive representative `<picture>`. Media, WebGL, observers, and clocks start after hydration. Keep provider appearance, initial target, replay identity, sequence ID, and run ID hydration-stable.
- Blade honors `prefers-reduced-motion`; finite work presents a calibrated still and loops wait for external advance.
- Hidden, offscreen, paused, and runtime-denied instances stop active scheduling.
- RazorSense is decorative by default. `accessibilityLabel` names meaningful material but never replaces visible copy, progress, status, alert, or recovery UI.
- Prefer one instance per meaningful surface. Never mount one per chat message or dense row.

Preload only one probable next target without mounting it:

```tsx
await preloadRazorSenseTarget({ state: 'thinking' });
await preloadRazorSenseTarget({ state: 'thinking' }, undefined, 'dark');
await preloadRazorSenseTarget({ preset: 'success' });
```

## Managed compatibility map

| Compatibility input                                    | Canonical product input                                          |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| `<RazorSense />`, `preset="default"`, `mode="neutral"` | `state="idle"`                                                   |
| `preset="zoomed"`, `mode="thinking"`                   | `state="thinking"`                                               |
| `mode="typing"`                                        | `state="typing"`                                                 |
| `mode="loading"`                                       | `state="loading"`                                                |
| `mode="calm"`                                          | `state="working"`                                                |
| `mode="joyful"`                                        | `state="success"`                                                |
| `mode="caution"`, `mode="regret"`                      | Same-named semantic states                                       |
| `preset="circleSlideUp"`                               | `preset="success"`                                               |
| Raw loader time ranges                                 | `state="loading"`, `preset="compactLoader"`, or a typed sequence |
| `preset="legacy"` or raw shader props                  | Compatibility/internal calibration only                          |

No removal date is declared for `mode` or the raw renderer. `circleSlideUp` is a legacy product-facing name and new code uses `preset="success"`. Compatibility support is not permission for agents to generate raw shader controls for normal product state.

## Legacy calibration constraints

- `videoSrc` and `imageSrc` are mutually exclusive — when `imageSrc` is provided, the video is not created.
- Changing `gradientMapSrc` or `gradientMap2Src` re-initializes the WebGL context.
- Prefer the declarative `state` API for new product work. Use `mode` and legacy shader props only for compatibility or internal calibration.
- `preloadRazorSenseModeAssets(modeOrModes, assetsPath?, colorScheme?)` preloads one or more semantic programs. It defaults to `neutral` and `light`; pass `dark` when preloading operational or mobile dark composites.
- `preloadRazorSenseAssets(preset)` remains the preload helper for legacy presets.
- Supplying both `mode` and `preset` is invalid intent: `mode` wins and Blade warns in development.
- The component only works on **web** (requires WebGL).
- `edgeFeather` values range from 0 (no feather) to higher values for more aggressive feathering: `[top, right, bottom, left]`.
- `backgroundColor` uses RGB in the `[0-1, 0-1, 0-1]` range — not hex or CSS colors.
- Props always take priority over preset values.

## Legacy compatibility TypeScript reference

The following types describe the older mode/raw surface retained for existing calibrated integrations. They are not the complete declarative `RazorSenseProps` union and must not be used as the new product API reference.

```typescript
type RazorSensePreset =
  | 'default'
  | 'zoomed'
  | 'bottomWave'
  | 'rippleWave'
  | 'circleSlideUp'
  | 'legacy';

type RazorSenseMode =
  | 'neutral'
  | 'typing'
  | 'thinking'
  | 'loading'
  | 'calm'
  | 'joyful'
  | 'caution'
  | 'regret';

type LegacyRazorSenseProps = {
  mode?: never;
  /** CSS width (default: '100%') */
  width?: string | number;
  /** CSS height (default: '100%') */
  height?: string | number;
  /**
   * Named preset that provides a base configuration.
   * Any explicit props override the preset values.
   * - 'default'       — authored Neutral unless shader-tuning props are supplied
   * - 'zoomed'        — authored Thinking unless shader-tuning props are supplied
   * - 'bottomWave'    — exact finite 10-second bottom-wave source
   * - 'rippleWave'    — ray pulse video, ripple effect
   * - 'circleSlideUp' — success circle animation
   * - 'legacy'        — original configurable default shader
   */
  preset?: RazorSensePreset;
  /** Base CDN path for loading default assets */
  assetsPath?: string;

  // --- Asset Customization ---
  /** URL to a custom legacy source video. Passing it selects the legacy renderer. */
  videoSrc?: string;
  /** URL to a static image to use as the base texture instead of video */
  imageSrc?: string;
  /** URL to the gradient map image for colorama effect */
  gradientMapSrc?: string;
  /** URL to a second gradient map for cross-fading via gradientMapBlend */
  gradientMap2Src?: string;
  /** URL to the legacy center-element gradient map */
  centerGradientMapSrc?: string;
  /** Canvas element for runtime gradient map hot-swap without reinitializing WebGL */
  gradientMapCanvas?: HTMLCanvasElement | null;

  // --- Playback ---
  /** Whether video is paused (default: false) */
  paused?: boolean;
  /** Video start time in seconds (default: 0) */
  startTime?: number;
  /** Video end time in seconds (default: 14) */
  endTime?: number;
  /** Video playback rate multiplier (default: 1.0) */
  playbackRate?: number;
  /** Animate light effect independently of video (default: false) */
  animateLightIndependently?: boolean;

  // --- Effect Toggles ---
  /** Enable displacement effect (default: true) */
  enableDisplacement?: boolean;
  /** Enable colorama effect (default: true) */
  enableColorama?: boolean;
  /** Enable bloom effect (default: true) */
  enableBloom?: boolean;
  /** Enable light sweep effect (default: true) */
  enableLightSweep?: boolean;
  /** Toggle center element (default: true) */
  enableCenterElement?: boolean;

  // --- Zoom & Pan ---
  /** Zoom level — 1.0 = normal, 2.0 = 2x zoom (default: 1.0) */
  zoom?: number;
  /** Horizontal pan offset -1 to 1 (default: 0.0) */
  panX?: number;
  /** Vertical pan offset -1 to 1 (default: 0.0) */
  panY?: number;
  /** Per-side edge feathering [top, right, bottom, left] (default: [0,0,0,0]) */
  edgeFeather?: [number, number, number, number];

  // --- Colorama ---
  /** Input range min (default: 0.0) */
  inputMin?: number;
  /** Input range max (default: 1.0) */
  inputMax?: number;
  /** Gamma curve: <1 = brights, >1 = darks (default: 1.05) */
  modifyGamma?: number;
  /** 0 = off, >0 = number of discrete posterization steps (default: 0.0) */
  posterizeLevels?: number;
  /** Stretch/compress the gradient index (default: 1.0) */
  cycleRepetitions?: number;
  /** Static phase offset (default: 0.0) */
  phaseShift?: number;
  /** Cycling animation speed (default: 0.0) */
  cycleSpeed?: number;
  /** false = clamp, true = wrap/fract (default: false) */
  wrapMode?: boolean;
  /** false = normal, true = reverse gradient (default: true) */
  reverse?: boolean;
  /** 0 = full effect, 1 = original (default: 0.0) */
  blendWithOriginal?: number;
  /** Cross-fade between gradientMapSrc and gradientMap2Src (default: 0.0) */
  gradientMapBlend?: number;
  /** Duration of gradientMapBlend transition in seconds (default: 0.6) */
  gradientMapBlendDuration?: number;

  // --- Displacement ---
  /** Number of glass slits (default: 45.0) */
  numSegments?: number;
  /** Angle of slits in radians (default: 0.15) */
  slitAngle?: number;
  /** X displacement in pixels (default: -12.0) */
  displacementX?: number;
  /** Y displacement in pixels (default: -20.0) */
  displacementY?: number;

  // --- Color Correction ---
  /** Levels black point (default: 0.0) */
  ccBlackPoint?: number;
  /** Levels white point (default: 0.9) */
  ccWhitePoint?: number;
  /** Midtone gamma (default: 1.2) */
  ccMidtoneGamma?: number;
  /** Output gamma (default: 1.2) */
  ccGamma?: number;
  /** Contrast boost (default: 0.0) */
  ccContrast?: number;

  // --- Light Effect ---
  /** Strength of light sweep effect (default: 0.2) */
  lightIntensity?: number;
  /** Frame when light effect starts (default: 140) */
  lightStartFrame?: number;

  // --- Center Element ---
  /** Duration of center element animation cycle in seconds (default: 6.0) */
  centerAnimDuration?: number;

  // --- Canvas ---
  /** Target aspect ratio width/height for cover behavior (default: 3/2) */
  aspectRatio?: number;

  // --- Background ---
  /** Background color RGB [0-1, 0-1, 0-1] to blend bright areas with */
  backgroundColor?: [number, number, number];

  // --- Cycle Animation ---
  /** Whether to animate cycle repetitions (default: true) */
  animateCycleReps?: boolean;
  /** Starting value for cycle repetitions animation (default: 1.0) */
  cycleRepetitionsStart?: number;
  /** Ending value for cycle repetitions animation (default: 1.15) */
  cycleRepetitionsEnd?: number;
  /** Frame when cycle repetitions animation starts (default: 0) */
  cycleRepetitionsStartFrame?: number;
  /** Duration of cycle repetitions animation in frames (default: 140) */
  cycleRepetitionsDuration?: number;

  // --- Callbacks ---
  /** Called when assets are loaded */
  onLoad?: () => void;
  /** Called on error */
  onError?: (error: Error) => void;

  className?: string;
  style?: React.CSSProperties;
};

type SemanticRazorSenseProps = Pick<
  LegacyRazorSenseProps,
  | 'width'
  | 'height'
  | 'assetsPath'
  | 'paused'
  | 'startTime'
  | 'endTime'
  | 'playbackRate'
  | 'onLoad'
  | 'onError'
  | 'className'
  | 'style'
> & {
  mode: RazorSenseMode;
  preset?: never;
  /** Crossfade duration (default: 0.4 operational, 1 emotional) */
  modeTransitionDuration?: number;
  /** Delayed responsive trail in emotional desktop modes (default: true) */
  interactive?: boolean;
};

type RazorSenseProps = LegacyRazorSenseProps | SemanticRazorSenseProps;
```

## Legacy compatibility guidance

**Do**

- Use `RazorSense` for immersive, branded visual moments: success screens, hero sections, login pages, and loading states.
- Use declarative states for product meaning. Compatibility modes map `neutral`, `typing`, `thinking`, `loading`, `calm`, `joyful`, `caution`, and `regret` to `idle`, `typing`, `thinking`, `loading`, `working`, `success`, `caution`, and `regret`.
- Trigger `typing` on focus or typing intent, before the first glyph; do not reset the surrounding UI animation phase per keystroke.
- Use managed branded presets for durable compositions. Prefer `preset="success"` over the legacy `circleSlideUp` name.
- Let RazorSense inherit appearance from the nearest `BladeProvider`; do not create a parallel component-level theme state.
- Call `preloadRazorSenseTarget(target, assetsPath?, colorScheme?)` for a probable next semantic or branded target.
- Keep `preloadRazorSenseModeAssets` and `preloadRazorSenseAssets` only for existing mode and legacy-preset integrations.
- Use `edgeFeather` for vignetting when overlaying text or UI on top of the animation.
- Layer `RazorSenseGradient` on top only for the specialized Spark Animation compatibility pattern.

**Don't**

- Don't use `RazorSense` on React Native — it requires WebGL and is web-only.
- Don't pass both `mode` and `preset`; they describe different rendering APIs.
- Don't provide both `videoSrc` and `imageSrc` simultaneously — they are mutually exclusive.
- Don't rapidly change `gradientMapSrc`/`gradientMap2Src` — these re-initialize WebGL and cause flicker.
- Don't set extremely high `numSegments` — it causes performance degradation.
- Don't use `RazorSense` for simple transitions or button feedback — use standard CSS/framer-motion animations for lightweight effects.
- Don't pass hex/CSS colors to `backgroundColor` — it expects normalized RGB `[0-1, 0-1, 0-1]`.

## Legacy and calibration examples

Here are examples demonstrating various ways to use the RazorSense component:

### Basic Usage

Renders the compatibility default, which maps to semantic `idle`. Prefer `state="idle"` in new code.

```jsx
import React from 'react';
import { RazorSense, Box } from '@razorpay/blade/components';

const DefaultExample = () => {
  return (
    <Box width="100%" height="100vh">
      <RazorSense width="100%" height="100%" />
    </Box>
  );
};

export default DefaultExample;
```

### Compatibility mode mapping

Existing `mode` integrations remain supported. New product code uses `state` and target-based preload.

```jsx
import React, { useEffect, useState } from 'react';
import { RazorSense, preloadRazorSenseTarget, Box } from '@razorpay/blade/components';

const SemanticExample = () => {
  const [state, setState] = useState('idle');

  useEffect(() => {
    void preloadRazorSenseTarget({ state: 'thinking' });
  }, []);

  return (
    <Box width="100%" height="440px">
      <RazorSense state={state} width="100%" height="100%" />
      <button onFocus={() => setState('typing')} onBlur={() => setState('idle')}>
        Start typing
      </button>
    </Box>
  );
};
```

### Dark Appearance

RazorSense follows BladeProvider automatically. Semantic states and `compactLoader` use the separately calibrated dark material: a wider centered aperture, localized chromatic emission, neutral silver echo rails, and charcoal negative space. `bottomWave` uses its authenticated, phase-matched dark master. `rippleWave`, branded `success`, and `audioWave` retain their supplied authored appearance because no verified dark source exists for those presets; do not fake one with CSS filters or inversion.

```jsx
import React, { useEffect } from 'react';
import {
  BladeProvider,
  RazorSense,
  preloadRazorSenseTarget,
  Box,
} from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';

const DarkRazorSense = () => {
  useEffect(() => {
    void preloadRazorSenseTarget({ state: 'thinking' }, undefined, 'dark');
  }, []);

  return (
    <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
      <Box width="100%" height="440px">
        <RazorSense state="thinking" width="100%" height="100%" />
      </Box>
    </BladeProvider>
  );
};
```

### Using Presets

Managed branded presets provide durable compositions. The `default`, `zoomed`, and `circleSlideUp` names shown in older code are compatibility aliases.

```jsx
import React from 'react';
import { RazorSense, Box } from '@razorpay/blade/components';

const PresetExamples = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      {/* Zoomed-in closeup — good for card/badge backgrounds */}
      <Box width="100%" height="400px">
        <RazorSense width="100%" height="100%" preset="zoomed" />
      </Box>

      {/* Bottom wave — decorative footer/header strip */}
      <Box width="100%" height="250px">
        <RazorSense
          width="100%"
          height="100%"
          preset="bottomWave"
          playback="once"
          endBehavior="hold"
        />
      </Box>

      {/* Ripple wave — pulsing ray animation */}
      <Box width="100%" height="100vh">
        <RazorSense width="100%" height="100%" preset="rippleWave" playback="loop" />
      </Box>
    </Box>
  );
};

export default PresetExamples;
```

### Paused Video with Independent Light Animation

Pauses the video at a specific frame while keeping the light sweep animating.

```jsx
import React from 'react';
import { RazorSense, Box } from '@razorpay/blade/components';

const PausedExample = () => {
  return (
    <Box width="100%" height="100vh">
      <RazorSense
        width="100%"
        height="100%"
        paused={true}
        startTime={8}
        animateLightIndependently={true}
        lightStartFrame={0}
      />
    </Box>
  );
};

export default PausedExample;
```

### Legacy success composition

The example below is retained only to explain the old raw composition. New product code uses `<RazorSense preset="success" playback="once" endBehavior="hold" />` and keeps result UI independent; it must not coordinate RazorSense opacity or completion with Framer Motion.

```jsx
import React, { useState, useEffect } from 'react';
import { m as motion } from 'framer-motion';
import {
  RazorSense,
  preloadRazorSenseAssets,
  Box,
  Heading,
  Text,
  Button,
  CheckIcon,
} from '@razorpay/blade/components';

const SuccessAnimation = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [assetsPreloaded, setAssetsPreloaded] = useState(false);

  useEffect(() => {
    preloadRazorSenseAssets('circleSlideUp')
      .then(() => setAssetsPreloaded(true))
      .catch((error) => console.error('Failed to preload:', error));
  }, []);

  if (!assetsPreloaded) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      backgroundColor="surface.background.gray.intense"
    >
      {/* Background shader animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ delay: isLoaded ? 0.5 : 0, duration: isLoaded ? 1.5 : 0.3 }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -45%)',
        }}
      >
        <RazorSense
          width="500px"
          height="800px"
          preset="circleSlideUp"
          edgeFeather={[0, 0, 0.2, 0]}
          onLoad={() => setIsLoaded(true)}
        />
      </motion.div>

      {/* Success card */}
      <Box position="relative" zIndex={100} padding="spacing.10" maxWidth="500px">
        <Box
          backgroundColor="feedback.background.positive.subtle"
          borderRadius="max"
          width="80px"
          height="80px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CheckIcon size="xlarge" color="feedback.icon.positive.intense" />
        </Box>
        <Heading size="large" textAlign="center">
          You're officially in!
        </Heading>
        <Button variant="primary" size="large" isFullWidth>
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default SuccessAnimation;
```
