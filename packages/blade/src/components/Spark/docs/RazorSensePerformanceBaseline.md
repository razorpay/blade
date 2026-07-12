# RazorSense performance baseline

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
- Whole-file hashes are not used as the reproducibility signal because AVFoundation writes export-time
  container timestamps. The compressed-sample and format-description digests are deterministic.
- The HEVC highest-quality preset is an explicit no-go: preflight did not preserve source color
  metadata and missed the `0.995` SSIM threshold. No HEVC file or manifest candidate is shipped.

To reproduce the export, point `--assets-root` at a directory containing the backed-up, untrimmed
`razorsense-states/razorsense-typing.mp4` and `razorsense-typing-dark.mp4` masters:

```sh
swift scripts/exportRazorSenseVideoVariants.swift \
  --assets-root <untrimmed-typing-assets-root> \
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
