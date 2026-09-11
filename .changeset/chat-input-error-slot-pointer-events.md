---
'@razorpay/blade': patch
---

fix(ChatInput): stop the validation region swallowing clicks when no error is showing. It stays mounted for its exit animation, and as a full-width transparent box directly above the composer it silently intercepted pointer events aimed at anything a consumer stacked there
