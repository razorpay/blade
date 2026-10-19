# Card

Blade's Card: a surface around content, composed as Blade React's:
`CardHeader`, `CardBody` and `CardFooter` (`components/card-children/`), each
over its own classes, exported apart (`resolveCardHeader()`, …). Card renders
its parts as children, so an app that uses only Card does not bundle them
(`yarn check:tree-shaking`).

```svelte
<Card>
  <CardHeader title="Order summary" subtitle="2 items" trailing={badge} />
  <CardBody>…</CardBody>
  <CardFooter title="₹2,000" actions={{ primary: { text: 'Pay' }, secondary: { text: 'Later' } }} />
</Card>
```

| `Card` prop             | Notes                                                                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`               | `primary` (default: Blade's raised white surface — rim, shadow, gradient) or `secondary` (flat gray)                                                              |
| `padding`               | Blade React's values around everything: `spacing.0`, `.3`, `.4`, `.5` (16px) or `.7` (24px, default) — Blade DSL's Card in Figma draws 24px, its metric card 16px |
| `children`              | The parts, or anything. A `CardHeader`'s title names the card (or its overlay) when there is no `accessibilityLabel`                                              |
| `onClick`               | Lays a button over the whole card (`aria-pressed` follows `isSelected`); links and buttons inside the card sit above it and stay usable                           |
| `href`, `target`, `rel` | Lays a link over the card instead, through `adapters.navigate`; `_blank` gets `noopener noreferrer`                                                               |
| `isSelected`            | Blade's 2px primary ring; the surface drops its rim                                                                                                               |
| `isDisabled`            | No overlay, `aria-disabled`; beats `isSelected`                                                                                                                   |
| `as="label"`            | The card is a `<label>`, for a visually hidden radio or checkbox inside that drives `isSelected`                                                                  |
| `accessibilityLabel`    | Names the card: a `group`, or the overlay's name; wins over the header's title                                                                                    |
| `class`, `testID`       | As everywhere; width goes in `class`                                                                                                                              |

| Part         | Props                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CardHeader` | React's CardHeaderLeading (`title`, `subtitle`, `prefix`: an icon or a snippet, `suffix`, which shows without a title too) and CardHeaderTrailing (`trailing`) as props; `showDivider` (default `true`). Open by design, with no back button, close or drag: `classes`, `start`, `content` (in place of the title block), `children` (under the row), `titleId` / `subtitleId` and `attach` let other headers build on it — ModalHeader, BottomSheetHeader and DrawerHeader do |
| `CardBody`   | `children`                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `CardFooter` | React's CardFooterLeading (`title`, `subtitle`) and CardFooterTrailing (`actions`: `primary`, `secondary`, drawn as Buttons), or `children` in their place; `showDivider` (default `true`)                                                                                                                                                                                                                                                                                     |

Keyboard focus on the overlay draws Blade's 4px ring around the card.
