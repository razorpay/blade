---
"@razorpay/blade": minor
---

feat(Table): add `isActive` prop to `TableRow` for detail-panel integration

Adds an `isActive` boolean prop to `TableRow` that visually marks the row whose detail panel or side drawer is currently open. The active row renders with a brand-tinted background (`interactive.background.primary.faded`) and a 2px left-border accent (`interactive.border.primary.default`), distinct from the neutral-gray selection highlight. Both states (`isActive` and `isSelected`) can coexist simultaneously. State management is consumer-controlled — pass `isActive={activeItemId === item.id}`.
