---
'@razorpay/blade': minor
'@razorpay/blade-svelte': minor
'@razorpay/blade-core': patch
---

feat(Card): add `ticket` and `info` card variants

Adds two new Card variants to both React (`@razorpay/blade`) and Svelte (`@razorpay/blade-svelte`):

- `ticket`: a coupon/ticket style card split into two sections by a perforated, scalloped tear line with notched side edges.
- `info`: a two-tone card with an emphasized header section over a subtle body section, wrapped by a single rounded border.

Both variants support default, selected, and disabled states. In React the two sections are authored as two `CardBody` children (separated by `CardTearLine` for `ticket`); in Svelte they are supplied via the `topSection` and `bottomSection` snippets.
