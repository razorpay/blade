---
"@razorpay/blade": patch
---

fix(Carousel): resolve Firefox autofit & autoplay-pause interaction test failures

The Carousel's scroll sync handler (debounced) fires during programmatic smooth scroll animations and overwrites `activeSlide` with intermediate slide positions detected via `elementFromPoint`. In Firefox, smooth scroll fires events at different intervals than Chromium, causing the handler to detect an intermediate slide before the scroll completes. This keeps navigation buttons visible when they should be hidden and cascades errors to subsequent stories.

Fix: track the target slide index during programmatic scroll and skip the entire scroll handler while the guard is active. Only clear the guard when the scroll handler detects the target slide has been reached, instead of relying solely on a fixed timeout. Also increase the fallback timeout from 600ms to 1000ms as a safety net for longer scroll distances in Firefox.
