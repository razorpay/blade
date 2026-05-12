---
'@razorpay/blade': minor
---

feat(Table): add `minHeight` and `maxHeight` props

Tables with few rows no longer need a wrapper hack to set a floor height,
and tables with many rows can now scroll within a bounded container without
a fixed `height`. Both props accept the same responsive spacing values as
the existing `height` prop.
