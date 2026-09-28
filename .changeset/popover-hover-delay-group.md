---
'@razorpay/blade': minor
'@razorpay/blade-mcp': patch
---

feat(Popover): switch hover popovers and tooltips in place

Popovers with `openInteraction="hover"` now join the same group as every `Tooltip` (the `FloatingDelayGroup` in `BladeProvider`). Moving the pointer from one hover overlay to the next switches them in place: opening one closes whichever is showing, the replaced one disappears without fading out, and the new one appears without fading in. Only the first overlay of a hover streak fades in, and only the last one fades out. This works for controlled hover popovers too: being replaced calls `onOpenChange({ isOpen: false })`.

**Behaviour changes for hover popovers** (click popovers are unchanged):

- **Not modal.** A hover popover no longer traps focus or marks the rest of the page `aria-hidden` while it is open; a preview the pointer rests on should not hide the page from screen readers.
- **Short close delay.** Leaving the trigger closes the popover after 80ms instead of immediately, which lets the next hover overlay replace it in place. Moving the pointer onto the popover cancels the close, so hover popovers are now easier to reach with the mouse.

**Tooltip:** tooltips switch the same way, as floating-ui recommends: a tooltip replaced by the next one disappears at once instead of fading out under it.

The `blade-mcp` Popover doc now describes hover popovers.
