# Popover

`packages/blade/components/popover/`: `Popover.svelte` and the platform
leaf `PopoverPanel.svelte` (+ `.native.svelte`), sharing `layer/anchor.ts`
with the Tooltip.

| Prop | Notes |
| --- | --- |
| `isOpen` | Bindable, or host-driven; `onOpenChange({ isOpen })` |
| `placement` | Default `bottom-start`; flips on web when the side lacks room |
| `trigger({ isOpen })` | The trigger; a press on it toggles, so it wires nothing. `aria-haspopup`, `aria-expanded` and `aria-controls` are stamped on it |
| `children({ close })` | The panel's content |
| `title` | A string or a snippet (in the title's box); names the panel |
| `titleLeading({ close })`, `footer({ close })` | Before the title (an icon); under the content (actions) |
| `accessibilityLabel` | Required: names the panel (`role="dialog"`, not modal) |
| `isDisabled` | The trigger does not open it |

Opening moves focus to the first control in the panel, closing returns it to
the trigger. The page stays live: it joins the layers only as a floating
layer, so nothing goes inert and Escape closes only the topmost overlay. For
a list of actions use `Menu`; for a hint, `Tooltip`.
