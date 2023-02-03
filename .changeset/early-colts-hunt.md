---
"@razorpay/blade": patch
---

fix(checkbox): fixed screen reader styles 

Fixed a bug where if we have lots of checkboxes in a small overflowed container the browser is trying to jump to the hidden inputs which is causing unexpected jumps in the scroll.
