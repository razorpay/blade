---
"@razorpay/blade-svelte": minor
---

fix(blade-svelte): a modal makes only the provider's content inert

The top-level `BladeProvider` wraps its content in a `display: contents` element, and an open Modal, BottomSheet or Drawer makes only that wrapper inert, not everything beside the overlay host. A partner SDK's popup added to `<body>` (Apple Pay's QR sheet in Chrome) stays clickable. The wrapper doesn't change layout, but CSS child combinators across the provider (`.shell > main`) no longer match.
