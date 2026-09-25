---
'@razorpay/blade': minor
'@razorpay/blade-mcp': patch
---

feat(TreeView): show a Tooltip or Popover when hovering a `TreeViewItem`

`TreeViewItem` accepts two new props:

- `tooltip` (`{ title?, content, placement?, onOpenChange? }`) shows a Tooltip on hover and on keyboard focus. The row keeps its title as its accessible name; the tooltip content is announced as its description.
- `popover` (`{ title?, titleLeading?, content, footer?, placement?, maxWidth?, onOpenChange? }`) shows a Popover on mouse hover, for rich previews such as an image of the screen an item represents. It does not open on touch screens, where a tap only selects the row.

Both open to the right of the row by default. Pass one or the other; if both are passed, `popover` wins and a dev warning is logged.

The `blade-mcp` knowledgebase doc for TreeView is updated with both props and an example.
