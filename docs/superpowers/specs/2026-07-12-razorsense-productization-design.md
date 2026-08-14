# RazorSense Productization Design

Status: approved direction, ready for implementation planning after review

Date: July 12, 2026

## Objective

Productize RazorSense as Blade's reusable AI material without weakening the visual language established by the launch film and RazorSense website. Consumers should choose product meaning, size, and placement. Blade should own renderer selection, motion calibration, light and dark appearance, resource loading, accessibility defaults, and performance behavior.

The implementation must support chat, thinking, loading, response, input, hero, card, and ambient applications through one semantic primitive and executable composition recipes.

## Measured baseline

The current implementation proves the material, but it provisions more work than each instance needs.

| Baseline                      |                                         Current measurement |
| ----------------------------- | ----------------------------------------------------------: |
| Semantic video assets         |                                                   30.17 MiB |
| Video codec                   |                                         H.264 (`avc1`) only |
| Cold Calm transfer            |                         3.64 MB across four emotional clips |
| Cold Neutral transfer         |                                11.66 MB for the active clip |
| Neutral video elements        | Five ready elements: four modes plus the Thinking seam pair |
| Desktop emotional sources     |                 Four decoded videos and four WebGL textures |
| Full RazorSense bundle        |                                                30.4 KB gzip |
| Authored renderer sub-bundle  |                                                 3.6 KB gzip |
| Emotional renderer sub-bundle |                                                 9.8 KB gzip |

The primary bottleneck is eager loading and lifecycle work, not the shader's visible complexity. The design therefore preserves the authored pixels and removes invisible network, decode, upload, render, and listener work.

## Product model

RazorSense is one semantic visual primitive. It does not own product layout, content, progress semantics, agent schemas, or status copy.

```tsx
<RazorSense mode="thinking" width="100%" height="320px" isInteractive={false} />
```

Existing Blade components remain responsible for their current jobs:

- `ChatInput` owns composition, focus, attachments, submission, and generation controls.
- `ChatMessage` owns message content, loading text, reasoning traces, and response actions.
- `Spinner`, `ProgressBar`, and `Skeleton` own progress communication.
- `Alert`, `Toast`, `Badge`, and `Indicator` own semantic status communication.
- `Box` and surface recipes own placement, clipping, layering, padding, and foreground contrast.

RazorSense must not become a prop on these leaf components. A page, agent workflow, or recipe controller maps application state to one RazorSense instance for each expressive zone.

## Public API

### Canonical semantic API

```ts
type RazorSenseMode =
  | 'neutral'
  | 'typing'
  | 'thinking'
  | 'loading'
  | 'calm'
  | 'joyful'
  | 'caution'
  | 'regret';

type SemanticRazorSenseProps = {
  /** Product meaning. Defaults to neutral. */
  mode?: RazorSenseMode;

  /** CSS width. Defaults to 100%. */
  width?: string | number;

  /** CSS height. Defaults to 100%. */
  height?: string | number;

  /** Freezes media and shader time while retaining the current frame. Defaults to false. */
  isPaused?: boolean;

  /** Enables the delayed pointer response for emotional modes. Defaults to true. */
  isInteractive?: boolean;

  /**
   * When absent, RazorSense is decorative and hidden from assistive technology.
   * When present, RazorSense uses role="img" and this accessible name.
   */
  accessibilityLabel?: string;

  /** Fires after the first exact frame for the requested mode is ready. */
  onLoad?: () => void;

  /** Fires once for an asset or renderer failure. */
  onError?: (error: Error) => void;
} & StyledPropsBlade &
  TestID &
  DataAnalyticsAttribute;
```

`mode` is optional because `<RazorSense />` already resolves to Neutral at runtime. The type must match that supported behavior.

`onLoad` fires once per component mount after the initial requested mode presents its first exact frame. Later mode changes do not fire it again. `onError` fires once for each failed source or renderer attempt.

`className` and raw `style` remain accepted for compatibility, but canonical product examples use Blade styled props plus explicit `width` and `height`.

The canonical API does not expose:

