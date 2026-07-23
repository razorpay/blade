# RazorSense motion reference

Status: implementation source of truth

Date: July 12, 2026

This document separates directly observed behavior from implementation inference. Frame numbers are zero-based. A range marked **observed** was checked against decoded source frames. A range marked **inferred** is a proposed implementation rule that still needs browser comparison against the cited frames.

## Evidence set

| Source                                  |                      Video | Frames |  Duration | Role                                       |
| --------------------------------------- | -------------------------: | -----: | --------: | ------------------------------------------ |
| `NEW Login-Dashboard.mp4`               |      1920 x 1080 at 24 fps |    385 | 16.0417 s | Canonical login-to-dashboard journey       |
| `Audio Wave2.mp4`                       |      1920 x 1080 at 30 fps |    242 |  8.0667 s | Voice/audio activity program               |
| `Loader.mp4`                            |      4500 x 3000 at 24 fps |     75 |   3.125 s | Compact loading mark source                |
| `Main Animation (Without UI).mp4`       |      4500 x 3000 at 24 fps |    210 |   8.750 s | Compact ambient aperture source            |
| `Thinking.mp4`                          |      3000 x 2000 at 24 fps |    108 |   4.500 s | Large thinking field source                |
| `Bottom Wave (Default, Typing).mp4`     |      1920 x 1080 at 25 fps |    250 |  10.000 s | Bottom-edge ambient wave                   |
| `Login-Dashboard (Default, Typing).mp4` |      1920 x 1080 at 25 fps |    481 |  19.240 s | Earlier login journey                      |
| `RAZORSENSE VIDEO.mp4`                  |      1920 x 1080 at 30 fps |   2627 | 87.5947 s | Launch-film product and dark-mode evidence |
| RazorSense design-language website      | responsive browser surface |   live |      live | Emotional modes and pointer response       |

The implementation must never use either login video as a production UI texture. They are composition references. The executable journey must render real Blade UI over the appropriate RazorSense programs.

## Canonical login-to-dashboard journey

Source: `NEW Login-Dashboard.mp4`.

### Timeline

| Phase                    |  Frames |            Time | Observation                                                                                                                                                                   | Implementation contract                                                                                                                                                     |
| ------------------------ | ------: | --------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Login hold               |   0-148 |   0.000-6.167 s | **Observed.** The form, copy, and crop are stable while the left material moves internally.                                                                                   | Real Blade login UI remains interactive. RazorSense runs as an ambient background program.                                                                                  |
| Form exit                | 149-159 |   6.208-6.625 s | **Observed.** A large glass field expands horizontally across the form. The material covers/clips the crisp UI; this is not a black wipe, a UI blur, or an opacity-only fade. | The built-in sequence keeps the outgoing UI mounted, collapses the live rail material into the mark, and uses a synchronized tinted cover; consumers do not animate the UI. |
| Material bleach          | 159-169 |   6.625-7.042 s | **Observed.** The field becomes near-white while its large geometry continues drifting.                                                                                       | Hold the final large-field composite; do not expose a blank DOM background.                                                                                                 |
| Loader overlap           | 170-171 |   7.083-7.125 s | **Observed.** The first compact loader ghost appears before the large field has completely vanished.                                                                          | Incoming loader readiness overlaps the outgoing field by roughly two source frames.                                                                                         |
| Loader beat 1            | 172-221 |   7.167-9.208 s | **Observed.** Complete compact blue-to-ghost pulse.                                                                                                                           | One `compactLoader` occurrence, accelerated from the standalone source.                                                                                                     |
| Loader beat 2            | 222-271 |  9.250-11.292 s | **Observed.** A second distinct occurrence of the same pulse.                                                                                                                 | Replay the same preset without remounting the host. Occurrence identity must differ from target equality.                                                                   |
| Loader beat 3            | 272-295 | 11.333-12.292 s | **Observed.** Third pulse begins and is interrupted before its natural terminal.                                                                                              | `finish-current` is not used here; the authored edge replaces the active beat at a named cue.                                                                               |
| Aperture expansion       | 296-316 | 12.333-13.167 s | **Observed.** The compact mark opens into large rails. “Let’s start our journey” becomes visible at frames 305-306.                                                           | The built-in sequence expands the destination rail material and aperture mask together, then emits the foreground cue at the recorded frame boundary.                       |
| Dashboard shell reveal   | 317-323 | 13.208-13.458 s | **Observed.** Top chrome appears first, then the shell/background becomes readable.                                                                                           | Reveal shell behind the moving rails. No independent UI fade timer.                                                                                                         |
| Dashboard content reveal | 324-347 | 13.500-14.458 s | **Observed.** Heading and prompt enter first; lower cards and chips follow from frame 330.                                                                                    | Step lifecycle events drive ordered real-UI visibility. RazorSense remains one continuous material.                                                                         |
| Settled dashboard        | 348-384 | 14.500-16.000 s | **Observed.** Composition is effectively settled and held.                                                                                                                    | Final program loops or holds without restarting the journey.                                                                                                                |

