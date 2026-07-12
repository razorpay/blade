# RazorSense Productization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship RazorSense as Blade's semantic, cross-surface AI material with progressive resource loading, bounded runtime cost, exact light and dark fidelity, executable recipes, and measurable browser performance.

**Architecture:** Keep one public `RazorSense` primitive. Route semantic, emotional, and legacy behavior internally; add a per-document runtime for visibility and admission; load only the active and transitioning assets; preserve exact output through frame snapshots and calibrated fallback stills. Compose RazorSense with existing Blade components in recipes instead of adding animation props to leaf components.

**Tech Stack:** React, TypeScript, Blade styled props and provider APIs, HTML video, WebGL 1, GLSL, `requestVideoFrameCallback`, Intersection Observer, Page Visibility, Media Capabilities, Storybook, Playwright with the installed system Chrome, AVFoundation for source metadata, Prettier, Jest only for small API and lifecycle checks.

---

## File map

### Create

- `packages/blade/src/components/Spark/RzpGlass/RazorSenseRuntime.ts`: one per-document lifecycle and admission registry.
- `packages/blade/src/components/Spark/RzpGlass/useRazorSenseLifecycle.ts`: React bridge from a container ref into the runtime.
- `packages/blade/src/components/Spark/RzpGlass/razorSenseAssets.ts`: versioned asset manifest, capability selection, still mapping, and preload cache.
- `packages/blade/src/components/Spark/RzpGlass/RazorSenseLegacy.tsx`: dynamically loaded legacy shader wrapper extracted from `RzpGlass.tsx`.
- `packages/blade/src/components/Spark/RzpGlass/RazorSenseFallback.tsx`: calibrated still and exact snapshot renderer.
- `packages/blade/src/components/Spark/RzpGlass/__tests__/RazorSense.web.test.tsx`: minimal routing, accessibility, and alias coverage.
- `packages/blade/src/components/Spark/RzpGlass/__tests__/RazorSenseRuntime.test.ts`: focused lifecycle and admission coverage.
- `packages/blade/src/components/Spark/RzpGlass/_decisions/decisions.md`: permanent API and usage decision record.
- `packages/blade/src/components/Spark/docs/RazorSenseRecipes.stories.tsx`: executable chat, thinking, response, loader, card, hero, and ambient recipes.
- `packages/blade/src/components/Spark/docs/RazorSensePerformance.stories.tsx`: single, multi-instance, offscreen, rapid-transition, reduced-motion, and failure fixtures.
- `packages/blade/src/components/Spark/docs/RazorSensePerformanceBaseline.md`: source-media and browser-runtime measurements before and after optimization.
- `packages/blade/src/components/Spark/docs/RazorSensePerformanceBaseline.before.json`: raw pre-optimization browser measurements.
- `packages/blade/src/components/Spark/docs/RazorSensePerformanceBaseline.after.json`: raw post-optimization browser measurements.
- `packages/blade/src/components/Spark/docs/RazorSenseFallbackExporter.stories.tsx`: deterministic fixed-phase fallback rendering surface.
- `packages/blade/scripts/exportRazorSenseFallbacks.mjs`: screenshots calibrated still assets with the installed Chrome.
- `packages/blade/scripts/exportRazorSenseVideoVariants.swift`: trims operational sources and exports H.264 and HEVC candidates without changing geometry, timing, or color intent.
- `packages/blade/scripts/razorsense-media-requirements.txt`: pinned local visual-verification dependencies.
- `packages/blade/scripts/verifyRazorSenseMedia.py`: calculates fixed-frame SSIM, PSNR, Delta E 2000, and edge displacement with Pillow, NumPy, and SciPy.
- `packages/blade/scripts/measureRazorSenseBundles.mjs`: reproducible esbuild and gzip measurement for the three renderer paths.
- `packages/blade/scripts/measureRazorSenseRuntime.mjs`: direct-iframe network, media, frame, RAF, and WebGL collector.
- `packages/blade/assets/spark/razorsense-stills/*.png`: 24 approved final-color fallback stills.
- `packages/blade/assets/spark/razorsense-modes/*-hevc.mp4`: optional high-efficiency emotional candidates.
- `packages/blade/assets/spark/razorsense-states/*-hevc.mp4`: optional high-efficiency operational candidates.

### Modify

- `packages/blade/src/components/Spark/RzpGlass/types.ts`: canonical semantic props, deprecated aliases, analytics, styled props, and preload options.
- `packages/blade/src/components/Spark/RzpGlass/RzpGlass.tsx`: deterministic router, semantic host, code splitting, exact snapshot bridge, and public attributes.
- `packages/blade/src/components/Spark/RzpGlass/RazorSenseAuthored.tsx`: current and incoming operational layers only, lifecycle pause, and exact snapshot capture.
- `packages/blade/src/components/Spark/RzpGlass/RazorSenseMood.tsx`: lifecycle and reduced-motion integration for desktop and mobile.
- `packages/blade/src/components/Spark/RzpGlass/RazorSenseMoodMount.ts`: on-demand mode textures, video-frame callbacks, active scheduling, capture, and intentional context loss.
- `packages/blade/src/components/Spark/RzpGlass/webgl-utils.ts`: allocate textures once and update existing storage.
- `packages/blade/src/components/Spark/RzpGlass/modes.ts`: remove URL construction and retain semantic labels, timings, and mode guards.
- `packages/blade/src/components/Spark/RzpGlass/utils.ts`: legacy-only utilities and compatibility preload aliases.
- `packages/blade/src/components/Spark/RzpGlass/utils.native.ts`: new semantic preload signature and explicit native boundary.
- `packages/blade/src/components/Spark/RzpGlass/index.ts`: new preload export and canonical types.
- `packages/blade/src/components/Spark/index.ts`: new preload export.
- `packages/blade/src/utils/metaAttribute/metaConstants.ts`: add the RazorSense component identifier.
- `packages/blade/src/@types/globals.d.ts`: declare the build-injected Blade package version.
- `packages/blade/rollup.config.mjs`: inject the current package version into every library build.
- `packages/blade/.storybook/react/main.ts`: inject the current package version into Storybook.
- `packages/blade/jest.web.config.js`: inject the current package version into focused source tests.
- `packages/blade/src/components/Spark/docs/RazorSenseVisualSpec.md`: runtime, fallback, and verification contract references.
- `packages/blade-mcp/knowledgebase/components/RazorSense.md`: canonical API and misuse boundaries.
- `packages/blade-mcp/knowledgebase/patterns/SparkAnimation.md`: semantic recipes instead of legacy-preset-first guidance.

### Delete

- `packages/blade/src/components/Spark/RzpGlass/PerformanceManager.ts`: GPU-name and adaptive-quality heuristics that violate the fixed full-quality contract.

## Task 0: Capture the current runtime baseline

**Files:**

- Create: `packages/blade/src/components/Spark/docs/RazorSensePerformance.stories.tsx`
- Create: `packages/blade/src/components/Spark/docs/RazorSensePerformanceBaseline.md`
- Create: `packages/blade/src/components/Spark/docs/RazorSensePerformanceBaseline.before.json`
- Create: `packages/blade/scripts/measureRazorSenseRuntime.mjs`

- [ ] **Step 1: Add fixed performance fixtures without changing production behavior**

Create direct stories for current Neutral, current Calm, four visible mixed instances, eight mounted instances with six below the fold, rapid operational changes, rapid emotional changes, light/dark provider changes, and a page-visibility fixture. Give each story a stable `data-razor-sense-scenario` id and expose only test controls that call existing public props.

- [ ] **Step 2: Implement the behavior-preserving collector**

Launch `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` through the workspace's Playwright package with a new temporary profile. Before application code runs, wrap `requestAnimationFrame`, `cancelAnimationFrame`, `HTMLMediaElement.play`, `HTMLMediaElement.pause`, `HTMLCanvasElement.getContext`, and `requestVideoFrameCallback`; each wrapper records calls and forwards the original receiver, arguments, and return value unchanged. Collect Resource Timing encoded bytes, response URLs, video playback quality, RAF intervals, long tasks, active playing media, acquired WebGL contexts, and rVFC lateness.

The script accepts exactly `--storybook-url`, `--output`, and `--label`. It runs three uncached reloads for network, then five frame runs with a two-second warm-up and ten-second sample. It records commit, dirty status, Chrome version, macOS version, viewport, DPR, and cache condition. It writes raw JSON to `RazorSensePerformanceBaseline.{label}.json` beside the Markdown file and replaces only the matching generated table between stable markers.

