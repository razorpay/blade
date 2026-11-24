---
'@razorpay/blade': patch
---

feat(GenUI): component renderers get `isStreaming`

`GenUISchemaRenderer` passes `isStreaming` to each component renderer. It's true only for the reply's last component while `isAnimating` is on, so a renderer can tell a finished component from the one still streaming in. Built-in components ignore it.
