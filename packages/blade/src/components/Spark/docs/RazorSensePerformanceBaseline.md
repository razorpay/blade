# RazorSense performance baseline

This file records the pre-orchestration baseline, a headed after capture of the declarative
motion-state runtime, and the verified Typing media trim. The after capture uses collector schema
v2: current WebGL means connected and non-lost, weak references expose still-live detached media
without pinning it, and representative-still transfers are reported separately from video
transfers. Those corrected resource gauges must not be compared numerically with the schema-v1
before table.

<!-- razorsense-runtime:before:start -->

## before runtime capture

Status: **passed**. Captured 2026-07-12T08:26:38.666Z from commit `238d140669cd02aba9f3b74f07654ba432da973d` with a clean worktree using Chrome 145.0.7632.160 on macOS 26.5.2. Raw runs: [`RazorSensePerformanceBaseline.before.4b51927e57f3.json`](./RazorSensePerformanceBaseline.before.4b51927e57f3.json).

Collector SHA-256: `ee173dc9b82180d9a160e30975febd7fb74d643dac496074ff0e48a0100ffe5e`.

Viewport: 1200x720 at DPR 1. Each scenario uses three cache-disabled cold network runs, then five cache-enabled frame runs with a 2 s warm-up and 10 s measurement window.

| Scenario                     | Collector status | Media assets / transfers / observed bytes | Transfer states completed / canceled / failed / other | RAF callback cadence p50 / p95 / p99 (ms) | Long tasks count / total | Playing media | WebGL contexts | rVFC callbacks / p95 late | Video total / dropped |
| ---------------------------- | ---------------- | ----------------------------------------: | ----------------------------------------------------: | ----------------------------------------: | -----------------------: | ------------: | -------------: | ------------------------: | --------------------: |
| Current neutral              | passed           |                        4 / 11 / 11.13 MiB |                                        1 / 10 / 0 / 0 |                           n/a / n/a / n/a |              0 / 0.00 ms |             1 |              0 |                0 / n/a ms |       240 / 0 (0.00%) |
| Current calm                 | passed           |                          4 / 4 / 3.47 MiB |                                         4 / 0 / 0 / 0 |                       8.30 / 9.70 / 10.30 |              0 / 0.00 ms |             0 |              1 |                0 / n/a ms |         0 / 0 (0.00%) |
| Four visible mixed instances | passed           |                        8 / 19 / 29.93 MiB |                                        11 / 8 / 0 / 0 |                     33.30 / 34.70 / 35.00 |              0 / 0.00 ms |             3 |              2 |                0 / n/a ms |       513 / 2 (0.39%) |
| Eight mounted instances      | passed           |                        8 / 38 / 40.38 MiB |                                       21 / 17 / 0 / 0 |                      8.30 / 10.20 / 10.30 |              0 / 0.00 ms |             3 |              4 |                0 / n/a ms |       741 / 0 (0.00%) |
| Rapid operational changes    | passed           |                        4 / 17 / 17.94 MiB |                                        5 / 12 / 0 / 0 |                    8.30 / 358.30 / 366.69 |              0 / 0.00 ms |             2 |              0 |                0 / n/a ms |       748 / 0 (0.00%) |
| Rapid emotional changes      | passed           |                          4 / 4 / 3.47 MiB |                                         4 / 0 / 0 / 0 |                        8.30 / 8.90 / 9.30 |              0 / 0.00 ms |             0 |              1 |                0 / n/a ms |         0 / 0 (0.00%) |
| Provider appearance changes  | passed           |                        8 / 67 / 26.76 MiB |                                        7 / 55 / 0 / 5 |                  491.80 / 544.23 / 562.45 |              0 / 0.00 ms |             1 |              0 |              20 / 0.01 ms |         1 / 0 (0.00%) |
| Page visibility              | passed           |                         8 / 9 / 14.60 MiB |                                         5 / 4 / 0 / 0 |                        8.30 / 9.30 / 9.40 |              0 / 0.00 ms |             1 |              1 |                0 / n/a ms |       240 / 0 (0.00%) |

Limitations:

