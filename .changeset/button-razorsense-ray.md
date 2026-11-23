---
'@razorpay/blade': minor
---

feat(Button): add `aiHover`: `"razorsense"` (RazorSense on hover, on the neutral primary button) and `"ray-investigate"` (on hover a secondary button widens for Ray, at any size, and he searches with his magnifying glass; more Ray actions will come as new values). Both are web only and fall back to the button's own hover where they can't play (reduced motion, no usable GPU, a ButtonGroup, a full-width button, and for Ray an icon-only button or one its container stretches). Keyboard focus plays them as hovering does (a click's focus doesn't), with Blade's focus ring kept on top. Their canvases are made only while the pointer is on or near the button, or it's focused from the keyboard.
