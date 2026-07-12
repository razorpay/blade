## Component Name

RazorSense

## Description

RazorSense is Blade's responsive glass material. Its semantic `mode` API covers authored operational states (`neutral`, `typing`, `thinking`, `loading`) and emotional states (`calm`, `joyful`, `caution`, `regret`). The operational programs preserve the launch-film flute, refraction, chromatic fringe, caustics, and bloom; emotional modes use the website's shared GPU flute field and exact palettes. RazorSense automatically follows the nearest `BladeProvider` light or dark color scheme; it does not expose a separate appearance prop. The older configurable WebGL renderer remains available through specialized presets and shader-tuning props.

## Important Constraints

- `videoSrc` and `imageSrc` are mutually exclusive — when `imageSrc` is provided, the video is not created.
- Changing `gradientMapSrc` or `gradientMap2Src` re-initializes the WebGL context.
- Prefer the semantic `mode` API for new product work. Use legacy shader props only for existing specialized effects.
- `preloadRazorSenseModeAssets(modeOrModes, assetsPath?, colorScheme?)` preloads one or more semantic programs. It defaults to `neutral` and `light`; pass `dark` when preloading operational or mobile dark composites.
- `preloadRazorSenseAssets(preset)` remains the preload helper for legacy presets.
- Supplying both `mode` and `preset` is invalid intent: `mode` wins and Blade warns in development.
- The component only works on **web** (requires WebGL).
- `edgeFeather` values range from 0 (no feather) to higher values for more aggressive feathering: `[top, right, bottom, left]`.
- `backgroundColor` uses RGB in the `[0-1, 0-1, 0-1]` range — not hex or CSS colors.
- Props always take priority over preset values.

## TypeScript Types

The following types represent the props that the RazorSense component accepts.

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
   * - 'bottomWave'    — authored Typing unless shader-tuning props are supplied
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

## Usage Guidelines

**Do**

- Use `RazorSense` for immersive, branded visual moments: success screens, hero sections, login pages, and loading states.
- Use semantic modes for product meaning: `neutral`, `typing`, `thinking`, `loading`, `calm`, `joyful`, `caution`, and `regret`.
- Trigger `typing` on focus or typing intent, before the first glyph; do not reset the surrounding UI animation phase per keystroke.
- Use presets only for compatibility or the specialized `rippleWave` and `circleSlideUp` effects.
- Let RazorSense inherit appearance from the nearest `BladeProvider`; do not create a parallel component-level theme state.
- Call `preloadRazorSenseModeAssets(modeOrModes, assetsPath?, colorScheme?)` before mounting latency-sensitive semantic states.
- Call `preloadRazorSenseAssets(preset)` before mounting to avoid visible frame skipping on first render.
- Use `edgeFeather` for vignetting when overlaying text or UI on top of the animation.
- Layer `RazorSenseGradient` on top as a foreground icon overlay for the full Spark Animation pattern.

**Don't**

- Don't use `RazorSense` on React Native — it requires WebGL and is web-only.
- Don't pass both `mode` and `preset`; they describe different rendering APIs.
- Don't provide both `videoSrc` and `imageSrc` simultaneously — they are mutually exclusive.
- Don't rapidly change `gradientMapSrc`/`gradientMap2Src` — these re-initialize WebGL and cause flicker.
- Don't set extremely high `numSegments` — it causes performance degradation.
- Don't use `RazorSense` for simple transitions or button feedback — use standard CSS/framer-motion animations for lightweight effects.
- Don't pass hex/CSS colors to `backgroundColor` — it expects normalized RGB `[0-1, 0-1, 0-1]`.

## Example

Here are examples demonstrating various ways to use the RazorSense component:

### Basic Usage

Renders the default glass refraction animation filling its container.

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

### Semantic States

Use `mode` for all new RazorSense product states.

```jsx
import React, { useEffect, useState } from 'react';
import { RazorSense, preloadRazorSenseModeAssets, Box } from '@razorpay/blade/components';

const SemanticExample = () => {
  const [mode, setMode] = useState('neutral');

  useEffect(() => {
    preloadRazorSenseModeAssets(['neutral', 'typing', 'thinking']);
  }, []);

  return (
    <Box width="100%" height="440px">
      <RazorSense mode={mode} width="100%" height="100%" />
      <button onFocus={() => setMode('typing')} onBlur={() => setMode('neutral')}>
        Start typing
      </button>
    </Box>
  );
};
```

### Dark Appearance

RazorSense follows BladeProvider automatically. The dark material uses a wider centered aperture, localized chromatic emission, neutral silver echo rails, and charcoal negative space calibrated from the launch film.

```jsx
import React, { useEffect } from 'react';
import {
  BladeProvider,
  RazorSense,
  preloadRazorSenseModeAssets,
  Box,
} from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';

const DarkRazorSense = () => {
  useEffect(() => {
    preloadRazorSenseModeAssets(['neutral', 'thinking'], undefined, 'dark');
  }, []);

  return (
    <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
      <Box width="100%" height="440px">
        <RazorSense mode="neutral" width="100%" height="100%" />
      </Box>
    </BladeProvider>
  );
};
```

### Using Presets

Presets provide ready-made configurations for common use cases.

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
        <RazorSense width="100%" height="100%" preset="bottomWave" />
      </Box>

      {/* Ripple wave — pulsing ray animation */}
      <Box width="100%" height="100vh">
        <RazorSense width="100%" height="100%" preset="rippleWave" />
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

### Success Animation with Preloading

Uses `preloadRazorSenseAssets` to preload assets before mounting, combined with a success UI card and framer-motion animations.

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