### Loader source correlation

The three loading beats are not arbitrary timers. Normalized frame metrics correlate the first two beats with `Loader.mp4` at 0.99-0.997 when the 75-frame, 3.125-second source is mapped to approximately 50 frames, or 2.083 seconds. The third occurrence is deliberately interrupted.

**Verified implementation:** the built-in manifest registers named source cues and maps the 75-frame loader source at `1.5x` for the first two 50-frame windows. A July 13 browser replay confirmed the three distinct occurrences, the deliberately shortened third beat, and the handoff into the frame-296 reveal without a blank frame. Consumers do not receive those calibration numbers.

### Geometry and compositing

- **Observed:** the exit and reveal are material transitions, not unrelated clip fades.
- **Observed:** foreground UI is progressively occluded and revealed by large glass rails.
- **Observed:** the compact mark and large rails share the same slanted flute language.
- **Inferred:** the scalable implementation should use a masked foreground layer plus a RazorSense transition program. It must not bake product UI into video.
- **Inferred:** `collapse-to-mark` and `expand-from-mark` are private authored edges. They are selected by the built-in login sequence and are not raw shader props.

### Interruption behavior

- Before form exit starts, replacement returns to the login ambient state.
- During form exit, replacement preserves the current composite, prepares the requested target, and transitions from that exact frame.
- During loader beats, `replace` starts the newest request after its first frame is ready; `finish-current` waits only for the current pulse boundary; `queue` waits for the full run.
- During dashboard reveal, navigation and business completion never wait on the decorative sequence. Cancellation commits the current real UI and freezes or releases the material safely.

The first three rules are implementation policy inferred from the product requirement. The source video contains no user interruption, so they must be verified adversarially rather than described as observed behavior.

## Audio wave

Source: `Audio Wave2.mp4`.

| Phase              | Frames |          Time | Observation                                                                                                                           | Contract                                                                                               |
| ------------------ | -----: | ------------: | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| White lead-in      |   0-12 | 0.000-0.400 s | **Observed.** Pure white.                                                                                                             | Do not use this frame as a loop seam. It may be retained as the one-shot entry.                        |
| Entry              |  13-29 | 0.433-0.967 s | **Observed.** First non-white at frame 13, measurable blue by frame 18, full waveform width by frame 29.                              | `audioWave` one-shot fades/materializes from the representative background.                            |
| Active deformation | 30-240 | 1.000-8.000 s | **Observed.** Fixed center and width with irregular internal pulses; broad maxima near 1.80, 3.20, 4.57/5.23, 6.10, and 7.70 seconds. | Geometry envelope remains centered; amplitude is authored, not synthesized from random CSS transforms. |
| Active terminal    |    241 |       8.033 s | **Observed.** The final frame is still active.                                                                                        | Default to one-shot with terminal hold. The full source is not loop-safe.                              |

The source contains no exit and its first and last frames are incompatible. A looping audio state therefore needs either a separately authored seam segment or a procedural phase-continuous waveform. Repeating the whole clip is prohibited because it flashes to white.

## Compact loader

Source: `Loader.mp4`.

