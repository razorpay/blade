---
"@razorpay/blade": patch
---

feat(getFocusRingStyles): add a neutral variant of the focus ring

Figma models the focus ring as a component set with a primary and a neutral variant, but the helper only ever drew the primary one, so `BaseButton` had hand-rolled the neutral ring for its filled neutral surface. The variant now lives in `getFocusRingStyles` and `FocusRingWrapper`, and `BaseButton` uses it.

No visual change: the default is still `primary`, and only the colour varies by variant, so focus geometry and motion stay identical across the system.