- This is a single-machine, single-Chrome-version baseline. Use it for before/after comparison under the same protocol, not as a cross-device performance target.
- A passed collector scenario means navigation, readiness, and measurement completed; it does not mean every media transfer completed.
- Network assets are unique URLs and transfers are CDP request IDs. Both include only `razorsense-` video MIME responses or `.mp4`/`.webm` URLs observed during the fixed two-second post-ready window.
- Observed bytes sum the immutable CDP `encodedDataLength` snapshot and include partial canceled, failed, or still-in-flight range transfers.
- Transfer states are disjoint with precedence canceled, failed, completed, then other. The failed count therefore excludes canceled transfers, and other means still in flight or otherwise unclassified at snapshot time.
- RAF callback cadence measures time between observed wrapped RAF callback timestamps. It includes intentional idle gaps and is not browser frame-render time.
- WebGL context count is a resource gauge and includes unique contexts acquired before the ten-second frame window; raw runs also report contexts acquired during the window.
- Video frame counters are ten-second deltas from `getVideoPlaybackQuality` (with WebKit counters as a fallback). Long-task and rVFC fields depend on browser support.
- The collector waits only for `data-scenario-ready="true"`; it intentionally never blocks on `data-scenario-fully-ready` so optimized offscreen instances may remain deferred.
<!-- razorsense-runtime:before:end -->

<!-- razorsense-runtime:after:start -->

## after runtime capture

Status: **passed**. Captured 2026-07-12T22:02:05.924Z from commit
`82941077a96132679d8500248a9a76be9cec20d1` with the RazorSense implementation in a dirty worktree
using headed Chrome 145.0.7632.160 on macOS 26.5.2. All 30 cold-network runs and 50 frame runs
completed, and all 30 network snapshots passed internal consistency checks. Raw-run SHA-256:
`d749546ba8e308bd53b62619403c5db4cb4fb7813c8fcdf2e3664daa48ce119b`.

Collector SHA-256: `b273ebdc1fee0b59c9e02b64646e6927288cc022d83d8752ea33b6be13181d32`.

Viewport: 1200x720 at DPR 1. Each scenario uses three cache-disabled cold network runs, then five
cache-enabled frame runs with a 2 s warm-up and 10 s measurement window. The two public-API cold
runs click the rendered control once. During their frame windows, the collector drives eight
synchronous replacements every 1.2 s and a provider light/dark switch every 1 s.

