---
'@razorpay/blade': minor
---

fix(SpotlightPopoverTour, PopupArrow): match the spotlight to the highlighted component, remove the popover's arrow seam, and round the arrow tip

Three visual fixes. All three apply to light and dark — none introduces a colour-scheme branch.

**1. `SpotlightPopoverTour` — the spotlight now takes the shape of what it highlights.**
`TourMask` hardcoded its corner radius to `theme.spacing[2]` (4px — a *spacing* token used as a radius), so the spotlight was drawn at 4px around a soft-cornered `Card`, a pill, or a square button alike, and nothing in the public API could change it. The mask now derives its radius from the spotlit element:

- the element has a corner radius → the spotlight takes **the same radius**;
- the element draws no corner at all (e.g. the step highlights plain text) → the spotlight falls back to `border.radius.large`, matching the popover, instead of squaring off to a hard corner.

Because `SpotlightPopoverTourStep` clones its child to attach a ref, consumers commonly wrap their UI in a layout element that draws no corner of its own; the measurement falls through to the first element child so a wrapped `Card` is still matched.

> **⚠️ Visual change (no API break):** every existing web tour's spotlight will change shape, and will now differ per step depending on what that step highlights. This is the intended behaviour. `SpotlightPopoverTourMaskRect` gains an optional `borderRadius` field (internal to the component).
>
> React Native is unchanged here — it measures via `measureInWindow`, which reports geometry but no style, so there is no computed radius to read. The native mask keeps its existing radius; matching it there needs an explicit prop and is left as a follow-up.

**2. `SpotlightPopoverTour` — the popover no longer shows a line where the arrow meets the card.**
`TourPopover` painted the arrow with `popup.background.gray.subtle` while the card body uses `popup.background.gray.moderate`, so a visible seam ran along the junction. `Popover` already passes the matching token — this was drift introduced in the v11 → v12 popup-token migration, where the card was moved to `gray.moderate` and the tour's arrow was missed. On web the arrow abuts the card edge with zero overlap (Blade passes no `strokeWidth`, so `FloatingArrow` positions it at `100%`), so matching the fill token makes the two composite identically and the popover reads as one continuous surface.

> React Native is intentionally left alone here. Its `PopupArrow` draws an opaque backing path (`surface.background.gray.intense`) beneath the fill and adds a stroke, so swapping the fill token alone does not make the arrow match the card — it only moves the mismatch (measured on the dark theme: from ~2/255 darker than the card to ~3/255 lighter). Fixing native means addressing that backing path, and is left as a follow-up.

**3. `PopupArrow` — the arrow tip now reads as rounded.**
`tipRadius` was set from `border.radius['2xsmall']` (2). `tipRadius` is a *ratio* rather than a px value, scaled against the arrow's own dimensions, so on a 22×12 arrow that blunted the tip by only 1.5px — invisible at 1x, leaving the tip looking like a hard point against the popup's rounded corners. Raised to `border.radius.xsmall` (4), the largest value that still leaves straight edges; the shape degenerates into a lens by 8.

> **⚠️ Visual change (no API break):** `PopupArrow` is shared, so this affects the arrows on `Popover` and `Tooltip` as well as `SpotlightPopoverTour`.
