# RazorSense performance baseline

<!-- razorsense-runtime:before:start -->

## before runtime capture

Status: **passed**. Captured 2026-07-12T08:04:11.738Z from commit `2728ff0ae9e6ad6f7cc7d428ebef5fafbbe5e549` with a dirty worktree using Chrome 145.0.7632.160 on macOS 26.5.2. Raw runs: [`RazorSensePerformanceBaseline.before.json`](./RazorSensePerformanceBaseline.before.json).

Viewport: 1200x720 at DPR 1. Each scenario uses three cache-disabled cold network runs, then five cache-enabled frame runs with a 2 s warm-up and 10 s measurement window.

| Scenario                     | Status | Media assets / transfers / bytes | RAF p50 / p95 / p99 (ms) | Long tasks count / total | Playing media | WebGL contexts | rVFC callbacks / p95 late | Video total / dropped |
| ---------------------------- | ------ | -------------------------------: | -----------------------: | -----------------------: | ------------: | -------------: | ------------------------: | --------------------: |
| Current neutral              | passed |               4 / 14 / 11.13 MiB |          n/a / n/a / n/a |              0 / 0.00 ms |             1 |              0 |                0 / n/a ms |       241 / 0 (0.00%) |
| Current calm                 | passed |                 4 / 4 / 3.47 MiB |      8.30 / 9.90 / 10.30 |              0 / 0.00 ms |             0 |              1 |                0 / n/a ms |         0 / 0 (0.00%) |
| Four visible mixed instances | passed |               8 / 18 / 29.93 MiB |    33.30 / 34.75 / 34.99 |              0 / 0.00 ms |             3 |              2 |                0 / n/a ms |       511 / 2 (0.39%) |
| Eight mounted instances      | passed |               8 / 36 / 40.38 MiB |      8.30 / 9.80 / 10.30 |              0 / 0.00 ms |             3 |              4 |                0 / n/a ms |       740 / 0 (0.00%) |
| Rapid operational changes    | passed |               4 / 18 / 18.82 MiB |   8.30 / 358.30 / 366.68 |              0 / 0.00 ms |             2 |              0 |                0 / n/a ms |       749 / 0 (0.00%) |
| Rapid emotional changes      | passed |                 4 / 4 / 3.47 MiB |     8.30 / 10.00 / 10.30 |              0 / 0.00 ms |             0 |              1 |                0 / n/a ms |         0 / 0 (0.00%) |
| Provider appearance changes  | passed |               8 / 68 / 26.74 MiB | 499.90 / 552.36 / 557.11 |              0 / 0.00 ms |             1 |              0 |              20 / 0.71 ms |         4 / 0 (0.00%) |
| Page visibility              | passed |               8 / 11 / 15.47 MiB |     8.30 / 10.00 / 10.30 |              0 / 0.00 ms |             1 |              1 |                0 / n/a ms |       240 / 0 (0.00%) |

Limitations:

- This is a single-machine, single-Chrome-version baseline. Use it for before/after comparison under the same protocol, not as a cross-device performance target.
- Network assets are unique URLs and transfers are CDP request IDs. Both include only `razorsense-` video MIME responses or `.mp4`/`.webm` URLs observed during the fixed two-second post-ready window; bytes are encoded transfer lengths.
- WebGL context count is a resource gauge and includes unique contexts acquired before the ten-second frame window; raw runs also report contexts acquired during the window.
- Video frame counters are ten-second deltas from `getVideoPlaybackQuality` (with WebKit counters as a fallback). Long-task and rVFC fields depend on browser support.
- The collector waits only for `data-scenario-ready="true"`; it intentionally never blocks on `data-scenario-fully-ready` so optimized offscreen instances may remain deferred.
<!-- razorsense-runtime:before:end -->
