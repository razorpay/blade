---
'@razorpay/blade-svelte': patch
---

fix(blade-svelte): keep formatted TextInput in sync with controlled value

Controlled `format` mode on TextInput now reconciles the display against the parent `value` after every change, so consumer sanitisation (digit-only card fields) and programmatic prefill/reset actually show up on screen. The formatter no longer leaks a trailing delimiter when the value ends on a group boundary, and the caret stays after the typed character when a delimiter is inserted.
