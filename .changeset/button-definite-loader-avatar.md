---
"@razorpay/blade-core": patch
"@razorpay/blade-svelte": patch
---

fix(blade-svelte): add definite loader and avatar group to Button

Adds a definite (left-to-right progress) loader and avatar group support to the
Svelte `Button`, reworks the indefinite loader to a pure-CSS 3-dot animation, and
removes the unused spinner styling/exports from `blade-core`.
