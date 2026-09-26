# Tooltip

The component is `packages/blade/components/tooltip/Tooltip.svelte` over the
`createTooltipModel` and `place` (`packages/blade/runes/tooltip`, `runes/layer/placement.ts`). It
has no style axes yet (`components/tooltip/index.ts`).

## Behaviour props

| Prop | Notes |
| --- | --- |
| `content` | A string or a snippet |
| `placement` | `top`, `bottom`, `left`, `right`, each optionally `-start` / `-end`. The wanted side; the bubble flips when it lacks room |
| `isDisabled` | Never opens; closes if open |
| `onOpenChange` | Fires with the new state |
| `children` | The trigger. Make it focusable so the keyboard can reach the tooltip |

## Opening

Mouse hover opens after a short rest and closes after a short grace, so the
pointer can travel onto the bubble. Keyboard focus opens at once; Escape
closes only the tooltip, not a modal beneath it. A tap toggles — the only
way in on touch and on native — and a press elsewhere closes.

## Placement

The bubble renders into the `LayerHost` (so the card's scroll and overflow
cannot clip it) but stays off the layer stack: the page never goes inert.
It is measured and placed by the pure `place()` function — flipped on the
main axis, clamped on the cross axis, arrow kept on the trigger — and
re-placed on scroll and resize. On native it renders inside the trigger's
wrapper at the requested placement, without measuring.
