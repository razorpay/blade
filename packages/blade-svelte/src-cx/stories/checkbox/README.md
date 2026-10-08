# Checkbox

The component is `packages/blade/components/checkbox/Checkbox.svelte` over
the `createCheckbox` and `createField` models: a visually hidden native input
for semantics and keys, and a drawn indicator — Blade's box, whose mark
(the `checkboxMark` snippet) scales in and out as it toggles. It
has no style axes (`components/checkbox/index.ts`): checkout has one
checkbox size.

## Behaviour props

| Prop | Notes |
| --- | --- |
| `isChecked` | The initial state, a `bind:`, or a value the host keeps driving; there is no `defaultChecked` |
| `onChange` | Fires on a user toggle with `{ isChecked, value }` |
| `name` | Registers the field with the enclosing Form under this key |
| `parse` | Maps the boolean to the value the form collects; keep the unchecked result falsy, since `isChecked` reads the truthiness of that value |
| `isRequired` | Declarative constraint: the form blocks submission until checked |
| `validationState`, `helpText`, `errorText` | Omit `validationState` inside a Form to mirror its error once toggled or submitted (the message replaces `hint` while it lasts); pass it to own the state and its line |
| `children({ isChecked, isDisabled })` | The label; `accessibilityLabel` names the control when there is none |

## One checked prop

A Svelte prop is already an initial value the component then owns, a binding,
or a value the host keeps driving — so the React-style
`isChecked`/`defaultChecked` split is collapsed into `isChecked`.

Every label snippet (and `leading` / `trailing` where it has them) receives the control's state, `{ isChecked, isDisabled }` (`ControlState`). Groups take `labelRow`, and every hint line is `string | Snippet`, as the inputs.
