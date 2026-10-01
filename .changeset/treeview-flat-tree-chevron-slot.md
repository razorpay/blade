---
'@razorpay/blade': patch
'@razorpay/blade-mcp': patch
---

fix(TreeView): drop the empty chevron space when no row can expand

`TreeViewItem` rows reserve an empty chevron slot so leaves line up with branches. This is now decided once for the whole tree: the slot is kept on every row only when at least one row can expand (it has children or passes `hasChildren`). A fully flat tree drops the slot on every row, so it renders flush like `ActionList`, and `TreeViewLoadMore` drops its matching label offset too.

The `blade-mcp` knowledgebase doc for TreeView is updated with the rule, and recommends `ActionList` for data that can never nest.
