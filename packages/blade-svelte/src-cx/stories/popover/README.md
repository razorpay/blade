# Popover

`packages/blade/components/popover/`: `Popover.svelte` and the platform
leaf `PopoverPanel.svelte` (+ `.native.svelte`), sharing `layer/anchor.ts`
with the Tooltip.

| Prop | Notes |
| --- | --- |
| `isOpen` | Bindable, or host-driven; `onOpenChange({ isOpen })` |
| `placement` | Default `top`, as in React; flips on web when the side lacks room |
| `children({ isOpen })` | The trigger, as in React; a press on it toggles, so it wires nothing. `aria-haspopup`, `aria-expanded` and `aria-controls` are stamped on it |
| `content` | The panel's content: a string (small body text), or a snippet `content({ close })` |
| `title` | A string or a snippet (in the title's box); names the panel |
| `titleLeading` | Before the title: an icon (`IconSource`), drawn as a 20px glyph, or a snippet `titleLeading({ close })` with an asset (a logo, an avatar) |
| `footer({ close })` | Under the content: actions |
| `accessibilityLabel` | Required: names the panel (`role="dialog"`, not modal) |
| `isDisabled` | The trigger does not open it |

Opening moves focus to the first control in the panel, closing returns it to
the trigger. The page stays live: it joins the layers only as a floating
layer, so nothing goes inert and Escape closes only the topmost overlay. For
a list of actions use `Menu`; for a hint, `Tooltip`.

## Why `titleLeading` is a prop

The header is Blade DSL's _Popover Title (Figma): the leading item (a 20px
icon, or an asset) 8px before the title, the title with 12px after it, then
12px to the close button. The popover owns that row, so the leading item is
a prop that lands in its place with its gap. It is one prop with two
shapes, and the popover places each: an icon draws as the 20px glyph, a
snippet sits in its place.

| | Spacing |
| --- | --- |
| Leading item → title | 8px |
| Title → close | 24px (the title's 12px, then the row's 12px) |
| Without a leading item | the title starts at the panel's 16px inset |

