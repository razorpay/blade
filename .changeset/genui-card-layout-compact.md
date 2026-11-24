---
'@razorpay/blade': minor
---

feat(GenUI): add opt-in `cardLayout: 'compact'` to `GenUIProvider` for tighter GenUI cards

- `GenUIProvider config={{ cardLayout: 'compact' }}` turns on the compact card layout. The default, `'default'`, renders as before.
- DIVIDER inside a CARD: 12px a side. Next to a DIVIDER, nothing else stacks on it. The last block in a CARD adds no space, so the card padding (16px) is the bottom edge.
- INFO_GROUP: horizontal, small, values right-aligned.
- Long ids, emails, VPAs and URLs in INFO_GROUP values, TABLE text cells and CARD titles stay on one line, cut in the middle, with the full value in a tooltip and copy on click.
- GRID columns are never under 120px, so metric tiles wrap in a narrow box.
- A CARD with a CHART and no TABLE shows no divider under its header.
- A TABLE inside a CARD sits flush to the card's sides and the card clips it to its corners.
