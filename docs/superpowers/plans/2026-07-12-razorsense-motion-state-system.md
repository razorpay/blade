# RazorSense motion-state system implementation plan

> Use `superpowers:subagent-driven-development` for disjoint implementation lanes and `verify-with-browser` for every visual milestone. The root agent owns public API judgment, integration, and final browser verification.

**Goal:** Ship RazorSense as Blade's controlled semantic visual, typed authored-sequence runtime, and optional event-driven controller while preserving every branded preset and the current exact visual quality.

**Selected architecture:** One persistent host owns the shared-runtime registration, displayed exact composite, hidden incoming slot, optional host-level blend, queue, reducer, events, and promises. Mount-first renderer leases provide occurrence-scoped exact readiness, playback boundaries, capture, pause reasons, appearance revisions, and cleanup. Controlled state, sequence definitions, and the controller compile into that same engine.

**Primary evidence:** `packages/blade/src/components/Spark/docs/RazorSenseMotionReference.md`, the supplied videos, the live RazorSense website, and current fixed-frame assets.

## Approach-family registry

| Family                              | Artifact                                                      | Status                    |
| ----------------------------------- | ------------------------------------------------------------- | ------------------------- |
| Reference-video reverse engineering | Timestamped motion reference and dense decoded frames         | Complete                  |
| Controlled primitive                | `state`/branded-preset target, replay, discriminated playback | Selected                  |
| Declarative sequence                | Validated finite/manual-advance definitions, typed cues       | Selected                  |
| Controller/hook                     | Named readiness/transition/completion promises                | Selected for advanced use |
| Public statechart                   | Structural actor candidate and XState evaluation              | Rejected; app-owned       |
| Renderer transition                 | Mount-first leases and host composite                         | Selected                  |
| Lifecycle/performance               | Independent gates, shared runtime, decoder/context accounting | Selected                  |
| Compatibility/migration             | Additive preset/mode/raw-shader path                          | Required                  |
| Storybook/product recipes           | Public/calibration/performance split                          | Required                  |
| Adversarial API/runtime review      | Blocking-contract corrections incorporated into design        | Complete                  |

## Task 1: Freeze the API and motion contract

**Files**

- Review and format `docs/superpowers/specs/2026-07-12-razorsense-motion-state-system-design.md`.
- Review and format `packages/blade/src/components/Spark/docs/RazorSenseMotionReference.md`.
- Create `packages/blade/src/components/Spark/RzpGlass/_decisions/decisions.md` with the accepted API, compatibility rules, rejected alternatives, and misuse boundaries.

**Acceptance**

- No ambiguous units, thenable command handles, contradictory playback combinations, or unreachable sequence examples.
- Responsive web/mobile is distinguished from unsupported React Native.
- Observed facts and implementation inference remain labeled.
- Commit the design and plan before runtime edits.

## Task 2: Correct website-hover geometry

**Files**

- Modify `packages/blade/src/components/Spark/RzpGlass/razorSenseMoodShader.ts`.
- Add or update the focused shader-source invariant in `packages/blade/src/components/Spark/RzpGlass/__tests__/RazorSense.web.test.tsx` only if the existing test can cover it cheaply.

**Implementation**

- Compute the warped coordinate for source/background sampling.
- Evaluate flute displacement and pointer-trail lookup in unwarped screen coordinates.
- Preserve current palette, blur, overscan, dither, and 4-second interaction gate.

**Browser gate**

- Capture before, 80 ms, 260 ms, and 760 ms hover frames.
- Compare a fixed rail-edge profile; rail pitch/topology must remain stationary while background/color response moves.
- Check light and derived dark behavior; do not claim exact dark-site parity because the site has no dark hover reference.

## Task 3: Add the public vocabulary and program manifest

**Create**

- `packages/blade/src/components/Spark/RzpGlass/razorSensePrograms.ts`
- `packages/blade/src/components/Spark/RzpGlass/razorSenseMotionTypes.ts`
- `packages/blade/src/components/Spark/RzpGlass/useRazorSenseReducedMotion.ts`
- `packages/blade/src/components/Spark/RzpGlass/RazorSensePreloadBroker.ts`

**Modify**

- `types.ts`, `modes.ts`, `presets.ts`, `razorSenseAssets.ts`, `utils.ts`, `utils.native.ts`, `index.ts`, and `Spark/index.ts`.

