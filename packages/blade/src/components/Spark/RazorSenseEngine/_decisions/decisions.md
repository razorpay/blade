# RazorSense 2.0: quality to the device, both ways

The PR review (review 6, must fix): 2.0 only knew software renderers (`POTATO_TIER_PATTERNS`), always started at full quality, and only stepped down (after a 2 s warm-up and 3 slow seconds), page-wide and never undone. A known weak GPU drew 3-6 s of janky full-quality frames on every load, and a short stall (a video call, another WebGL tab) cut quality for the rest of the page.

## Start from the device's level

- `FreshStage`'s WebGL2 check (once a page) hands its own context to today's RazorSense's `PerformanceManager.detect()`, which reads the GPU's name, or the device's memory, cores and mobile where the browser hides it (Safari, often Firefox). `PerformanceManager` is now exported from `RzpGlass/PerformanceManager.ts` for this: nothing else in today's RazorSense changes.
- The page's first step (`startLevelOf`): a **low** GPU (old Intel HD, Mali-400 / G5x, Adreno 3xx / 4xx...) two steps down (every other frame, at 0.75 of a CSS px), a **mid** GPU on a phone one step down (every other frame; not an iPhone or iPad, which Safari's hidden GPU name leaves 'mid' by its signals alone, and which held its frames at full on the device test), a **high** or **unknown** one, or a mid one on a laptop, at full. A software renderer still shows the still (the WebGL2 check, as before). A stage whose page starts two steps down draws at 0.75 of a CSS px from its first frame.
- The steps keep the picture: every other frame, then fewer pixels (see Render scale). Only frames under 20 a second for 3 seconds at the lowest step go to the still, as before.
- **Intel UHD and Iris Xe start at full** (they classify as high or mid on a laptop: 0). The device test's UHD laptop (1920x1080 @1x, a 950 px wide window) held 60 drawn frames a second with each component alone, its page at 88-144 fps and its 95th-percentile frame 7-14 ms (an earlier run, the laptop busier: 50-60 drawn, 21-28 ms). Starting it lower would cost every page on it fewer frames or pixels where it doesn't need them. What it can't hold is every component on one page at once while typing (12-20 fps): that's what the steps are for, and they now meet it within a second (below). Iris Xe is faster than UHD.
- `detect()` makes no probe context of its own here: it's told there's no major performance caveat (FreshStage's WebGL2 check asked already, with `failIfMajorPerformanceCaveat`). Today's RazorSense, which doesn't tell it, still probes.

## Step back up

- Once a page holds 55 fps (or 9/10 of the screen's own rate, on a slower screen) for 3 seconds, 4 s on from its last step, it steps back up, as `WebGLPerformanceController` does.
- A step up that doesn't hold (a step down within 8 s of it) doubles the wait before the next, so a device on its edge doesn't go up and down. After three of those it stays down (the PR review: the page's frame rate holds near the screen's at every other frame even on a GPU that can't draw every frame, so it kept trying, ~3 s of jank about once a minute). Steps come at most once a second, page-wide.
- Measured (Chrome, M-series Mac, the chat background at 2x, with the old 1.2 step): a 9 s CPU overload (the page at 38 fps) stepped down to every other frame, then to the lower sharpness (canvas 2304 -> 1728 px wide); 2 s after it ended, full sharpness again, then every frame. Before, it stayed at 1728 for the rest of the page. With nothing in its way it stays at full (32 s at 120 fps, its canvas unchanged).

## Render scale (the device test: the steps did nothing at 1x)

- The old second step capped the canvas's pixel ratio at 1.2: on a 1x screen (the Windows laptops that needed it) it changed nothing. Steps 2 and 3 now set a render scale below 1x of a CSS px, whatever the screen: **0.75, then 0.5** (the engine's `sharpness` cap; the browser scales the canvas up). Its pixels: 56 %, then 25 %.
- **The picture holds.** Each 2.0 story frozen at the same moment (Playwright's clock), drawn at each scale on Metal and diffed against full, over the pixels the effect covers: at 0.75 every component is within 0.10-0.48 / 255 on average (99th percentile 1-7), against 0.09-0.39 for the old 1.2 step at 2x; at 0.5 within 0.13-0.77 / 255 (99th percentile 1-10, the loader's flutes the softest). Light and dark, 1x and 2x.
- **What it saves** (GPU time per frame, timer queries, Metal, 1920x1080 @1x): typing in the chat 7.7 -> 5.6 ms at 0.75 -> 3.3 ms at 0.5; the bottom wave 6.0 -> 3.4 ms at 0.5; the thinking 10.9 -> 4.9 ms at 0.5. Not all of a frame scales with its pixels (the blurs work at their own small scale), so 0.5 saves about half, not three quarters.
- **Sooner.** A step down needs 2 slow seconds (was 3), 1 under 20 fps (was 2), and under half the wanted rate it steps two at once (one step can at most double the rate). A typing surge that takes a page to 12 fps is at 0.75 within about a second.
- `RazorSenseBackground` keeps its own pixel budget under these (its box can be a whole big screen).

## Typing's own cost

- Measured (timer queries, Metal, 1x): typing adds 2.4-3.8 ms a frame to the chat and the bottom wave, 1-1.5 ms to the chat background. It's the typing strip drawn over the strip at rest, animating (its shapes rasterised again each frame), and the size boost (every shape grown round the strip's middle, so rasterised again too). With only one of the two the frame costs about the same as with both, so neither can go without the other being redrawn: the look itself costs it. Fewer pixels is the cut that keeps it, and the steps now reach it within a second.

## Only what it draws (24 Nov, the device test's fixed-cost lab)

- On the Intel UHD laptop, compositing canvases, their number and per-frame uploads cost nothing; passes and fill do. And a blurred layer's size comes from its blur (its sigma at 5 texels), not the canvas, so the steps' lower render scale didn't shrink it.
- **`blurBox`** (an engine switch, on for every 2.0 component): a layer's two blur passes run only over its box (its shape out by its 3-sigma blur and the margin the stack's scissor keeps), its targets cleared first. Outside the box the blur only ever read empty texels: every comp byte-identical to the engine before. And a small layer's non-convex outline is drawn in a tile its box's size (the path a big layer already took), not a 1024 px tile for its whole layer: 97 of 98 compared frames byte-identical, one dark voice frame 1 / 255 off in 508 pixels.
- GPU time a frame (timer queries, Metal, 1920x1080 @1x): the voice look listening 10.6 -> 4.1 ms (light), 11.4 -> 6.0 ms (dark); thinking 10.9 -> 7.5 ms; the chat at rest 3.7 -> 3.0 ms.
- **`view`** (from #4101, off here): layers and the accumulation only over what the canvas shows, for a Button hover's small window onto a card-sized comp. In this engine so both PRs build one; 2.0's components don't ask for it (byte-identical).

