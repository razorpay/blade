---
'@razorpay/blade': minor
'@razorpay/blade-mcp': patch
---

feat(Popover): switch hover popovers and tooltips in place

Popovers with `openInteraction="hover"` now join the same group as every `Tooltip` (the `FloatingDelayGroup` in `BladeProvider`). Moving the pointer from one hover overlay to the next switches them in place: opening one closes whichever is showing, the replaced one disappears without fading out, and the new one appears without fading in. Only the first overlay of a hover streak fades in, and only the last one fades out. This works for controlled hover popovers too: being replaced calls `onOpenChange({ isOpen: false })`.

**Behaviour changes for hover popovers** (click popovers are unchanged). These fix behaviour that was not intended rather than change a designed API, so they ship as a minor release:

- **Not modal (bug fix).** Hover popovers used to be modal by accident: the `modal` setting was hard-coded for every popover, so a hover popover marked the rest of the page `aria-hidden` while the pointer rested on its trigger, hiding the page from screen readers. A hover popover now neither traps focus nor hides the page. Opening one still never moves focus into it (it already opened with no initial focus); the difference is that if the user clicks into it and presses Tab, focus can now leave it instead of cycling inside it.
- **Short close delay.** Leaving the trigger closes the popover after 80ms instead of immediately, which lets the next hover overlay replace it in place. Moving the pointer onto the popover cancels the close, so hover popovers are now easier to reach with the mouse.

**Tooltip:** tooltips switch the same way, as floating-ui recommends: a tooltip replaced by the next one disappears at once instead of fading out under it.

The `blade-mcp` Popover doc now describes hover popovers.
