---
'@razorpay/blade': patch
---

fix(Alert): align leading icon to the first line of text instead of centering it on the whole description block. Multi-line descriptions no longer show the icon floating mid-paragraph — including desktop full-width alerts with inline actions and no title, whose icon and text content now center as a single group against the action buttons, so single-line full-width banners render the same as before.