**Implementation**

- Add `RazorSenseState`, `RazorSenseBrandedPreset`, `RazorSenseTarget`, discriminated playback, transition, events, errors, sequence, controller, and preload types.
- Extend the existing preset union; never narrow or replace `RazorSensePreset`.
- Map canonical states to current visual modes.
- Register default playback, legal playback modes, representative light/dark desktop/mobile stills, safe seams, terminal frames, and compatible families.
- Keep deprecated `mode`, raw times, presets, aliases, and shader props assignable.
- Add target-based preload without breaking the mode-based form.
- Replace permanent preload video retention with a bounded current-plus-probable-next broker. Deduplicate promises, hand prepared sources to renderers where possible, and release temporary video elements after handoff or a short TTL.
- Resolve transition-duration tokens through Blade theme motion.

**Focused validation**

- Type-check legal and illegal ownership/playback unions.
- Validate repeat counts and sequence IDs in development.
- Confirm no new runtime dependency.

## Task 4: Make the shared runtime model independent gates and real resource cost

**Modify**

- `RazorSenseRuntime.ts`
- `useRazorSenseLifecycle.ts`
- `PerformanceManager.ts` only where the legacy renderer still duplicates lifecycle work.

**Implementation**

- Remove user pause from viewport/admission classification.
- Track document-hidden, offscreen, admission, user, controller, and reduced-motion pause reasons independently.
- Permit warm preparation while user-paused.
- Report actual retained video decoders and WebGL contexts.
- Keep one observer and one page-visibility listener per document.
- Preserve current admission limits until new multi-instance measurements justify a change.

**Focused validation**

- Existing lifecycle tests plus independent-pause and resource-accounting cases.
- Verify a paused visible instance can prepare a newly requested target without playing it.

## Task 5: Implement the mount-first persistent host

**Create**

- `RazorSenseHost.tsx`
- `RazorSensePresentationReducer.ts`
- `RazorSenseRendererAdapter.ts`
- `RazorSenseHostSnapshot.ts`
- `RazorSenseAdapterRegistry.ts`

**Modify**

- Refactor `RzpGlass.tsx` so public routing stays inside one persistent host.

**Implementation**

- One runtime registration, displayed slot, hidden incoming slot, snapshot canvas, and host-level WAAPI blend.
- Deduplicated, token-guarded dynamic imports for authored, emotional, and legacy adapter families. SSR imports no browser renderer module.
- Async staging waits for the adapter import, reserves its declared peak decoder/context cost, then mounts. Leases report real cost changes to the runtime.
- Occurrence ID, command epoch, and appearance/viewport/fallback revision.
- Occurrence-scoped exact-ready tokens; delete family-wide readiness booleans.
- Same-family retarget when supported; cross-family staging otherwise.
- During interrupted blends, capture both leases at current opacity into the host snapshot before replacement.
- WebGL-to-WebGL family changes snapshot and release outgoing context before mounting incoming.
- Server output uses stable `<picture>` markup for responsive still selection.
- Public DOM ref remains the outer container.

**Focused validation**

- Neutral → Calm → Neutral → Loading slow-readiness race.
- Replacement during a 50% cross-family blend.
- Appearance revision while incoming prepares.
- Unmount during readiness.
- Same-family retarget commits the next occurrence; disposing the old logical lease must not destroy the shared physical renderer.

## Task 6: Bring authored video programs to the renderer contract

**Modify**

- `RazorSenseAuthored.tsx`
- `RazorSenseVideoFrame.ts`
- `razorSenseAssets.ts`
- `modes.ts`

**Create**

- `RazorSenseVideoProgram.tsx` for simple final-color authored programs such as Audio Wave.

**Implementation**

- Separate exact readiness from playback start.
- Replace `timeupdate` boundary control with `requestVideoFrameCallback` metadata and a safe fallback bridge.
- Support once, repeat, loop, pause, reset-to-start, terminal hold, iteration, and finish-at-boundary.
- Emit occurrence-scoped readiness, transition, iteration, terminal, and recoverable/fatal error events.
- Preserve the existing Thinking dual-deck seam and playback snapshot restore.
- Checkpoint exact frames at readiness, seam, transition settlement, and terminal.

