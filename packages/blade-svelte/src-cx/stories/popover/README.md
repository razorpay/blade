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
| `titleIcon` | A glyph before the title, drawn at 20px |
| `titleLeading({ close })`, `footer({ close })` | Before the title in place of `titleIcon` (an asset); under the content (actions) |
| `accessibilityLabel` | Required: names the panel (`role="dialog"`, not modal) |
| `isDisabled` | The trigger does not open it |

Opening moves focus to the first control in the panel, closing returns it to
the trigger. The page stays live: it joins the layers only as a floating
layer, so nothing goes inert and Escape closes only the topmost overlay. For
a list of actions use `Menu`; for a hint, `Tooltip`.

## Why `titleIcon` and `titleLeading` are props

The header is Blade DSL's _Popover Title (Figma): the leading item (a 20px
icon, or an asset) 8px before the title, the title with 12px after it, then
12px to the close button. The popover owns that row, so the leading item is
a prop that lands in its place with its gap.

| | Spacing |
| --- | --- |
| Leading item → title | 8px |
| Title → close | 24px (the title's 12px, then the row's 12px) |
| Without a leading item | the title starts at the panel's 16px inset |

