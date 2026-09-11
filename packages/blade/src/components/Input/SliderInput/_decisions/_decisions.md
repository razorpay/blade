# SliderInput Decisions

SliderInput lets a user pick a number from a range by dragging along a track.

## Geometry

Every measurement below is derived from the Figma component set, not chosen here.

| Piece                   | Value                               |
| ----------------------- | ----------------------------------- |
| Field box height        | 32 (equals `baseInputHeight.small`) |
| Box padding top         | 4                                   |
| Control height          | 24                                  |
| Track height            | 3                                   |
| Track top, in the box   | 15                                  |
| Thumb                   | 12 × 12                             |
| Marker dot              | 3 (equals the track height)         |
| Marker transparent ring | 6 (twice the track height)          |
| Scale row               | 12 tall, starting at y 24           |

Two consequences are worth stating because they look like bugs otherwise.

**The track is not vertically centred in the control.** A 3px track cannot be centred in a
24px control on whole pixels. It is pinned to y 15, which puts its centre 0.5px below the
thumb's. That is invisible and keeps the rail crisp at 1x.

**The scale hangs 4px below the field box.** The box stays exactly one small BaseInput tall
whatever the scale does, so toggling the scale never moves the track and a SliderInput keeps
sharing a field centre line with a `TextInput` next to it. The box reserves bottom margin for
the overflow rather than growing.

## Markers are cut out, never painted

Markers are transparent holes punched through the track with `mask-image`, one
`radial-gradient` per marker composited with `mask-composite: intersect`. The dot at the
centre of each hole stays in the mask, so it takes the colour of whatever layer it sits on:
the fill colour once the thumb has passed it, the rail colour before.

Painting markers with a surface colour would hardcode an assumption about what is behind the
slider, and would break on cards and in dark mode.

> `mask-composite: intersect` is the one thing here that is not universally old-browser safe.
> If it has to be dropped, the replacement is a generated SVG data-URI mask, not painted dots.

## The rail and the fill are the same size

Both track layers are full track width and share one mask; the fill is trimmed to the reached
value with `clip-path` rather than by being narrower. If the fill were sized to the value, the
percentages inside its mask would resolve against its own width and the marker holes would
drift out of alignment with the rail's.

This also means nothing about positioning needs a measured width. Offsets are CSS `calc`
expressions, so the server renders the thumb at its final position instead of at zero and then
jumping on hydration.

The fill ends at the far edge of the marker it reaches, not its centre, or the reached dot
renders half filled. Its trailing edge is always under the thumb, so clipping it square there
is never visible.

## Snapping

`max` is always reachable, even when the range is not a whole number of steps. A 0-100 slider
with `step={30}` has stops at 0, 30, 60, 90 and 100; the last gap is deliberately short.
Without this, `max` would be unreachable on any range that does not divide evenly, which is
the more surprising of the two behaviours.

A controlled value that is off-step renders on the nearest step, and `aria-valuenow` reports
the snapped value. Reporting the raw one produces a readout saying 37 while the thumb stands
on 40.

## Two change callbacks

`onChange` fires on every pointer move during a drag. `onChangeEnd` fires once, when the
interaction commits, and only when the value actually changed across it. Expensive work
belongs in `onChangeEnd`; a drag across a wide range would otherwise fire dozens of times, and
a click that lands back on the starting value would fire for nothing.

## Suppression

Markers and scale labels crowd at different widths, so they are dropped independently: markers
once the transparent rings would touch, labels once they would collide with each other. A
narrow slider degrades to a plain track rather than a smear of overlapping dots.

Before the track has been measured, which is the SSR and first-paint case, both render. A
too-narrow track corrects itself on the first resize observation.

That pitch floor assumes markers are evenly spaced, which stops being true when the range is
not a whole number of steps: with `step={33.33}` the last whole step lands at 99.99, a sliver
away from `max`, and the two labels print on top of each other at any track width. So labels
are additionally filtered pairwise against their neighbour. Both values are real stops the
thumb can land on, so only the label is dropped, never the stop. `min` and `max` always
survive that filter, and a label colliding with `max` is dropped in favour of `max`.

## Composition over a bundled readout

The slider does not ship with a paired text field. Holding the value in your own state and
passing it to both leaves you free to decide how they reconcile, which matters because they
can legitimately disagree: typing 37 against a step of 8 puts the thumb on 40. See the
`PairedWithTextInput` story.

The value indicator above the thumb is private and unexported rather than the public
`Tooltip`, which has a 51px floor once its padding and arrow are counted and will not hug a
two-character value.

## Accessibility

`role="slider"` sits on the thumb with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and
`aria-valuetext`, the last two always carrying the snapped value run through `formatValue`.
The label is associated with `aria-labelledby`, since a `<label for>` cannot target a div.