| Phase | Approximate time | Observation                                                             | Contract                                                                                |
| ----- | ---------------: | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Entry |    0.000-0.750 s | **Observed.** A faint sliver grows into a saturated blue compact mark.  | One-shot starts from an exact transparent/white-compatible frame.                       |
| Peak  |    0.750-1.750 s | **Observed.** Blue mark is fully legible and internally refracted.      | Preserve the dense flute edge and blue core.                                            |
| Exit  |    1.750-3.125 s | **Observed.** Saturation and opacity fall into a pale green/blue ghost. | Terminal frame holds when requested; automatic sequences advance at the media terminal. |

The default `loading` semantic state uses this program once and holds. The `compactLoader` preset exposes the same visual for authored sequences. Repeated beats are separate occurrences.

## Main compact aperture

Source: `Main Animation (Without UI).mp4`.

- **Observed:** the program begins with a pale compact aperture, reaches high blue intensity around 3.25-4.00 seconds, recedes, then rises again around 6.00-6.50 seconds before fading to a pale terminal by 8.75 seconds.
- **Observed:** the aperture outline and flute topology stay coherent; intensity travels through the material.
- **Inferred:** this is an ambient/brand one-shot, not a seamless whole-file loop. A loop must use registered internal cue boundaries proven by frame comparison.

## Thinking field

Source: `Thinking.mp4`.

- **Observed:** large diagonal rails fill and overscan the 3:2 composition for the full 4.5 seconds.
- **Observed:** color remains a restrained mint/cyan/blue field; perceived motion comes from rail drift, refraction, and changing bloom rather than large object translation.
- **Observed:** first and last frames are close in composition but not identical.
- **Implemented contract:** desktop Thinking uses two synchronized media layers with a 0.6-second crossfade seam. A secondary-layer failure degrades to the primary loop without a blank frame.

## Bottom wave

Source: `Bottom Wave (Default, Typing).mp4`.

- **Observed:** the material is confined to a thin overscanned band along the lower edge for the entire 10-second source.
- **Observed:** the upper field stays visually empty; motion is lateral and internal within the band.
- **Observed:** blue and pale green energy alternate across the horizon without changing the crop.
- **Implemented boundary:** the exact ten-second source supports finite `once` or `repeat` playback. Loop remains rejected until an authored seam is verified. It must never be center-cropped into a generic full-field material.

## Earlier login journey

Source: `Login-Dashboard (Default, Typing).mp4`.

- **Observed:** the login UI holds through roughly 6.5 seconds.
- **Observed:** a large glass wipe covers the UI around 6.5-7.2 seconds.
- **Observed:** compact loader pulses occupy roughly 7.4-12.7 seconds.
- **Observed:** the mark expands into rails around 12.7-13.4 seconds.
- **Observed:** the dashboard shell and content progressively appear from roughly 13.4-15.5 seconds and then hold.

These are coarse contact-sheet boundaries. The newer 24 fps journey above is canonical where the two differ.

## Launch-film product journey

Source: `RAZORSENSE VIDEO.mp4`.

The film is editorial evidence rather than a single reusable sequence. The following table is an observed one-second editorial map, not a frame-accurate transition specification. Dense inspection in this document is limited to the explicitly timestamped login, loader, audio-wave, thinking, bottom-wave, website-interaction, and dark-material boundaries. A product recipe must not claim launch-film shot fidelity beyond those recorded boundaries without a new dense comparison.

|      Time | Observed role                                                                                                                                        |
| --------: | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
|     0-9 s | Product collage resolves into an AI assistant surface and typing interaction.                                                                        |
|   10-27 s | Design philosophy, “alive / expressive / dynamic,” RazorSense mark, and brand material construction.                                                 |
|   28-36 s | Dashboard/agent surface, prompt entry, submit focus, and transition into agent work.                                                                 |
|   37-42 s | Thinking/progress treatment behind real UI and staged task completion.                                                                               |
|   43-54 s | Emotional material applied to caution, regret, calm, and joyful result surfaces.                                                                     |
|   55-65 s | Branded success/result patterns, compact mark, cards, insight surfaces, and response UI.                                                             |
|   66-69 s | **Observed dark appearance.** The same dashboard composition uses a near-black material base with saturated blue rails and retained edge definition. |
|   70-73 s | Light surface collage of RazorSense applications.                                                                                                    |
|   74-82 s | Design-language titles and the audio-wave form.                                                                                                      |
| 83-87.6 s | Closing brand and URL.                                                                                                                               |

