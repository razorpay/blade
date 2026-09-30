---
'@razorpay/blade': minor
'@razorpay/blade-mcp': patch
---

feat(TreeView): show a Popover preview when hovering a `TreeViewItem`

`TreeViewItem` accepts a new `popover` prop (`{ title?, titleLeading?, content, footer?, placement?, maxWidth?, onOpenChange? }`) that shows a Popover when the row is hovered with a mouse, for rich previews such as an image of the screen an item represents. It opens to the right of the row by default. It does not open on keyboard focus or on touch screens, where a tap only selects the row, so its content should never be the only place information lives.

Moving the pointer from row to row switches previews in place, using the hover-popover switching built into Popover (razorpay/blade#4044): the replaced preview disappears without fading out, and the new one appears without fading in.

The `blade-mcp` knowledgebase doc for TreeView is updated with the prop and an example.