- appearance or color scheme;
- renderer or codec choice;
- quality tiers or pixel ratio;
- placement, crop, scrim, or content slots;
- transition curves or authored playback timing;
- shader uniforms.

The nearest `BladeProvider` remains the only source of light or dark appearance.

### Compatibility API

This pass is additive and backward compatible.

- Keep the `RazorSense` export and existing aggregate exports.
- Keep all current presets and raw shader controls.
- Keep `paused` and `interactive` as deprecated aliases for `isPaused` and `isInteractive`.
- When a canonical prop and its deprecated alias are both present, `isPaused` and `isInteractive` win.
- Keep `startTime`, `endTime`, `playbackRate`, and `modeTransitionDuration` for calibration and existing consumers, but remove them from canonical product examples.
- Keep `assetsPath` as an advanced deployment escape hatch.
- Keep `preloadRazorSenseAssets` and `preloadRazorSenseModeAssets` as aliases.
- Keep `mode` precedence over `preset` for JavaScript calls and retain the development warning.

Legacy shader code loads only when a consumer uses a legacy preset or shader control.

The runtime routing rule is deterministic:

1. An explicit `mode` selects the semantic renderer.
2. A canonical-only prop such as `isPaused`, `isInteractive`, or `accessibilityLabel` selects semantic Neutral when `mode` is omitted.
3. `preset="default"`, `preset="zoomed"`, and `preset="bottomWave"` select their existing semantic programs when no raw shader control is present.
4. A raw shader asset, uniform, or legacy-only preset selects the dynamically loaded legacy renderer.
5. A call with semantic and legacy controls selects the semantic renderer and warns once in development.
6. A call with none of these controls selects semantic Neutral.

### Preload API

Critical above-the-fold and interaction-adjacent surfaces can warm exact assets before mounting.

```ts
type PreloadRazorSenseOptions = {
  modes: RazorSenseMode | readonly RazorSenseMode[];
  colorSchemes?: 'light' | 'dark' | readonly ('light' | 'dark')[];
  assetsPath?: string;
};

function preloadRazorSense(options: PreloadRazorSenseOptions): Promise<void>;
```

The helper resolves the same capability-selected source that the component will use. Repeated calls share one promise per asset URL. A failed preload does not prevent the component from retrying when mounted.

`colorSchemes` defaults to `light` for compatibility with the existing preload helper. Dark or theme-switchable applications must pass `dark` or both schemes explicitly.

## Runtime architecture

### Module boundaries

The productized implementation separates five responsibilities.

1. `RazorSense`: public semantic host and compatibility router.
2. `RazorSenseRuntime`: per-document visibility, capability, asset, and telemetry registry.
3. `RazorSenseAuthored`: operational video programs.
4. `RazorSenseMood`: emotional WebGL renderer and final-color fallbacks.
5. `RazorSenseLegacy`: dynamically loaded shader workbench for existing consumers.

The default Neutral path statically loads the semantic host and authored renderer. Emotional and legacy modules load on demand. Consumer bundlers can therefore exclude the emotional shader and legacy workbench from the first application chunk.

### Shared runtime

One `RazorSenseRuntime` instance exists per browser document. It owns:

- one `IntersectionObserver` for all RazorSense instances;
- one Page Visibility listener;
- cached `MediaCapabilities` results;
- in-flight asset preload promises;
- active decoder and WebGL context accounting;
- development-only performance diagnostics.

Component instances register and unregister with the runtime. They do not install independent global listeners.

### Lifecycle

Each instance moves through five internal states.

```text
dormant <-> warm <-> active <-> suspended
               ^                   |
               |                   v
               +------ cold <------+
```

| State       | Trigger                                                               | Resource policy                                                                           |
| ----------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `dormant`   | Outside the 240 px warm margin and never activated                    | No media source, decoder, RAF, or WebGL context                                           |
| `warm`      | Within the warm margin or explicitly preloaded                        | Resolve codec, load the active asset, and prepare the selected renderer                   |
| `active`    | Intersects the viewport, document is visible, and `isPaused` is false | Play the active source and render exact frames                                            |
| `suspended` | Offscreen, document hidden, or explicitly paused                      | Stop playback, video callbacks, shader RAF, and pointer work; retain the exact last frame |
| `cold`      | Suspended for 10 seconds                                              | Release inactive media and GPU resources; retain a 2D snapshot of the exact last frame    |

