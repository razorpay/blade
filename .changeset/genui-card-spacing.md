---
'@razorpay/blade': minor
---

fix(GenUI): text sits 24px from a CARD or TABLE

Every GenUI consumer's gap between text and a CARD or TABLE changes from 36px to 24px. The ring container's 12px margin was added on top of the spacing contract's 24px. `textToCardTable`, `cardTableToNextH3` and `h3ToCardTable` are now `spacing.4`, so text, or a title, sits 24px from a card.