| Scenario                                 | Collector status | Video assets / transfers / observed bytes | Representative still assets / transfers / observed bytes | Video transfer states completed / canceled / failed / other | Still transfer states completed / canceled / failed / other | RAF callback cadence p50 / p95 / p99 (ms) | Long tasks count / total | Tracked / playing / off-DOM sourced media | Current / lifetime WebGL contexts | rVFC callbacks / p95 late | Video total / dropped |
| ---------------------------------------- | ---------------- | ----------------------------------------: | -------------------------------------------------------: | ----------------------------------------------------------: | ----------------------------------------------------------: | ----------------------------------------: | -----------------------: | ----------------------------------------: | --------------------------------: | ------------------------: | --------------------: |
| Current neutral                          | passed           |                         1 / 1 / 11.12 MiB |                                         1 / 1 / 0.39 MiB |                                               1 / 0 / 0 / 0 |                                               1 / 0 / 0 / 0 |                        8.40 / 8.40 / 8.40 |              0 / 0.00 ms |                                 1 / 1 / 0 |                             0 / 0 |               1 / 2.50 ms |       244 / 0 (0.00%) |
| Current calm                             | passed           |                          1 / 1 / 0.53 MiB |                                         1 / 1 / 0.15 MiB |                                               1 / 0 / 0 / 0 |                                               1 / 0 / 0 / 0 |                     41.70 / 42.99 / 43.36 |              0 / 0.00 ms |                                 1 / 1 / 1 |                             1 / 1 |             239 / 0.00 ms |       248 / 0 (0.00%) |
| Four visible mixed instances             | passed           |                         4 / 5 / 23.93 MiB |                                         4 / 4 / 1.09 MiB |                                               5 / 0 / 0 / 0 |                                               4 / 0 / 0 / 0 |                     33.30 / 34.80 / 35.00 |              0 / 0.00 ms |                                 5 / 4 / 2 |                             2 / 2 |             143 / 1.50 ms |    831 / 100 (11.90%) |
| Eight mounted instances                  | passed           |                         2 / 2 / 11.65 MiB |                                         8 / 8 / 1.76 MiB |                                               2 / 0 / 0 / 0 |                                               8 / 0 / 0 / 0 |                     41.70 / 43.10 / 46.36 |              0 / 0.00 ms |                                 2 / 2 / 1 |                             1 / 1 |             241 / 0.00 ms |       492 / 0 (0.00%) |
| Rapid operational changes                | passed           |                       4 / 25 / 126.68 MiB |                                        4 / 20 / 4.81 MiB |                                              25 / 0 / 0 / 0 |                                              20 / 0 / 0 / 0 |                      8.40 / 66.65 / 75.24 |              0 / 0.00 ms |                                 3 / 2 / 1 |                             0 / 0 |            104 / 13.64 ms |        18 / 0 (0.00%) |
| Rapid emotional changes                  | passed           |                        4 / 14 / 11.35 MiB |                                        4 / 14 / 2.76 MiB |                                              14 / 0 / 0 / 0 |                                              14 / 0 / 0 / 0 |                      8.30 / 24.91 / 33.40 |              0 / 0.00 ms |                                 9 / 2 / 9 |                             1 / 1 |             527 / 4.90 ms |        22 / 0 (0.00%) |
| Legacy provider appearance changes       | passed           |                         2 / 5 / 37.75 MiB |                                         2 / 5 / 1.77 MiB |                                               5 / 0 / 0 / 0 |                                               5 / 0 / 0 / 0 |                   58.40 / 291.63 / 305.80 |              0 / 0.00 ms |                                 4 / 2 / 2 |                             0 / 0 |              86 / 5.88 ms |        89 / 0 (0.00%) |
| Public state rapid replacement           | passed           |                         2 / 2 / 11.80 MiB |                                         2 / 3 / 0.81 MiB |                                               2 / 0 / 0 / 0 |                                               3 / 0 / 0 / 0 |                      9.90 / 34.38 / 35.10 |              0 / 0.00 ms |                                 2 / 1 / 2 |                             1 / 1 |             297 / 0.23 ms |       364 / 0 (0.00%) |
| Public state provider appearance changes | passed           |                          1 / 1 / 0.53 MiB |                                         2 / 2 / 0.39 MiB |                                               1 / 0 / 0 / 0 |                                               2 / 0 / 0 / 0 |                      9.30 / 42.50 / 43.30 |              0 / 0.00 ms |                                 1 / 1 / 1 |                             1 / 1 |             240 / 0.10 ms |       248 / 0 (0.00%) |
| Page visibility                          | passed           |                         2 / 2 / 11.65 MiB |                                         2 / 2 / 0.54 MiB |                                               2 / 0 / 0 / 0 |                                               2 / 0 / 0 / 0 |                     41.70 / 43.20 / 47.03 |              0 / 0.00 ms |                                 2 / 2 / 1 |                             1 / 1 |             241 / 0.00 ms |       492 / 0 (0.00%) |

### Observed findings

- The six-below-fold fixture mounted eight instances but admitted only two sourced videos and one
  current WebGL context at the sample boundary. The other six states still requested their
  representative stills, which accounts for the independent eight-image line item.
- Public rapid replacement settled repeated eight-command bursts with two video assets, two video
  transfers, and two still-live sourced elements at the median boundary. The legacy 120 ms mode
  churn retained only one detached sourced element at the frame boundary after weak-reference
  correction, but still transferred 126.68 MiB in its median cold run. These scenarios use
  different trigger cadences, so this is directional evidence rather than a direct before/after
  ratio.
- The public provider appearance scenario used one 0.53 MiB video transfer plus the two light/dark
  representative stills; the legacy 500 ms toggle used five video transfers totaling 37.75 MiB at
  the median and retained two detached sourced elements at the frame boundary. Its 1 s public
  trigger cadence again makes this directional, not ratio-grade, evidence.
