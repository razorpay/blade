---
'@razorpay/blade': minor
---

feat(Button): add `hasRazorSense` (RazorSense on hover, on the neutral primary button) and `hasRay` with `rayVariant` (on hover a secondary button widens for Ray, at any size; `investigate`: his magnifying glass). Both are web only and fall back to the button's own hover where they can't play (reduced motion, no usable GPU, a ButtonGroup, a full-width button, and for Ray an icon-only button).
