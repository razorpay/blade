---
'@razorpay/blade': minor
---

fix(SpotlightPopoverTour): match the spotlight to the highlighted component, remove the popover's arrow seam, and even out the arrow-to-spotlight gap

Three visual fixes. All three apply to light and dark — none introduces a colour-scheme branch.

**1. `SpotlightPopoverTour` — the spotlight now takes the shape of what it highlights.**
`TourMask` hardcoded its corner radius to `theme.spacing[2]` (4px — a *spacing* token used as a radius), so the spotlight was drawn at 4px around a soft-cornered `Card`, a pill, or a square button alike, and nothing in the public API could change it. The mask now derives its radius from the spotlit element:

- the element has a corner radius → the spotlight takes **the same radius**;
- the element draws no corner at all (e.g. the step highlights plain text) → the spotlight falls back to `border.radius.large`, matching the popover, instead of squaring off to a hard corner.

Because `SpotlightPopoverTourStep` clones its child to attach a ref, consumers commonly wrap their UI in a layout element just to forward one. Measuring that wrapper is wrong twice over: it has no corner radius to inherit, and a wrapper stretched by its parent's layout (e.g. `alignItems="stretch"` in a flex row) is taller than the component inside it — which left the spotlight's padding uneven, 6px on three sides and 18px at the bottom. So when the step's element paints nothing itself and wraps a single child that fills it on at least one axis, the spotlight traces that child instead, for both geometry and radius. The padding is now even on all four sides. The fill check stops it shrinking onto an inner element that merely happens to be first — a wrapper around narrower content is still measured as the wrapper.

> **⚠️ Visual change (no API break):** every existing web tour's spotlight will change shape, and will now differ per step depending on what that step highlights. This is the intended behaviour. `SpotlightPopoverTourMaskRect` gains an optional `borderRadius` field (internal to the component).
>
> React Native is unchanged here — it measures via `measureInWindow`, which reports geometry but no style, so there is no computed radius to read. The native mask keeps its existing radius; matching it there needs an explicit prop and is left as a follow-up.

**2. `SpotlightPopoverTour` — the popover no longer shows a line where the arrow meets the card.**
`TourPopover` painted the arrow with `popup.background.gray.subtle` while the card body uses `popup.background.gray.moderate`, so a visible seam ran along the junction. `Popover` already passes the matching token — this was drift introduced in the v11 → v12 popup-token migration, where the card was moved to `gray.moderate` and the tour's arrow was missed. Matching the fill token removes the colour step, but a line survived it: the popup surface carries a 1px inset hairline (`getPopupBoxShadowString`) on **every** edge, including the one the arrow sits on — so the container's own border was drawn straight across the join and the arrow still read as a separate shape stuck on top.

`TourPopover` was passing only `fillColor` to its arrow. `Popover` passes four props, and the other three are what close the join: a `strokeColor` so the outline continues around the arrow, a non-zero `strokeWidth` (which also offsets the arrow onto the container edge so its fill masks the hairline beneath it), and a `translateY(-1px)` nudge. Bringing the tour to parity with `Popover` makes the body and arrow read as one container with a single outline.

> React Native is intentionally left alone here. Its `PopupArrow` draws an opaque backing path (`surface.background.gray.intense`) beneath the fill and adds a stroke, so swapping the fill token alone does not make the arrow match the card — it only moves the mismatch (measured on the dark theme: from ~2/255 darker than the card to ~3/255 lighter). Fixing native means addressing that backing path, and is left as a follow-up.

**3. `SpotlightPopoverTour` — the gap between the arrow tip and the spotlight is now the same on every step.**
Nothing sets that gap directly; it falls out of two numbers measured from two different rectangles. `TourPopover` offsets the popup by `spacing[4] + ARROW_HEIGHT` (24px) so that, after the arrow's own 12px protrusion, the tip lands `GAP` (12px) from the anchor's edge — while `TourMask` draws the halo 6px past the traced element. The intended result is a constant 6px.

That held only when both measured the same element, and they did not. The mask resolves the step's ref through `resolveSpotlightTarget` to trace the painted component, but `TourPopover` set its position reference to the raw ref — so any overhang between the wrapper and the component inside it was added straight to the gap. A step whose wrapper is stretched by a flex row (`alignItems="stretch"`) sat visibly further from its spotlight than a step whose wrapper happened to match its card. `resolveSpotlightTarget` moves into the shared web utils and both now resolve through it, so the gap no longer depends on how a consumer wraps their markup.