**Browser gate**

- Typing and Loading terminal frames.
- Thinking loop seam at normal and throttled frame rate.
- Two identical consecutive Loading occurrences without host remount.

## Task 7: Bring emotional desktop/mobile programs to the renderer contract

**Modify**

- `RazorSenseMood.tsx`
- `RazorSenseMoodMount.ts`
- `razorSenseMoodShader.ts`
- `webgl-utils.ts`

**Implementation**

- Mount/stage with a post-draw exact-ready gate.
- Accept finite/repeating/looping playback plans instead of unconditional native looping.
- Expose shader-weight transition start/finish and safe envelope boundaries.
- Preserve live pointer trail only while active, visible, admitted, full-motion, and interactive.
- Treat mobile final-color videos through the same occurrence and playback protocol.
- Preserve the last committed exact checkpoint on unexpected context loss and fall back without blank output.
- Appearance changes use revision, not occurrence.

**Browser gate**

- All four emotional modes, light/dark, desktop/mobile.
- Rapid emotional replacement, same-state replay, context loss, and light/dark change mid-transition.

## Task 8: Refactor legacy presets into a real adapter

**Create**

- `RazorSenseLegacy.tsx`
- `RazorSenseLegacyAdapter.ts`

**Modify**

- `RzpGlassMount.ts`
- legacy portions of `RzpGlass.tsx`
- `PerformanceManager.ts`
- `presets.ts`

**Implementation**

- Lazy staged initialization and post-draw readiness.
- Exact seek, capture, pause reasons, demand-driven RAF, finite/looping playback boundaries, finish-at-boundary, cleanup, and context-loss fallback.
- Remove per-instance page-visibility ownership in favor of the shared runtime.
- Preserve every raw uniform and existing preset result.
- Canonical success maps to the existing circle success program; alias remains valid.

**Browser gate**

- Ripple, success, raw legacy, and semantic ↔ legacy transitions.
- No second retained WebGL context during an emotional ↔ legacy handoff.

## Task 9: Implement the controller and command scheduler

**Create**

- `RazorSenseController.ts`
- `useRazorSenseController.ts`
- `useRazorSenseSnapshot.ts`

**Modify**

- `RzpGlass.tsx`, public exports, and native stubs.

**Implementation**

- Stable external store with a hydration-safe initial target.
- Named `ready`, `transitioned`, and `completed` promises; no thenable handles.
- Replace, queue, finish-current, command cancel, active cancel, and all cancel.
- FIFO event drain and once-only milestone settlement.
- Same-target replay always creates a new occurrence.
- One controller binds to one mounted host; warn on a second attachment.
- Controller ownership excludes controlled target/playback props.

**Focused validation**

- Exact event order, stale generation, same-target replay, queue behind loop, superseded finish-current, cancellation, unmount, and no duplicate settlement.

## Task 10: Implement validated sequences, typed cues, and built-in finite journeys

**Create**

- `RazorSenseSequence.tsx`
- `defineRazorSenseSequence.ts`
- `razorSenseJourneys.ts`

**Implementation**

- Run identity `(sequence.id, runId)` and immutable definitions.
- Once/repeat/loop plus on-complete/manual advance.
- Presentation-gated delays with probable-next preloading.
- Terminal hold/reset-to-start.
- Opaque typed cues from built-in authored manifests.
- Export only finite `razorSenseLoginToDashboardJourney` and `razorSenseThreePhaseLoadingJourney`.
- Chat remains controlled-state recipe; interrupted chat remains a fixture.

**Focused validation**

- Three equal Loading steps replay.
- Third login beat is interrupted at the registered cue.
- Nonterminal loop without controller is rejected in development.
- Reduced-motion finite run completes; loop waits for external advance.

## Task 11: Author the login foreground edge programs and compositor

**Create**

- `RazorSenseForegroundCompositor.tsx`
- `razorSenseAuthoredEdges.ts`
- fixed-frame calibration fixtures for `collapse-to-mark` and `expand-from-mark`

**Implementation**