- Every scenario's median current and lifetime WebGL counts were equal. One of 50 individual frame
  runs acquired two contexts over its page lifetime and ended with one current context; the other
  context had already been collected. No still-live context was detached or context-lost at any
  measurement boundary.
- The four-visible mixed fixture dropped a median 100 of 831 decoded video frames (11.90%). That is
  the remaining measured pressure point; the collector recorded no long tasks, so this capture
  does not attribute those drops to JavaScript main-thread work.

Limitations:

- This is a single-machine, single-Chrome-version baseline. Use it for comparisons under the same
  protocol, not as a cross-device performance target.
- A passed collector scenario means navigation, readiness, and measurement completed; it does not
  establish a visual-fidelity score or a production service-level objective.
- Video assets are unique URLs and transfers are CDP request IDs. They include only `razorsense-`
  video MIME responses or `.mp4`/`.webm` URLs observed during the fixed two-second post-ready
  window.
- Representative-still assets are counted independently. They include image responses under
  `/razorsense-stills/`; shared shader gradient maps and unrelated Storybook images are excluded.
- Observed bytes sum the immutable CDP `encodedDataLength` snapshot and include partial canceled,
  failed, or still-in-flight range transfers.
- Transfer states are disjoint with precedence canceled, failed, completed, then other. The failed
  count excludes canceled transfers, and other means still in flight or otherwise unclassified at
  snapshot time. Each displayed value is an independent median across three runs, so median state
  cells are not guaranteed to add back to the separately computed median transfer count.
- RAF callback cadence measures time between observed wrapped RAF callback timestamps. It includes
  intentional idle gaps and is not browser frame-render time.
- Current WebGL contexts are connected to the document and not context-lost at the end of the
  ten-second frame window. Lifetime contexts are unique allocations observed since page navigation;
  raw runs also report detached/lost contexts and allocations during the window.
- Tracked media includes connected elements plus detached elements that still retain a source.
  The collector keeps only weak references, so it does not itself prevent collection. Off-DOM media
  can be an intentional video texture; the gauge proves a still-live sourced element at sample
  time, not by itself a memory leak.
- Video frame counters are ten-second deltas from `getVideoPlaybackQuality` (with WebKit counters as
  a fallback). Long-task and rVFC fields depend on browser support.
- The collector waits for `data-scenario-ready="true"` in legacy performance fixtures. The two
  public scenarios instead wait for their public presentation host. It intentionally never waits
  for `data-scenario-fully-ready`, so optimized offscreen instances may remain deferred.

<!-- razorsense-runtime:after:end -->

## Typing media trim

The light and dark Typing assets now contain only the authored `6.68–10.00 s` impulse. They were
exported from the 10-second masters with `AVAssetExportPresetPassthrough`, an integer
`CMTimeRange(start: 167/25, duration: 83/25)`, and network optimization enabled. No video samples
were transcoded.

| Appearance | Source bytes | Shipped bytes |      Saved | Source bitrate | Shipped bitrate | Codec         | Visible frames |
| ---------- | -----------: | ------------: | ---------: | -------------: | --------------: | ------------- | -------------: |
| Light      |    2,395,149 |     1,180,184 |     50.73% |  1,905,380 bps |   2,333,390 bps | `avc1.4D4029` |   83 at 25 fps |
| Dark       |      736,125 |       452,413 |     38.54% |    585,649 bps |     857,733 bps | `avc1.640028` |   83 at 25 fps |
| **Total**  |    3,131,274 |     1,632,597 | **47.86%** |                |                 |               |                |

The segment bitrate is higher than the ten-second source average because the retained interval is
the energetic part of the animation. Payload still drops by 1,498,677 bytes because 6.68 seconds of
unused timeline are gone.

### Authoritative masters

The exporter authenticates the complete file before it writes any derivative. A master must match
its hardcoded SHA-256, exact ten-second duration, 1920×1080 geometry, 25 fps cadence, 250 visible
frames, codec profile, and color tags. Renaming the light master as the dark master therefore fails
before export.