Dark mode is a separate calibrated material, not a color inversion. The launch film directly verifies the saturated blue treatment, dark neutral base, luminous rail edges, and readable foreground contrast. The green, orange, and red dark palettes are Blade calibration derived from the emotional modes rather than launch-film observations.

## Website emotional modes

Source: `https://razorpay.com/razorsense/#design-language` and its July 12, 2026 desktop module.

### Pointer response

This is directly observed in the live output and proved from the website implementation:

1. A static flute/displacement map is built once.
2. The pointer trail changes source/background sampling offsets, blur, and hue.
3. The fixed displacement field is still indexed by the unwarped output pixel.
4. Therefore rail pitch, topology, and screen position remain fixed while material underneath them refracts and changes color.

The pre-fix Blade shader evaluated `fluteMap(pointerWarp(vUv))`, which moved the rail topology with the pointer. The current implementation evaluates source/background sampling at the warped coordinate and the flute field at `vUv`; the rails therefore remain screen-fixed while the material beneath them refracts. Any future interaction change must preserve that separation.

Additional observed parameters from the website are evidence for calibration, not public API:

- response begins after a 4-second delay;
- trail decays to 90% of the previous frame;
- flow basis is rotated by 15 degrees;
- the trail creates a persistent radial swirl;
- hue response is approximately 7 degrees;
- mobile at 809.98 px and below uses pre-rendered 360 x 484 clips with a 600 ms crossfade and no equivalent pointer response.

Dark hover behavior was not present in the inspected desktop evidence and must not be claimed as exact. Blade should use the same screen-fixed topology rule with its calibrated dark palette, then verify the result in the browser.

## Global transition rules

These rules combine observed behavior with the product requirements:

1. Preserve the exact outgoing composite until the incoming target has an exact decoded or drawn frame.
2. Keep at most the current and incoming renderer live in normal operation.
3. Cross-renderer transitions use the current composite as their continuity source; never reveal a blank canvas, source grayscale, placeholder gradient, or wrong appearance.
4. Same-target replay uses occurrence identity and restarts the program without remounting the public host.
5. A one-shot emits its terminal after the last decodable frame and may hold that frame.
6. A loop can stop at its next registered safe boundary for `finish-current`.
7. Provider appearance changes preserve occurrence and playback phase while replacing the material with the newest appearance generation.
8. Reduced motion commits the representative target frame and collapses decorative time; application progress must not wait on decorative playback.
9. Mobile uses registered crops or mobile sources. Desktop media must not be naively squeezed into a portrait box.
10. Foreground UI remains real, accessible Blade content. RazorSense is never the only loading, success, caution, or failure signal.

## Verification checkpoints and evidence status

The timestamps below are the required comparison set. They record which source boundaries must be inspected; they are not, by themselves, proof that the final browser output matches. A verification handoff must pair each important source boundary with a browser capture or explicitly label it unverified.

For the login journey, browser captures must include frames equivalent to source frames 148, 149, 159, 169, 170, 172, 221, 222, 271, 272, 295, 296, 305, 317, 320, 324, 336, and 348.

For Audio Wave, captures must include source frames 0, 12, 13, 18, 29, 54, 96, 137, 183, 231, and 241.

Every calibration pass compares:

- crop and overscan;
- flute pitch and screen position;
- material edge displacement;
- bloom radius and luminance;
- representative palette samples;
- foreground occlusion/reveal order;
- blank-frame count;
- loop first/last-frame discontinuity;
- light/dark appearance;
- desktop/mobile crop;
- interruption from each boundary phase.

On July 13, 2026, the 16:9 Storybook journey was replayed continuously and visually inspected at 6.50 s, 7.05 s, 12.60 s, 13.20 s, and 14.50 s. The checks confirmed real foreground UI, distinct loader occurrences, a material collapse/reveal, ordered shell/content/card cues, and no blank or grayscale handoff. The source film contains only a baked composite, so the clean material rail geometry remains a reconstructed implementation rather than a byte-exact derivative. The exhaustive checkpoint list above is the calibration set for any future clean source delivery; exact-fidelity claims remain limited to comparisons reported with their timestamp, viewport, appearance, and measured or visually inspected result.