- Add typed built-in foreground slots `source` and `destination` to the login definition.
- Keep supplied Blade UI nodes crisp inside Blade-owned wrappers.
- Implement the material-derived cover/mask from source frames 149-172.
- Implement the compact-mark-to-rail aperture and staged destination reveal from frames 296-348.
- Own z-order, clipping, mask texture, overscan, logical progress, pause reasons, freeze, cancellation, and cleanup inside the host.
- Freeze WAAPI/logical mask progress on interruption and retain the real DOM wrappers; browsers cannot losslessly rasterize arbitrary DOM. Snapshot only the material and release old wrappers after the next composition settles.
- Keep exactly one slot interactive and accessible: source active first; destination `inert`, `aria-hidden`, and pointer-disabled; then atomically swap ownership after source cover and destination readiness.
- Add a Blade-owned interstitial loading region. Once source is covered, make both UI slots inert, expose stable `role="status"` text, and move source focus to its programmatic landmark. When destination is exact-ready, remove the status region, activate destination, and move that focus to the destination landmark once.
- Reduced motion performs the same ownership change atomically after destination readiness.
- Keep both edge programs private to the built-in login manifest; do not add raw mask or shader props.

**Browser gate**

- Overlay captures at source-equivalent frames 149, 159, 169, 170, 172, 296, 305, 317, 320, 324, 330, and 348.
- Verify the source UI is covered/clipped rather than blurred, the destination chrome leads content, and no consumer opacity timer exists.
- Keyboard through source cover, loader beats, and destination reveal; verify hidden controls are not tabbable or announced, the interstitial status owns the gap, and focus reaches the destination landmark once.

## Task 12: Add and optimize the Audio Wave program without losing craft

**Assets**

- Add lazy light and derived dark responsive-web sources under `packages/blade/assets/spark/razorsense-presets/`.
- Add desktop/mobile representative stills.

**Implementation**

- Preserve the observed 0.433-0.967 second formation and active terminal.
- Default to once + hold; reject whole-file loop because first/last frames are incompatible.
- If a loop is required, author and verify a separate internal seam instead of flashing to white.
- Transcode with fast-start metadata and compare fixed frames, color samples, edges, and bloom before accepting any byte reduction.

**Measurement**

- Record source/output bytes, decode readiness, and fixed-frame similarity.

## Task 13: Rebuild Storybook around public API, product recipes, and internal calibration

**Create**

- `RazorSensePresets.stories.tsx`
- `RazorSenseRecipes.stories.tsx`
- `RazorSenseJourneys.stories.tsx`
- `RazorSenseLegacyCalibration.stories.tsx`
- `RazorSenseGradient.stories.tsx`

**Modify**

- Reduce `RazorSense.stories.tsx` to controlled API, playback, and compatibility.
- Reorganize `RazorSenseModes.stories.tsx` into state/transition labs and calibration.
- Extend `RazorSensePerformance.stories.tsx` with the final engine fixtures.

**Required executable stories**

1. Semantic state gallery.
2. Every valid state pair.
3. Sequence builder.
4. Controlled AI chat journey.
5. Interrupted AI chat.
6. Login-to-dashboard journey.
7. Three-phase loading.
8. Ripple wave.
9. Bottom wave.
10. Success.
11. One-shot terminal hold.
12. Loop.
13. Pause/resume and manual advance.
14. Light-to-dark.
15. Reduced motion.
16. Responsive mobile crop.
17. Rapid replacement.
18. Queue and finish-current.
19. Asset and WebGL failure.
20. Multiple mounted instances.
21. Compact loader preset.
22. Audio wave preset.

**Composition rules**

- Real Blade `ChatInput`, `ChatMessage`, `Card`, `Button`, `TextInput`, `PasswordInput`, `Spinner`, `Box`, `Text`, and `Heading`.
- One persistent host per expressive zone, never one per message.
- Login form stays mounted until the material covers it; cues reveal real dashboard shell/content.
- No consumer `setTimeout`, RAF choreography, raw source times, manual video seeks, shader props, or CSS opacity transitions.
- Calibration and performance fixtures may use internal controls and timers only when clearly separated from product guidance.

**Existing-story disposition**

