---
'@razorpay/blade': minor
'@razorpay/blade-plugin': patch
'@razorpay/blade-mcp': patch
---

feat(SideNav): `trailingVisibility` on `SideNavLink`, `trailing` on items that open the next level, and `SideNavVisibility`

- New `trailingVisibility` prop on `SideNavLink`. `on-hover` (default) keeps today's behaviour. `always` keeps the trailing slot visible without hover while the SideNav is expanded. Use it when trailing shows the state of the item, e.g. an item that is pinned and can be unpinned.
- `trailing` now renders on items that open the next level (L2 triggers). On those items the chevron moves next to the title and trailing takes the end of the item. Earlier `trailing` was ignored on them.
- The trailing slot is now also revealed while keyboard focus is anywhere in the item, not only once focus is inside the slot.
- The trailing slot now sits `spacing.4` (12px) from the end of the item instead of `spacing.2` (4px), so it mirrors the leading icon.
- An item with a trailing slot now keeps room for it, so a long title truncates 12px before the slot instead of running under it. This holds for both `on-hover` and `always`, so the title does not shift when the slot appears on hover. No room is kept while the SideNav is collapsed to icons.
- A long `SideNavLink` title is now cut at the letter that no longer fits instead of at the last whole word, so it uses the room up to whatever follows it (`titleSuffix`, chevron, trailing) and no longer leaves a gap before it.
- While a SideNav is collapsed to icons with `isExpanded`, the trailing slot is taken out instead of only faded out, so its action is no longer in the tab order while it cannot be seen. The mobile SideNav (Drawer) keeps the trailing slot whatever `isExpanded` is.
- New `SideNavVisibility` component. It shows its children only while the SideNav is expanded (`visibleWhen="expanded"`) or only while it is collapsed to icons (`visibleWhen="collapsed"`), for your own content inside SideNav. In a SideNav that collapses with `isExpanded`, the hidden content takes no space and cannot be focused. It throws an error when used outside SideNav, and is not meant for the `banner` slot.
