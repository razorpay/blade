# Card

Blade's Card: a surface around content. React's CardHeader, CardBody and
CardFooter (and their Leading, Trailing and leaf parts) are snippets here:
what goes in them is yours to lay out.

| Prop | Notes |
| --- | --- |
| `variant` | `primary` (default: Blade's raised white surface — rim, shadow, gradient) or `secondary` (flat gray) |
| `padding` | Around everything: `spacing.0` / `.3` / `.4` / `.5` / `.7` — 0, 8, 12, 16, 24px (default) |
| `color` | cx-only: a tinted card (the shared intents); it replaces the variant's surface |
| `header`, `footer` | Snippets on hairlines, 12px either side of each |
| `children` | The body |
| `onClick` | Lays a button over the whole card (`aria-pressed` follows `isSelected`); links and buttons inside the card sit above it and stay usable |
| `href`, `target`, `rel` | Lays a link over the card instead; `_blank` gets `noreferrer noopener` |
| `isSelected` | Blade's 2px primary ring; the surface drops its rim |
| `isDisabled` | No overlay, `aria-disabled`; beats `isSelected` |
| `as="label"` | The card is a `<label>`, for a visually hidden radio or checkbox inside that drives `isSelected` |
| `accessibilityLabel` | Names the card: a `group`, or the overlay's name |
| `class`, `testID` | As everywhere; width goes in `class` |

Keyboard focus on the overlay draws Blade's 4px ring around the card.

API parity with Blade React: see `src-cx/API-PARITY.md`.
