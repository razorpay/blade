---
'@razorpay/blade': patch
'@razorpay/blade-plugin': patch
---

fix(blade): RazorSense 2.0 adjusts to the device both ways. A page starts at its device's level (today's RazorSense's GPU class: a known weak GPU a step or two down) and steps back up once frames hold again, so a short stall no longer cuts quality for the rest of the page. Its steps down cut pixels on any screen (every other frame, then its canvas at 0.75 and 0.5 of a CSS px) and meet a sharp drop within about a second. RazorSenseBackground keeps its canvas within a pixel budget on big screens.
