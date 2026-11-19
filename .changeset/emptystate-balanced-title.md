---
'@razorpay/blade': patch
---

fix(EmptyState): balance title line breaks

The `EmptyState` title now uses `text-wrap: balance` on web, so a long centred title splits into lines of similar length instead of leaving one word alone on the last line. Browsers without `text-wrap: balance` wrap as before. No API change. React Native is unchanged because it has no equivalent.