The 240 px warm margin covers one common composer band before it enters the viewport. The 10 second cooldown avoids decoder and context churn during short chat scrolls. Browser profiling may tune these internal constants without changing the public API.

`isPaused` freezes both media and time-dependent shader behavior. It does not allow the shader clock to continue behind a frozen video.

The component reserves its requested layout immediately but keeps the material layer hidden until the first exact frame is ready. This avoids exposing an uncalibrated intermediate gradient or grayscale source.

### Active-source policy

The component initially loads only the requested mode.

- Operational modes retain the current source and an incoming source only during a transition.
- Thinking uses its required two-video seam pair while active.
- Desktop emotional modes bind one active video texture. An incoming texture is added only after it is decoded and ready to transition.
- Interrupted emotional transitions retain every source with a non-zero blend weight until that weight reaches zero. Normal transitions use two decoders. Rapidly interrupted transitions may temporarily use three or four decoders to preserve the exact blended material, then release them as soon as their weights reach zero.
- Mobile emotional modes render the current and incoming final-color videos only.
- Cross-family transitions keep the outgoing exact frame visible until the incoming renderer presents a decoded frame.

The shader can retain four sampler slots for stable uniform layout. Unloaded modes bind a one-pixel placeholder texture and consume no decoder.

### Renderer scheduling

- Use `requestVideoFrameCallback` to mark a video texture dirty when a decoded frame reaches the compositor.
- Use RAF only while an active shader has time-dependent work, an active transition, or a live pointer trail.
- Upload dirty video textures before issuing the draw call.
- Reuse allocated textures instead of reallocating storage for each frame.
- Keep one fullscreen draw call per emotional instance.
- Cache uniform and attribute locations outside the render loop.
- Use `powerPreference: 'default'`; the browser should choose the appropriate GPU.
- Eagerly delete textures, buffers, and programs on disposal.
- Deliberately lose a context only after its exact output has been copied to the cold snapshot.
- Treat deliberate cold-state context loss as normal cleanup. Only unexpected context loss calls `onError`.

The emotional shader's flute geometry, displacement, palette stops, dither, overscan, blur, and transition math remain unchanged unless visual comparison proves a correction is required.

### Canvas sizing

Use `ResizeObserver`'s physical pixel box when available. Fall back to measured CSS size multiplied by device pixel ratio.

Do not expose a quality prop or silently reduce detail based on GPU-name heuristics. A render-size cap may only be applied when fixed-frame comparisons prove that pixels above the cap add no source detail. A constrained device falls back to an exact authored still rather than a simplified material.

## Asset architecture

### Internal manifest

Each mode and appearance resolves through an internal asset descriptor.

```ts
type RazorSenseVideoSource = {
  src: string;
  type: string;
  codec: string;
  width: number;
  height: number;
  bitrate: number;
  framerate: number;
};

type RazorSenseAsset = {
  sources: readonly RazorSenseVideoSource[];
  fallbackSrc: string;
  representativeFrameSrc: string;
};
```

The source order does not decide codec choice. Blade queries `MediaCapabilities.decodingInfo()` and selects the first candidate that is supported, smooth, and power-efficient. It then falls back to supported and smooth, followed by the H.264 fallback.

### Representative stills

The first implementation generates and ships calibrated final-color stills for every required fallback:

- eight operational stills: four modes in light and dark;
- eight desktop emotional stills: four modes in light and dark at 1364 by 440;
- eight mobile emotional stills: four modes in light and dark at 360 by 484.

Generate each still from the current production renderer at the fixed representative phase recorded in the asset manifest. Export a lossless source image, then create a delivery derivative only when it passes the same visual thresholds as video derivatives. A human visual review approves each light, dark, desktop, and mobile still before it becomes a reduced-motion or failure fallback.

