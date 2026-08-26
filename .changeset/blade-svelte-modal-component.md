---
'@razorpay/blade-svelte': patch
---

feat(blade-svelte): add Modal component

Adds `Modal`, `ModalHeader`, `ModalBody`, and `ModalFooter` to `@razorpay/blade-svelte`. Focus is trapped within the surface while open, moves to the close button (or a caller-supplied `initialFocusRef`) on open, and returns to the previously focused element on close — including when a controlled `isOpen` prop flips to `false` directly. Background content is marked `inert` (falling back to `aria-hidden` where unsupported) while the modal is mounted, and a dev-only warning is logged if `accessibilityLabel` is missing.