- [ ] **Step 3: Capture and commit the current baseline before production edits**

Run:

```bash
cd packages/blade
node scripts/measureRazorSenseRuntime.mjs \
  --storybook-url http://localhost:9009 \
  --output src/components/Spark/docs/RazorSensePerformanceBaseline.md \
  --label before
```

Record failures as measured limitations; do not edit production RazorSense to improve this run.

```bash
git add packages/blade/src/components/Spark/docs/RazorSensePerformance.stories.tsx \
  packages/blade/src/components/Spark/docs/RazorSensePerformanceBaseline.md \
  packages/blade/src/components/Spark/docs/RazorSensePerformanceBaseline.before.json \
  packages/blade/scripts/measureRazorSenseRuntime.mjs
git commit -m "perf(blade): record RazorSense baseline"
```

## Task 1: Canonical API, deterministic routing, and accessibility

**Files:**

- Modify: `packages/blade/src/components/Spark/RzpGlass/types.ts`
- Modify: `packages/blade/src/components/Spark/RzpGlass/RzpGlass.tsx`
- Modify: `packages/blade/src/components/Spark/RzpGlass/RazorSenseAuthored.tsx`
- Modify: `packages/blade/src/components/Spark/RzpGlass/RazorSenseMood.tsx`
- Modify: `packages/blade/src/utils/metaAttribute/metaConstants.ts`
- Create: `packages/blade/src/components/Spark/RzpGlass/__tests__/RazorSense.web.test.tsx`

- [ ] **Step 1: Add the minimal routing and accessibility test**

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { bladeTheme } from '~tokens/theme';
import { BladeProvider } from '~components/BladeProvider';
import { RazorSense } from '../index';

const renderRazorSense = (props: React.ComponentProps<typeof RazorSense>): void => {
  render(
    <BladeProvider themeTokens={bladeTheme} colorScheme="light">
      <RazorSense width="320px" height="180px" {...props} />
    </BladeProvider>,
  );
};

