---
"@razorpay/blade": minor
---

feat(BottomSheet): add `showDragHandle` prop to optionally hide the drag handle

`BottomSheet` now accepts a `showDragHandle` boolean prop (default `true`). Set it to `false` to hide the drag handle (the pill affordance at the top of the sheet). On web this also removes the drag-to-move affordance since the handle is the drag surface; the sheet can still be dismissed via the backdrop, `esc`, or programmatically. On native, pan-to-close continues to work.
