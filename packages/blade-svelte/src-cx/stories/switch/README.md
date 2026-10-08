# Switch

`packages/blade/components/switch/Switch.svelte`, over the checkbox model
(`createCheckbox`): to a Form it is a checkbox (`name`, `parse`), to assistive
tech a `role="switch"`.

| Prop | Notes |
| --- | --- |
| `isChecked` | Bindable, or a value the host keeps driving |
| `onChange` | `{ isChecked }`: the new state |
| `isLoading` | A change is in flight: `aria-busy`, a spinner in the thumb, toggles refused — but it stays in the tab order, unlike `isDisabled` |
| `children({ isChecked, isDisabled })` / `accessibilityLabel` | The label, or the name when there is none |
| `size` | Style axis: `small` (28×16 track) or `medium` (36×20, default), in a 2px margin — Blade DSL's Switch (Figma), the same at every width (React's bigger phone sizes are not ported) |

No `activeColor` / `inactiveColor` (v2): colours are the theme's.

Every label snippet (and `leading` / `trailing` where it has them) receives the control's state, `{ isChecked, isDisabled }` (`ControlState`). Groups take `labelRow`, and every hint line is `string | Snippet`, as the inputs.
