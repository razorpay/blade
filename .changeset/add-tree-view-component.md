---
'@razorpay/blade': minor
---

feat(blade): add TreeView component

TreeView: hierarchical selectable list, standalone and inside Dropdown. First snowflake promotion (original Tree Hierarchy snowflake by Prarthana Gogoi).

- `TreeView`, `TreeViewItem`, `TreeViewLoadMore` exports (web-only; native entry throws a dev error)
- Standalone: single select (radio semantics) and multiple select with branch cascade, indeterminate checkboxes, roving tabindex keyboard map, `tree`/`treeitem` ARIA
- Inside Dropdown: drop-in replacement for ActionList - selection controlled through the trigger's `value`/`onChange` (SelectInput, FilterChipSelectInput), with an additive optional `selectedGroups` field in the onChange payload and smallest-describing-set display on the trigger
- Async children (`hasChildren` + `isLoading`) with selection inheritance, and `TreeViewLoadMore` for progressive loading at any depth
