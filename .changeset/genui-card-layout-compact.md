---
'@razorpay/blade': minor
---

feat(GenUI): new default layout for GenUI cards, details, long values and grids

This is a visual change for every app that renders GenUI, with no opt-out. There is no new prop and no API to change. Check your GenUI screens after you upgrade.

What changes:

- DIVIDER inside a CARD: 12px a side, the header divider included. Next to a DIVIDER, nothing else stacks on it. The last block in a CARD adds no space, so the card padding (16px) is the bottom edge.
- A CARD with a CHART and no TABLE shows no divider under its header.
- A TABLE inside a CARD sits flush to the card's sides and the card clips it to its corners.
- INFO_GROUP, inside and outside a CARD: label and value on one row, small text, values right-aligned. Before, values were medium text and left-aligned.
- Long ids, emails, VPAs and URLs in INFO_GROUP values, TABLE text cells and CARD titles, inside and outside a CARD: one line, cut in the middle, with the full value in a tooltip. INFO_GROUP values, CARD titles and `copyable` TABLE cells also get a copy button. Before, they wrapped.
- GRID, inside and outside a CARD: columns are never under 120px, so metric tiles wrap in a narrow box. Before, columns shrank to fit.
