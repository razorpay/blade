---
'@razorpay/blade-svelte': patch
---

fix(blade-svelte): stop BottomSheet and Modal from scrolling the page to the top on iOS

`body-scroll-lock-upgrade` locks iOS by moving the page into `body { position: fixed; top: -scrollY }` and restoring it with `window.scrollTo()` on unlock, which loses the reading position; Android and desktop take its `overflow: hidden` branch and were unaffected. Both overlays now use a ref-counted lock that applies the same `overflow: hidden` bookkeeping on every platform and blocks background scrolling on iOS by intercepting `touchmove`, so nothing mutates page geometry. BottomSheet additionally acquires its lock at most once per open instead of on every content re-measurement.
