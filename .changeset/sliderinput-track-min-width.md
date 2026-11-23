---
'@razorpay/blade': patch
---

fix(SliderInput): stop reserving 10px per step when markers and scale values are hidden

The track's minimum width counted every step even when nothing was drawn per step, so the default 0–100 slider needed 1003px and a 600-step range needed 6000px, overflowing narrow containers. Steps now widen the minimum only when `showMarkers` or scale values are on screen. Sliders with markers or scale values keep their current minimum width, and an endpoints-only scale (`showScale` with `showScaleValues={false}`) still reserves room for its two bound labels, without the per-step floor.
