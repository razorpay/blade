---
"@razorpay/blade": patch
---

fix(SliderInput): keep the thumb, fill and value indicator in sync while dragging

The thumb, the fill and the value indicator now read a single eased value, so the fill no longer trails behind the thumb during a fast drag. Dragging stays pinned to the pointer with no lag; when markers are shown, the thumb glides between steps instead of jumping.