| Appearance | Authoritative source                                                                                           | SHA-256                                                            | Color tags                             |
| ---------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------- |
| Light      | Supplied launch file `Bottom Wave (Default, Typing).mp4`; identical to the pre-trim Blade asset at `f39c9d80b` | `fd8facc2711148a60693279da4f28d6a75d1329f3adf904ba9d7163922f4ecc5` | BT.709 primaries, transfer, and matrix |
| Dark       | Phase-matched pre-trim Blade asset at `f39c9d80b`                                                              | `5e225bc0c273b86293c5a2185d5e2f33daff540a24673e39768bd126ca7b8490` | Intentionally untagged                 |

Verification on macOS 26.5.2 with the pinned Pillow, NumPy, and SciPy versions passed all ten
native-resolution checkpoints: first visible frame, attack, peak/fixed-grid frame, hold, and last
visible frame in both appearances. Each candidate frame was PNG-byte-identical to its source frame:
SSIM `1.0`, linear PSNR `Infinity`, Delta E 2000 P95 `0.0`, and symmetric Sobel edge distance P95
`0 px`. The exporter also requires matching geometry, codec profile, color metadata, 25 fps cadence,
83 visible frames, source sample-description digest, and compressed-sample digest.

The isolated Storybook fixed-phase captures at the rebased `1.96 s` phase were also byte-identical
to the committed pre-trim stills: light SHA-256
`c5f8e7ea732928a2136282bc4d68f4001e7d0a9ae8f491039db8710817222144`, dark SHA-256
`d6ac20c06b565e6c4a478b8babffb8248ca51c49938f31f85d575896256adf4e`. The full 24-frame fallback
matrix was not regenerated.

- Light retains BT.709 primaries, transfer function, and matrix metadata.
- Dark remains explicitly untagged before and after the trim; the passthrough export does not invent
  a color profile.
- H.264 dependency preroll remains in the container so the first visible frame decodes correctly.
  The edit list exposes exactly 83 frames over 3.32 seconds.
- After AVFoundation exports, a bounded ISO-BMFF parser zeroes only the version-aware creation and
  modification timestamps in the single `mvhd`, `tkhd`, and `mdhd` boxes. Unknown versions,
  truncated boxes, unexpected nesting, or duplicate timestamp boxes fail instead of being patched.
- Two independent exports were whole-file byte-identical. Light SHA-256 is
  `247210b2366c64d3941f7c2668ea9c588d040259f05bf7af62be5bc98881c088`; dark SHA-256 is
  `4e8b0b287abca6f4299c8a138117a3188cad7eb310e6d97bd3eb8c6fa719b055`. Their byte sizes,
  sample digests, format-description digests, and decoded metadata also match.
- The HEVC highest-quality preset is an explicit no-go: preflight did not preserve source color
  metadata and missed the `0.995` SSIM threshold. No HEVC file or manifest candidate is shipped.

To retrieve the authenticated masters without keeping a second copy in the repository, extract the
original Blade blobs into a temporary source root:

```sh
mkdir -p /tmp/razorsense-typing-masters/razorsense-states
git show f39c9d80b:packages/blade/assets/spark/razorsense-states/razorsense-typing.mp4 \
  > /tmp/razorsense-typing-masters/razorsense-states/razorsense-typing.mp4
git show f39c9d80b:packages/blade/assets/spark/razorsense-states/razorsense-typing-dark.mp4 \
  > /tmp/razorsense-typing-masters/razorsense-states/razorsense-typing-dark.mp4
swift scripts/exportRazorSenseVideoVariants.swift \
  --assets-root /tmp/razorsense-typing-masters \
  --output-dir /tmp/razorsense-typing-output \
  --write-frames /tmp/razorsense-typing-frames
/tmp/razorsense-media-venv/bin/python scripts/verifyRazorSenseMedia.py \
  --reference-dir /tmp/razorsense-typing-frames/reference \
  --candidate-dir /tmp/razorsense-typing-frames/candidate \
  --min-ssim 0.995 \
  --min-psnr 42 \
  --max-delta-e-p95 1.5 \
  --max-edge-shift 1
```
