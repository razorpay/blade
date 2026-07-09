---
"@razorpay/blade": patch
"@razorpay/blade-svelte": patch
"@razorpay/blade-core": patch
---

fix(bottomsheet): synchronize body and footer transition animations with surface

The BottomSheet body and footer had no transition animations of their own,
causing them to appear/disappear at different times during open/close because
the surface's height animation with overflow:hidden revealed them at different
points. Both elements now have a matching transform: translateY() transition
with the same duration and easing as the surface, ensuring they slide in and
out together consistently. Transitions are disabled during drag for both
elements, matching the surface's behavior.
