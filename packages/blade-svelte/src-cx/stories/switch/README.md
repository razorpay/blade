# Switch

`packages/blade/components/switch/Switch.svelte`, over the checkbox model
(`createCheckbox`): to a Form it is a checkbox (`name`, `parse`), to assistive
tech a `role="switch"`.

| Prop | Notes |
| --- | --- |
| `isChecked` | Bindable, or a value the host keeps driving |
| `onChange` | The new state |
| `isLoading` | A change is in flight: `aria-busy`, a spinner in the thumb, toggles refused — but it stays in the tab order, unlike `isDisabled` |
| `children` / `accessibilityLabel` | The label, or the name when there is none |
| `size` | Style axis |

No `activeColor` / `inactiveColor` (v2): colours are the theme's.
