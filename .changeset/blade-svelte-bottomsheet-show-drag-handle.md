---
'@razorpay/blade-svelte': minor
---

feat(blade-svelte): add `showDragHandle` prop to BottomSheet to optionally hide the drag handle

`BottomSheet` now accepts a `showDragHandle` boolean prop (default `true`). Set it to `false` to hide the drag handle (the pill affordance at the top of the sheet). Since the handle is the drag surface, hiding it also removes the drag-to-move affordance; the sheet can still be dismissed via the backdrop, `esc`, or programmatically.
