# CardGroup

`CardGroup` holds `CardGroupItem`s: cards to pick one of, the picked one
expanding into its body. It was cx's Accordion, renamed after the
CardGroup/CardGroupItem pair Blade's interactive-cards decision describes;
its look and behaviour are Blade React's Accordion. Each item is a header
button (`aria-expanded`) over a region: one item open at a time, and
pressing the open one closes it. The open item is `bind:value`:
the item's `value`, or its index when it has none.

```svelte
<CardGroup bind:value variant="filled" showNumberPrefix>
  <CardGroupItem value="refund" title="When do refunds arrive?" subtitle="Refunds">
    {#snippet body()}<Text color="subtle">Within five to seven days.</Text>{/snippet}
  </CardGroupItem>
  <CardGroupItem value="card" title="Cards" onClick={() => goto('/card')} />
</CardGroup>
```

Built for the mobile home method list
(`app/v2/modules/home/components/InstrumentList.svelte`), which is three
things at once:

1. **A required choice.** The open item is the value: `bind:value`, and with
   `name` + `isRequired` a Form requires and submits it.
2. **Expand or go.** An item with no `body` or `children` never expands:
   a press only reports through `onClick`, and it draws a chevron pointing right.
3. **A press the host may refuse.** `onClick(event)` fires before anything
   changes; `return false` vetoes the expand (an address gate, a method
   facing issues that opens a downtime sheet instead).

## CardGroup

| Prop | Notes |
| --- | --- |
| `value` (bindable) | The open item's `value` (its index when unset), `null` for none. The initial value is the default-open item |
| `onChange` | `{ name, value }` after a press changed it; `value` is `null` for none |
| `variant` | `transparent` (default: a divider after every item) or `filled` (one raised surface, dividers between items) |
| `size` | `large` (default) or `medium`: title type, line box and number prefix; `state.size` for snippets |
| `showNumberPrefix` | Numbers the items `1.`, `2.`, … in place of their `leading` |
| `isDisabled` | Every header is inert |
| `scrollOnExpand` | Default `true`: the panel scrolls into view (`block: 'nearest'`) once it has opened |
| `name`, `isRequired`, `validationState`, `helpText`, `errorText`, `label`, `accessibilityLabel` | The field line, as on OptionList |

## CardGroupItem

| Prop | Notes |
| --- | --- |
| `value` | The item's identity in the CardGroup's `value`; its index by default |
| `title`, `subtitle` | A string in Figma's type (medium-weight title at the card group's size, 16/24 or 14/20; small muted subtitle 2px under it), or a snippet that sizes its own |
| `leading` snippet | Ahead of the title, capped at 32px (24px at medium). The number prefix wins over it |
| `trailing` snippet | Replaces the chevron (a status glyph, a loading placeholder); owns its look |
| `header` snippet | The header's content between `leading` and `trailing`: it receives the drawn `title` and `subtitle` as snippets beside the item state, and places them — as Modal's `header`. Without it the two render on their own. Inside a `<button>`: phrasing content only, nothing interactive — use `Text as="span"` |
| `body` snippet | The body in Figma's body box (16px above and in, 16px below and 16px between its parts; 12px at medium). Mounted only while open, so lazy content loads on expand. Ignored when `children` is given, as Modal's |
| `children` snippet | A custom body at full width, no padding or background of the card group's own; wins over `body` |
| snippet state | Every item snippet receives `{ index, isExpanded, isDisabled, isActionable, size, collapse }`; `collapse()` closes the item from its own body ("Use this card") |
| `isDisabled` | The header is inert |
| `onClick` | Every header click (a keyboard press included); `return false` to veto. Without a body, the press is all the item does |
| `testID` | Overrides the `${testID}-${index}` the CardGroup hands the header |

Every snippet receives `state`: `{ index, isExpanded, isDisabled, isActionable, size }`.
`isActionable` is true for an item without a body.

Keyboard: headers are in the Tab order; Up, Down, Home and End move between
enabled headers; Enter and Space press.

The panel slides over the component's duration (none with reduced motion, and
none on native, which mounts it as is). Separate CardGroups are independent;
to make them exclusive, bind each `value` and clear the others in `onChange`.

## Why `leading` and `trailing` are props

CardGroup follows Blade DSL's Accordion in Figma (❖ Accordion). Its header
is a row the item owns, with different spacing on each side of the title
block, so what goes before and after the title has its own slot:

| Size | Line box | Leading → title | Title → trailing / chevron | Chevron |
| --- | --- | --- | --- | --- |
| large | 24px | 8px | 12px | 20px |
| medium | 20px | 8px | 12px | 16px |

The leading item and the chevron centre on the title's first line, not on
the whole header, so a subtitle doesn't move them. Content in `title` or
`header` is the title block.

API parity with Blade React: see `src-cx/API-PARITY.md`.

CardGroup takes `labelArea` and `string | Snippet` hint lines, as the inputs do.
