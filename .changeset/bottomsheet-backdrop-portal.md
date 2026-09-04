---
'@razorpay/blade-svelte': minor
---

feat(blade-svelte): add `backdropPortalTarget` to BottomSheet

Adds an optional `backdropPortalTarget` prop so the dim overlay can mount into a wider ancestor while the sheet surface stays in a nested container. When the targets differ, backdrop and surface render in separate portals with stacking tuned so the surface still paints above the dim layer.
