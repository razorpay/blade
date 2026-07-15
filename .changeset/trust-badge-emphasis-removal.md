---
'@razorpay/blade': minor
'@razorpay/blade-svelte': minor
'@razorpay/blade-core': minor
---

fix(TrustBadge): remove `emphasis` prop and align with Blade DSL trust marker design

The `emphasis` prop (`'subtle' | 'intense'`) and the `TrustBadgeEmphasis` type have been removed from TrustBadge. The new Blade DSL design uses a single sea-subtle pill treatment regardless of surface color. Migrate by removing any `emphasis` prop usage — the updated component renders correctly on all surfaces.

- `@razorpay/blade`: `emphasis` prop removed from `TrustBadgeProps`
- `@razorpay/blade-svelte`: `emphasis` prop removed from `TrustBadgeProps`
- `@razorpay/blade-core`: `TrustBadgeEmphasis` type and `getTrustBadgePillEmphasisClass` removed; replaced by `getTrustBadgeVariantClass`
