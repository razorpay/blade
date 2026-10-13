# Tooltip

The component is `packages/blade/components/tooltip/Tooltip.svelte` over the
`createTooltipModel` and `place` (`packages/blade/runes/tooltip`, `runes/layer/placement.ts`). It
has no style axes yet (`components/tooltip/index.ts`).

## Behaviour props

| Prop | Notes |
| --- | --- |
| `content` | What it says: a string, or a snippet for rich content |
| `title` | A heading above the content: a string or a snippet |
| `placement` | `top`, `bottom`, `left`, `right`, each optionally `-start` / `-end`. The wanted side; the bubble flips when it lacks room |
| `isDisabled` | Never opens; closes if open |
| `onOpenChange` | Fires with `{ isOpen }` |
| `children({ isOpen })` | The trigger, as in React. Make it focusable so the keyboard can reach the tooltip. While open, its first focusable element is `aria-describedby` the bubble |

## Opening

Mouse hover opens after a short rest and closes after a short grace, so the
pointer can travel onto the bubble. Keyboard focus opens at once; Escape
closes only the tooltip, not a modal beneath it. A tap toggles — the only
way in on touch and on native — and a press elsewhere closes.

## Placement

The bubble renders into the `LayerHost` (so the card's scroll and overflow
cannot clip it) and joins the layers only as a floating layer: the page never
goes inert, and Escape closes only the topmost overlay — the tooltip, not a
popover or modal beneath it.
It is measured and placed by the pure `place()` function — flipped on the
main axis, clamped on the cross axis, arrow kept on the trigger — and
re-placed on scroll and resize. On native it renders inside the trigger's
wrapper at the requested placement, without measuring.