The thumb's hit area is lifted to 44 × 44 with a pseudo-element so the visual thumb stays
12px. Drag persists after the pointer leaves the thumb via pointer capture.

The value indicator is `aria-hidden`; the value is already announced through `aria-valuetext`,
and it is never the only way to read the value.

## Motion, except while dragging

The thumb, the fill and the value indicator all move on Blade's motion tokens, sharing one
block in `sliderInputTokens` so they cannot drift out of step with each other.

Movement uses `2xquick`, the shortest duration the system offers, with the `standard` morph
easing. A held arrow key repeats, and anything slower would still be easing the previous step
when the next one lands. Colour changes between the default, highlighted and disabled states
get `xquick`, since nothing is chasing them.

Movement is suppressed while _scrubbing_, not merely while the pointer is down, and the
difference is the whole point. A click on a far part of the track should glide there; a drag
must pin the thumb to the finger, where easing would read as lag. Those are the same
`pointerdown`, so they can only be told apart afterwards: the press starts as a click, and the
pointer moving more than `SLIDER_DRAG_SLOP` promotes it to a drag for the rest of the gesture.

Hence two states. `isDragging` means the pointer is down and drives the highlight and the
indicator; `isScrubbing` means it has also moved, and only that drops movement from the
transition list. The colour transition survives either way, not being tied to position.

The slop exists because a mouse rarely holds perfectly still between press and release, and
without it a single jittered pixel would cancel the glide and make every click look broken.
Where the distance cannot be measured at all, the code errs towards dragging: losing a glide
is far cheaper than easing every frame and leaving the thumb trailing the pointer.

The indicator fades and rises 2px on `entrance` easing and falls away on `exit`, which is the
one place the two directions differ. Only the rise is interpolated on the transform: the
centring half is a constant translateX and contributes nothing.

Two traps worth knowing about if this is edited again:

- `getFocusRingStyles` sets `transition-property: outline-width`, which would otherwise freeze
  the thumb exactly while the keyboard is driving it. The `:focus-visible` block re-declares
  the movement alongside the ring's growth.
- Backticks inside a comment in a styled-components template literal terminate the template.

`prefers-reduced-motion` is not handled, matching `BaseInput`: it is not handled anywhere in
Blade today, and adding it belongs in a system-wide motion pass rather than one component.

## The neutral focus ring

The thumb uses `getFocusRingStyles({ variant: 'neutral' })`. Figma models the focus ring as a
component set with a primary and a neutral variant, but the helper only ever drew the primary
one, so `BaseButton` had already hand-rolled the neutral ring for its filled neutral surface.
Rather than add a second copy, the variant was added to the helper and `BaseButton` moved onto
it, leaving one definition of each ring for both platforms.

The slider is a neutral component, so the primary blue would give it an accent it does not
otherwise carry. Only the colour changes: the 4px width, the 1px offset and the motion are
shared with every other component, so focus geometry stays consistent system-wide.

Focus is moved to the thumb by hand on pointer down. The pointer handler calls
`preventDefault()` to stop a drag from selecting text across the page, and that also suppresses
the focus the browser would otherwise move, which would leave the keyboard dead until the user
tabbed in separately. The ring itself still only appears for `:focus-visible`, so it stays
hidden during mouse use.

## The value indicator animates its number

The number in the indicator swaps with `BaseAnimatedValue` rather than being replaced outright,
so a rising value visibly rises.

The reference for this was [NumberFlow](https://number-flow.barvian.me/), which was not used.
It renders through a custom element with declarative shadow DOM, so it is web-only where every
other Blade component is cross-platform; it would be a new runtime dependency; and its own
documentation rules out RTL locales and non-Latin digits, which this component is deliberately
positioned not to block. It is also numbers-only, and the indicator is expected to hold
arbitrary text later.

So the swap animates the whole value rather than individual digits: one behaviour that reads
correctly for a number and for a word, on Blade's existing motion system, with no new
dependency. The trade is that it does not have NumberFlow's per-digit roll.

`BaseAnimatedValue` takes the raw value and the formatted text separately. Direction comes from
the raw value, so a `formatValue` that adds a unit or a currency still moves the right way
instead of falling back to a cross-fade.

## Not on React Native

The mask compositing that draws the markers has no equivalent in React Native's style system.
A native version needs a different drawing approach and its own gesture handling, so it is
left out rather than shipped as a lookalike that drifts from the web behaviour.

## Open

- RTL uses logical properties throughout and the pointer maths reads the computed direction so
  the two cannot disagree, but Blade has no RTL infrastructure to test against and no RTL
  support is claimed.
