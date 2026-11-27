---
'@razorpay/blade': minor
---

feat(GenUI): text sits 24px from a CARD or TABLE

The ring container's 12px margin was added on top of the spacing contract, so the gaps next to a CARD or TABLE were wider than the contract said:
- After a paragraph, the gap goes from 36px to 24px (`textToCardTable` and `cardTableToNextH3`: `spacing.7` → `spacing.4`).
- After a heading, it goes from 20px to 24px (`h3ToCardTable`: `spacing.3` → `spacing.4`).

These are the gaps with RayChatOutput's TEXT. GenUI's own TEXT adds its paragraph and heading margins on top.
