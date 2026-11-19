---
'@razorpay/blade': patch
---

fix(EmptyState): balance title and description line breaks

The `EmptyState` title and description now use `text-wrap: balance` on web, so long centred copy splits into lines of similar length instead of leaving one word alone on the last line. Browsers without `text-wrap: balance` wrap as before. No API change. React Native is unchanged because it has no equivalent.
