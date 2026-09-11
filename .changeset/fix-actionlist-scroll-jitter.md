---
"@razorpay/blade": patch
---

fix(ActionList): resolve scroll jitter in virtualized ActionList on initial scroll by replacing useState with useRef for visible indices and removing unnecessary cache resets
