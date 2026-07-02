---
'@razorpay/blade': patch
'@razorpay/blade-core': patch
'@razorpay/blade-svelte': patch
---

feat(blade-svelte): add ActionList component

Also fixes a React BaseMenu hover style: the hover background is now suppressed when `aria-selected=true` so a selected row's `fadedHighlighted` background is not overridden on pointer-enter. This intentional fix applies to all React `BaseMenu`-based consumers (ActionList, Select, etc.) and matches the expected selected-item UX.
