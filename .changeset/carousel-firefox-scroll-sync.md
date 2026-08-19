---
"@razorpay/blade": patch
---

fix(Carousel): resolve Firefox interaction test failures caused by scroll sync handler

The Carousel's scroll sync handler (debounced 50ms) fires during programmatic smooth scroll animations and overwrites `activeSlide` with intermediate slide positions detected via `elementFromPoint`. In Firefox, smooth scroll fires events at different intervals than Chromium, causing the handler to detect an intermediate slide before the scroll completes. This corrupts the internal `activeSlide` state and calls `onChange` with wrong indices, breaking controlled Carousel behavior and causing flaky interaction test failures.

Fix: track the target slide index (`targetSlideRef`) during programmatic scroll, skip the entire scroll handler while the guard is active (preventing both `setActiveSlide` and `setActiveIndicator` from being called with intermediate positions), only clear the guard when the scroll handler detects the target slide has been reached, and increase the fallback timeout from 600ms to 1000ms as a safety net for longer scroll distances in Firefox.
