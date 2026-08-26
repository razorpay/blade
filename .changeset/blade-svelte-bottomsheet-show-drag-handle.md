---
'@razorpay/blade-svelte': minor
---

feat(blade-svelte): add `showDragHandle` prop to BottomSheet to optionally hide the drag handle

`BottomSheet` now accepts a `showDragHandle` boolean prop (default `true`). Set it to `false` to hide the drag handle (the pill affordance at the top of the sheet) and disable drag-to-move/dismiss gestures — useful for desktop flows where dragging is not expected. The sheet can still be dismissed via the backdrop, `esc`, or programmatically.