describe('RazorSense semantic API', () => {
  it('uses semantic Neutral when mode is omitted', () => {
    renderRazorSense({ isPaused: true, testID: 'razorsense' });
    expect(screen.getByTestId('razorsense')).toHaveAttribute('data-razor-sense-mode', 'neutral');
  });

  it('is decorative unless accessibilityLabel is supplied', () => {
    renderRazorSense({ mode: 'thinking', isPaused: true, testID: 'decorative' });
    expect(screen.getByTestId('decorative')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('decorative')).not.toHaveAttribute('role');
  });

  it('uses the supplied accessibility label', () => {
    renderRazorSense({
      mode: 'thinking',
      isPaused: true,
      accessibilityLabel: 'Agent is thinking',
    });
    expect(screen.getByRole('img', { name: 'Agent is thinking' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the focused test and confirm the new API fails**

Run:

```bash
cd packages/blade
SHARD=1/1 yarn test:react RazorSense.web --runInBand
```

Expected: TypeScript or runtime failure because `isPaused`, `accessibilityLabel`, analytics attributes, and omitted-mode semantic routing are not implemented.

- [ ] **Step 3: Define the canonical and compatibility types**

Add these imports and types in `types.ts`, retaining all existing legacy configuration types:

```ts
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { ColorSchemeNames } from '~tokens/theme';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type RazorSenseSemanticControls = {
  mode?: RazorSenseMode;
  isPaused?: boolean;
  isInteractive?: boolean;
  accessibilityLabel?: string;
  modeTransitionDuration?: number;
  paused?: boolean;
  interactive?: boolean;
  startTime?: number;
  endTime?: number;
  playbackRate?: number;
};

type SemanticRazorSenseProps = RzpGlassCommonProps &
  StyledPropsBlade &
  TestID &
  DataAnalyticsAttribute &
  RazorSenseSemanticControls & {
    preset?: never;
  };

type PreloadRazorSenseOptions = {
  modes: RazorSenseMode | readonly RazorSenseMode[];
  colorSchemes?: ColorSchemeNames | readonly ColorSchemeNames[];
  assetsPath?: string;
};
```

Keep `width`, `height`, `className`, `style`, `assetsPath`, `onLoad`, and `onError` in `RzpGlassCommonProps`. Export `PreloadRazorSenseOptions`.

- [ ] **Step 4: Implement deterministic routing**

Add these helpers in `RzpGlass.tsx`:

```ts
const CANONICAL_SEMANTIC_KEYS = new Set([
  'isPaused',
  'isInteractive',
  'accessibilityLabel',
  'modeTransitionDuration',
]);
const LEGACY_ONLY_PRESETS = new Set(['rippleWave', 'circleSlideUp', 'legacy']);

const hasCanonicalSemanticSignal = (props: RzpGlassProps): boolean =>
  props.mode !== undefined ||
  Object.entries(props).some(
    ([key, value]) => value !== undefined && CANONICAL_SEMANTIC_KEYS.has(key),
  );

const hasLegacyRendererSignal = (props: RzpGlassProps): boolean =>
  (props.preset !== undefined && LEGACY_ONLY_PRESETS.has(props.preset)) ||
  Object.entries(props).some(
    ([key, value]) => value !== undefined && RAW_LEGACY_RENDERER_KEYS.has(key),
  );

const shouldUseSemanticRenderer = (props: RzpGlassProps): boolean => {
  if (hasCanonicalSemanticSignal(props)) return true;
  if (getImplicitAuthoredMode(props as LegacyRzpGlassProps) !== undefined) return true;
  return !hasLegacyRendererSignal(props);
};

const getSemanticMode = (props: RzpGlassProps): RazorSenseMode => {
  if (props.mode !== undefined) return props.mode;
  return getImplicitAuthoredMode(props as LegacyRzpGlassProps) ?? 'neutral';
};
```

Define `RAW_LEGACY_RENDERER_KEYS` once beside the legacy configuration contract and include every shader uniform, raw asset key, `gradientMapCanvas`, and legacy effect toggle. Exclude the supported semantic compatibility controls `paused`, `interactive`, `startTime`, `endTime`, and `playbackRate`. This makes no-prop usage and alias-only usage resolve to semantic Neutral, while raw shader/assets and the three legacy-only presets resolve to the compatibility renderer.

Route with `shouldUseSemanticRenderer(props)` instead of `if (props.mode)`. Resolve aliases with canonical precedence:

```ts
const paused = props.isPaused ?? props.paused ?? false;
const interactive = props.isInteractive ?? props.interactive ?? true;
```

When canonical semantic signals and legacy renderer signals are both present at runtime JavaScript, render the semantic path, ignore the legacy controls, and emit one development warning that lists the ignored keys.

- [ ] **Step 5: Apply Blade public-component attributes and accessibility once at the semantic host**

Add `MetaConstants.RazorSense = 'razorsense'`. Apply these attributes to the semantic host container, not to every renderer layer:

```tsx
const accessibilityProps = accessibilityLabel
  ? { role: 'img', 'aria-label': accessibilityLabel }
  : { 'aria-hidden': true };

<BaseBox
  {...accessibilityProps}
  {...metaAttribute({ name: MetaConstants.RazorSense, testID })}
  {...makeAnalyticsAttribute(rest)}
  {...getStyledProps(rest)}
  data-razor-sense-mode={mode}
  data-razor-sense-color-scheme={colorScheme}
  width={width}
  height={height}
  position="relative"
  overflow="hidden"
  className={className}
  style={{ ...containerStyle, ...style }}
>
  {renderer}
</BaseBox>;
```

Remove generated `role="img"` and labels from `RazorSenseAuthored`, `DesktopRazorSenseMood`, `MobileRazorSenseMood`, and the unresolved mobile placeholder.

- [ ] **Step 6: Run focused validation**

Run:

```bash
cd packages/blade
SHARD=1/1 yarn test:react RazorSense.web --runInBand
yarn typecheck
```

Expected: RazorSense test passes. Typecheck may still report the already-known unrelated ActionList, BaseMotion, and Preview failures; record exact output and confirm no new Spark or RazorSense error.

- [ ] **Step 7: Commit the API slice**

```bash
git add packages/blade/src/components/Spark/RzpGlass/types.ts \
  packages/blade/src/components/Spark/RzpGlass/RzpGlass.tsx \
  packages/blade/src/components/Spark/RzpGlass/RazorSenseAuthored.tsx \
  packages/blade/src/components/Spark/RzpGlass/RazorSenseMood.tsx \
  packages/blade/src/components/Spark/RzpGlass/__tests__/RazorSense.web.test.tsx \
  packages/blade/src/utils/metaAttribute/metaConstants.ts
git commit -m "feat(blade): stabilize RazorSense semantic API"
```

## Task 2: Versioned asset manifest, capability selection, and preload API

**Files:**

- Create: `packages/blade/src/components/Spark/RzpGlass/razorSenseAssets.ts`
- Modify: `packages/blade/src/components/Spark/RzpGlass/modes.ts`
- Modify: `packages/blade/src/components/Spark/RzpGlass/utils.ts`
- Modify: `packages/blade/src/components/Spark/RzpGlass/utils.native.ts`
- Modify: `packages/blade/src/components/Spark/RzpGlass/index.ts`
- Modify: `packages/blade/src/components/Spark/index.ts`
- Modify: `packages/blade/src/@types/globals.d.ts`
- Modify: `packages/blade/rollup.config.mjs`
- Modify: `packages/blade/.storybook/react/main.ts`
- Modify: `packages/blade/jest.web.config.js`

- [ ] **Step 1: Move URL construction into a typed manifest**

Create the following public-internal contract in `razorSenseAssets.ts`:

```ts
import type { ColorSchemeNames } from '~tokens/theme';
import type { RazorSenseMode } from './modes';

type RazorSenseViewport = 'desktop' | 'mobile';

type RazorSenseVideoSource = {
  file: string;
  type: string;
  codec: string;
  width: number;
  height: number;
  bitrate: number;
  framerate: number;
};

type RazorSenseAsset = {
  sources: readonly [RazorSenseVideoSource, ...RazorSenseVideoSource[]];
  fallbackSource: RazorSenseVideoSource;
  representativeFrameFile: string;
  representativePhase: number;
};

type RazorSenseAssetRequest = {
  assetsPath: string;
  mode: RazorSenseMode;
  colorScheme: ColorSchemeNames;
  viewport: RazorSenseViewport;
};
```

Populate the manifest from this measured H.264 source table. `codec` is `avc1` and `type` is `video/mp4` for every row. Set the existing H.264 MP4 entry as `fallbackSource` even when higher-efficiency candidates exist.

| File                                 | Width | Height | FPS | Bitrate bps |
| ------------------------------------ | ----: | -----: | --: | ----------: |
| `razorsense-loading-dark.mp4`        |  1920 |   1280 |  24 |     123,446 |
| `razorsense-loading.mp4`             |  1920 |   1280 |  24 |   3,280,996 |
| `razorsense-neutral-dark.mp4`        |  1920 |   1280 |  24 |   2,093,927 |
| `razorsense-neutral.mp4`             |  1920 |   1280 |  24 |  10,660,661 |
| `razorsense-thinking-dark.mp4`       |  1920 |   1280 |  24 |   4,492,532 |
| `razorsense-thinking.mp4`            |  1920 |   1280 |  24 |  11,052,569 |
| `razorsense-typing-dark.mp4`         |  1920 |   1080 |  25 |     585,649 |
| `razorsense-typing.mp4`              |  1920 |   1080 |  25 |   1,905,380 |
| `razorsense-calm-mobile-dark.mp4`    |   360 |    484 |  24 |     443,919 |
| `razorsense-calm-mobile.mp4`         |   360 |    484 |  24 |     175,513 |
| `razorsense-calm.mp4`                |  1364 |    440 |  24 |     870,025 |
| `razorsense-caution-mobile-dark.mp4` |   360 |    484 |  24 |     380,019 |
| `razorsense-caution-mobile.mp4`      |   360 |    484 |  24 |     162,291 |
| `razorsense-caution.mp4`             |  1364 |    440 |  30 |   6,352,596 |
| `razorsense-joyful-mobile-dark.mp4`  |   360 |    484 |  24 |     406,636 |
| `razorsense-joyful-mobile.mp4`       |   360 |    484 |  24 |     217,663 |
| `razorsense-joyful.mp4`              |  1364 |    440 |  30 |   1,719,441 |
| `razorsense-regret-mobile-dark.mp4`  |   360 |    484 |  24 |      68,357 |
| `razorsense-regret-mobile.mp4`       |   360 |    484 |  24 |     212,710 |
| `razorsense-regret.mp4`              |  1364 |    440 |  30 |   1,413,669 |

Add still filenames using this pattern:

```text
razorsense-stills/{viewport}-{colorScheme}-{mode}.png
```

Use these initial authored phases: Neutral `5.8`, Typing `8.64`, Thinking `2.25`, Loading `1.5`, Calm `2.48`, Joyful `0.98`, Caution `1.22`, and Regret `1.97` seconds. Any later source trim updates the manifest phase in the same commit.

- [ ] **Step 2: Add capability-based selection with a stable H.264 fallback**

```ts
const capabilityPromiseByKey = new Map<string, Promise<MediaCapabilitiesDecodingInfo | null>>();

const getCapability = async (
  source: RazorSenseVideoSource,
): Promise<MediaCapabilitiesDecodingInfo | null> => {
  if (typeof navigator === 'undefined' || !navigator.mediaCapabilities?.decodingInfo) return null;
  const key = JSON.stringify(source);
  const existing = capabilityPromiseByKey.get(key);
  if (existing) return existing;

  const promise = navigator.mediaCapabilities
    .decodingInfo({
      type: 'file',
      video: {
        contentType: `${source.type}; codecs="${source.codec}"`,
        width: source.width,
        height: source.height,
        bitrate: source.bitrate,
        framerate: source.framerate,
      },
    })
    .catch(() => null);
  capabilityPromiseByKey.set(key, promise);
  return promise;
};

const selectRazorSenseVideoSource = async (
  request: RazorSenseAssetRequest,
): Promise<{ src: string; source: RazorSenseVideoSource }> => {
  const asset = getRazorSenseAsset(request);
  const checked = await Promise.all(
    asset.sources.map(async (source) => ({ source, capability: await getCapability(source) })),
  );
  const selected = checked.find(
    ({ capability }) => capability?.supported && capability.smooth && capability.powerEfficient,
  ) ??
    checked.find(({ capability }) => capability?.supported && capability.smooth) ??
    checked.find(({ capability }) => capability?.supported) ?? {
      source: asset.fallbackSource,
    };

  return { src: joinAssetPath(request.assetsPath, selected.source.file), source: selected.source };
};
```

- [ ] **Step 3: Add the object-form preload helper and compatibility aliases**

```ts
const preloadPromiseByUrl = new Map<string, Promise<void>>();

const preloadVideoUrl = (src: string): Promise<void> => {
  const existing = preloadPromiseByUrl.get(src);
  if (existing) return existing;
  const promise = new Promise<void>((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.onloadeddata = () => resolve();
    video.onerror = () => reject(new Error(`RazorSense: Failed to preload ${src}`));
    video.src = src;
    video.load();
  }).catch((error) => {
    preloadPromiseByUrl.delete(src);
    throw error;
  });
  preloadPromiseByUrl.set(src, promise);
  return promise;
};

async function preloadRazorSense(options: PreloadRazorSenseOptions): Promise<void> {
  const modes = Array.isArray(options.modes) ? options.modes : [options.modes];
  const schemes = Array.isArray(options.colorSchemes)
    ? options.colorSchemes
    : [options.colorSchemes ?? 'light'];
  const viewport = window.matchMedia('(max-width: 809.98px)').matches ? 'mobile' : 'desktop';
  const assetsPath = options.assetsPath ?? DEFAULT_CDN_PATH;
  const selected = await Promise.all(
    schemes.flatMap((colorScheme) =>
      modes.map((mode) => selectRazorSenseVideoSource({ assetsPath, mode, colorScheme, viewport })),
    ),
  );
  await Promise.all(selected.map(({ src }) => preloadVideoUrl(src)));
}
```

Make `preloadRazorSenseModeAssets` call `preloadRazorSense` and keep its current positional signature.

In `utils.native.ts`, add the same typed `preloadRazorSense(options)` export as an async no-op, make `preloadRazorSenseModeAssets` delegate to it, and use the build-injected versioned path. Native keeps its explicit unsupported rendering boundary; preloading must remain safe during shared application initialization.

- [ ] **Step 4: Replace `@latest` with a build-injected package version**

Declare the value in `src/@types/globals.d.ts`:

```ts
declare const __BLADE_VERSION__: string;
```

Add this replacement beside `__DEV__` in every web, development, and native `pluginReplace` block in `rollup.config.mjs`:

```js
__BLADE_VERSION__: JSON.stringify(packagejson.version),
```

Read `package.json` through the existing `createRequire` instance in `.storybook/react/main.ts` and add the same Vite definition:

```ts
const bladePackage = require(resolve(bladeRoot, 'package.json')) as { version: string };

define: {
  __DEV__: true,
  __BLADE_VERSION__: JSON.stringify(bladePackage.version),
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
},
```

Read `package.json` in `jest.web.config.js` and add the version to `baseConfig.globals`:

```js
const packagejson = require('./package.json');

globals: {
  __DEV__: true,
  __BLADE_VERSION__: packagejson.version,
},
```

Then construct the runtime path:

```ts
const DEFAULT_CDN_PATH = `https://cdn.jsdelivr.net/npm/@razorpay/blade@${__BLADE_VERSION__}/assets/spark`;
```

Do not leave a literal `@latest` path in web or native utilities.

- [ ] **Step 5: Validate types and URL selection**

Run:

```bash
cd packages/blade
yarn typecheck
```

Expected: no new `razorSenseAssets`, preload, or Spark type errors.

- [ ] **Step 6: Commit the asset contract**

```bash
git add packages/blade/src/components/Spark/RzpGlass/razorSenseAssets.ts \
  packages/blade/src/components/Spark/RzpGlass/modes.ts \
  packages/blade/src/components/Spark/RzpGlass/utils.ts \
  packages/blade/src/components/Spark/RzpGlass/utils.native.ts \
  packages/blade/src/components/Spark/RzpGlass/index.ts \
  packages/blade/src/components/Spark/index.ts \
  packages/blade/src/@types/globals.d.ts \
  packages/blade/rollup.config.mjs \
  packages/blade/.storybook/react/main.ts \
  packages/blade/jest.web.config.js
git commit -m "feat(blade): add RazorSense asset selection"
```

## Task 3: Shared lifecycle and admission runtime

**Files:**

- Create: `packages/blade/src/components/Spark/RzpGlass/RazorSenseRuntime.ts`
- Create: `packages/blade/src/components/Spark/RzpGlass/useRazorSenseLifecycle.ts`
- Create: `packages/blade/src/components/Spark/RzpGlass/__tests__/RazorSenseRuntime.test.ts`
- Modify: `packages/blade/src/components/Spark/RzpGlass/RzpGlass.tsx`

- [ ] **Step 1: Write focused lifecycle and admission tests**

Cover these exact invariants with mocked IntersectionObserver and fake timers:

```ts
it('keeps a never-visible offscreen instance dormant', () => {
  const observer = installMockIntersectionObserver();
  const runtime = createRazorSenseRuntime(document);
  runtime.register(element, options, listener);
  observer.emit(element, {
    isIntersecting: false,
    intersectionRatio: 0,
    boundingClientRect: offscreenRect,
  });
  expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({ state: 'dormant' }));
});

it('suspends an active instance and makes it cold after ten seconds', () => {
  const observer = installMockIntersectionObserver();
  const runtime = createRazorSenseRuntime(document);
  runtime.register(element, options, listener);
  observer.emit(element, {
    isIntersecting: true,
    intersectionRatio: 1,
    boundingClientRect: visibleRect,
  });
  expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({ state: 'active' }));
  observer.emit(element, {
    isIntersecting: false,
    intersectionRatio: 0,
    boundingClientRect: offscreenRect,
  });
  expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({ state: 'suspended' }));
  jest.advanceTimersByTime(10_000);
  expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({ state: 'cold' }));
});

it('admits four animations and no more than two WebGL renderers', () => {
  const snapshots = registerVisibleEntries(runtime, [
    'emotional',
    'legacy',
    'emotional',
    'authored',
    'authored',
  ]);
  expect(snapshots.filter((item) => item.isAdmitted)).toHaveLength(4);
  expect(snapshots.filter((item) => item.isAdmitted && item.family !== 'authored')).toHaveLength(2);
});
```

`installMockIntersectionObserver()` replaces the global constructor, captures the single observer callback, and exposes `emit(element, init)` to invoke that callback with a complete mocked entry. Production code has no `setIntersection` escape hatch.

- [ ] **Step 2: Implement the runtime contract**

```ts
type RazorSenseLifecycleState = 'dormant' | 'warm' | 'active' | 'suspended' | 'cold';
type RazorSenseRendererFamily = 'authored' | 'emotional' | 'legacy';

type RazorSenseRuntimeSnapshot = {
  state: RazorSenseLifecycleState;
  isAdmitted: boolean;
  isPageVisible: boolean;
  intersectionRatio: number;
};

type RazorSenseRuntimeOptions = {
  family: RazorSenseRendererFamily;
  isPaused: boolean;
  isInteractive: boolean;
};

type RazorSenseRuntimeRegistration = {
  id: number;
  update(options: RazorSenseRuntimeOptions): void;
  unregister(): void;
};
```

Use one observer with `rootMargin: '240px 0px'` and thresholds `[0, 0.01, 0.25, 0.5, 1]`. The observer reports the warm margin; compute actual viewport intersection by clipping `entry.boundingClientRect` to `document.documentElement.clientWidth` and `clientHeight`. Register `pointerenter` and `pointerleave` listeners for interactive entries and store `hasActivePointer`. Rank active candidates by active pointer, then actual visible intersection area, then current DOM order using `compareDocumentPosition`; use registration id only when nodes are disconnected. Admit at most four total and two WebGL entries, where `emotional` and `legacy` are WebGL families. Remove pointer listeners on unregister. Suspend immediately; schedule cold state at 10 seconds.

- [ ] **Step 3: Implement the React bridge**

```ts
const useRazorSenseLifecycle = ({
  containerRef,
  family,
  isPaused,
  isInteractive,
}: UseRazorSenseLifecycleOptions): RazorSenseRuntimeSnapshot => {
  const [snapshot, setSnapshot] = useState(INITIAL_SNAPSHOT);
  const registrationRef = useRef<RazorSenseRuntimeRegistration | null>(null);
  const optionsRef = useRef({ family, isPaused, isInteractive });
  optionsRef.current = { family, isPaused, isInteractive };

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;
    const registration = getRazorSenseRuntime(document).register(
      element,
      optionsRef.current,
      setSnapshot,
    );
    registrationRef.current = registration;
    return () => registration.unregister();
  }, [containerRef]);

  useEffect(() => {
    registrationRef.current?.update({ family, isPaused, isInteractive });
  }, [family, isInteractive, isPaused]);

  return snapshot;
};
```

Register once for the host element. A Neutral-to-Calm or semantic-to-legacy family change flows only through `registration.update(...)`; it must not reset lifecycle state, document priority, observation, or the cold timer.

- [ ] **Step 4: Connect the semantic host without changing pixels**

Pass `isRuntimeActive`, `isRuntimeWarm`, `isRuntimeCold`, and `isAdmitted` into authored, emotional, and legacy renderer components. For this task, keep current renderers mounted and use only the pause signal so pixel output remains unchanged while lifecycle behavior is introduced.

- [ ] **Step 5: Run focused tests**

```bash
cd packages/blade
SHARD=1/1 yarn test:react RazorSenseRuntime RazorSense.web --runInBand
```

Expected: lifecycle, admission, routing, and accessibility tests pass.

- [ ] **Step 6: Commit the runtime**

```bash
git add packages/blade/src/components/Spark/RzpGlass/RazorSenseRuntime.ts \
  packages/blade/src/components/Spark/RzpGlass/useRazorSenseLifecycle.ts \
  packages/blade/src/components/Spark/RzpGlass/__tests__/RazorSenseRuntime.test.ts \
  packages/blade/src/components/Spark/RzpGlass/RzpGlass.tsx
git commit -m "feat(blade): manage RazorSense lifecycle"
```

## Task 3A: Exact fallback foundation

**Files:**

- Create: `packages/blade/src/components/Spark/RzpGlass/RazorSenseFallback.tsx`
- Create: `packages/blade/src/components/Spark/docs/RazorSenseFallbackExporter.stories.tsx`
- Create: `packages/blade/scripts/exportRazorSenseFallbacks.mjs`
- Create: `packages/blade/assets/spark/razorsense-stills/*.png`
- Modify: `packages/blade/src/components/Spark/RzpGlass/razorSenseAssets.ts`

- [ ] **Step 1: Build the fixed-phase exporter surface**

Read `mode`, `colorScheme`, and `viewport` query parameters, resolve `representativePhase` from the asset manifest, and render the internal authored or emotional renderer at its canonical geometry with `startTime={representativePhase}`, `isPaused`, and interaction disabled. After `onLoad`, wait for two animation frames before setting `data-export-ready="true"`. The exported node uses `data-razor-sense-export` and has no Storybook chrome, padding, transform, or background outside the material.

- [ ] **Step 2: Export the full fallback matrix**

Launch the installed system Chrome with a temporary profile. For each supported combination, navigate to the direct exporter iframe, wait for `[data-export-ready="true"]`, and screenshot `[data-razor-sense-export]` at original resolution:

- operational: desktop light and dark;
- emotional: desktop light and dark;
- emotional: mobile light and dark.

Write `assets/spark/razorsense-stills/{viewport}-{scheme}-{mode}.png`. Require exactly 24 files and exit non-zero for an unknown query value, timeout, duplicate output, missing mode, wrong screenshot dimensions, or blank image.

```bash
cd packages/blade
node scripts/exportRazorSenseFallbacks.mjs --storybook-url http://localhost:9009
```

- [ ] **Step 3: Add the decorative fallback renderer**

Create `RazorSenseFallback` with `src` plus `StyledPropsBlade`. Render a full-size `BaseBox` and an `alt=""`, `aria-hidden="true"` image with `object-fit: cover`. Accessibility remains on the outer RazorSense host. Export the internal component for Tasks 4, 5, 7, and 8.

- [ ] **Step 4: Review and commit the foundation**

Inspect all 24 images at original resolution in a contact sheet and individually. Reject blank frames, grayscale emotional output, wrong appearance, wrong crop, clipped rails, or phase drift.

```bash
git add packages/blade/src/components/Spark/RzpGlass/RazorSenseFallback.tsx \
  packages/blade/src/components/Spark/RzpGlass/razorSenseAssets.ts \
  packages/blade/src/components/Spark/docs/RazorSenseFallbackExporter.stories.tsx \
  packages/blade/scripts/exportRazorSenseFallbacks.mjs \
  packages/blade/assets/spark/razorsense-stills
git commit -m "feat(blade): add RazorSense fallback foundation"
```

## Task 4: Progressive operational video layers

**Files:**

- Modify: `packages/blade/src/components/Spark/RzpGlass/RazorSenseAuthored.tsx`
- Modify: `packages/blade/src/components/Spark/RzpGlass/RzpGlass.tsx`

- [ ] **Step 1: Replace the four-mode render map with an active layer list**

Use this layer model:

```ts
type AuthoredLayer = {
  id: number;
  mode: RazorSenseOperationalMode;
  colorScheme: ColorSchemeNames;
  opacity: number;
  status: 'loading' | 'visible' | 'outgoing';
};
```

Initialize one layer for the requested mode. On mode or color-scheme change, append one loading layer. Start the crossfade only after its first decoded frame. Remove the outgoing layer after the authored transition duration.

- [ ] **Step 2: Preserve the Thinking seam pair only while Thinking is active**

Create the secondary Thinking element inside the Thinking layer only. Dispose both Thinking video sources when that layer leaves the list. Preserve the current 600 ms seam dissolve and source phase restoration.

- [ ] **Step 3: Wire lifecycle states**

- `warm`: create the active video source and decode the first frame.
- `active`: play only the visible layer and the incoming layer during transition.
- `suspended`: pause every layer and stop the Thinking RAF.
- `cold`: copy the current exact frame to the shared snapshot, clear `src`, call `load()`, and remove all video nodes.
- denied admission: show the calibrated still and create no video.

- [ ] **Step 4: Verify operational request and element counts in Storybook**

For Neutral, Typing, Loading, and Thinking, inspect the direct iframe with an uncached reload.

Expected:

- Neutral, Typing, and Loading: one video element and one media request.
- Thinking: two video elements for the seam pair and one shared media URL.
- No hidden-mode request.
- Switching modes uses current and incoming layers only.

- [ ] **Step 5: Commit the operational renderer**

```bash
git add packages/blade/src/components/Spark/RzpGlass/RazorSenseAuthored.tsx \
  packages/blade/src/components/Spark/RzpGlass/RzpGlass.tsx
git commit -m "perf(blade): load active RazorSense state only"
```

## Task 5: On-demand emotional textures and frame-driven uploads

**Files:**

- Modify: `packages/blade/src/components/Spark/RzpGlass/RazorSenseMood.tsx`
- Modify: `packages/blade/src/components/Spark/RzpGlass/RazorSenseMoodMount.ts`
- Modify: `packages/blade/src/components/Spark/RzpGlass/webgl-utils.ts`

- [ ] **Step 1: Make video and texture slots optional**

Replace eager arrays with mode-keyed slots:

```ts
type MoodSlot = {
  video: HTMLVideoElement;
  texture: Texture;
  isDirty: boolean;
  frameCallbackId: number | null;
};

private readonly slots = new Map<RazorSenseEmotionalMode, MoodSlot>();
```

Bind one-pixel placeholder textures to all four sampler units during setup.

Request the emotional WebGL context with `powerPreference: 'default'`, `depth: false`, `stencil: false`, `antialias: false`, and `preserveDrawingBuffer: false`. Do not select render quality from a GPU name or tier.

- [ ] **Step 2: Add `ensureModeLoaded` and delayed transitions**

```ts
async ensureModeLoaded(mode: RazorSenseEmotionalMode): Promise<MoodSlot> {
  const existing = this.slots.get(mode);
  if (existing) return existing;
  const source = await selectRazorSenseVideoSource(this.getAssetRequest(mode));
  const video = await loadVideo(source.src);
  const texture = new Texture(this.gl, { textureUnit: getRazorSenseModeIndex(mode) });
  texture.image(video);
  const slot = { video, texture, isDirty: false, frameCallbackId: null };
  this.slots.set(mode, slot);
  this.scheduleVideoFrame(mode, slot);
  return slot;
}
```

Make `setMode` async. Await the target slot before starting transition weights. Retain non-zero interrupted sources, then dispose zero-weight slots when a transition settles.

- [ ] **Step 3: Replace current-time polling with video-frame callbacks**

```ts
private scheduleVideoFrame(mode: RazorSenseEmotionalMode, slot: MoodSlot): void {
  const video = slot.video as HTMLVideoElement & {
    requestVideoFrameCallback?: (callback: () => void) => number;
  };
  if (!video.requestVideoFrameCallback || this.disposed) return;
  slot.frameCallbackId = video.requestVideoFrameCallback(() => {
    slot.isDirty = true;
    this.scheduleVideoFrame(mode, slot);
  });
}
```

Upload only dirty contributing slots before the draw call. Keep current-time comparison as the fallback for browsers without `requestVideoFrameCallback`.

- [ ] **Step 4: Stop the shader loop when no time-dependent work exists**

Add `setActive(active: boolean)` to cancel RAF and pause slots when inactive. Resume RAF only for active playback, a transition, a color-scheme transition, or a live pointer trail. Freeze the shader clock when paused by storing `pausedAt` and subtracting accumulated paused duration from `uTime`.

- [ ] **Step 5: Replace the four mobile emotional videos with current and incoming layers**

Use the same `loading`, `visible`, and `outgoing` layer states as the operational renderer. Preserve the current 600 ms mobile crossfade, phase-matched light and dark source restoration, and exact snapshot bridge. Create no other emotional video element. Clear outgoing `src` values and call `load()` after the crossfade.

- [ ] **Step 6: Add exact capture and intentional disposal**

```ts
captureFrame(target: HTMLCanvasElement): Promise<void> {
  return new Promise((resolve) => {
    this.pendingCapture = { target, resolve };
    this.scheduleRender();
  });
}

private flushPendingCapture(): void {
  if (!this.pendingCapture) return;
  const { target, resolve } = this.pendingCapture;
  const { width, height } = this.canvasElement;
  const pixels = new Uint8Array(width * height * 4);
  this.gl.readPixels(0, 0, width, height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);
  target.width = width;
  target.height = height;
  const context = target.getContext('2d');
  const image = context?.createImageData(width, height);
  if (context && image) {
    for (let row = 0; row < height; row += 1) {
      const sourceOffset = (height - row - 1) * width * 4;
      image.data.set(pixels.subarray(sourceOffset, sourceOffset + width * 4), row * width * 4);
    }
    context.putImageData(image, 0, 0);
  }
  this.pendingCapture = null;
  resolve();
}

dispose({ loseContext = false }: { loseContext?: boolean } = {}): void {
  this.disposed = true;
  cancelAnimationFrame(this.animationFrameId);
  for (const slot of this.slots.values()) {
    if (slot.frameCallbackId !== null && slot.video.cancelVideoFrameCallback) {
      slot.video.cancelVideoFrameCallback(slot.frameCallbackId);
    }
    slot.video.pause();
    slot.video.removeAttribute('src');
    slot.video.load();
    slot.texture.destroy();
  }
  this.slots.clear();
  this.releaseGeometry();
  this.releaseProgram();
  if (loseContext) this.gl.getExtension('WEBGL_lose_context')?.loseContext();
}
```

Call `flushPendingCapture()` immediately after `gl.drawArrays` and before the render callback returns. Await `captureFrame` before pausing playback, deleting resources, or intentionally losing the context. This keeps `preserveDrawingBuffer: false` while reading the exact just-rendered pixels at the only reliable point.

Track intentional context loss so it does not call `onError`.

- [ ] **Step 7: Verify cold Calm loading**

Expected uncached direct-story result:

- One Calm media request, approximately 0.55 MB with the current H.264 asset.
- One active decoder and one WebGL context.
- No Joyful, Caution, or Regret request until selected.
- Selecting Joyful briefly retains Calm and Joyful, then releases Calm.

- [ ] **Step 8: Commit the emotional renderer**

```bash
git add packages/blade/src/components/Spark/RzpGlass/RazorSenseMood.tsx \
  packages/blade/src/components/Spark/RzpGlass/RazorSenseMoodMount.ts \
  packages/blade/src/components/Spark/RzpGlass/webgl-utils.ts
git commit -m "perf(blade): load active RazorSense mood only"
```

## Task 6: Asset payload optimization without visual loss

**Files:**

- Create: `packages/blade/scripts/exportRazorSenseVideoVariants.swift`
- Create: `packages/blade/scripts/razorsense-media-requirements.txt`
- Create: `packages/blade/scripts/verifyRazorSenseMedia.py`
- Modify: `packages/blade/src/components/Spark/docs/RazorSensePerformanceBaseline.md`
- Modify: `packages/blade/assets/spark/razorsense-modes/*.mp4`
- Modify: `packages/blade/assets/spark/razorsense-states/*.mp4`
- Modify: `packages/blade/src/components/Spark/RzpGlass/razorSenseAssets.ts`
- Modify: `packages/blade/src/components/Spark/RzpGlass/modes.ts`

- [ ] **Step 1: Record the current codec, duration, frame rate, resolution, bitrate, and byte size**

Use AVFoundation to record every current mode asset in `RazorSensePerformanceBaseline.md`: codec, duration, frame rate, resolution, bitrate, byte size, authored phase interval, and accepted replacement status. Preserve the current MP4s until a derivative passes the visual gate.

- [ ] **Step 2: Create the deterministic AVFoundation exporter**

Pin the verifier environment:

```text
Pillow==12.2.0
numpy==2.4.6
scipy==1.17.1
```

The Swift script parses `--assets-root`, `--output-dir`, and `--write-frames`. It discovers and sorts every MP4 in `razorsense-states` and `razorsense-modes`, rejects duplicate output names, and builds one `ExportJob` per source and codec. `trimRange(for:)` returns `6.68...10.00` for Typing, `0...8.708` for Neutral, and the full asset duration for every other source. `representativePhase(for:)` returns the phase map from the visual spec, rebased by the trim start. Use one export function:

```swift
import AVFoundation
import Foundation

struct ExportJob {
  let input: URL
  let output: URL
  let start: Double
  let duration: Double
  let preset: String
}

func export(_ job: ExportJob) async throws {
  let asset = AVURLAsset(url: job.input)
  guard let session = AVAssetExportSession(asset: asset, presetName: job.preset) else {
    throw NSError(domain: "RazorSenseExport", code: 1)
  }
  try? FileManager.default.removeItem(at: job.output)
  session.outputURL = job.output
  session.outputFileType = .mp4
  session.shouldOptimizeForNetworkUse = true
  session.timeRange = CMTimeRange(
    start: CMTime(seconds: job.start, preferredTimescale: 600),
    duration: CMTime(seconds: job.duration, preferredTimescale: 600)
  )
  await session.export()
  if session.status != .completed {
    throw session.error ?? NSError(domain: "RazorSenseExport", code: 2)
  }
}
```

Use `AVAssetExportPresetHighestQuality` for H.264 fallback candidates and `AVAssetExportPresetHEVCHighestQuality` for HEVC candidates. Export from the highest-quality source available in the supplied launch materials. Use a current derivative only when no higher-quality source contains that authored composition.

After each export, use `AVAssetImageGenerator` with `appliesPreferredTrackTransform = true`, zero time tolerances, and the rebased representative phase to write:

```text
{write-frames}/reference/{asset-name}.png
{write-frames}/candidate/{asset-name}-{codec}.png
```

Exit non-zero for an unknown argument, missing input, unsupported export preset, failed export, failed frame capture, or output collision. The script prints a JSON line for every job with input, output, codec, trim range, old bytes, and new bytes.

`verifyRazorSenseMedia.py` uses `argparse` for the six flags shown below, sorts reference PNGs, requires at least one matching candidate per reference, reports missing or extra images, emits one JSON line per comparison, and exits non-zero when any file fails any threshold. It imports only the three pinned packages plus the Python standard library.

- [ ] **Step 3: Remove unused timeline payload**

Export Typing from 6.68 through 10.00 seconds as a 3.32-second asset in both appearances. Update its playback timing to start at 0 and end at 3.32. Export Neutral through the exact 8.708-second seam. Preserve the full Thinking and Loading intervals.

- [ ] **Step 4: Produce HEVC candidates and visually gate every replacement**

Generate HEVC candidates for all operational and emotional assets. Add a candidate to the manifest only when:

- SSIM is at least 0.995;
- PSNR is at least 42 dB;
- Delta E 2000 P95 is no greater than 1.5;
- no flute, rail, bloom, aperture, crop, or seam edge shifts by more than one physical pixel;
- visual review finds no added banding or dark-material drift.

Keep the current H.264 file when a proposed H.264 replacement fails. The capability selector uses HEVC only on devices that report supported, smooth, and power-efficient decoding.

The exporter writes matching reference and candidate PNGs at the visual-spec phases. `verifyRazorSenseMedia.py` loads those frames with Pillow, converts sRGB to linear RGB and Lab with NumPy, computes windowed SSIM with `scipy.ndimage.gaussian_filter`, computes PSNR from linear RGB mean-square error, computes Delta E 2000 per pixel, and compares Sobel edge centroids. It exits non-zero when any threshold fails.

Run:

```bash
cd packages/blade
python3 -m venv /tmp/razorsense-media-venv
/tmp/razorsense-media-venv/bin/pip install \
  --requirement scripts/razorsense-media-requirements.txt
swift scripts/exportRazorSenseVideoVariants.swift \
  --assets-root assets/spark \
  --output-dir /tmp/razorsense-media-variants \
  --write-frames /tmp/razorsense-media-check
/tmp/razorsense-media-venv/bin/python scripts/verifyRazorSenseMedia.py \
  --reference-dir /tmp/razorsense-media-check/reference \
  --candidate-dir /tmp/razorsense-media-check/candidate \
  --min-ssim 0.995 \
  --min-psnr 42 \
  --max-delta-e-p95 1.5 \
  --max-edge-shift 1
```

Expected: one JSON result per candidate and process exit code 0 only when every accepted derivative passes.

- [ ] **Step 5: Verify payload results**

Record old and new bytes for each accepted file. Require no increase in H.264 fallback bytes and report the actual HEVC savings. Do not claim a reduction for a derivative that was rejected by the visual gate.

- [ ] **Step 6: Commit accepted variants and the exporter**

```bash
git add packages/blade/scripts/exportRazorSenseVideoVariants.swift \
  packages/blade/scripts/razorsense-media-requirements.txt \
  packages/blade/scripts/verifyRazorSenseMedia.py \
  packages/blade/src/components/Spark/docs/RazorSensePerformanceBaseline.md \
  packages/blade/assets/spark/razorsense-modes \
  packages/blade/assets/spark/razorsense-states \
  packages/blade/src/components/Spark/RzpGlass/razorSenseAssets.ts \
  packages/blade/src/components/Spark/RzpGlass/modes.ts
git commit -m "perf(blade): optimize RazorSense media payloads"
```

## Task 7: Dynamic emotional and legacy modules

**Files:**

- Create: `packages/blade/src/components/Spark/RzpGlass/RazorSenseLegacy.tsx`
- Create: `packages/blade/scripts/measureRazorSenseBundles.mjs`
- Modify: `packages/blade/src/components/Spark/RzpGlass/RzpGlass.tsx`
- Modify: `packages/blade/src/components/Spark/RzpGlass/RzpGlassMount.ts`
- Delete: `packages/blade/src/components/Spark/RzpGlass/PerformanceManager.ts`

- [ ] **Step 1: Extract the legacy wrapper without changing its props**

Move `LegacyRzpGlass` and the `RzpGlassMount` import into `RazorSenseLegacy.tsx`. Export a named `RazorSenseLegacy` component. Change the legacy WebGL context to `powerPreference: 'default'`. Remove `PerformanceManager`, `WebGLPerformanceController`, GPU-name detection, and adaptive quality changes from the legacy runtime; the compatibility renderer keeps one fixed full-quality setting.

- [ ] **Step 2: Lazy-load emotional and legacy paths**

```tsx
const LazyRazorSenseMood = React.lazy(async () => {
  const module = await import('./RazorSenseMood');
  return { default: module.RazorSenseMood };
});

const LazyRazorSenseLegacy = React.lazy(async () => {
  const module = await import('./RazorSenseLegacy');
  return { default: module.RazorSenseLegacy };
});
```

Own the boundary inside the semantic host:

```tsx
<React.Suspense fallback={outgoingSnapshot ?? null}>{lazyRenderer}</React.Suspense>
```

For cross-family changes, keep the exact outgoing snapshot visible while the new chunk loads. For a first direct emotional or legacy mount, render the fallback as `null` and keep the material layer hidden until its renderer reports the first exact frame. Do not show an uncalibrated substitute. Keep `RazorSenseAuthored` static because Neutral is the default path. On the server, emit only the semantic host and deterministic calibrated fallback markup; do not evaluate WebGL modules until hydration.

- [ ] **Step 3: Measure the split bundles**

Create `measureRazorSenseBundles.mjs` with named entry points for default semantic `RzpGlass.tsx`, emotional `RazorSenseMood.tsx`, and legacy `RazorSenseLegacy.tsx`. Run one esbuild build with `bundle: true`, `minify: true`, `treeShaking: true`, `write: false`, `platform: 'browser'`, `format: 'esm'`, `splitting: true`, `metafile: true`, and `outdir: '/tmp/razorsense-bundle-measure'`; keep React and every Blade alias external. Use the metafile's `entryPoint` and dynamic-import graph to identify the shipped semantic entry, emotional lazy chunk, legacy lazy chunk, and any shared chunk. Compress each emitted output with `gzipSync(output, { level: 9 })`, report raw and gzip bytes as JSON, attribute shared bytes explicitly instead of double-counting them, and exit non-zero when the semantic entry or emotional incremental budget is exceeded.

Run:

```bash
cd packages/blade
node scripts/measureRazorSenseBundles.mjs
```

Expected:

- default semantic path at or below 10 KB gzip;
- emotional chunk at or below 12 KB gzip;
- legacy shader absent from the default semantic chunk.

- [ ] **Step 4: Commit the split**

```bash
git add packages/blade/src/components/Spark/RzpGlass/RazorSenseLegacy.tsx \
  packages/blade/src/components/Spark/RzpGlass/RzpGlass.tsx \
  packages/blade/src/components/Spark/RzpGlass/RzpGlassMount.ts \
  packages/blade/src/components/Spark/RzpGlass/PerformanceManager.ts \
  packages/blade/scripts/measureRazorSenseBundles.mjs
git commit -m "perf(blade): defer RazorSense renderers"
```

## Task 8: Recalibrated fallbacks and reduced motion

**Files:**

- Modify: `packages/blade/src/components/Spark/RzpGlass/RazorSenseFallback.tsx`
- Modify: `packages/blade/src/components/Spark/docs/RazorSenseFallbackExporter.stories.tsx`
- Modify: `packages/blade/scripts/exportRazorSenseFallbacks.mjs`
- Modify: `packages/blade/assets/spark/razorsense-stills/*.png`
- Modify: `packages/blade/src/components/Spark/RzpGlass/razorSenseAssets.ts`
- Modify: `packages/blade/src/components/Spark/RzpGlass/RzpGlass.tsx`

- [ ] **Step 1: Rebase the deterministic exporter after accepted media trims**

The story reads `mode`, `colorScheme`, and `viewport` from query parameters, renders one RazorSense at the canonical size, passes `isPaused`, and disables interaction. After `onLoad`, wait for two animation frames before setting `data-export-ready="true"` so the WebGL draw and compositor presentation have both completed:

```ts
const handleLoad = (): void => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => setIsExportReady(true));
  });
};
```

Use these fixed phases in the story:

```ts
const REPRESENTATIVE_PHASE: Record<RazorSenseMode, number> = {
  neutral: 5.8,
  typing: 1.96,
  thinking: 2.25,
  loading: 1.5,
  calm: 2.48,
  joyful: 0.98,
  caution: 1.22,
  regret: 1.97,
};
```

Export `representativePhase` from the asset manifest and consume it in this story so a future trim cannot desynchronize the fallback capture. `1.96` is Typing's authored `8.64` phase rebased by the `6.68` trim start.

- [ ] **Step 2: Regenerate the fallback matrix**

Launch `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` with a temporary profile. For every required mode, scheme, and viewport, navigate to the exporter iframe, wait for `[data-export-ready="true"]`, and save a PNG screenshot of `[data-razor-sense-export]` to `assets/spark/razorsense-stills/{viewport}-{scheme}-{mode}.png`.

The matrix is:

- operational modes: desktop light and dark;
- emotional modes: desktop light and dark;
- emotional modes: mobile light and dark.

Expected file count: 24.

Run:

```bash
cd packages/blade
node scripts/exportRazorSenseFallbacks.mjs --storybook-url http://localhost:9009
```

- [ ] **Step 3: Integrate the fallback renderer across terminal policies**

```tsx
type RazorSenseFallbackProps = {
  src: string;
} & StyledPropsBlade;

const RazorSenseFallback = ({
  src,
  ...styledProps
}: RazorSenseFallbackProps): React.ReactElement => (
  <BaseBox {...getStyledProps(styledProps)} width="100%" height="100%" overflow="hidden">
    <img
      src={src}
      alt=""
      aria-hidden="true"
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  </BaseBox>
);
```

Use it for reduced motion, denied admission, initial media failure, and WebGL failure. Use the exact runtime snapshot for suspended and cold instances that have already rendered.

- [ ] **Step 4: Verify fallback output**

Review every still in light and dark at original resolution. Confirm the source is final color, not grayscale, and that no image has a blank frame, theme flash, clipped rail, or wrong crop.

- [ ] **Step 5: Commit fallbacks**

```bash
git add packages/blade/src/components/Spark/RzpGlass/RazorSenseFallback.tsx \
  packages/blade/src/components/Spark/RzpGlass/razorSenseAssets.ts \
  packages/blade/src/components/Spark/RzpGlass/RzpGlass.tsx \
  packages/blade/src/components/Spark/docs/RazorSenseFallbackExporter.stories.tsx \
  packages/blade/scripts/exportRazorSenseFallbacks.mjs \
  packages/blade/assets/spark/razorsense-stills
git commit -m "feat(blade): add RazorSense exact fallbacks"
```

## Task 9: Executable cross-surface recipes

**Files:**

- Create: `packages/blade/src/components/Spark/docs/RazorSenseRecipes.stories.tsx`
- Modify: `packages/blade/src/components/Spark/docs/RazorSenseModes.stories.tsx`

- [ ] **Step 1: Add the recipe state controller**

Use one local recipe type and mapping:

```ts
type AgentVisualState =
  | 'idle'
  | 'composing'
  | 'thinking'
  | 'working'
  | 'success'
  | 'review'
  | 'error';

const MODE_BY_AGENT_STATE: Record<AgentVisualState, RazorSenseMode> = {
  idle: 'neutral',
  composing: 'typing',
  thinking: 'thinking',
  working: 'calm',
  success: 'joyful',
  review: 'caution',
  error: 'regret',
};
```

- [ ] **Step 2: Implement all eight production recipes with Blade components**

Add these named stories under `Components/RazorSense/Recipes`:

1. `ChatComposer`: absolute Typing band behind `ChatInput`; focus changes the state.
2. `AgentThinking`: one Thinking field behind `ChatMessage` and reasoning traces.
3. `AgentResponse`: outcome controls switch Calm, Joyful, Caution, and Regret once per response.
4. `BrandedLoader`: 160 by 160 Loading plus `Spinner` and `VisuallyHidden` status.
5. `FeaturedResultCard`: RazorSense and Card as siblings inside a clipped `Box`.
6. `LoginHero`: Neutral stage with a Typing input band.
7. `DarkAgentWorkspace`: nearest dark `BladeProvider`, Neutral ambient field, and crisp foreground UI.
8. `AmbientApplicationSurface`: one non-interactive Neutral or Calm field behind an expressive application zone, with an explicit pause control and opaque foreground regions for dense data.

Use Blade `Box`, `Card`, `ChatInput`, `ChatMessage`, `Button`, `Text`, `Heading`, `Spinner`, and `VisuallyHidden`. Do not use raw application CSS for layout that Blade styled props can express.

- [ ] **Step 3: Add misuse guidance to story descriptions**

Every recipe description states:

- one instance per expressive zone;
- no RazorSense inside Toast, Alert, Badge, Indicator, or repeated card rows;
- semantic text remains required;
- interactive mode is disabled behind controls.

- [ ] **Step 4: Verify light, dark, and responsive recipes in the real Storybook browser**

Inspect 1364 by 768, 960 by 720, and 360 by 800 viewports. Exercise ChatInput focus, reasoning completion, outcome switches, and provider appearance changes. Capture screenshots for each stable recipe state.

- [ ] **Step 5: Commit recipes**

```bash
git add packages/blade/src/components/Spark/docs/RazorSenseRecipes.stories.tsx \
  packages/blade/src/components/Spark/docs/RazorSenseModes.stories.tsx
git commit -m "docs(blade): add RazorSense application recipes"
```

## Task 10: Decision record and MCP guidance

**Files:**

- Create: `packages/blade/src/components/Spark/RzpGlass/_decisions/decisions.md`
- Modify: `packages/blade/src/components/Spark/docs/RazorSenseVisualSpec.md`
- Modify: `packages/blade-mcp/knowledgebase/components/RazorSense.md`
- Modify: `packages/blade-mcp/knowledgebase/patterns/SparkAnimation.md`

- [ ] **Step 1: Write the decision record**

Use these sections:

1. Design source and intent.
2. Semantic mode contract.
3. Canonical API and compatibility behavior.
4. Renderer anatomy.
5. Lifecycle and admission.
6. Asset and preload policy.
7. Accessibility and reduced motion.
8. Surface recipe matrix.
9. Performance and visual budgets.
10. React Native boundary.
11. Rejected alternatives.

- [ ] **Step 2: Update the visual specification implementation map**

Document the runtime, on-demand sources, fixed fallback phases, code splitting, request counts, and final browser-verification contract. Preserve all existing geometry, palette, timing, and dark-material calibration.

- [ ] **Step 3: Replace legacy-first MCP examples**

Lead the component and Spark pattern docs with `mode`, semantic mapping, one-instance-per-zone rules, and the seven recipes. Move `preset`, raw shader controls, and `preloadRazorSenseAssets` into a compatibility section.

- [ ] **Step 4: Format and commit docs**

```bash
packages/blade/node_modules/.bin/prettier --write \
  packages/blade/src/components/Spark/RzpGlass/_decisions/decisions.md \
  packages/blade/src/components/Spark/docs/RazorSenseVisualSpec.md \
  packages/blade-mcp/knowledgebase/components/RazorSense.md \
  packages/blade-mcp/knowledgebase/patterns/SparkAnimation.md
git add packages/blade/src/components/Spark/RzpGlass/_decisions/decisions.md \
  packages/blade/src/components/Spark/docs/RazorSenseVisualSpec.md \
  packages/blade-mcp/knowledgebase/components/RazorSense.md \
  packages/blade-mcp/knowledgebase/patterns/SparkAnimation.md
git commit -m "docs(blade): define RazorSense usage standards"
```

## Task 11: Performance and fidelity verification

**Files:**

- Modify: `packages/blade/src/components/Spark/docs/RazorSensePerformance.stories.tsx`
- Modify: `packages/blade/scripts/measureRazorSenseRuntime.mjs`
- Modify: `packages/blade/src/components/Spark/docs/RazorSensePerformanceBaseline.md`
- Create: `packages/blade/src/components/Spark/docs/RazorSensePerformanceBaseline.after.json`
- Reopen the owning implementation task instead of making an unreviewed catch-all change if a budget fails.

- [ ] **Step 1: Add reproducible performance fixtures**

Create stories for:

- one active Neutral instance;
- one active Calm instance;
- four visible mixed instances;
- eight mounted instances with six offscreen;
- rapid operational transitions;
- rapid emotional transitions;
- light and dark provider transition;
- reduced motion;
- simulated asset failure;
- simulated WebGL context loss.

Extend the existing collector only where the new lifecycle and failure fixtures require additional scenario actions. Preserve the same instrumentation, durations, cache policy, and report format used by the `before` run so the comparison remains valid.

- [ ] **Step 2: Capture before-and-after network evidence**

For each renderer family, disable cache and run three direct-iframe reloads. Record median media request count and encoded bytes.

Run:

```bash
cd packages/blade
node scripts/measureRazorSenseRuntime.mjs \
  --storybook-url http://localhost:9009 \
  --output src/components/Spark/docs/RazorSensePerformanceBaseline.md \
  --label after
```

Required results:

- Calm cold load: one media request, current H.264 approximately 0.55 MB.
- Neutral cold load: one media request, current H.264 approximately 11.66 MB.
- No inactive-mode request.
- Offscreen dormant fixtures: no media request until the 240 px warm margin.

- [ ] **Step 3: Capture frame and idle evidence**

Discard two seconds, collect ten seconds, repeat five times, and record P50, P95, P99, total frames, dropped frames, active RAF callbacks, playing media, and WebGL contexts.

Required results on the Apple M5 Pro reference Mac:

- desktop emotional P95 at or below 18.5 ms;
- visible video dropped frames below 1%;
- page-hidden and offscreen instances have zero playback and zero RazorSense RAF;
- no more than four animated instances and two emotional contexts.

- [ ] **Step 4: Capture fixed-phase visual evidence**

Compare every operational and emotional mode in light and dark at the visual-spec phases. Capture transition frames at 0, 250, 500, 750, and 1000 ms, including interruption and theme change. Reject any blank flash, crop change, flute shift, palette drift, bloom loss, banding, or seam jump.

- [ ] **Step 5: Run targeted repository validation**

```bash
cd packages/blade
SHARD=1/1 yarn test:react RazorSense.web RazorSenseRuntime --runInBand
yarn typecheck
node_modules/.bin/prettier --check \
  src/components/Spark/RzpGlass \
  src/components/Spark/docs/RazorSenseRecipes.stories.tsx \
  src/components/Spark/docs/RazorSensePerformance.stories.tsx
```

Expected: focused tests and formatting pass. Typecheck introduces no RazorSense error; unrelated pre-existing failures are listed exactly.

- [ ] **Step 6: Run the completion audit**

Check every objective and design-spec requirement against current source, Storybook screenshots, network traces, frame metrics, accessibility DOM, and documentation. Keep the goal active if any required recipe, lifecycle state, performance budget, appearance, fallback, or verification artifact is missing.

- [ ] **Step 7: Commit the verification fixture**

```bash
git add packages/blade/src/components/Spark/docs/RazorSensePerformance.stories.tsx \
  packages/blade/src/components/Spark/docs/RazorSensePerformanceBaseline.md \
  packages/blade/src/components/Spark/docs/RazorSensePerformanceBaseline.after.json \
  packages/blade/scripts/measureRazorSenseRuntime.mjs
git commit -m "test(blade): add RazorSense performance fixtures"
```

## Execution order and review checkpoints

1. Task 0 records the current dirty-worktree runtime before production behavior changes.
2. Tasks 1 through 3 establish API, asset, and lifecycle foundations without changing material pixels.
3. Task 3A creates exact stills and the fallback renderer before any lifecycle or lazy-renderer slice consumes them.
4. Tasks 4 and 5 remove the measured network, decoder, and idle bottlenecks.
5. Task 6 trims unused source timelines and adds only visually approved codec candidates.
6. Task 7 defers emotional and legacy code without exposing an intermediate material.
7. Task 8 regenerates exact stills after accepted media changes and connects reduced-motion and failure policies.
8. Tasks 9 and 10 productize usage across Blade surfaces.
9. Task 11 captures the comparable `after` run and proves performance, accessibility, and launch-film fidelity before completion.

After each task, review only that task's diff and runtime evidence. Do not batch unrelated cleanup or spend time expanding the test suite beyond the focused checks above.
