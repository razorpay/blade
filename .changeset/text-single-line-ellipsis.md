---
'@razorpay/blade': patch
---

fix(Text): end right-aligned `truncateAfterLines={1}` text with an ellipsis

One-line truncation uses a line clamp, which in Chrome drops its "…" on right-aligned text and just cuts the line. A right-aligned single line now uses `white-space: nowrap` with `text-overflow: ellipsis`, plus `min-width: 0` so it can shrink inside flex rows. Left and centre aligned text, and two or more lines, keep the line clamp, so their sizing does not change. Applies to Text, Heading and Display on web; React Native is unchanged.
