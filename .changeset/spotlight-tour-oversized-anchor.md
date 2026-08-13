---
'@razorpay/blade': patch
---

Fixed `SpotlightPopoverTour` scrolling indefinitely and locking the page when a step's anchor is taller than the viewport (e.g. a large table). The tour now detects oversized anchors and scroll-aligns them to the top instead of trying to center them, so the page no longer freezes with the popover pushed off-screen.
