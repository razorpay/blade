---
"@razorpay/blade": patch
---

fix(blade): fixed SpotlightPopoverTour bugs

- Safari body-scroll-lock causing the page to get clipped because storybook doesn't set width/height on body - fixed by setting width/height
- Initial delay of opening the mask - fixed by immediately updating the mask size on initial render
- Delay of transitioning between steps which occurs because we need to wait for the animation to finish before scrolling otherwise the scroll gets interrupted - fixed by reduced this to 100ms
