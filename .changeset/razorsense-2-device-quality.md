---
'@razorpay/blade': patch
'@razorpay/blade-plugin': patch
---

fix(blade): RazorSense 2.0 adjusts to the device both ways. A page starts at its device's level (today's RazorSense's GPU class: a known weak GPU a step or two down) and steps back up once frames hold again, so a short stall no longer cuts quality for the rest of the page. RazorSenseBackground keeps its canvas within a pixel budget on big screens.
