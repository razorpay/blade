# Radio

`RadioGroup` is the form field
(`src/components/radio/RadioGroup.svelte`, over the
`createRadioGroup` model, on the field shell every field shares); `Radio` is one radio inside
it: a visually hidden native input for semantics and keys, and a drawn
indicator — Blade's circle, whose dot scales in on a pick and only fades
out on the next one. Its styles (`components/radio/index.ts`) own the group's
`orientation` axis and resolve the Radios' parts too; checkout has one radio
size.

## RadioGroup

| Prop | Notes |
| --- | --- |
| `value` | The picked Radio's `value`: initial, a `bind:`, or host-driven; there is no `defaultValue` |
| `onChange` | Fires on a user pick with `{ name, value }` |
| `name` | Registers the group with the app's form (`adapters.form`) under this key; the Radios share it (a generated name without one) |
| `isRequired` | Declarative constraint: the form blocks submission until a radio is picked |
| `validationState`, `helpText`, `errorText` | Omit `validationState` inside a Form to mirror its error once picked or submitted; pass it to own the state and its line |
| `isDisabled` | Disables every Radio |
| `label`, `accessibilityLabel` | Name the `radiogroup` |
| `testID` | Lands on the group; each Radio's control without its own gets `${testID}-${index}` |

## Radio

| Prop | Notes |
| --- | --- |
| `value` | What the group's `value` becomes when picked |
| `isDisabled` | This radio only |
| `children({ isChecked, isDisabled })` | The label; `accessibilityLabel` names it when there is none |

## Segmented

There is no segmented variant here, and RadioGroup takes no `look`. Blade's
SegmentedControl is the `SegmentedControl` + `SegmentedControlItem`
components (see that story): RadioGroup's base (`BaseRadioGroup`, internal)
and the same radios, drawn as one joined pill in the control's own classes
(`segmentedLook(size, color)`), nothing of which is imported here.

A Radio has no style props: its look is the group's decision. Roving arrow
keys, the single tab stop and exclusivity are the browser's, not code here.
A pick reports `select` to `adapters.vibrate`. A Radio outside a RadioGroup is unsupported.

Every label snippet (and `leading` / `trailing` where it has them) receives the control's state, `{ isChecked, isDisabled }` (`ControlState`). Every hint line is `string | Snippet`, as the inputs.
