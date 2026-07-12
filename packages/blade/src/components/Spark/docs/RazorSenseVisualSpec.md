# RazorSense visual and implementation specification

This is the source-backed contract for Blade's RazorSense renderer. It records the observable material, motion, state semantics, and playback rules. It intentionally separates verified output from assumptions about the original After Effects graph.

## References inspected

- Launch film: `/Users/aditya.nawal/Downloads/RAZORSENSE VIDEO.mp4` — 1920×1080, 30 fps, 87.567 seconds.
- Live design-language experience: <https://razorpay.com/razorsense/#design-language>.
- `Main Animation (Without UI).mp4` — 4500×3000, 24 fps, 8.750 seconds.
- `Thinking.mp4` — 3000×2000, 24 fps, 4.500 seconds.
- `Loader.mp4` — 4500×3000, 24 fps, 3.125 seconds.
- `Bottom Wave (Default, Typing).mp4` — 1920×1080, 25 fps, 10.000 seconds.
- `Login-Dashboard (Default, Typing).mp4` — 1920×1080, 25 fps, 19.240 seconds.
- The deployed Framer runtime, its four desktop motion fields, its four mobile composites, and its interface-application films.

All five supplemental clips are opaque, final-color H.264 renders with no audio or alpha channel.

## The invariant material

RazorSense is one master glass form seen through different cameras and energy states. It is not a family of unrelated ambient gradients.

The canonical form is a right-leaning open flute or trapezoid:

- two side rails lean roughly 12–18° right from vertical;
- the lower edge is nearly horizontal;
- the upper edge rises steeply to the right;
- 24–30 tapered blade cells create serrated combs along the long edges;
- the center alternates between translucent glass, broad caustics, and an overexposed aperture;
- most motion is internal. The silhouette does not bounce, rotate, or re-randomize.

Measured starting anchors on the 3:2 master stage:

```ts
const master = {
  outerQuad: [
    [0.23, 0.88],
    [0.62, 0.88],
    [0.78, 0.04],
    [0.36, 0.38],
  ],
  innerQuad: [
    [0.31, 0.75],
    [0.57, 0.75],
    [0.69, 0.22],
    [0.43, 0.4],
  ],
  bladePitch: 0.0177,
  bladeLeanDegrees: 15,
  railCoreShortAxis: 0.04,
  railFwhmShortAxis: 0.06,
  railHaloShortAxis: 0.15,
};
```

Bloom moves the apparent boundary, so these are comparison anchors rather than source vectors.

## Material layer recipe

The final composite needs distinct layers. A single blurred polygon cannot reproduce it.

1. Neutral near-white or blue-gray stage.
2. Low-frequency lime under-volume.
3. Broad cyan refraction volume.
4. Stable repeated blade cores with tapered ends.
5. Stronger cobalt energy on the perimeter and lower comb.
6. Large white caustic lobes moving through the aperture.
7. Normal-directed chromatic fringe: cyan outside, cobalt core, lime trailing edge.
8. Wide bloom and local overexposure after the crisp core.

At peak energy, the measured main rail uses approximately 4.1% of the short axis for its high-intensity core, 5.9% for blue-excess FWHM, and 15.2% for the low-level halo. This separation between crisp rail and broad volume is the defining glass cue.

Representative color anchors from decoded references:

| Role          | Anchors                                    |
| ------------- | ------------------------------------------ |
| Cobalt core   | `#2B54E0`, `#4677E8`, `#567DE7`, `#769EED` |
| Cyan bridge   | `#6CB2E8`, `#8BCEE6`, `#9ED0F4`, `#AECEF0` |
| Lime ghost    | `#D9EEDE`, `#E3FBDD`, `#EDF6E5`            |
| Neutral glass | `#EBF1F2`, `#D5E6EA`, `#B9D3EC`            |

## Operational programs

Blade exposes four output-first operational programs. The source clips already contain the complete rail, comb, caustic, fringe, and bloom stack, so the current renderer uses high-quality optimized derivatives as its fidelity baseline. The semantic API is independent of that implementation and can move to a fully procedural master without changing consumers.

| Mode       | Reference and camera                             | Playback contract                                                                                                             |
| ---------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `neutral`  | Canonical full form from Main Animation          | Seam-safe outer loop. The shipped derivative loops at the visually identical 8.708-second seam.                               |
| `typing`   | Bottom-horizon crop, source segment 6.68–10.00   | One-shot energy impulse. It ends on the authored energized remainder instead of incorrectly looping the full ten-second file. |
| `thinking` | 1.35–1.45× immersive crop, shifted left and down | Continuous two-decoder loop with a 600 ms dissolve because the raw 4.5-second clip is not seam-safe.                          |
| `loading`  | Compact centered identity mark                   | One-shot formation, hold, and dissolve. The final lime ghost is retained; the raw clip is never looped.                       |