### Delivery rules

- Produce every codec candidate from the same authored master, never by transcoding a previously compressed derivative when the master is available.
- Remove audio tracks.
- Preserve source frame rate, duration, loop points, color primaries, transfer function, matrix, and phase.
- Publish immutable, versioned asset URLs with long-lived cache headers.
- Replace the current `@latest` default CDN path with the package's build-time version so code and assets cannot drift across releases.
- Load no mode asset until that mode is warm, active, or explicitly preloaded.

H.264 remains the universal fallback. AV1, VP9, and HEVC candidates can be added independently when the asset pipeline can produce and visually verify them.

## Multiple-instance admission policy

The shared runtime limits simultaneous animated work without relying on undocumented browser context limits.

- At most four RazorSense instances animate in one document.
- At most two of those instances use WebGL emotional renderers.
- Paused, suspended, dormant, and cold instances do not count against the budget.
- Additional visible instances display their exact calibrated representative still.
- Admission order is deterministic: an interactive instance with an active pointer first, then larger visible intersection area, then document order.
- When an admitted instance leaves the active state, the highest-ranked waiting instance becomes active and resumes from its authored start phase.
- Development builds warn when an instance is held on its still because the document budget is full. Production builds remain silent.

Recipes are designed to stay within this budget. The cap protects products from accidental one-instance-per-message or one-instance-per-card usage.

## Accessibility and motion preference

RazorSense is decorative by default:

```html
<div aria-hidden="true">...</div>
```

When `accessibilityLabel` is supplied, the outer element uses `role="img"` and that label.

Product meaning must still be communicated by the owning Blade component or text. RazorSense never acts as the sole indication of loading, progress, success, caution, or failure.

When `prefers-reduced-motion: reduce` is active, RazorSense displays the calibrated representative frame for the requested mode and appearance. This is an art-directed state, not a lower-quality renderer. Consumers do not receive an override that can ignore the user's system preference.

## Semantic state standard

| Product state                 | RazorSense mode | Use                                                               |
| ----------------------------- | --------------- | ----------------------------------------------------------------- |
| Idle agent surface            | `neutral`       | Default ambient material                                          |
| Composition intent            | `typing`        | Start on focus or intent, before the first glyph                  |
| Active agent reasoning        | `thinking`      | Use while the request or reasoning trace is in progress           |
| Long-running nonblocking work | `calm`          | Communicate steady progress while the user can continue           |
| Meaningful successful outcome | `joyful`        | Reserve for an outcome worth acknowledging                        |
| Review or risk required       | `caution`       | Pair with explicit review text and actions                        |
| Unable to complete or recover | `regret`        | Pair with an explanation and recovery action                      |
| Branded blocking transition   | `loading`       | Use for a rare identity-forming transition, not generic reasoning |

For competing states in one expressive zone, precedence is:

```text
regret or caution -> thinking -> typing -> neutral
```

`joyful` and `calm` are explicit workflow outcomes, not automatic overrides. A composer can use its own Typing band while the conversation zone remains Thinking because they are separate expressive zones.

## Surface recipes

Recipes are executable Storybook stories and durable MCP guidance. They are not new public wrapper components.

### Chat composer

- Place one Typing band as an absolute sibling behind `ChatInput`.
- Start Typing on `onFocus` or explicit composition intent.
- Do not restart the authored impulse for every keystroke.
- Keep ChatInput's validation, focus, attachments, and submit controls above the material.

### Agent reasoning

- Place one Thinking field behind the assistant response zone.
- Map `ChatMessage.isLoading` or `reasoningStatus="loading"` to Thinking.
- Do not mount one instance for each reasoning step or historical message.
- Keep loading text and reasoning traces as the accessible status.

### Agent response

- Choose Calm, Joyful, Caution, or Regret once from the response outcome.
- Set `isInteractive={false}` when controls or selectable content sit above the field.
- Pair Caution and Regret with explicit copy and recovery actions.

### Branded loader

