---
'@razorpay/blade': minor
---

feat(Button): add `hasRazorSense` (RazorSense on hover, on the neutral primary button) and `hasRay` with `rayVariant` (on hover a secondary button widens for Ray, at any size; `investigate`: his magnifying glass). Both are web only and fall back to the button's own hover where they can't play (reduced motion, no usable GPU, a full-width button, and for Ray a ButtonGroup or an icon-only button).