The canonical Main loop contains a small introductory breath followed by two differently shaped crests. Its period is not one sine wave. Neutral preserves that authored envelope.

Typing is an energy and edge impulse, not a geometry replacement. Between the Default boundary at 6.68 seconds and the Typing peak at 8.64 seconds:

- mean chroma rises 4.16×;
- strong-color area rises 7.12×;
- edge energy rises 6.55×;
- physical band height grows by only 2.2% of the frame.

The product trigger is focus or typing intent, not the first glyph. In the login film, the field starts rising around 16.4 seconds, the caret appears around 17.2 seconds, and text starts around 17.48 seconds. The field peaks early and decays while typing continues.

## Emotional material

The four website emotions use exact grayscale motion envelopes and one shared refractive field. The state changes palette, envelope, contrast, and cadence while the flute topology stays fixed.

### Desktop source and overscan

- Canonical visible stage: 1364×440.
- Source zoom: 1.206.
- Production effect overscan: 1.34, followed by a center crop.
- 28 repeated black-to-white flute ramps.
- Authoring ramp: 649×34 px, pitch 34 px, rotation 106°.
- Authoring origin offset: +14 x, −18 y.
- Authoring displacement: 6 px x and 11 px y.

Because the effect is authored inside the overscan surface, the effective visible values are:

- ramp width 869.66 px;
- pitch 45.56 px;
- origin offset +18.76 x, −24.12 y;
- displacement 8.04 px x and 14.74 px y;
- first blur 4.02 px, followed by 8.04 px additional vertical softness.

Applying the raw authoring values directly in visible space makes the flutes about 25% too fine and the refraction too weak. Blade applies the overscan scale to geometry, displacement, offsets, and blur distances before cropping.

### Color mapping

- Rec.709 luminance from the displaced source.
- Fixed 8×8 Bayer dither before lookup.
- Six palette stops per emotion.
- Stop colors interpolate in linear light and return to sRGB.
- Mode transitions blend motion weights and palette values together over one second with quintic smootherstep.

| Mode    | Stops                                                                                                      |
| ------- | ---------------------------------------------------------------------------------------------------------- |
| Calm    | `0.2828 #A8CFFE`, `0.3443 #87C0FE`, `0.4508 #5274FF`, `0.4918 #6188FF`, `0.5697 #AACFF8`, `0.6352 #CCE1FC` |
| Joyful  | `0.3600 #F8F8F8`, `0.4100 #D6F5DA`, `0.4800 #C5F0D7`, `0.6500 #6BD9EF`, `0.7000 #C5F0D7`, `0.7900 #F9FBF8` |
| Caution | `0.0000 #FFFBF5`, `0.1270 #FFF0E1`, `0.4221 #FFD1A1`, `0.6230 #FFC58F`, `0.8484 #FAE1C3`, `1.0000 #FDAB59` |
| Regret  | `0.0000 #F66F61`, `0.1066 #FFF0E1`, `0.3402 #FBD3C6`, `0.5205 #FFBEA1`, `0.8525 #F66F61`, `0.9795 #FF807F` |

### Interaction

The pointer response begins after four seconds, matching the site. A low-resolution persistent trail drives:

- anisotropic 15° flow;
- localized refraction and swirl;
- a small seven-degree hue response;
- exponential trail decay rather than a stateless cursor bubble.

Selecting the active emotion again restarts its envelope. An interrupted emotion transition continues from the currently blended weights without remounting the canvas.

### Mobile

At 809.98 px and below, Blade uses the same four final-color 360×484 composites as the site. This preserves the exact portrait crop and avoids running the desktop shader on a phone. Mode layers crossfade over 600 ms.

## Dark material

Dark appearance is a material calibration, not an inversion of the light frame. The launch film contains one true dark RazorSense chapter:

- 66.800–67.433 seconds: a center-out, blade-aligned aperture wipe converts the dashboard;
- 67.433–67.600 seconds: the charcoal stage and neutral silver rim settle;
- 67.600–68.600 seconds: the stable dark hold;
- 68.633–69.567 seconds: a blue-gray veil exits into the cyan-white horizon rather than reversing the inbound wipe.

The stable 68.200-second frame has 85.4% of pixels below 0.18 luminance and only 1.6% above 0.8. Representative anchors are `#16181B` and `#222728` for the stage, `#0F1E43` for deep glass, `#193671` and `#284DA0` for cobalt cores, and rare `#A0A8B8` silver highlights. Compared with the light frame, the dark aperture is about 21% wider, peak blue excess is 2.61× stronger, and its FWHM is 1.41× wider while the broad page wash is suppressed.

Blade follows the nearest `BladeProvider` color scheme automatically:

```tsx
<BladeProvider themeTokens={bladeTheme} colorScheme="dark">
  <RazorSense mode="neutral" width="100%" height="440px" />
</BladeProvider>
```

There is no second appearance prop on RazorSense. The provider remains the single source of truth for the resolved light or dark surface.

Implementation by renderer:

- Operational states use phase-matched dark composites made from the same source frames. Frame rate, duration, one-shot timing, and Thinking seam points remain identical; the dark renderer expands the centered horizontal aperture by 1.2×, then applies the authored palette and exposure.
- Desktop emotional states reuse the grayscale motion envelopes. `uColorSchemeMix` interpolates authored light and dark palettes in linear light, expands the aperture by 1.208×, and introduces a separately gated neutral echo without rebuilding WebGL or restarting the active envelope.
- Mobile emotional states use phase-matched 360×484 dark composites and the same 1.2× centered aperture expansion.
- Operational and mobile appearance changes retain a canvas snapshot of the outgoing decoded frame, restore the incoming phase, and reveal it only after decode. This avoids a background-only flash without keeping a second full decoder set alive.
- Dark Calm uses a restrained cobalt field; Joyful keeps green/teal emission; Caution uses amber cores; Regret uses coral/red volume. Semantic modes do not collapse into one blue treatment.

## Public API

`mode` describes product meaning. Explicit mode selection is preferred:

```tsx
import { RazorSense, preloadRazorSenseModeAssets } from '@razorpay/blade/components';

await preloadRazorSenseModeAssets(['neutral', 'thinking']);
await preloadRazorSenseModeAssets(['neutral', 'thinking'], undefined, 'dark');

<RazorSense mode="neutral" width="100%" height="100%" />;
<RazorSense mode="typing" width="100%" height="240px" />;
<RazorSense mode="thinking" width="100%" height="320px" />;
<RazorSense mode="loading" width="160px" height="160px" />;
<RazorSense mode="calm" width="100%" height="440px" interactive />;
```

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
```

Compatibility behavior:

- `<RazorSense />` and `preset="default"` use authored Neutral.
- `preset="zoomed"` uses authored Thinking.
- `preset="bottomWave"` uses authored Typing.
- `rippleWave`, `circleSlideUp`, and calls with legacy shader-tuning props keep the legacy renderer.
- `preset="legacy"` is the explicit migration escape hatch for the original default shader.
- TypeScript rejects `mode + preset` and `mode + legacy shader knobs`. JavaScript calls still resolve `mode` first and warn in development.

Relevant controls:

- `modeTransitionDuration` controls semantic crossfades.
- `paused`, `playbackRate`, `startTime`, and `endTime` support calibration and controlled playback.
- `interactive={false}` disables the delayed emotional trail.
- `preloadRazorSenseModeAssets(modeOrModes, assetsPath, colorScheme)` preloads only requested states; its defaults are Neutral and light. Pass `dark` when preloading operational or mobile dark composites.

## Implementation map

- `RzpGlass/modes.ts` — semantic modes, asset mapping, backgrounds, and exact playback policies.
- `RzpGlass/RazorSenseAuthored.tsx` — operational video programs, state transitions, one-shots, and the Thinking seam dissolve.
- `RzpGlass/razorSenseMoodShader.ts` — emotional flute geometry, overscan, palette, dither, refraction, and trail response.
- `RzpGlass/RazorSenseMoodMount.ts` — desktop WebGL lifecycle, source textures, transitions, trail feedback, resize, and disposal.
- `RzpGlass/RazorSenseMood.tsx` — desktop/mobile selection and responsive fallbacks.
- `RzpGlass/RzpGlass.tsx` — decode-gated cross-family transition host, semantic routing, and legacy compatibility.
- `RazorSenseModes.stories.tsx` — operational grid, emotional comparisons, fixed-phase calibration, interaction calibration, mobile reference, and product application.

## Browser verification contract

- Compare every emotional mode at the same viewport and source phase as production.
- Compare emotion transitions at 0, 250, 500, 750, and 1000 ms, including interruption.
- Verify both color schemes inside their matching `BladeProvider`; the component must not require an appearance prop.
- In dark output, preserve the charcoal negative space and neutral silver echo rails instead of lifting the whole canvas.
- Verify Neutral at the large crests around 3.25–4.25 and 5.25–7.38 seconds and at the blank loop seam.
- Verify Typing at its 7.20-second attack, 8.64-second peak, and final energized remainder.
- Verify Thinking across its two-decoder seam; no blank or geometry jump is allowed.
- Verify Loading forms once, reaches cobalt around 1.0–1.75 seconds, and ends on the pale lime ghost without replaying.
- Keep product UI in a separate crisp layer above the material.
- Treat geometry, timing, and interruption behavior as the contract. A palette-only resemblance is not parity.
