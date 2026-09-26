# Card

`packages/blade/components/card/Card.svelte` is style-only: a pressable card
is a `<button>` around the same box, with no model behind it.

| Prop | Notes |
| --- | --- |
| `variant` | Style axis: `primary` (raised, bordered), `secondary` (flat, subtle fill) |
| `color` | Style axis (the shared intents): a tinted card; it replaces the variant's surface |
| `header`, `body`, `footer` | Padded sections (blade: 24px from the edge, 12px either side of the hairline between them). They are padding and lines only: a title row, actions or a divider inside are yours to lay out |
| `children` | Raw content: no section, no padding — it owns its box, and wins over `body` when both are given, as a modal's does |
| `onPress`, `isDisabled` | The whole card becomes one `<button>` — its content must then hold no control of its own |
| `accessibilityLabel` | Names the card: a `group`, or the button's name |
| `class`, `testID` | As everywhere; radius, width or a raw child's padding go in `class` |

The card itself carries no padding. An interactive card (click, select)
would be behaviour — a model, not this component.
