---
'@razorpay/blade': minor
---

feat(TreeView): add `size` prop with a new `small` size

`<TreeView size="small" />` renders a denser tree for sidebars, file trees and long
dropdown overlays, scaling the row height, title typography, chevron, checkbox and
indentation.
`size` is tree-wide and defaults to `medium`, so existing usage is unchanged.

`leading` and `trailing` are consumer-provided nodes and are not resized by TreeView. Size
them yourself: icons (leading and trailing) follow the tree's `size`, while trailing
Counters, Badges and Text stay `size="small"` at both tree sizes.

This also fixes the item title on `medium` missing its letter-spacing (now `-0.182px`, per
the design spec).
