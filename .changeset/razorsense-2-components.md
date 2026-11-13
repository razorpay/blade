---
'@razorpay/blade': minor
---

feat(blade): add RazorSense 2.0 components next to RazorSense (which is unchanged): `RazorSenseLoader` (the loading splash), `RazorSenseChatBackground` (behind a landing's chat input), and for an assistant chat `RazorSenseThinking`, `RazorSenseBottomWave` and `RazorSenseChat`, which connects them with the bottom surge. Inside a `RazorSenseChat`, a loading `ChatMessage` (`isLoading` with its `loadingText`) drives the thinking as it is; outside one, `ChatMessage` is unchanged. Web only; each shows a still frame of itself where it can't animate.
