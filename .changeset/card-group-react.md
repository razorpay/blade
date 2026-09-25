---
'@razorpay/blade': minor
---

feat(CardGroup): add CardGroup component

Adds `CardGroup`, `CardGroupItem`, `CardGroupCollapsibleItem`, and
`CardGroupCollapsibleItemBody` for React (web + native) — a single-surface stack
of navigating, selecting, and disclosing rows. The group owns the border,
radius, elevation, top/bottom gradient, and the dividers between rows; rows
navigate (`href`) or select (`onClick` / `isSelected`), never both, and a row
inside a collapsible item acts as its disclosure trigger.
