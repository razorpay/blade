---
'@razorpay/blade-svelte': minor
---

feat(blade-svelte): add BottomSheet auto mode and maxHeight cap

When `snapPoints` is omitted, BottomSheet now opens at its natural content height (capped by `maxHeight`, default `0.97` of the viewport or portal container). Content height is tracked via `ResizeObserver` and the sheet re-clamps as content grows or shrinks. Drag-to-dismiss remains; drag-to-resize is disabled in auto mode. Passing `snapPoints` keeps the existing multi-detent behaviour unchanged. Also fixes portal-target sheets occasionally exceeding `maxHeight` when height math used `window.innerHeight` before the container height was synced.
