---
'@razorpay/blade': patch
---

fix(fonts): keep tabular digits in the Inter Latin font file

`fonts/inter-variable/inter-latin-blade.woff2` was subset without Inter's `tnum` feature, so `font-variant-numeric: tabular-nums` had no effect. CounterInput, animated numbers and any timer or amount column shifted as digits changed. The file is rebuilt from the same Inter 3.19 source with `tnum` added. Every existing glyph, advance width, kerning pair, weight and slant variation, and vertical metric is unchanged; the file grows by 376 bytes.
