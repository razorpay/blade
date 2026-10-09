---
"@razorpay/blade": patch
---

fix(Dropdown): animate the overlay away from the trigger on the resolved placement side

`DropdownOverlay` hardcoded its enter/exit transform to `translateY(-8px)`, so an overlay that floating-ui flipped above the trigger (or one opened with a `top-*` / `left-*` / `right-*` `defaultPlacement`) slid in from the wrong direction. The transform now reads the resolved `side` from `useTransitionStyles`, matching the behaviour already in `Menu`.
