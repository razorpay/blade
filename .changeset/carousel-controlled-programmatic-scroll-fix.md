---
"@razorpay/blade": patch
---

fix: prevent Carousel onChange from firing during programmatic scroll animations

In controlled Carousel, browsers like Firefox could fire scroll events before a smooth-scroll animation completed, causing the debounced scroll handler to detect a stale slide index and call onChange with the wrong value. This fix tracks programmatic scrolls with a ref flag so onChange is skipped during those animations. Uncontrolled and user-initiated (drag/swipe) interactions are unaffected.