- Use Loading at a compact canonical size, initially 160 by 160 px.
- Pair it with `Spinner`, `ProgressBar`, visible text, or `VisuallyHidden` status.
- Preserve the authored one-shot formation and terminal hold.

### Featured result or card

- Render RazorSense and Card as siblings inside a relative `Box`.
- Keep RazorSense behind the Card; do not insert it as an arbitrary Card child.
- Use one featured result, not a repeating grid of animated cards.

### Login and hero

- Use Neutral for the major panel or full-stage material.
- Optionally layer a separate Typing band behind the primary input zone.
- Keep headings, forms, and navigation on crisp foreground surfaces.

### Dark agent workspace

- Place one Neutral field behind the expressive workspace.
- Let the nearest `BladeProvider` switch the material.
- Keep dense data tables and navigation on contrast-protected foreground surfaces.

### Ambient application surface

- Use Neutral or Calm in an intentionally expressive agent workspace.
- Disable interaction for background use.
- Avoid dense dashboards, repeated cards, notifications, and status rows.

## Error handling and fallbacks

- Keep the outgoing exact frame visible while an incoming asset decodes.
- If the incoming asset fails, retain the outgoing frame, call `onError` once, and avoid a blank flash.
- If initial media fails, show the calibrated representative frame for the requested mode and appearance.
- If WebGL creation or restoration fails, show the same calibrated still. Do not expose raw grayscale source media or a generic CSS gradient.
- Recreate every buffer, texture, program, and uniform binding after a restorable context loss.
- Log detailed diagnostics only in development.

React Native remains explicitly unsupported in this implementation. It must not silently claim animated parity through a static substitute. A future native renderer can adopt the same semantic API and asset manifest without changing consumers.

## Performance budgets

The implementation is complete only when before-and-after measurements prove these budgets.

| Scenario                    | Budget                                                                                                                       |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Cold emotional mode         | One active media request before interaction; no inactive mode downloads                                                      |
| Cold operational mode       | One active source, except the two-source Thinking seam                                                                       |
| Transition                  | Current and incoming sources normally; up to four weighted sources during rapid interruption, released as weights reach zero |
| Offscreen or page-hidden    | Zero active media playback, video callbacks, shader RAF, and pointer work                                                    |
| Default semantic JavaScript | At most 10 KB gzip incremental RazorSense code before an emotional or legacy mode is requested                               |
| Emotional chunk             | At most 12 KB gzip incremental code                                                                                          |
| Visible playback            | Less than 1% dropped video frames in the representative browser matrix                                                       |
| Desktop shader              | P95 frame interval at or below 18.5 ms on the reference desktop profile                                                      |
| Mobile final-color playback | P95 frame interval at or below 33.3 ms on the reference mobile profile                                                       |
| Multiple instances          | At most four animated instances and two WebGL contexts per document; denied instances use exact stills                       |

The current Calm implementation transfers 3.64 MB because it loads all four emotions. The lifecycle target is the active Calm clip only, currently 0.55 MB, before codec optimization.

### Measurement protocol

Every performance result records the exact commit, browser version, operating system, viewport, device pixel ratio, and asset cache state.

- Bundle size: use the workspace's pinned esbuild 0.27.2, browser ESM output, minification enabled, React and Blade aliases external, and gzip level 9. Measure the semantic host, authored path, emotional chunk, and legacy chunk separately.
- Cold network: disable the browser cache, reload the direct Storybook iframe, and report the median request count and encoded bytes across three runs.
- Frame pacing: discard a two-second warm-up, collect ten seconds of video and RAF timing, and repeat five times. Report median P50, P95, P99, and dropped-frame percentage.
- Reference desktop: the current Apple M5 Pro MacBook Pro with 24 GB memory, latest stable Chrome, 1364 by 440 viewport, and device pixel ratio 2. The result records the exact operating system and browser version.
- Reference mobile profiles: iPhone 13 Safari at 360 by 484 and Pixel 6 Chrome at 360 by 484. When physical devices are unavailable, emulation is labeled as emulation and cannot prove the mobile hardware gate.
- Load stress: repeat cold-network measurements on Fast 4G and frame measurements under 4x CPU throttling as supplementary diagnostics. These do not replace the unthrottled reference gate.