| Existing story                                                                         | Destination                                                                                     |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `Default`, `DefaultPaused`, `RazorSenseProps`                                          | Core controlled-state/playback stories                                                          |
| `LegacyDefault`, `TweakpanePlayground`                                                 | `Calibration/Legacy`                                                                            |
| `Zoomed`                                                                               | Product replacement in `Recipes/AgentThinking`; deprecated alias in calibration                 |
| `BottomWave`                                                                           | `Presets/BottomWave`                                                                            |
| `RzpGlassSuccessAnimation`                                                             | `Presets/Success`; remove manual Framer opacity handshake                                       |
| `RippleWaveAnimation`                                                                  | `Presets/RippleWave`; remove consumer RAF/CSS visibility choreography                           |
| `OnboardingPlaybackControls`                                                           | `Journeys/ThreePhaseLoading`; old timer/RAF/raw-time version moves to calibration or is removed |
| `RazorSenseGradientBasic`, `RazorSenseGradientProps`                                   | Dedicated `RazorSenseGradient` stories                                                          |
| `LoginPage`                                                                            | `Recipes/LoginHero` and `Journeys/LoginToDashboard`; raw shader version in legacy calibration   |
| `DarkApplication`, `AgentResponse`                                                     | Public recipes using canonical state; raw seeking removed                                       |
| State/mode/transition labs                                                             | Retain as public state and transition labs                                                      |
| `PhaseCalibration`, `InteractionCalibration`, `MobileReference`, `DarkMobileReference` | Calibration-only                                                                                |
| `RazorSensePerformance.*`                                                              | Internal performance fixtures; timers remain stress mechanisms only                             |
| `RazorSenseFallbackExporter`                                                           | Internal capture tool; preserve deterministic readiness gate                                    |

## Task 14: Update human docs, migration, and Blade MCP knowledge

**Create or modify**

- Component decision record.
- `packages/blade-mcp/knowledgebase/components/RazorSense.md`.
- Relevant Blade MCP pattern/component indexes.
- Story descriptions and RazorSense visual/performance docs.

**Content**

- Three-minute quick start.
- State, preset, playback, transition, sequence, interruption, event, controller, preload, appearance, responsive web, reduced motion, accessibility, failure, and performance references.
- AI chat, login, loading, ripple, success, bottom-wave, and audio-wave recipes.
- Multiple-instance limits, debugging, migration, deprecated APIs, common mistakes, and visual misuse boundaries.
- Explicit agent rules against per-message instances, visual-only status, keystroke replay, minor-success celebration, dense rows, manual transitions, raw shader props, eager mounting, missing dark/reduced-motion, and accidental infinite loops.

## Task 15: Focused automated validation

Keep tests narrow. Cover orchestration invariants only:

- reducer event order;
- exact once/repeat/loop/terminal behavior;
- replacement, queue, finish-current, cancel, and supersession;
- stale readiness cannot win;
- no duplicate completion;
- occurrence replay;
- cleanup and unmount;
- reduced motion;
- ownership/type routing;
- compatibility aliases.

Run targeted tests, TypeScript, Prettier, and a Blade build. Do not expand unrelated snapshots or broad cleanup.

## Task 16: Browser, visual, accessibility, and performance verification

**Reference comparison**

- Start Storybook with `corepack yarn start:web`.
- Capture the login source-boundary equivalents listed in `RazorSenseMotionReference.md`.
- Capture Audio Wave reference frames.
- Use image overlays, sampled colors, edge profiles, and frame diffs.

**Behavior**

- Light/dark, desktop/responsive mobile, reduced motion, all interruption policies, provider change, asset failure, context loss, hidden/offscreen, and multiple instances.
- Delayed incoming asset must leave the exact outgoing composite visible.
- No blank, grayscale, uncalibrated gradient, theme flash, console error, stale transition, or duplicate callback.

**Performance**

- Record media requests and transferred bytes.
- Count active video elements, decoders where observable, and WebGL contexts.
- Measure first exact frame, frame pacing, dropped frames, RAF activity, hidden/offscreen work, and cold release.
- Compare before/after bundle sizes.
- Reject any optimization that changes flute geometry, refraction, edges, palette, bloom, timing, dark material, or responsive crop.

## Task 17: Independent final audits and fix loop

Run disjoint read-only audits for:

- public API and Blade conventions;
- renderer races and cleanup;
- visual fidelity and motion craft;
- accessibility and reduced motion;
- performance and bundle/network cost;
- compatibility and MCP guidance.

For each finding, reproduce it, fix it, replay the affected story, and capture new evidence. Stop only when the required flows and public contracts survive the audits.
