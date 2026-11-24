---
'@razorpay/blade': patch
---

fix(GenUI): text sits 24px from a CARD or TABLE

The ring container's 12px margin was added on top of the spacing contract's 24px gaps, so text sat 36px from a card. `textToCardTable` and `cardTableToNextH3` are now `spacing.4`, which makes the visible gap 24px.
