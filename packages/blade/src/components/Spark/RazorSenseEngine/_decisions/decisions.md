# RazorSense 2.0: quality to the device, both ways

The PR review (review 6, must fix): 2.0 only knew software renderers (`POTATO_TIER_PATTERNS`), always started at full quality, and only stepped down (after a 2 s warm-up and 3 slow seconds), page-wide and never undone. A known weak GPU drew 3-6 s of janky full-quality frames on every load, and a short stall (a video call, another WebGL tab) cut quality for the rest of the page.

## Start from the device's level

- `FreshStage`'s WebGL2 check (once a page) hands its own context to today's RazorSense's `PerformanceManager.detect()`, which reads the GPU's name, or the device's memory, cores and mobile where the browser hides it (Safari, often Firefox). `PerformanceManager` is now exported from `RzpGlass/PerformanceManager.ts` for this: nothing else in today's RazorSense changes.
- The page's first step (`startLevelOf`): a **low** GPU (old Intel HD, Mali-400 / G5x, Adreno 3xx / 4xx...) two steps down (every other frame, at the lower sharpness), a **mid** GPU on a phone one step down (every other frame), a **high** or **unknown** one, or a mid one on a laptop, at full. A software renderer still shows the still (the WebGL2 check, as before). A stage whose page starts two steps down draws at the lower sharpness from its first frame.
- The steps keep the picture: every other frame, then a lower sharpness under the blurs. Only frames under 20 a second for 3 seconds go to the still, as before.
- `detect()` makes one more probe context, once a page (its own `failIfMajorPerformanceCaveat` check), let go at once.

## Step back up

- Once a page holds 55 fps (or 9/10 of the screen's own rate, on a slower screen) for 3 seconds, 4 s on from its last step, it steps back up, as `WebGLPerformanceController` does.
- A step up that doesn't hold (a step down within 8 s of it) doubles the wait before the next (up to 16x), so a device on its edge doesn't go up and down. Steps come at most once a second, page-wide.
- Measured (Chrome, M-series Mac, the chat background at 2x): a 9 s CPU overload (the page at 38 fps) stepped down to every other frame, then to the lower sharpness (canvas 2304 -> 1728 px wide); 2 s after it ended, full sharpness again, then every frame. Before, it stayed at 1728 for the rest of the page. With nothing in its way it stays at full (32 s at 120 fps, its canvas unchanged).

## Not in this PR

- A pixel budget per step for every component (as today's `maxPixelCount`), in place of the single 1.2 sharpness step: it touches the engine's `sharpness` hook and needs its own device testing. The two steps before the still stay. (`RazorSenseBackground` has its own budget already: its box can be a whole big screen.)
