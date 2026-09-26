# Radio

`RadioGroup` is the form field
(`packages/blade/components/radio/RadioGroup.svelte`, over the
`createRadioGroup` and `createField` models); `Radio` is one radio inside
it: a visually hidden native input for semantics and keys, and a drawn
indicator — Blade's circle, whose dot scales in on a pick and only fades
out on the next one. Its styles (`components/radio/index.ts`) own the group's
`orientation` axis and resolve the Radios' parts too; checkout has one radio
size.

## RadioGroup

| Prop | Notes |
| --- | --- |
| `value` | The picked Radio's `value`: initial, a `bind:`, or host-driven; there is no `defaultValue` |
| `onChange` | Fires on a user pick with the new value |
| `name` | Registers the group with the enclosing Form under this key; the Radios share it (a generated name without one) |
| `isRequired` | Declarative constraint: the form blocks submission until a radio is picked |
| `validationState`, `helpText`, `errorText` | Omit `validationState` inside a Form to mirror its error once picked or submitted; pass it to own the state and its line |
| `isDisabled` | Disables every Radio |
| `label`, `accessibilityLabel` | Name the `radiogroup` |

## Radio

| Prop | Notes |
| --- | --- |
| `value` | What the group's `value` becomes when picked |
| `isDisabled` | This radio only |
| `children` | The label; `accessibilityLabel` names it when there is none |

## Segmented

There is no segmented variant here. Blade's SegmentedControl is the
`SegmentedControl` + `SegmentedControlItem` components (see that story): the same group
and the same radios, drawn as one joined pill through a look the control
hands the group (`look={segmentedLook(size, color)}`): a library-internal
prop, not an axis, and nothing of it is imported here.

A Radio has no style props: its look is the group's decision. Roving arrow
keys, the single tab stop and exclusivity are the browser's (and the native
renderer's), not code here. A Radio outside a RadioGroup is unsupported.
