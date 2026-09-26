# Popover

`packages/blade/components/popover/`: `Popover.svelte` and the platform
leaf `PopoverPanel.svelte` (+ `.native.svelte`), sharing `layer/anchor.ts`
with the Tooltip.

| Prop | Notes |
| --- | --- |
| `isOpen` | Bindable, or host-driven; `onOpenChange` |
| `placement` | Default `bottom-start`; flips on web when the side lacks room |
| `children` | The trigger; a press on it toggles. `aria-haspopup`, `aria-expanded` and `aria-controls` are stamped on it |
| `content({ close })` | The panel |
| `accessibilityLabel` | Required: names the panel (`role="dialog"`, not modal) |
| `isDisabled` | The trigger does not open it |

Opening moves focus to the first control in the panel, closing returns it to
the trigger. The page stays live: no layer is pushed, nothing goes inert. For
a list of actions use `Menu`; for a hint, `Tooltip`.
