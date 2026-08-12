---
"@razorpay/blade-svelte": minor
"@razorpay/blade-core": minor
---

feat: add checkout studio story with style override playground

- Export slot metadata API (defineComponentSlotMeta, BLADE_SLOT_METADATA) for style override introspection
- Add Card 'surface' slot descriptor for per-slot style overrides
- Fix AppBar z-index from 1000 to 100 so it no longer overlays modal surfaces like BottomSheet (default z-index 100)
- Fix Input focus-ring transition to animate outline-width only, avoiding black→blue color flash on focus
