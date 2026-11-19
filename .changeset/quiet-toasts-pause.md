---
"@razorpay/blade": minor
---

feat(Toast): add timer, progress bar and link action to promotional toast

- `introDuration` (web only) starts the auto dismiss timer and the progress bar after the content plays its own intro.
- `showProgressBar` (web only) shows a 2px bar on the bottom edge of the toast for the time left.
- A promotional toast that auto dismisses pauses while the pointer is over it or focus is inside it. It resumes from where it stopped.
- `action` takes `variant: 'link'` with `href`, `target` and `rel`, plus `icon` and `iconPosition` (web only).
- Blade runs the timer of a promotional toast with `autoDismiss`, so `useToast().toasts` now shows `duration: Infinity` for it.
