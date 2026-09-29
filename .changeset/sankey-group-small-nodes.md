---
'@razorpay/blade': minor
---

feat(SankeyChart): group small nodes into an expandable "Other" node; Blade-owned layout on web

- `groupNodesBelow` folds every node under the given share of the total into one "Other" node per column (never a root, never a node with `isGroupable: false`, never a group of one). Ribbons are re-pointed and summed, the group is drawn in neutral grey with a chevron, and its tooltip lists the members with their shares
- Clicking a group, or pressing Enter/Space on its label, reveals the members in place at the same scale: every other bar and ribbon keeps its size, each revealed node gets room for its label, and the drawing grows below the container. Wrap the chart in a fixed-height `Box` with `overflowY="auto"` to scroll it. Clicking a revealed label folds the group again
- Expanded state follows the Accordion API: `defaultExpandedGroupIds`, `expandedGroupIds`, `onExpandChange`. `getGroupLabel` names the group
- The web chart now lays out through Blade's own engine, a port of the recharts Sankey algorithm pinned by a parity test, and renders its own tooltip. Existing charts keep their exact geometry; the link tooltip now names both ends (`Source → Target`)