The desktop frame-pacing budget is P95 at or below 18.5 ms rather than exactly one 16.7 ms refresh interval, which avoids rejecting stable playback because of timer quantization. The mobile budget remains P95 at or below 33.3 ms for the 24 to 30 fps final-color assets.

## Visual fidelity gates

No performance optimization may change the launch-film material.

Verify fixed source phases and transitions against the existing visual specification:

- every operational mode at its authored attack, peak, hold, and loop seam;
- every emotional mode at the production viewport and source phase;
- transitions at 0, 250, 500, 750, and 1000 ms;
- interrupted emotional transitions;
- light and dark appearance;
- 1364 by 440 desktop and 360 by 484 mobile stages;
- provider appearance changes without blank frames;
- reduced motion and WebGL-failure stills.

Lifecycle-only changes should produce no fixed-phase pixel difference. New codec derivatives must meet all of these thresholds:

- SSIM at least 0.995;
- PSNR at least 42 dB;
- Delta E 2000 at the 95th percentile no greater than 1.5;
- no flute, rail, bloom, or aperture edge shift greater than one physical pixel;
- no visible banding at palette ramps or dark silver echoes.

The visual review can reject a derivative even when numerical thresholds pass.

## Verification scope

Prioritize output and runtime evidence over a large test suite.

1. Add component-level type coverage for the canonical API and deprecated aliases.
2. Add small lifecycle tests only where browser verification cannot prove cleanup reliably.
3. Measure uncached network requests and bytes for each renderer family.
4. Measure mounted media elements, active decoders where observable, WebGL contexts, dropped frames, frame intervals, and hidden-state work.
5. Exercise rapid mode changes, light and dark appearance changes, viewport entry and exit, page visibility, reduced motion, and WebGL failure.
6. Capture Storybook screenshots and transition frames for every recipe.
7. Run targeted typecheck and formatting. Do not expand into unrelated cleanup.

## Documentation deliverables

- `packages/blade/src/components/Spark/RzpGlass/_decisions/decisions.md`: stable API, lifecycle, performance, accessibility, and considered alternatives.
- `packages/blade/src/components/Spark/docs/RazorSenseRecipes.stories.tsx`: executable product recipes.
- `packages/blade/src/components/Spark/docs/RazorSenseVisualSpec.md`: retain as the visual calibration contract and update implementation references.
- `packages/blade-mcp/knowledgebase/components/RazorSense.md`: canonical component API and constraints.
- `packages/blade-mcp/knowledgebase/patterns/SparkAnimation.md`: semantic state mapping and application recipes.

## Considered alternatives

### Public `RazorSenseSurface`

Rejected for this pass. A wrapper would immediately need crop, placement, scrim, padding, foreground contrast, layout, and content escape hatches. It would duplicate `Box` and would not fit a composer band, compact loader, featured result, and full-page hero through one stable contract.

Add a wrapper only after real consumers repeat the same structure without variation.

### RazorSense props on Blade leaf components

Rejected. Adding animation props to `ChatInput`, `ChatMessage`, `Card`, `Alert`, or Toast would distribute resource policy, create competing instances, couple heavy rendering to functional components, and obscure ownership when application states overlap.

### Public renderer and quality controls

Rejected. Renderer choice, codec, pixel ratio, and quality tiers are implementation details. Exposing them would let consumers break the craft contract and would make future renderer improvements source-breaking.

### OffscreenCanvas and WebCodecs in the first pass

Deferred. They add worker orchestration, demuxing, explicit frame queues, and resource ownership. Adopt them only if the completed lifecycle and video-frame scheduling work still leaves a measured main-thread or decode bottleneck.

## Final decision

Blade will ship one semantic RazorSense primitive, an automatic shared runtime, capability-selected assets, and executable composition recipes. Surface components remain independent. Performance work removes invisible cost while fixed-phase visual gates protect the launch-film material.
