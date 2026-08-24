---
'@razorpay/blade': minor
'@razorpay/blade-mcp': minor
---

feat(FloatingActionButton): add FloatingActionButton component

Adds `FloatingActionButton`, a persistent pill-shaped button anchored to the bottom of the viewport for the single most important action on a screen. It supports `primary`, `white` and `black` colors, anchors via `placement` (`bottom-end`, `bottom-start`, `bottom`) with a configurable `offset` and `zIndex`, and renders either an icon with a short label or an icon on its own, in which case `accessibilityLabel` is required. Positioning is `fixed` on web and `absolute` with safe-area insets on React Native.
