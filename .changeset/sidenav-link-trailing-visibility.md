---
'@razorpay/blade': minor
'@razorpay/blade-plugin': patch
---

feat(SideNav): `trailingVisibility` on `SideNavLink`, `trailing` on items that open the next level, and `SideNavVisibility`

- New `trailingVisibility` prop on `SideNavLink`. `hover` (default) keeps today's behaviour. `always` keeps the trailing slot visible and makes the title truncate before it. Use it when trailing shows the state of the item, e.g. an item that is pinned and can be unpinned.
- `trailing` now renders on items that open the next level (L2 triggers). On those items the chevron moves next to the title and trailing takes the end of the item. Earlier `trailing` was ignored on them.
- The trailing slot is now also revealed while keyboard focus is anywhere in the item, not only once focus is inside the slot.
- The trailing slot now sits `spacing.4` (12px) from the end of the item instead of `spacing.2` (4px), so it mirrors the leading icon.
- New `SideNavVisibility` component. It shows its children only while the SideNav is expanded (`visibleWhen="expanded"`) or only while it is collapsed to icons (`visibleWhen="collapsed"`), for your own content inside SideNav.
