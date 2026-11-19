---
'@razorpay/blade': patch
---

fix(SliderInput): keep scale end labels inside the track

With `showScale`, the first scale label now starts at its tick and the last one ends at its tick, so long end labels no longer hang past the track. Labels in between stay centred, and the spacing that drops crowded labels accounts for the wider end labels.

The field's minimum width now makes room for both end labels side by side on two-stop scales and when `showScaleValues={false}`, so a slider can get wider in a tight layout.
