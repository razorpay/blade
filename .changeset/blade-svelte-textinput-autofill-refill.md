---
'@razorpay/blade-svelte': patch
---

fix(blade-svelte): keep formatted TextInput in sync on browser autofill refill

A formatted `TextInput` could end up showing raw, unformatted digits after browser autofill: Chrome can refill the same raw digits shortly after the first fill (e.g. after a network-driven `maxlength` swap changes the form). When the refill formatted to the value already held in state, the DOM `value` was never rewritten and the raw text stayed on screen. The input element is now synced directly in that case, so the value stays formatted after an autofill refill.
