---
'@razorpay/blade': minor
'@razorpay/blade-mcp': patch
---

feat(TreeView): show a Tooltip or Popover when hovering a `TreeViewItem`

`TreeViewItem` accepts two new props:

- `tooltip` (`{ title?, content, placement?, onOpenChange? }`) shows a Tooltip on hover and on keyboard focus. The row keeps its title as its accessible name; the tooltip content is announced as its description.
- `popover` (`{ title?, titleLeading?, content, footer?, placement?, maxWidth?, onOpenChange? }`) shows a Popover on mouse hover, for rich previews such as an image of the screen an item represents. It does not open on touch screens, where a tap only selects the row.

Both open to the right of the row by default. Pass one or the other; if both are passed, `popover` wins and a dev warning is logged.

Moving the pointer from row to row swaps overlays without an overlap: opening a tooltip or popover closes the one that is open, and the replaced one disappears at once instead of fading out under the new one.

**Tooltip:** tooltips in the same delay group (every Tooltip under `BladeProvider`) now switch the same way, as floating-ui recommends. The tooltip that is replaced disappears immediately; the first tooltip still fades in, and the last one still fades out.

The `blade-mcp` knowledgebase doc for TreeView is updated with both props and an example.
