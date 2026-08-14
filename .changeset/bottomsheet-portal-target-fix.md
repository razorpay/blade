---
"@razorpay/blade-core": patch
"@razorpay/blade-svelte": patch
---

fix(blade-svelte): constrain BottomSheet portalTarget to container bounds

Fixed BottomSheet `portalTarget` so backdrop and surface render inside the target container instead of escaping to the viewport. Adds portal root wrapper styles in blade-core that switch surface/backdrop from `position: fixed` to `position: absolute` when portaling into a bounded element.
