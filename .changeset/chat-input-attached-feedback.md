---
'@razorpay/blade': minor
---

feat(ChatInput): add `feedback` — attaches a `ChatFeedback` prompt to the top edge of the composer, on a tinted surface that holds the two together as one object. Web only. Omit the prop and the composer renders exactly as it does today; the surface is only drawn while the prompt is showing

fix(ChatInput): dissolve the attached surface instead of dropping it. Background and padding now transition on the same beat as the prompt's fade, so the composer no longer jumps up by the padding at the moment the confirmation leaves
