# RazorSense 2.0's states

RazorSense 2.0 (`RazorSenseChatBackground`, `RazorSenseChat`, `RazorSenseBottomWave`) takes the states the agentic dashboard plays: listening, an answer's outcome (success or error) and offline. They're the RazorSense system's own tunings (Razorsensation: `send/razorsense-blade`), each light and dark tuned on its own, as flow 10.5 plays them.

## Design

- Razorsensation's pack (2026-11-23): the voice dashboard (speechtest.html), the voice bottom (speechtest2.html), success (was success 2), error (was error 4) and offline (flow 10.5's mal9.js). Its README has every number.
- Flow 10.5 is how they play together: the voice looks swap in at m 0, the outcomes run on the strip's clock past its end (s1Doc), offline fades the landing and drops the strip.

## API

```jsx
// a landing
<RazorSenseChatBackground isListening={isDictating} voiceStream={micStream} isOffline={!isOnline}>
  <ChatInput … />
</RazorSenseChatBackground>

// a chat
<RazorSenseChat isListening={isDictating} voiceStream={micStream} outcome={result} isOffline={!isOnline}>
  …
  <RazorSenseBottomWave>
    <ChatInput … />
  </RazorSenseBottomWave>
</RazorSenseChat>
```

| Prop          | Type                   | Default | On                                                                                                                                                                                      |
| ------------- | ---------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isOffline`   | `boolean`              | `false` | all three: the landing fades away under its colours (1 s, easing in going, out coming back); the strip drops below the edge it leaves at (1.2 s, `cubic-bezier(.33,1,.68,1)` both ways) |
| `isListening` | `boolean`              | `false` | all three: the voice look (the voice dashboard on a landing, the voice bottom on a chat's strip)                                                                                        |
| `voiceStream` | `MediaStream`          | –       | the stream it listens to while `isListening`                                                                                                                                            |
| `outcome`     | `'success' \| 'error'` | –       | `RazorSenseChat`, and `RazorSenseBottomWave` on its own: the strip's wave, once each time it's set                                                                                      |

### Naming

- **The same names as Ray's** (#4099), so a page passes one set to both (decided 2026-11-23: "makes sense").
- **The page owns the microphone.** Blade's `ChatInput` has no voice input, so the page's dictation opens the mic and hands its stream in. RazorSense never calls `getUserMedia`: it reads the stream's levels (one analyser per stream, page-wide, read at most once a frame, nothing allocated per frame, no React state). Without a stream the voice look shows as it does in silence.
- **`outcome`, not `isSuccess` / `isError`**: one value, so it can't be both, and the next one (a third kind) is a new value, not a new prop.

## How it plays

- **One at a time.** Offline wins: listening goes at once. Listening and an outcome wait for the strip to be at rest (the answer settled), and an outcome waits for the voice look to be down. Anything that ends an outcome early plays it out quickly (x 4), never backwards: a new question (then the strip rises), the outcome cleared, or the other one set (then it plays from the strip's rest). Cleared mid-way, it used to play back to its start (x 3); the user found success running backwards before an error set over it "cooked", and flow 10.5 never runs a piece backwards. With reduced motion the new one's moment shows in place of the old one's at once. Every state has its own way in and out, and turns back mid-way from where it is.
- **On the component's one canvas.** No new canvas or WebGL context: each state is a document composed on the component's own and loaded on its running engine (`engine.load`: its context and compiled programs kept), swapped where it's the same picture. The voice dashboard is the voice tab (its row, its Colorama) swapped in at m 0 and back at m 0, morphed from the remnant by m (speechtest's player hook, as the engine's `look()`). The voice bottom is the strip page itself with the row in its Comp 3 (only the row, the strip's swell and Comp 3's colour move with m). An outcome is its effect shapes and keys spliced onto both strip pages' Comp 3 after the strip's own end (its 0.02 s past it, so the strip at rest is never a frame of it), and the strip's clock runs on through it and back; its Colorama starts and ends at the strip's own rest colour, so it ends seamlessly (measured: the strip at rest unchanged by the splice, its last frame within 3 levels of rest).
- **Engine changes are patches** in `scripts/razorsenseEngine/buildFreshEngine.js`: `look()` (a hook on every shape and the page values, before the stretch and offset) and `fade()` (every shape's opacity, under the bands and the Colorama).
- **Its own chunks.** The voice dashboard's and voice bottom's data and code load the first time the component listens; the outcomes' while the page is idle once the chat starts thinking. Each state's still is its own module, loaded only when needed.
- **Room across.** The chat comp has a quarter comp of room each side (`ROOM.x` 378): an outcome's splash reaches the window's sides, where it was cut in a line. It changes the rest by under 3 levels in 255.
- **An outcome plays where success-blob shows it; the wave rests where flow 10.5's remnant does.** At rest the strip is flow 10.5's remnant on the chat input. As success or error starts, the whole bottom wave (the strip, the halves' rise, the splash and its ring) eases down over 0.45 s to where success-blob.html shows its piece: cover-fitted and centred in its chat area (under its 48 px top bar, 6 px from the bottom, 60 px narrower; RazorSenseChat's own box), and back up to the remnant over the piece's last 0.7 s. In a window shorter than the comp's that's lower than flow 10.5's remnant, which is the look the user asked for ("the base is the bottom remnant, but the reactions are like success-blob's, and it comes back to the remnant base"). Where the chat input is put, and how it's sized and scaled, don't move the reaction: it's the page's. `outcomePlace` works out how far the wave goes down and lays the effects for success-blob's place on the moved page (flow 10.5's s1Map; its numbers match flow 10.5's own at two window sizes, `outcome.test.ts`). Measured in Storybook's canvas (1212 x 520) at the same moments of the piece: how high the green reaches above the bottom, success-blob / Blade, 246/248, 391/384, 440/424 px at 0.8, 1.0, 1.3 s (light). Before, outcomeComps.ts's reference map (a 1512 x 982 window) was used everywhere, so in a shorter window the splash rose higher than flow 10.5's. The shapes, keys, timing and colours are flow 10.5's own splice; success-blob draws its pack on its own comp, so its ring reads a little stronger (green 30 against flow 10.5's 20 and Blade's 16 at 1 s, light).
- **The voice bottom's row anchored to the strip at the bottom**, where flow has it: it comes out from under the chat input, rising from the bottom. A taller chat input (lines, attachments) doesn't move it up (2026-11-24, the user: "it should look like how we did it only coming out from the bottom"; it had been lifted onto a taller input's top edge, where the input hid most of it and it looked washed out). Under the input it's the reference's strength: light rgb(185, 207, 242) against the pack's rgb(193, 210, 245), dark rgb(38, 56, 115) against rgb(33, 48, 115), 4.5 s into the made-up sentence.
- **A lone `RazorSenseBottomWave`'s canvas reaches only 150 px above its input**, so an outcome's splash shows there and no higher; in `RazorSenseChat` it rises through the panel.
- **Offline stops drawing.** Faded or dropped all the way, the component stops drawing until it's back online.
- **The voice dashboard sits on the input as speechtest has it on its chat box** (2026-11-24, parity with Razorsensation's pages, frame by frame on the same voice). The chat background lifts its strip 52 px (`LIFT`: no suggestion tray under its input), which put the voice tab's remnant line, a still band of flutes, whole above the input (mean brightness above it 12.9 in silence against speechtest's 0.77, dark). The look now comes down by the lift as it comes in (`VOICE_DROP`, at m 0 exactly the base, so the swap is unchanged): above the input 0.77 / 31.1 (silence / full voice) against speechtest's 0.77 / 30.9, light 0.28 / 18.9 against 0.28 / 18.9. **Trade-off, open:** below the input its lower half now shows more (speechtest's tray covers it there; Blade has none): full voice below the input 11.7 -> 28.4 (dark). Masking the strip below the input by m is the fix if that's not wanted. The voice's numbers match the page's to 0 (doubles, as the page has them), the voice is read only while listening (on the way out the row falls in silence), its history clears as a listen starts, and the typing layer is held at 0 under the voice look (reduced motion had drawn the rest strip over it).
- **At rest, RazorSenseChat's canvas covers only the strip** (24 Nov, the device test's Intel UHD laptop: the steps' lower render scale barely moved the frame rate with several canvases on one page, so a frame's fixed cost was elsewhere). At rest its canvas was the whole chat, ~5 % of it drawn, all of it composited by the page each frame. While the strip is at rest (no thinking, no surge, no outcome) its stage starts 300 px above the chat input's bottom (the strongest typing surge reaches ~260), moved in steps of 20 CSS px, within the frame (its parts read again at once, the engine drawing again as its canvas is resized, before the page paints); thinking or an outcome gives it the whole chat again. Measured on Metal, 1920x1080: the canvas 1920x1023 -> 1920x343, pixels drawn a frame 5.5 -> 2.9 Mpx at rest and 8.5 -> 3.9 Mpx typing; against the whole stage at the same moments (the clock driven a frame at a time): thinking, surge, rest, typing and offline within 0-2 / 255, light and dark.
- **Reduced motion**: a still frame of each state (offline gone, listening the voice look silent, an outcome its colour for the wave's length). **No animation** (no WebGL2, too slow): listening and an outcome show stills of their own (`make_blade_stills.py`), and offline fades the still away.

## Not yet

- The device test (Windows GTX 1650, Android) for the new states: their documents are swapped on the running engine (no new programs), and the voice look's shapes are the comp's own kind, so the Direct3D specialised copies cover them, but first-frame times weren't measured on the GTX 1650 here (its local test source was lost on 18 Nov).

## Their stills (2026-11-24)

Where it can't animate, the states follow the animated strip's rules: an outcome waits till the strip can show it (thinking done, online, the voice look down), then shows for its piece's full length; the chat's strip comes back online over offline's 1.2 s, not thinking's 0.6 s. (Found by the states' interaction tests.)

## Which component takes which state (2026-11-24)

The states are props an app sets; the stories' buttons only flip them.

| State                         | On                                                                            | What it does                                                                                                                                                                                                              |
| ----------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isOffline`                   | `RazorSenseChatBackground`, `RazorSenseChat`, `RazorSenseBottomWave`          | the landing fades away; the chat's strip drops                                                                                                                                                                            |
| `isListening` + `voiceStream` | the same three                                                                | the RazorSense that's there goes and the voice look comes (the chat background's strip on the default, the bottom remnant on the bottom); off, it comes back. Each component owns its own hand-over: an app sets one prop |
| `outcome`                     | `RazorSenseBottomWave` (on its own), and `RazorSenseChat` for its bottom wave | the strip's success or error splash, once                                                                                                                                                                                 |

- **Success and error are the bottom wave's** (the user: the bottom surge happens before the answer starts to fill in; by the time it has, the surge is long over, and the outcome plays on the wave). They moved from Bottom Surge 2.0's bar to Bottom Wave 2.0's. Inside `RazorSenseChat` an outcome still waits for the surge to settle into the wave.
- **The lone bottom wave reaches its splash.** On its own its canvas reaches 150 px above the input and 700 to each side, as far as the wave does; while an outcome plays it reaches the window's sides and top (the splash reaches them, as in flow 10.5), then gives that back. Measured at 1512 x 982 at 2x: at rest 112 MB light / 157 MB dark, during the splash 149 / 194, after it 111 / 154. Its canvas, 2240 x 640 at rest and 2419 x 1912 while the splash plays, is back to 2240 x 640 after.
- **Voice 2.0's toggle** is "Show bottom" / "Show default" (the default is the landing's chat input; the bottom, a chat's).
