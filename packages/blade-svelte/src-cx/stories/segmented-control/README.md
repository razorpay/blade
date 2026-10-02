# SegmentedControl

Blade's `SegmentedControl` and `SegmentedControlItem`, spelt over
`RadioGroup` and `Radio`. Both are style-only components, shipped
whole (`components/segmented-control/SegmentedControl*.svelte`,
`components/segmented-control/index.ts`), and nothing of them is in the core:
the field, its value, the form wiring and the keys are the group's, so a
`SegmentedControl` is a `radiogroup` of native radios that picks a value and
has no panels — not tabs.

## SegmentedControl

Every prop but `size` and `color` is `RadioGroup`'s. The component hands the
group its pill look (`look={segmentedLook(size, color)}`, a library-internal
prop, not an axis); RadioGroup has no public variant for it and imports
nothing of the pill.

| Prop | Notes |
| --- | --- |
| `value` | The picked segment's `value`: initial, a `bind:`, or host-driven; there is no `defaultValue` |
| `onChange` | Fires on a user pick with `{ name, value }` |
| `name` | Registers the control with the enclosing Form under this key; the radios share it |
| `isRequired` | Declarative constraint: the form blocks submission until a segment is picked |
| `validationState`, `helpText`, `errorText` | Omit `validationState` inside a Form to mirror its error once picked or submitted; pass it to own the state and its line |
| `isDisabled` | Disables every segment |
| `label`, `accessibilityLabel` | Name the `radiogroup` |
| `size` | `small`, `medium` (default), `large`: Blade's paddings and radii for the pill, the segments and the thumb |
| `color` | `neutral` (default) tints the track gray over a light surface; `white` draws it over a brand-colour pane — a white 18% track, white unpicked text, the same white thumb with dark text |

## SegmentedControlItem

| Prop | Notes |
| --- | --- |
| `value` | What the control's `value` becomes when picked |
| `icon` | An `IconSource` before the label. Alone, it is the label, and `accessibilityLabel` names it — the radio reads as that name through its label |
| `isDisabled` | This segment only |
| `children({ isChecked, isDisabled })` | The label text |

## Keys and the thumb

The segments are native radios inside labels, so one is in the tab sequence
and the arrows move the pick — the browser's own radiogroup behaviour,
nothing in the library. The pick is a styled thumb, drawn by the radio
module's `radioGroupOptions` snippet from `{ index, count }`: segments share
the row equally, so it is one segment wide and slides by whole segments plus
the gap, sized per `size`. Nothing is measured, and native cannot resolve
that `calc(var())`, so it shows no pick there.

Every label snippet (and `leading` / `trailing` where it has them) receives the control's state, `{ isChecked, isDisabled }` (`ControlState`). Groups take `labelArea`, and every hint line is `string | Snippet`, as the inputs.
